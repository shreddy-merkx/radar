/**
 * Radar als Web-App.
 *
 * Die Meldungen kommen aus einer fertigen Datei, die GitHub alle 30 Minuten
 * baut (fetch.mjs). Was hier passiert, passiert auf dem Gerät: sieben nach
 * Quellen und Alter, mischen, anzeigen. So wirkt jede Einstellung sofort,
 * ohne auf den nächsten Lauf zu warten.
 */
import { mixDigest, toDigestItem } from './localFilter.js';
import { SOURCES, TOPICS, TOPIC_BY_ID } from './sources.js';
import {
  COMPILED_ON, countdownLabel, formatRange, groupByMonth,
  parseDay, soon, stateOf, upcoming,
} from './events.js';
import { LANGUAGES, detectLanguage, locale, setLanguage, t, topicNames } from './i18n.js';

const KEY = 'radar.settings.v4';
const DIGEST_KEY = 'radar.digest.v4';
const DIGEST_URL = 'data/digest.json';

/** Wie viele Meldungen eine Rubrikansicht auf einmal zeigt. */
const PAGE_SIZE = 25;
/** So viele gelesene Meldungen merkt sich Radar. Danach fällt die älteste raus. */
const SEEN_LIMIT = 500;
/**
 * Ab dieser Pause gilt der nächste Start als neuer Besuch. Wer die App
 * zwischendurch kurz weglegt, soll nicht jedes Mal „0 neu" lesen.
 */
const VISIT_GAP_MS = 45 * 60 * 1000;

const DEFAULTS = {
  off: [],          // ausgeschaltete Quellen (nur die Ausnahmen speichern)
  maxItems: 30,
  maxAgeDays: 3,
  filter: 'all',
  /** Zeigt Radar den Top-10-Streifen? Nur sichtbar, wenn es ihn überhaupt gibt. */
  top: true,
  /** 'roomy' oder 'dense'. Kompakt lässt die Anrisstexte weg. */
  density: 'roomy',
  /** Gemerkte Meldungen -- vollständig, damit sie bleiben, wenn die Quelle sie fallen lässt. */
  saved: [],
  /** Adressen gelesener Meldungen. Die Kennungen aus der Datei taugen nicht: Sie
      enthalten die Position im Feed und ändern sich bei jedem Lauf. */
  seen: [],
  /** Zeitpunkte: der laufende Besuch und der davor. Daraus kommt „7 neu". */
  visitLast: 0,
  visitPrev: 0,
  // null heißt: der Sprache des Geräts folgen. Erst eine bewusste Auswahl in
  // den Einstellungen schreibt hier ein Kürzel hinein.
  lang: null,
};

let settings = load();

function applyLanguage() {
  const code = setLanguage(settings.lang ?? detectLanguage());
  document.documentElement.setAttribute('lang', code);
  return code;
}
applyLanguage();

let digest = null;
let busy = false;
let now = new Date();

/* Nur für die laufende Sitzung -- nichts davon gehört in den Speicher. */
let extra = 0;                    // „Mehr laden" hat so oft nachgelegt
let findQuery = '';               // Suche über die Meldungen
let srcQuery = '';                // Suche über die Quellen in den Einstellungen
let openTopics = new Set();       // aufgeklappte Rubriken in den Einstellungen
let sheetKind = null;             // 'cal' | 'set' | 'find' | null

/* ------------------------------------------------------------- Speicher */

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS, ...migrate() };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
      off: Array.isArray(parsed.off) ? parsed.off : [],
      saved: Array.isArray(parsed.saved) ? parsed.saved : [],
      seen: Array.isArray(parsed.seen) ? parsed.seen : [],
    };
  } catch {
    // Privater Modus, volle Ablage, abgelehnte Berechtigung: Einstellungen
    // sind Komfort. Ohne sie läuft die App mit den Standardwerten weiter.
    return { ...DEFAULTS };
  }
}

/**
 * Was die vorige Fassung gespeichert hatte, soll nicht verlorengehen -- vor
 * allem nicht die abgeschalteten Quellen, die jemand einzeln durchgesehen hat.
 */
function migrate() {
  try {
    const old = JSON.parse(localStorage.getItem('radar.settings.v3') ?? 'null');
    if (!old) return {};
    return {
      off: Array.isArray(old.off) ? old.off : [],
      maxItems: old.maxItems ?? DEFAULTS.maxItems,
      maxAgeDays: old.maxAgeDays ?? DEFAULTS.maxAgeDays,
      top: old.top !== false,
      lang: old.lang ?? null,
    };
  } catch {
    return {};
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch { /* siehe oben */ }
}

/** Neuer Besuch? Dann merkt sich Radar, wann der vorige war. */
function markVisit() {
  const nowMs = Date.now();
  if (nowMs - (settings.visitLast ?? 0) > VISIT_GAP_MS) {
    settings.visitPrev = settings.visitLast || nowMs;
  }
  settings.visitLast = nowMs;
  save();
}
markVisit();

/* --------------------------------------------------------------- Helfer */

const $ = (id) => document.getElementById(id);

/** Feed-Inhalte sind fremder Text und dürfen nie als HTML ausgeführt werden. */
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Nur http(s) in ein href lassen -- „javascript:" wäre sonst ein Einfallstor. */
function safeUrl(url) {
  try {
    const parsed = new URL(url, location.href);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '#';
  } catch {
    return '#';
  }
}

function relativeTime(ms) {
  if (!ms) return '';
  const minutes = Math.round((Date.now() - ms) / 60000);
  if (minutes < 1) return t('justNow');
  if (minutes < 60) return t('minutesAgo', { n: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t('hoursAgo', { n: hours });
  const days = Math.round(hours / 24);
  if (days === 1) return t('yesterday');
  if (days < 7) return t('daysAgo', { n: days });
  return new Date(ms).toLocaleDateString(locale(), { day: '2-digit', month: 'short' });
}

/** Rubrik mit übersetztem Namen -- Farbe und Kennung bleiben aus sources.js. */
function topic_(id) {
  const [label, short] = topicNames(id);
  return { ...TOPIC_BY_ID[id], label, short };
}

const isOn = (id) => !settings.off.includes(id);

/** Große Zahlen kurz: 1.200.000 wird zu „1,2 Mio.", im Englischen zu "1.2M". */
function compactNumber(value) {
  try {
    return new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 })
      .format(value);
  } catch {
    return String(value);
  }
}

/** 754 Sekunden werden zu „12:34". */
function clockTime(seconds) {
  if (seconds === null || !Number.isFinite(seconds)) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/* ------------------------------------------------------ Gelesen, gemerkt */

const seenSet = new Set(settings.seen);
const isSeen = (link) => seenSet.has(link);

function markSeen(link) {
  if (!link || seenSet.has(link)) return;
  seenSet.add(link);
  settings.seen.push(link);
  // Vorne abschneiden: Das Älteste darf vergessen werden.
  if (settings.seen.length > SEEN_LIMIT) {
    for (const gone of settings.seen.splice(0, settings.seen.length - SEEN_LIMIT)) {
      seenSet.delete(gone);
    }
  }
  save();
}

const isSaved = (link) => settings.saved.some((item) => item.link === link);

function toggleSaved(item) {
  if (isSaved(item.link)) {
    settings.saved = settings.saved.filter((x) => x.link !== item.link);
  } else {
    /*
     * Die Meldung wird vollständig abgelegt, nicht nur ihre Adresse. Sonst ist
     * das Lesezeichen in drei Tagen eine leere Zeile -- dann hat die Quelle
     * die Meldung längst aus ihrem Feed geschoben.
     */
    settings.saved = [{
      headline: item.headline, summary: item.summary, link: item.link,
      sourceName: item.sourceName, sourceId: item.sourceId, publishedAt: item.publishedAt,
      topic: item.topic, lang: item.lang, kind: item.kind, image: item.image,
      seconds: item.seconds ?? null, views: item.views ?? null,
      savedAt: Date.now(),
    }, ...settings.saved].slice(0, 200);
  }
  save();
}

/* ------------------------------------------------------------ Auswertung */

/**
 * Eine Meldung, deren Quelle abgeschaltet ist, muss nicht verschwinden: Wenn
 * dieselbe Sache bei einer eingeschalteten Quelle steht (`also`, siehe
 * localFilter.js), rückt diese nach. Dann verschwindet beim Abschalten von
 * Cyclingnews nicht die halbe Rennsport-Rubrik.
 *
 * Übernommen werden Überschrift, Adresse und Name der nachrückenden Quelle --
 * nie der Anriss oder das Bild der abgeschalteten. Alles andere wäre, einer
 * Quelle Worte in den Mund zu legen, die sie nicht geschrieben hat.
 */
function resolveSource(raw) {
  if (isOn(raw.sourceId)) return raw;
  const stand = (raw.also ?? []).find((a) => isOn(a.sourceId));
  if (!stand) return null;
  return {
    ...raw,
    sourceId: stand.sourceId,
    sourceName: stand.sourceName,
    title: stand.title,
    link: stand.link,
    publishedAt: stand.publishedAt ?? raw.publishedAt,
    lang: stand.lang ?? raw.lang,
    excerpt: '',
    image: null,
    also: (raw.also ?? []).filter((a) => a !== stand),
  };
}

/**
 * Alle sichtbaren Meldungen, aufbereitet -- einmal pro Anzeige.
 *
 * `ignoreAge` ist für die Suche: Die soll in allem suchen, was geladen ist
 * (vierzehn Tage), nicht nur in dem Zeitraum, den die Frontpage gerade zeigt.
 * Wer „Rohloff" eintippt, sucht nicht die letzten drei Tage ab.
 */
function pool({ ignoreAge = false } = {}) {
  if (!digest) return [];
  const cutoff = ignoreAge ? 0 : Date.now() - settings.maxAgeDays * 86400000;
  const stamp = Date.now();
  const out = [];
  for (const raw of digest.items) {
    const item = resolveSource(raw);
    if (!item) continue;
    // Riemen behält sein längeres Gedächtnis, siehe localFilter.js.
    if (item.topic !== 'belt' && item.publishedAt !== null && item.publishedAt < cutoff) continue;
    const ready = toDigestItem(item, stamp);
    // Zweitquellen, die selbst abgeschaltet sind, stehen nicht in der Zeile.
    ready.also = (ready.also ?? []).filter((a) => isOn(a.sourceId));
    out.push(ready);
  }
  return out;
}

const byDate = (a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0);

/**
 * Was die Seite zeigt.
 *
 * „Alle" ist die gemischte Frontpage wie bisher. Ein angetippter Reiter zeigt
 * dagegen die **vollständige** Rubrik nach Aktualität -- das war der größte
 * Bruch des Versprechens: Wer auf MTB tippt, will alles zu MTB, nicht die drei
 * Meldungen, die es zufällig in die Mischung geschafft haben.
 */
function buildView() {
  const all = pool();
  const counts = {};
  for (const item of all) counts[item.topic] = (counts[item.topic] ?? 0) + 1;

  if (settings.filter === 'saved') {
    return { all, counts, items: settings.saved, total: settings.saved.length, mode: 'saved' };
  }
  if (settings.filter === 'all') {
    return {
      all, counts, mode: 'all',
      items: mixDigest(all, settings.maxItems + extra),
      total: all.length,
    };
  }
  const list = all.filter((item) => item.topic === settings.filter).sort(byDate);
  return {
    all, counts, mode: 'topic',
    items: list.slice(0, PAGE_SIZE + extra),
    total: list.length,
  };
}

/** Wie viele Meldungen seit dem vorigen Besuch dazugekommen und ungelesen sind. */
function countNew(all) {
  const since = settings.visitPrev;
  if (!since) return 0;
  return all.filter((item) => item.publishedAt && item.publishedAt > since && !isSeen(item.link)).length;
}

/* --------------------------------------------------------------- Abruf */

async function refresh({ silent = false } = {}) {
  if (busy) return;
  busy = true;
  now = new Date();
  if (!silent) {
    $('track').hidden = false;
    $('bar').style.width = '35%';
  }

  try {
    // Zeitstempel dranhängen, damit weder Browser noch Zwischenspeicher eine
    // alte Fassung ausliefern. Die Datei ist klein, das kostet nichts.
    const response = await fetch(`${DIGEST_URL}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // Fassung 1 und 2 werden beide gelesen: Eine App, die noch im
    // Zwischenspeicher liegt, soll an einer neueren Datei nicht ersticken.
    if (!(data.version === 1 || data.version === 2) || !Array.isArray(data.items)) {
      throw new Error('Unbekanntes Format');
    }
    digest = data;
    try { localStorage.setItem(DIGEST_KEY, JSON.stringify(data)); } catch {}
    $('bar').style.width = '100%';
  } catch (error) {
    // Kein Netz oder Datei kaputt: Der zuletzt gespeicherte Stand bleibt
    // stehen. Eine leere Seite wäre der schlechtere Fehler.
    if (!digest) {
      try {
        const cached = localStorage.getItem(DIGEST_KEY) ?? localStorage.getItem('radar.digest.v3');
        if (cached) digest = JSON.parse(cached);
      } catch {}
    }
    if (!digest) renderError(error);
  } finally {
    busy = false;
    setTimeout(() => { $('track').hidden = true; $('bar').style.width = '0'; }, 320);
    render();
  }
}

/* -------------------------------------------------------------- Anzeige */

function render() {
  document.body.classList.toggle('dense', settings.density === 'dense');
  const view = buildView();
  renderSubline(view);
  renderChips(view);
  renderContent(view);
  renderColophon();
  $('cal-badge').hidden = soon(now, 10).length === 0;
  if (sheetKind === 'find') renderFindResults();
}

function renderSubline({ items }) {
  if (!digest) { $('subline').textContent = t('loading'); return; }
  // Die Zeitangabe steht vorn: Wenn die Zeile am Rand abgeschnitten wird,
  // soll die Quellenzahl verlorengehen und nicht die Frische.
  $('subline').textContent = t('subline', {
    when: relativeTime(digest.generatedAt),
    items: items.length,
    ok: digest.sourcesOk,
    total: digest.sourcesTotal,
  });
}

function renderChips({ counts }) {
  const parts = [`<button class="chip" data-topic="all" aria-pressed="${settings.filter === 'all'}">${esc(t('all'))}</button>`];
  /*
   * Gemerktes steht gleich an zweiter Stelle, nicht am Ende. Am Ende der
   * Reiterzeile liegt es außerhalb des Bildschirms -- wer gerade etwas gemerkt
   * hat, sieht dann nicht, wohin es gewandert ist.
   */
  if (settings.saved.length > 0 || settings.filter === 'saved') {
    parts.push(
      `<button class="chip" data-topic="saved" aria-pressed="${settings.filter === 'saved'}">` +
      `${BOOKMARK_ICON}${esc(t('savedTitle'))} <span class="n">${settings.saved.length}</span></button>`,
    );
  }
  for (const base of TOPICS) {
    const topic = topic_(base.id);
    const n = counts[topic.id] ?? 0;
    // Leere Rubriken verschwinden -- außer Riemen, das ist Absicht.
    if (!n && topic.id !== 'belt') continue;
    parts.push(
      `<button class="chip" data-topic="${topic.id}" aria-pressed="${settings.filter === topic.id}">` +
      `<span class="dot" style="background:${topic.accent}"></span>${esc(topic.short)}` +
      (n ? ` <span class="n">${n}</span>` : '') +
      `</button>`,
    );
  }
  $('chips').innerHTML = parts.join('');
}

function renderContent(view) {
  const box = $('content');
  if (!digest) { box.innerHTML = skeleton(); return; }
  const { all, items, total, mode } = view;
  const out = [];

  const ageHours = (Date.now() - digest.generatedAt) / 3600000;
  if (ageHours > 6) {
    const days = Math.round(ageHours / 24);
    const alter = days >= 1
      ? (days === 1 ? t('ageDay') : t('ageDays', { n: days }))
      : t('ageHours', { n: Math.round(ageHours) });
    out.push(
      `<div class="banner"><b>${esc(t('staleTitle', { age: alter }))}</b>` +
      `<span>${esc(t('staleBody'))}</span></div>`,
    );
  }

  if (mode === 'all') {
    const fresh = countNew(all);
    if (fresh > 0) out.push(`<p class="news">${esc(t('newSince', { n: fresh }))}</p>`);
    out.push(renderStrip());
  }

  if (mode === 'saved') {
    out.push(items.length === 0
      ? `<div class="blank"><b>${esc(t('savedEmptyTitle'))}</b><p>${esc(t('savedEmptyBody'))}</p>` +
        `<button class="cta" data-topic="all">${esc(t('showAll'))}</button></div>`
      : `<div class="cards">${items.map((item) => card(item)).join('')}</div>`);
    box.innerHTML = out.join('');
    return;
  }

  if (items.length === 0) {
    const belt = settings.filter === 'belt';
    out.push(
      `<div class="blank"><b>${esc(belt ? t('emptyBeltTitle') : t('emptyTitle'))}</b>` +
      `<p>${esc(belt ? t('emptyBeltBody', { sources: SOURCES.length }) : t('emptyBody'))}</p>` +
      `<button class="cta" data-topic="all">${esc(t('showAll'))}</button></div>`,
    );
    box.innerHTML = out.join('');
    return;
  }

  if (mode === 'all') {
    let rest = items;
    if (items.length > 2) {
      out.push(hero(items[0]));
      rest = items.slice(1);
    }
    // Die Top 10 stehen hinter dem Aufmacher -- die Nachricht des Tages
    // bleibt oben.
    out.push(renderTop());

    const byTopic = new Map();
    for (const item of rest) {
      if (!byTopic.has(item.topic)) byTopic.set(item.topic, []);
      byTopic.get(item.topic).push(item);
    }
    for (const [topicId, list] of byTopic) {
      const topic = topic_(topicId);
      const inRubrik = view.counts[topicId] ?? list.length;
      out.push(
        `<section class="group" style="--accent:${topic.accent}"><div class="group-head">` +
        `<span class="group-dot"></span><h2>${esc(topic.label)}</h2>` +
        // Keine nackte Zahl mehr: Die stimmte nie mit dem Reiter überein, weil
        // der Aufmacher herausgezogen wird. Jetzt steht hier, wohin es geht.
        `<button class="more" data-topic="${topicId}">${esc(t('topicAll', { n: inRubrik }))}</button>` +
        `</div><div class="cards">${list.map((item) => card(item)).join('')}</div></section>`,
      );
    }
  } else {
    const topic = topic_(settings.filter);
    if (settings.filter === 'scene') out.push(renderTop());
    out.push(`<p class="count">${esc(t('inTopic', { n: total }))}</p>`);
    out.push(`<section class="group" style="--accent:${topic.accent}">` +
      `<div class="cards">${items.map((item) => card(item)).join('')}</div></section>`);
  }

  if (items.length < total) {
    out.push(`<button class="cta wide" data-more="1">${esc(t('loadMore'))}</button>`);
  }

  box.innerHTML = out.join('');
}

function isFresh(item) {
  return item.publishedAt && Date.now() - item.publishedAt < 3 * 3600000;
}

const BOOKMARK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
const THUMB_UP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20h3V9H2v11zm19.8-9.3c0-.9-.8-1.7-1.7-1.7h-5.4l.8-3.9v-.3c0-.4-.1-.7-.4-1L14.2 3 7.9 9.3c-.3.3-.5.7-.5 1.2v8.3c0 .9.8 1.7 1.7 1.7h7.6c.7 0 1.3-.4 1.6-1l2.6-6c.1-.2.1-.4.1-.6v-2.2z"/></svg>';

/**
 * Die Zeile unter der Überschrift. Hier steht auch das Lesezeichen -- bewusst
 * *neben* der Karte und nicht darin: Ein Knopf in einem Link ist weder
 * gültiges HTML noch auf dem Handy zuverlässig zu treffen.
 */
function metaLine(item) {
  const bits = [`<span class="src">${esc(item.sourceName)}</span>`];
  if (isFresh(item)) bits.push(`<span class="tag new">${esc(t('badgeNew'))}</span>`);
  if (item.publishedAt) bits.push(`<span>${esc(relativeTime(item.publishedAt))}</span>`);
  if (item.lang === 'en') bits.push('<span class="tag">EN</span>');
  if (item.kind === 'video' && Number.isFinite(item.views) && item.views > 0) {
    bits.push(`<span>${esc(t('topViews', { n: compactNumber(item.views) }))}</span>`);
  }

  // Dieselbe Meldung bei anderen Quellen -- die Zeile, die aus drei Karten
  // eine macht.
  const also = item.also ?? [];
  if (also.length > 0) {
    const names = also.slice(0, 2).map((a) => a.sourceName).join(', ');
    const label = also.length > 2
      ? `${names} ${t('alsoMore', { n: also.length - 2 })}`
      : names;
    bits.push(`<span class="also">${esc(t('alsoAt', { sources: label }))}</span>`);
  }

  const saved = isSaved(item.link);
  const button = `<button class="save${saved ? ' on' : ''}" data-save="${esc(item.link)}" ` +
    `aria-pressed="${saved}" aria-label="${esc(saved ? t('unsave') : t('save'))}">${BOOKMARK_ICON}</button>`;
  return `<div class="meta">${bits.join('')}${button}</div>`;
}

/**
 * Viele Feeds liefern als Zusammenfassung schlicht die eigene Überschrift noch
 * einmal. Dann steht dieselbe Aussage zweimal untereinander und kostet vier
 * Zeilen. Solche Anrisse fallen weg.
 */
function usefulSummary(item) {
  if (settings.density === 'dense') return '';
  const summary = String(item.summary ?? '').trim();
  if (summary.length < 25) return '';
  const flat = (text) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const head = flat(item.headline);
  const body = flat(summary);
  if (!head) return summary;
  if (body.startsWith(head.slice(0, Math.min(head.length, 60)))) return '';
  return summary;
}

function linkAttrs(item) {
  return `href="${esc(safeUrl(item.link))}" target="_blank" rel="noopener noreferrer" ` +
    `data-mark="${esc(item.link)}"`;
}

function hero(item) {
  const shot = item.image
    ? `<img class="shot" src="${esc(safeUrl(item.image))}" alt="" loading="eager" decoding="async">`
    : '';
  const summary = usefulSummary(item);
  return `<article class="hero${isSeen(item.link) ? ' seen' : ''}">` +
    `<a class="hero-main" ${linkAttrs(item)}>${shot}<div class="body">` +
    // Der Aufmacher erklärt sich jetzt selbst. Vorher war er nur größer, und
    // niemand konnte wissen, warum ausgerechnet diese Meldung oben steht.
    `<span class="kicker">${esc(t('heroLabel'))}</span>` +
    `<h2>${esc(item.headline)}</h2>` +
    (summary ? `<p>${esc(summary)}</p>` : '') +
    `</div></a><div class="hero-foot">${metaLine(item)}</div></article>`;
}

function card(item) {
  const seen = isSeen(item.link) ? ' seen' : '';
  const length = item.kind === 'video' ? clockTime(item.seconds ?? null) : '';

  if (item.kind === 'video' && item.image) {
    return `<article class="card video${seen}">` +
      `<a class="card-main" ${linkAttrs(item)}>` +
      `<div class="frame"><img class="shot" src="${esc(safeUrl(item.image))}" alt="" loading="lazy" decoding="async">` +
      `<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>` +
      (length ? `<span class="len">${esc(length)}</span>` : '') +
      `</div><h3>${esc(item.headline)}</h3></a>${metaLine(item)}</article>`;
  }

  const summary = usefulSummary(item);
  const thumb = item.image
    ? `<img class="thumb" src="${esc(safeUrl(item.image))}" alt="" loading="lazy" decoding="async">`
    : '';
  return `<article class="card${seen}">` +
    `<a class="card-main" ${linkAttrs(item)}>` +
    `<div class="text"><h3>${esc(item.headline)}</h3>` +
    (summary ? `<p>${esc(summary)}</p>` : '') + `</div>${thumb}</a>` +
    `${metaLine(item)}</article>`;
}

/**
 * Die Top 10 der Videoszene -- ein Streifen zum Seitwärtswischen, wie die
 * Termine. Als Liste untereinander wären es zehn Kacheln und damit fast ein
 * halber Bildschirmkilometer, bevor die eigentlichen Nachrichten kommen.
 */
function renderTop() {
  const top = digest?.topVideos;
  if (!top || settings.top === false || !Array.isArray(top.items) || top.items.length === 0) {
    return '';
  }
  const tiles = top.items.map((video, index) => {
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
    const shot = video.thumb
      ? `<img class="shot" src="${esc(safeUrl(video.thumb))}" alt="" loading="lazy" decoding="async">`
      : '<span class="shot"></span>';
    const length = clockTime(video.seconds);
    return `<a class="top" href="${esc(url)}" target="_blank" rel="noopener noreferrer">` +
      `<div class="frame">${shot}<span class="rank">${index + 1}</span>` +
      (length ? `<span class="len">${esc(length)}</span>` : '') +
      `<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div>` +
      `<h3>${esc(video.title)}</h3><p>${esc(video.channel)}</p>` +
      `<p class="num">${esc(t('topViews', { n: compactNumber(video.views) }))}` +
      (video.likes > 0 ? `<span class="likes">${THUMB_UP}${esc(compactNumber(video.likes))}</span>` : '') +
      `</p></a>`;
  }).join('');
  return `<div class="strip"><div class="strip-head"><h2>${esc(t('topHead'))}</h2>` +
    `<span class="note">${esc(t('topDays', { n: top.windowDays }))}</span></div>` +
    `<div class="rail">${tiles}</div></div>`;
}

function renderStrip() {
  const events = soon(now, 10);
  if (events.length === 0) return '';
  const cards = events.map((event) => {
    const accent = TOPIC_BY_ID[event.topic].accent;  // Farbe ist sprachunabhängig
    const running = stateOf(event, now) === 'running';
    return `<button class="ev${running ? ' now' : ''}" data-event="${esc(event.id)}"` +
      `${running ? ` style="border-color:${accent}"` : ''}>` +
      `<div class="when" style="color:${running ? accent : 'var(--muted)'}">` +
      `<span class="dot" style="background:${accent}"></span>${esc(countdownLabel(event, now))}</div>` +
      `<h3>${esc(event.name)}</h3>` +
      `<p>${esc(formatRange(event))}<br>${esc(event.location)}</p></button>`;
  }).join('');
  return `<div class="strip"><div class="strip-head"><h2>${esc(t('soonHead'))}</h2>` +
    `<button data-open="cal">${esc(t('fullCalendar'))}</button></div>` +
    `<div class="rail">${cards}</div></div>`;
}

function renderColophon() {
  const parts = [t('colophon', { sources: SOURCES.length, topics: TOPICS.length })];
  if (digest?.sourcesFailed?.length) {
    parts.push(t('colophonFailed', { n: digest.sourcesFailed.length, total: digest.sourcesTotal }));
  }
  $('colophon').innerHTML = parts.map(esc).join('<br>');
}

function skeleton() {
  const rows = Array.from({ length: 5 },
    () => '<div class="skel" style="height:96px;margin-bottom:10px"></div>').join('');
  return `<div class="skel" style="height:220px;margin-bottom:22px"></div>${rows}`;
}

function renderError(error) {
  $('content').innerHTML =
    `<div class="blank"><b>${esc(t('offlineTitle'))}</b>` +
    `<p>${esc(t('offlineBody'))} (${esc(error.message)})</p>` +
    `<button class="cta" data-retry="1">${esc(t('retry'))}</button></div>`;
}

/* --------------------------------------------------------------- Zettel */

/**
 * `keepScroll`: Beim Umschalten einer Quelle wird der Zettel neu aufgebaut.
 * Ohne das Merken der Scrollposition springt die Liste jedes Mal an den
 * Anfang -- bei 199 Quellen unbenutzbar.
 */
function openSheet(which, keepScroll = false) {
  const body = $('sheet-body');
  const y = keepScroll ? body.scrollTop : 0;
  sheetKind = which;
  $('sheet').hidden = false;

  const find = $('sheet-find');
  const input = $('find-input');
  find.hidden = which === 'cal';
  if (which === 'find') {
    input.placeholder = t('searchPlaceholder');
    if (input.value !== findQuery) input.value = findQuery;
  } else if (which === 'set') {
    input.placeholder = t('sourceSearch');
    if (input.value !== srcQuery) input.value = srcQuery;
  }

  if (which === 'cal') {
    const list = upcoming(now);
    $('sheet-title').textContent = t('eventsTitle');
    $('sheet-sub').textContent = list.length === 1
      ? t('eventsCountOne')
      : t('eventsCount', { n: list.length });
    body.innerHTML = calendarHtml(list);
  } else if (which === 'find') {
    $('sheet-title').textContent = t('searchTitle');
    renderFindResults();
    if (!keepScroll) setTimeout(() => input.focus(), 60);
  } else {
    $('sheet-title').textContent = t('settingsTitle');
    $('sheet-sub').textContent = t('settingsSub', {
      on: SOURCES.filter((s) => isOn(s.id)).length, total: SOURCES.length,
    });
    body.innerHTML = settingsHtml();
  }
  body.scrollTop = y;
}

function closeSheet() {
  $('sheet').hidden = true;
  sheetKind = null;
}

/* ----------------------------------------------------------------- Suche */

/**
 * Durchsucht alles, was geladen ist -- nicht nur die Frontpage. Genau das ist
 * der Punkt: „Rohloff" steht selten in den dreißig Meldungen, die oben stehen,
 * aber oft in den dreihundert, die dahinterliegen.
 */
function findMatches() {
  const query = findQuery.trim().toLowerCase();
  if (query.length < 2) return null;
  const words = query.split(/\s+/).filter(Boolean);
  const hits = [];
  for (const item of pool({ ignoreAge: true })) {
    const hay = `${item.headline} ${item.summary} ${item.sourceName}`.toLowerCase();
    if (words.every((word) => hay.includes(word))) hits.push(item);
  }
  return hits.sort(byDate);
}

function renderFindResults() {
  const body = $('sheet-body');
  const hits = findMatches();
  if (hits === null) {
    $('sheet-sub').textContent = '';
    body.innerHTML = `<p class="hint">${esc(t('searchHint'))}</p>`;
    return;
  }
  $('sheet-sub').textContent = t('searchHits', { n: hits.length });
  body.innerHTML = hits.length === 0
    ? `<div class="blank"><b>${esc(t('searchEmpty'))}</b></div>`
    : `<div class="cards">${hits.slice(0, 60).map((item) => card(item)).join('')}</div>`;
}

/* ------------------------------------------------------------- Kalender */

const KIND_KEY = {
  race: 'kindRace', championship: 'kindChampionship',
  festival: 'kindFestival', show: 'kindShow',
};

/**
 * Ein Termin als Datei, die jede Kalender-App versteht.
 *
 * Ganztägige Einträge: DTEND ist bei iCalendar der erste Tag *nach* der
 * Veranstaltung -- ein Tag mehr, sonst fehlt im Kalender der letzte Renntag.
 */
function icsFor(event) {
  const plain = (text) => String(text ?? '')
    .replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => `\\${m}`).replace(/\r?\n/g, '\\n');
  const stamp = (day) => day.replace(/-/g, '');
  const dayAfter = (day) => {
    const d = parseDay(day);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  };
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Radar//DE', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:radar-${event.id}@radar`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${stamp(event.start)}`,
    `DTEND;VALUE=DATE:${dayAfter(event.end ?? event.start)}`,
    `SUMMARY:${plain(event.name)}`,
    `LOCATION:${plain(event.location)}`,
    `DESCRIPTION:${plain(event.note ?? '')}${event.url ? `\\n${plain(event.url)}` : ''}`,
    event.url ? `URL:${plain(event.url)}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

function downloadIcs(event) {
  try {
    const blob = new Blob([icsFor(event)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.id}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch { /* Kein Kalender, kein Drama -- die Veranstalterseite bleibt. */ }
}

function calendarHtml(list) {
  const out = [];
  for (const group of groupByMonth(list)) {
    out.push(`<div class="month">${esc(group.label.toUpperCase())}</div><div class="block">`);
    for (const event of group.events) {
      const accent = TOPIC_BY_ID[event.topic].accent;
      const running = stateOf(event, now) === 'running';
      const day = parseDay(event.start);
      out.push(
        `<div class="ev-row">` +
        `<button class="ev-open" data-event="${esc(event.id)}">` +
        `<span class="date${running ? ' now' : ''}"${running ? ` style="background:${accent}"` : ''}>` +
        `<span class="d">${day.getDate()}</span>` +
        `<span class="w">${esc(day.toLocaleDateString(locale(), { weekday: 'short' }))}</span></span>` +
        `<span class="label"><span class="kind" style="color:${accent}">${esc(t(KIND_KEY[event.kind]))}</span> ` +
        `<span class="count-down" style="color:${running ? accent : 'var(--muted)'}">${esc(countdownLabel(event, now))}</span>` +
        `<h3>${esc(event.name)}</h3>` +
        `<p>${esc(formatRange(event))} · ${esc(event.location)}</p>` +
        (event.disciplines?.length ? `<p class="note">${esc(event.disciplines.join(' · '))}</p>` : '') +
        (event.note ? `<p class="note">${esc(event.note)}</p>` : '') +
        (!event.confirmed ? `<p class="unsure">${esc(t('unconfirmed'))}</p>` : '') +
        `</span></button>` +
        // Neu: Der Termin wandert in den eigenen Kalender des Telefons.
        `<button class="ics" data-ics="${esc(event.id)}">${esc(t('icsAdd'))}</button>` +
        `</div>`,
      );
    }
    out.push('</div>');
  }
  const stand = new Date(COMPILED_ON).toLocaleDateString(locale(), { day: '2-digit', month: 'long', year: 'numeric' });
  // Ehrlich bleiben: Die Liste ist von Hand gepflegt und endet irgendwann.
  const last = list.length ? parseDay(list[list.length - 1].start) : null;
  if (last) {
    out.push(`<p class="hint" style="margin-top:20px">${esc(t('calendarEnds', {
      date: last.toLocaleDateString(locale(), { day: '2-digit', month: 'long', year: 'numeric' }),
    }))}</p>`);
  }
  out.push(`<p class="hint">${esc(t('calendarFooter', { date: stand }))}</p>`);
  return out.join('');
}

/* -------------------------------------------------------- Einstellungen */

function steps(items) {
  return `<div class="steps">${items.join('')}</div>`;
}

function settingsHtml() {
  const out = [];
  const query = srcQuery.trim().toLowerCase();

  /*
   * Sucht jemand eine Quelle, verschwindet alles andere. Sprache und Umfang
   * zwischen den Treffern stehen zu lassen hieße, die Antwort im Heuhaufen zu
   * verstecken, den die Suche gerade wegräumen sollte.
   */
  if (!query) {
    out.push(`<div class="sec">${esc(t('secLanguage'))}</div>`);
    out.push(`<p class="hint">${esc(t('languageHint'))}</p>`);
    out.push(steps(LANGUAGES.map(({ code, label }) =>
      `<button class="step" data-lang="${code}" lang="${code}" ` +
      `aria-pressed="${locale() === code}">${esc(label)}</button>`)));

    out.push(`<div class="sec">${esc(t('secDisplay'))}</div>`);
    out.push(`<p class="hint">${esc(t('displayHint'))}</p>`);
    out.push(steps([
      `<button class="step" data-density="roomy" aria-pressed="${settings.density !== 'dense'}">${esc(t('displayRoomy'))}</button>`,
      `<button class="step" data-density="dense" aria-pressed="${settings.density === 'dense'}">${esc(t('displayDense'))}</button>`,
    ]));

    out.push(`<div class="sec">${esc(t('secScope'))}</div>`);
    out.push(`<p class="hint">${esc(t('scopeHint'))}</p>`);
    out.push(steps([10, 20, 30, 45, 60].map((n) =>
      `<button class="step" data-max="${n}" aria-pressed="${settings.maxItems === n}">${esc(t('nItems', { n }))}</button>`)));
    out.push(steps([1, 2, 3, 7, 14].map((d) =>
      `<button class="step" data-age="${d}" aria-pressed="${settings.maxAgeDays === d}">${esc(d === 1 ? t('nDay') : t('nDays', { n: d }))}</button>`)));

    if (digest?.topVideos) {
      out.push(`<div class="sec">${esc(t('secTop'))}</div>`);
      out.push(`<p class="hint">${esc(t('topHint'))}</p>`);
      out.push(
        '<div class="block">' +
        `<button class="row" data-top="1"><span class="label"><b>${esc(t('topShow'))}</b></span>` +
        `<span class="sw" aria-checked="${settings.top !== false}" role="switch"></span></button></div>`,
      );
    }
  }

  out.push(`<div class="sec">${esc(t('secSources', {
    on: SOURCES.filter((s) => isOn(s.id)).length, total: SOURCES.length,
  }))}</div>`);
  if (!query) out.push(`<p class="hint">${esc(t('sourcesHint'))}</p>`);
  out.push(steps([
    `<button class="step" data-every="on">${esc(t('everythingOn'))}</button>`,
    `<button class="step" data-every="off">${esc(t('everythingOff'))}</button>`,
    `<button class="step" data-every="de">${esc(t('onlyGerman'))}</button>`,
  ]));

  const matches = (source) => !query
    || source.name.toLowerCase().includes(query)
    || (source.note ?? '').toLowerCase().includes(query);

  let found = 0;
  for (const base of TOPICS) {
    const topic = topic_(base.id);
    const list = SOURCES.filter((s) => s.topic === base.id && matches(s));
    if (list.length === 0) continue;
    found += list.length;
    const on = list.filter((s) => isOn(s.id)).length;
    // Zugeklappt starten: 199 Schalter am Stück sind keine Liste, sondern eine
    // Wand. Aufgeklappt wird, was man wirklich sehen will -- oder was die
    // Suche gerade gefunden hat.
    const open = Boolean(query) || openTopics.has(base.id);
    out.push(
      `<div class="topic-head${open ? ' open' : ''}" style="--accent:${topic.accent}">` +
      `<button class="topic-toggle" data-fold="${base.id}">` +
      `<span class="chev" aria-hidden="true"></span>` +
      `<span class="group-dot"></span><b>${esc(topic.label)}</b> ` +
      `<span class="n">${on}/${list.length}</span></button>` +
      (open ? `<button class="bulk" data-bulk="${base.id}">${esc(on === list.length ? t('allOff') : t('allOn'))}</button>` : '') +
      `</div>`,
    );
    if (!open) continue;
    out.push('<div class="block">');
    for (const source of list) {
      out.push(
        `<button class="row" data-src="${esc(source.id)}">` +
        `<span class="label"><b>${esc(source.name)}` +
        (source.kind !== 'article' ? `<span class="tag">${esc(source.kind === 'video' ? t('tagVideo') : t('tagForum'))}</span>` : '') +
        (source.lang === 'en' ? '<span class="tag">EN</span>' : '') +
        `</b>${source.note ? `<span class="note">${esc(source.note)}</span>` : ''}</span>` +
        `<span class="sw" aria-checked="${isOn(source.id)}" role="switch"></span></button>`,
      );
    }
    out.push('</div>');
  }
  if (found === 0) out.push(`<div class="blank"><b>${esc(t('sourcesNone'))}</b></div>`);
  return out.join('');
}

/** Nur die Quellenliste neu zeichnen, damit das Suchfeld die Eingabemarke behält. */
function refreshSettingsBody() {
  $('sheet-body').innerHTML = settingsHtml();
  $('sheet-sub').textContent = t('settingsSub', {
    on: SOURCES.filter((s) => isOn(s.id)).length, total: SOURCES.length,
  });
}

/* ------------------------------------------------------------ Bedienung */

function setFilter(topic) {
  settings.filter = topic;
  extra = 0;
  save();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Eine Meldung aus Ansicht oder Suche anhand ihrer Adresse wiederfinden. */
function itemByLink(link) {
  return settings.saved.find((x) => x.link === link)
    ?? pool({ ignoreAge: true }).find((x) => x.link === link)
    ?? null;
}

document.addEventListener('click', (event) => {
  const target = event.target.closest(
    '[data-topic],[data-open],[data-event],[data-ics],[data-src],[data-bulk],[data-every],'
    + '[data-max],[data-age],[data-retry],[data-lang],[data-top],[data-density],[data-more],'
    + '[data-save],[data-mark],[data-fold]',
  );
  if (!target) return;

  if (target.dataset.save !== undefined) {
    // Muss vor allem anderen stehen: Der Knopf liegt in der Karte, und ein
    // Klick darauf soll nicht zusätzlich die Meldung öffnen.
    event.preventDefault();
    event.stopPropagation();
    const item = itemByLink(target.dataset.save);
    if (item) { toggleSaved(item); render(); if (sheetKind === 'find') renderFindResults(); }
    return;
  }
  if (target.dataset.mark !== undefined) {
    // Kein preventDefault: Der Link darf öffnen. Hier wird nur vermerkt,
    // dass die Meldung gesehen wurde.
    markSeen(target.dataset.mark);
    const box = target.closest('.card, .hero');
    if (box) box.classList.add('seen');
    return;
  }

  if (target.dataset.topic) {
    setFilter(target.dataset.topic);
  } else if (target.dataset.more) {
    extra += PAGE_SIZE;
    render();
  } else if (target.dataset.open === 'cal') {
    openSheet('cal');
  } else if (target.dataset.ics) {
    const event_ = upcoming(now).find((e) => e.id === target.dataset.ics);
    if (event_) downloadIcs(event_);
  } else if (target.dataset.event) {
    const event_ = upcoming(now).find((e) => e.id === target.dataset.event);
    if (event_) window.open(safeUrl(event_.url), '_blank', 'noopener');
  } else if (target.dataset.fold) {
    const id = target.dataset.fold;
    if (openTopics.has(id)) openTopics.delete(id); else openTopics.add(id);
    refreshSettingsBody();
  } else if (target.dataset.src) {
    const id = target.dataset.src;
    settings.off = isOn(id) ? [...settings.off, id] : settings.off.filter((x) => x !== id);
    const y = $('sheet-body').scrollTop;
    save(); refreshSettingsBody(); $('sheet-body').scrollTop = y; render();
  } else if (target.dataset.bulk) {
    const ids = SOURCES.filter((s) => s.topic === target.dataset.bulk).map((s) => s.id);
    const allOn = ids.every(isOn);
    settings.off = allOn
      ? [...new Set([...settings.off, ...ids])]
      : settings.off.filter((x) => !ids.includes(x));
    const y = $('sheet-body').scrollTop;
    save(); refreshSettingsBody(); $('sheet-body').scrollTop = y; render();
  } else if (target.dataset.every) {
    const mode = target.dataset.every;
    settings.off = mode === 'on' ? []
      : mode === 'off' ? SOURCES.map((s) => s.id)
        : SOURCES.filter((s) => s.lang !== 'de').map((s) => s.id);
    const y = $('sheet-body').scrollTop;
    save(); refreshSettingsBody(); $('sheet-body').scrollTop = y; render();
  } else if (target.dataset.density) {
    settings.density = target.dataset.density;
    save(); refreshSettingsBody(); render();
  } else if (target.dataset.top) {
    settings.top = settings.top === false;
    save(); refreshSettingsBody(); render();
  } else if (target.dataset.max) {
    settings.maxItems = Number(target.dataset.max);
    extra = 0;
    save(); refreshSettingsBody(); render();
  } else if (target.dataset.age) {
    settings.maxAgeDays = Number(target.dataset.age);
    save(); refreshSettingsBody(); render();
  } else if (target.dataset.lang) {
    settings.lang = target.dataset.lang;
    save();
    applyLanguage();
    refreshSettingsBody();
    render();
  } else if (target.dataset.retry) {
    $('pull-label').textContent = t('pullToRefresh');
    refresh();
  }
});

$('btn-cal').addEventListener('click', () => openSheet('cal'));
$('btn-set').addEventListener('click', () => { srcQuery = ''; openSheet('set'); });
$('btn-find').addEventListener('click', () => openSheet('find'));
$('sheet-close').addEventListener('click', closeSheet);

$('find-input').addEventListener('input', (event) => {
  const value = event.target.value;
  if (sheetKind === 'find') {
    findQuery = value;
    renderFindResults();
  } else if (sheetKind === 'set') {
    srcQuery = value;
    // Nur der Rumpf wird neu gezeichnet -- das Feld selbst bleibt stehen und
    // behält die Eingabemarke.
    $('sheet-body').innerHTML = settingsHtml();
  }
});

/* -------------------------------------------------- Kopfzeile und Reiter */

/**
 * Die Reiterzeile klebte bisher auf derselben Höhe wie die Kopfzeile und
 * verschwand dahinter -- wer die Rubrik wechseln wollte, musste erst wieder
 * ganz nach oben scrollen. Jetzt steht sie genau darunter, und dafür muss die
 * Höhe der Kopfzeile bekannt sein. Sie ändert sich mit der Aussparung des
 * Geräts, der Schriftgröße und beim Zusammenschieben -- also gemessen statt
 * geraten.
 */
const topbar = $('topbar');
function measureTopbar() {
  document.documentElement.style.setProperty('--topbar-h', `${Math.round(topbar.offsetHeight)}px`);
}
measureTopbar();
if ('ResizeObserver' in window) new ResizeObserver(measureTopbar).observe(topbar);
window.addEventListener('orientationchange', () => setTimeout(measureTopbar, 200));

/**
 * Beim Scrollen schiebt sich die Kopfzeile zusammen und wird deckend. Vorher
 * schimmerten Karten und Reiter darunter durch, und die große Überschrift
 * „Radar" nahm auf jedem Bildschirm Platz weg, den die Nachrichten brauchen.
 */
let lastY = -1;
function onScroll() {
  const y = window.scrollY;
  if (y === lastY) return;
  lastY = y;
  topbar.classList.toggle('small', y > 40);
  $('fab').hidden = y < 1200;
  measureTopbar();
}
window.addEventListener('scroll', onScroll, { passive: true });

$('fab').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ----------------------------------------------------- Ziehen und Pausen */

/**
 * Ziehen zum Aktualisieren. Bewusst selbst gebaut statt der Browser-Geste:
 * Die App läuft im Vollbild, und dort gibt es keine Adressleiste, an der man
 * ziehen könnte. Ausgelöst wird nur, wenn die Seite ganz oben steht.
 */
const scroller = $('scroller');
let startY = 0, pulling = false;

scroller.addEventListener('touchstart', (event) => {
  pulling = window.scrollY <= 0 && !busy;
  startY = event.touches[0].clientY;
}, { passive: true });

scroller.addEventListener('touchmove', (event) => {
  if (!pulling) return;
  const distance = event.touches[0].clientY - startY;
  $('pull').classList.toggle('armed', distance > 70);
  if (distance > 70) $('pull-label').textContent = t('releaseToRefresh');
}, { passive: true });

scroller.addEventListener('touchend', () => {
  if (pulling && $('pull').classList.contains('armed')) {
    $('pull-label').textContent = t('loading');
    refresh().then(() => {
      $('pull').classList.remove('armed');
      $('pull-label').textContent = t('pullToRefresh');
    });
  } else {
    $('pull').classList.remove('armed');
  }
  pulling = false;
}, { passive: true });

/**
 * Beim Zurückkehren in die App nachladen, wenn der Stand älter als zehn
 * Minuten ist. Das ersetzt die Handbewegung in den meisten Fällen: Man tippt
 * die App an und sieht Aktuelles, ohne etwas zu tun.
 */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  now = new Date();
  markVisit();
  const stale = !digest || Date.now() - digest.generatedAt > 600000;
  if (stale) refresh({ silent: true });
  else render();
});

/**
 * Tote Bildadressen kommen in Feeds ständig vor. Ohne das hier zeigt der
 * Browser sein Platzhalter-Symbol mitten in der Karte -- das sieht kaputt aus,
 * obwohl nur ein Bild fehlt. Muss in der Erfassungsphase lauschen:
 * Bildfehler steigen nicht auf.
 */
document.addEventListener('error', (event) => {
  const el = event.target;
  if (!(el instanceof HTMLImageElement)) return;
  const frame = el.closest('.frame');
  if (frame) frame.remove();
  else el.remove();
}, true);

/* --------------------------------------------------------------- Start */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // Ohne Service Worker läuft alles weiter, nur eben nicht offline.
    });
  });
}

try {
  const cached = localStorage.getItem(DIGEST_KEY) ?? localStorage.getItem('radar.digest.v3');
  if (cached) { digest = JSON.parse(cached); render(); }
} catch {}

// Beschriftungen, die im Gerüst auf Deutsch stehen, sofort auf die gewählte
// Sprache setzen -- sonst blitzt beim Start kurz Deutsch auf.
$('pull-label').textContent = t('pullToRefresh');
$('btn-cal').setAttribute('aria-label', t('eventsTitle'));
$('btn-set').setAttribute('aria-label', t('settingsTitle'));
$('btn-find').setAttribute('aria-label', t('searchTitle'));
$('fab').setAttribute('aria-label', t('toTop'));
$('sheet-close').textContent = t('done');
if (!digest) $('subline').textContent = t('loading');

refresh();
