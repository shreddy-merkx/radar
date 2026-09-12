/**
 * Radar als Web-App.
 *
 * Die gesamte Filter- und Sortierlogik ist unverändert dieselbe wie in der
 * bisherigen App -- localFilter.js und sources.js wurden Zeile für Zeile
 * übernommen. Was sich geändert hat, ist nur, *woher* die Meldungen kommen:
 * nicht mehr aus ~200 Einzelabrufen auf dem Handy, sondern aus einer fertigen
 * Datei, die GitHub alle 30 Minuten baut (build/fetch.mjs).
 */
import { localDigest } from './localFilter.js';
import { SOURCES, TOPICS, TOPIC_BY_ID } from './sources.js';
import {
  COMPILED_ON, countdownLabel, formatRange, groupByMonth,
  parseDay, soon, stateOf, upcoming,
} from './events.js';

const KEY = 'radar.settings.v3';
const DIGEST_URL = 'data/digest.json';

const DEFAULTS = {
  off: [],          // ausgeschaltete Quellen (nur die Ausnahmen speichern)
  maxItems: 30,
  maxAgeDays: 3,
  filter: 'all',
};

let settings = load();
let digest = null;
let busy = false;
let now = new Date();

/* ------------------------------------------------------------- Speicher */

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULTS,
      ...parsed,
      off: Array.isArray(parsed.off) ? parsed.off : [],
    };
  } catch {
    // Privater Modus, volle Ablage, abgelehnte Berechtigung: Einstellungen
    // sind Komfort. Ohne sie läuft die App mit den Standardwerten weiter.
    return { ...DEFAULTS };
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch { /* siehe oben */ }
}

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
  if (minutes < 1) return 'gerade eben';
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'gestern';
  if (days < 7) return `vor ${days} Tagen`;
  return new Date(ms).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

const isOn = (id) => !settings.off.includes(id);

/* ------------------------------------------------------------ Auswertung */

/**
 * Aus der gebauten Datei wird die Seite: erst nach Quellen und Alter sieben,
 * dann dieselbe Mischung wie bisher (Mindestplätze je Rubrik, Deckel bei
 * einem Drittel). Das läuft absichtlich hier und nicht beim Bauen -- so
 * wirken Einstellungen sofort, ohne auf den nächsten Lauf zu warten.
 */
function buildPage() {
  if (!digest) return { items: [], counts: {} };
  const cutoff = Date.now() - settings.maxAgeDays * 86400000;
  const raw = digest.items.filter((item) => {
    if (!isOn(item.sourceId)) return false;
    // Riemen behält sein längeres Gedächtnis, siehe localFilter.js.
    if (item.topic === 'belt') return true;
    return item.publishedAt === null || item.publishedAt >= cutoff;
  });
  const page = localDigest(raw, settings.maxItems);
  const counts = {};
  for (const item of page) counts[item.topic] = (counts[item.topic] ?? 0) + 1;
  return { items: page, counts };
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
    if (data.version !== 1 || !Array.isArray(data.items)) {
      throw new Error('Unbekanntes Format');
    }
    digest = data;
    try { localStorage.setItem('radar.digest.v3', JSON.stringify(data)); } catch {}
    $('bar').style.width = '100%';
  } catch (error) {
    // Kein Netz oder Datei kaputt: Der zuletzt gespeicherte Stand bleibt
    // stehen. Eine leere Seite wäre der schlechtere Fehler.
    if (!digest) {
      try {
        const cached = localStorage.getItem('radar.digest.v3');
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
  // Einmal rechnen, dreimal verwenden. localDigest sortiert ein paar hundert
  // Meldungen -- das dreimal pro Anzeige zu tun wäre schlicht Verschwendung.
  const page = buildPage();
  renderSubline(page);
  renderChips(page);
  renderContent(page);
  renderColophon();
  $('cal-badge').hidden = soon(now, 10).length === 0;
}

function renderSubline({ items }) {
  if (!digest) { $('subline').textContent = 'wird geladen …'; return; }
  $('subline').textContent =
    `${items.length} Meldungen · ${digest.sourcesOk}/${digest.sourcesTotal} Quellen · ${relativeTime(digest.generatedAt)}`;
}

function renderChips({ counts }) {
  const parts = [`<button class="chip" data-topic="all" aria-pressed="${settings.filter === 'all'}">Alle</button>`];
  for (const topic of TOPICS) {
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

function renderContent({ items }) {
  const box = $('content');
  if (!digest) { box.innerHTML = skeleton(); return; }

  const visible = settings.filter === 'all' ? items : items.filter((i) => i.topic === settings.filter);
  const out = [];

  const ageHours = (Date.now() - digest.generatedAt) / 3600000;
  if (ageHours > 6) {
    const days = Math.round(ageHours / 24);
    const alter = days >= 1
      ? `${days} ${days === 1 ? 'Tag' : 'Tagen'}`
      : `${Math.round(ageHours)} Stunden`;
    out.push(
      `<div class="banner"><b>Stand von vor ${alter}</b>` +
      `<span>Normalerweise wird alle 30 Minuten nachgeladen. Wenn das länger so bleibt, steht die Aktualisierung bei GitHub still — einmal „Run workflow" drücken weckt sie.</span></div>`,
    );
  }

  out.push(renderStrip());

  if (visible.length === 0) {
    const belt = settings.filter === 'belt';
    out.push(
      `<div class="blank"><b>${belt ? 'Gerade nichts zum Riemenantrieb' : 'Hier ist gerade nichts'}</b>` +
      `<p>${belt
        ? `Radar durchsucht alle ${SOURCES.length} Quellen nach Riemenantrieb, Nabenschaltung und Getriebe und schaut dabei drei Wochen zurück. Im Moment gibt es nichts — das ist normal.`
        : 'In dieser Rubrik ist bei der letzten Aktualisierung nichts angekommen.'}</p>` +
      `<button class="cta" data-topic="all">Alles anzeigen</button></div>`,
    );
    box.innerHTML = out.join('');
    return;
  }

  // Aufmacher nur in der Gesamtansicht -- in einer Rubrik wäre er willkürlich.
  let rest = visible;
  if (settings.filter === 'all' && visible.length > 2) {
    out.push(hero(visible[0]));
    rest = visible.slice(1);
  }

  const byTopic = new Map();
  for (const item of rest) {
    if (!byTopic.has(item.topic)) byTopic.set(item.topic, []);
    byTopic.get(item.topic).push(item);
  }
  for (const [topicId, list] of byTopic) {
    const topic = TOPIC_BY_ID[topicId];
    out.push(
      `<section class="group"><div class="group-head">` +
      `<span class="group-dot" style="background:${topic.accent}"></span>` +
      `<h2>${esc(topic.label)}</h2><span class="n">${list.length}</span></div>` +
      `<div class="cards">${list.map(card).join('')}</div></section>`,
    );
  }

  box.innerHTML = out.join('');
}

function isFresh(item) {
  return item.publishedAt && Date.now() - item.publishedAt < 3 * 3600000;
}

function metaLine(item) {
  const bits = [`<span class="src">${esc(item.sourceName)}</span>`];
  if (isFresh(item)) bits.push('<span class="tag new">NEU</span>');
  if (item.publishedAt) bits.push(`<span>${esc(relativeTime(item.publishedAt))}</span>`);
  if (item.lang === 'en') bits.push('<span class="tag">EN</span>');
  return `<div class="meta">${bits.join('')}</div>`;
}

function hero(item) {
  const shot = item.image
    ? `<img class="shot" src="${esc(safeUrl(item.image))}" alt="" loading="eager" decoding="async">`
    : '';
  return `<a class="hero" href="${esc(safeUrl(item.link))}" target="_blank" rel="noopener noreferrer">` +
    `${shot}<div class="body"><h2>${esc(item.headline)}</h2>` +
    `<p>${esc(item.summary)}</p>${metaLine(item)}</div></a>`;
}

function card(item) {
  const href = esc(safeUrl(item.link));
  if (item.kind === 'video' && item.image) {
    return `<a class="card video" href="${href}" target="_blank" rel="noopener noreferrer">` +
      `<div class="frame"><img class="shot" src="${esc(safeUrl(item.image))}" alt="" loading="lazy" decoding="async">` +
      `<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div>` +
      `<div><h3>${esc(item.headline)}</h3>${metaLine(item)}</div></a>`;
  }
  const thumb = item.image
    ? `<img class="thumb" src="${esc(safeUrl(item.image))}" alt="" loading="lazy" decoding="async">`
    : '<span></span>';
  return `<a class="card" href="${href}" target="_blank" rel="noopener noreferrer">` +
    `<div><h3>${esc(item.headline)}</h3><p>${esc(item.summary)}</p>${metaLine(item)}</div>${thumb}</a>`;
}

function renderStrip() {
  const events = soon(now, 10);
  if (events.length === 0) return '';
  const cards = events.map((event) => {
    const accent = TOPIC_BY_ID[event.topic].accent;
    const running = stateOf(event, now) === 'running';
    return `<button class="ev${running ? ' now' : ''}" data-event="${esc(event.id)}"` +
      `${running ? ` style="border-color:${accent}"` : ''}>` +
      `<div class="when" style="color:${running ? accent : 'var(--muted)'}">` +
      `<span class="dot" style="background:${accent}"></span>${esc(countdownLabel(event, now))}</div>` +
      `<h3>${esc(event.name)}</h3>` +
      `<p>${esc(formatRange(event))}<br>${esc(event.location)}</p></button>`;
  }).join('');
  return `<div class="strip"><div class="strip-head"><h2>DEMNÄCHST</h2>` +
    `<button data-open="cal">ganzer Kalender ›</button></div>` +
    `<div class="rail">${cards}</div></div>`;
}

function renderColophon() {
  const parts = [`${SOURCES.length} Quellen · ${TOPICS.length} Rubriken · sortiert auf dem Gerät`];
  if (digest?.sourcesFailed?.length) {
    parts.push(`${digest.sourcesFailed.length} Quellen waren beim letzten Einsammeln stumm — bei ${digest.sourcesTotal} ist das normal.`);
  }
  $('colophon').innerHTML = parts.map(esc).join('<br>');
}

function skeleton() {
  const rows = Array.from({ length: 5 },
    () => '<div class="skel" style="height:104px;margin-bottom:10px"></div>').join('');
  return `<div class="skel" style="height:230px;margin-bottom:22px"></div>${rows}`;
}

function renderError(error) {
  $('content').innerHTML =
    `<div class="blank"><b>Keine Verbindung</b>` +
    `<p>Radar konnte die Nachrichten nicht laden und hat auch keinen gespeicherten Stand. ` +
    `(${esc(error.message)})</p>` +
    `<button class="cta" data-retry="1">Nochmal versuchen</button></div>`;
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
  $('sheet').hidden = false;
  if (which === 'cal') {
    const list = upcoming(now);
    $('sheet-title').textContent = 'Termine';
    $('sheet-sub').textContent = `${list.length} ${list.length === 1 ? 'Termin' : 'Termine'} vor dir`;
    body.innerHTML = calendarHtml(list);
  } else {
    $('sheet-title').textContent = 'Einstellungen';
    $('sheet-sub').textContent = `${SOURCES.filter((s) => isOn(s.id)).length} von ${SOURCES.length} Quellen an`;
    body.innerHTML = settingsHtml();
  }
  body.scrollTop = y;
}

const KIND_LABEL = { race: 'RENNEN', championship: 'MEISTERSCHAFT', festival: 'FESTIVAL', show: 'MESSE' };

function calendarHtml(list) {
  const out = [];
  for (const group of groupByMonth(list)) {
    out.push(`<div class="month">${esc(group.label.toUpperCase())}</div><div class="block">`);
    for (const event of group.events) {
      const accent = TOPIC_BY_ID[event.topic].accent;
      const running = stateOf(event, now) === 'running';
      const day = parseDay(event.start);
      out.push(
        `<button class="ev-row" data-event="${esc(event.id)}">` +
        `<span class="date${running ? ' now' : ''}"${running ? ` style="background:${accent}"` : ''}>` +
        `<span class="d">${day.getDate()}</span>` +
        `<span class="w">${esc(day.toLocaleDateString('de-DE', { weekday: 'short' }))}</span></span>` +
        `<span class="label"><span class="kind" style="color:${accent}">${KIND_LABEL[event.kind]}</span> ` +
        `<span style="font-size:11.5px;font-weight:600;color:${running ? accent : 'var(--muted)'}">${esc(countdownLabel(event, now))}</span>` +
        `<h3>${esc(event.name)}</h3>` +
        `<p>${esc(formatRange(event))} · ${esc(event.location)}</p>` +
        (event.disciplines?.length ? `<p class="note">${esc(event.disciplines.join(' · '))}</p>` : '') +
        (event.note ? `<p class="note">${esc(event.note)}</p>` : '') +
        (!event.confirmed ? '<p class="unsure">Termin noch nicht endgültig bestätigt — vor der Anreise prüfen</p>' : '') +
        `</span></button>`,
      );
    }
    out.push('</div>');
  }
  out.push(
    `<p class="hint" style="margin-top:20px">Termine einzeln an den offiziellen Seiten nachgeschlagen, Stand ` +
    `${esc(parseDay(COMPILED_ON).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }))}. ` +
    `Tippen öffnet die Veranstalterseite.</p>`,
  );
  return out.join('');
}

function settingsHtml() {
  const out = [];

  out.push('<div class="sec">UMFANG</div>');
  out.push('<p class="hint">Wie viele Meldungen die Frontpage zeigt und wie weit Radar zurückschaut.</p>');
  out.push('<div class="steps">');
  for (const n of [10, 20, 30, 45, 60]) {
    out.push(`<button class="step" data-max="${n}" aria-pressed="${settings.maxItems === n}">${n} Meldungen</button>`);
  }
  out.push('</div><div class="steps" style="margin-top:9px">');
  for (const d of [1, 2, 3, 7, 14]) {
    out.push(`<button class="step" data-age="${d}" aria-pressed="${settings.maxAgeDays === d}">${d} ${d === 1 ? 'Tag' : 'Tage'}</button>`);
  }
  out.push('</div>');

  out.push(`<div class="sec">QUELLEN · ${SOURCES.filter((s) => isOn(s.id)).length} VON ${SOURCES.length} AN</div>`);
  out.push('<p class="hint">Abschalten blendet eine Quelle sofort aus. Eingesammelt wird trotzdem weiter — das passiert nicht auf deinem Handy, kostet dich also keine Zeit.</p>');

  for (const topic of TOPICS) {
    const list = SOURCES.filter((s) => s.topic === topic.id);
    if (!list.length) continue;
    const on = list.filter((s) => isOn(s.id)).length;
    out.push(
      `<div class="topic-head"><span class="group-dot" style="background:${topic.accent}"></span>` +
      `<b style="color:${topic.accent}">${esc(topic.label)}</b>` +
      `<span style="font-size:12.5px;color:var(--faint)">${on}/${list.length}</span>` +
      `<button data-bulk="${topic.id}">${on === list.length ? 'alle aus' : 'alle an'}</button></div>`,
    );
    out.push('<div class="block">');
    for (const source of list) {
      out.push(
        `<button class="row" data-src="${esc(source.id)}">` +
        `<span class="label"><b>${esc(source.name)}` +
        (source.kind !== 'article' ? ` <span class="tag">${source.kind === 'video' ? 'VIDEO' : 'FORUM'}</span>` : '') +
        (source.lang === 'en' ? ' <span class="tag">EN</span>' : '') +
        `</b>${source.note ? `<span>${esc(source.note)}</span>` : ''}</span>` +
        `<span class="sw" aria-checked="${isOn(source.id)}" role="switch"></span></button>`,
      );
    }
    out.push('</div>');
  }
  return out.join('');
}

/* ------------------------------------------------------------ Bedienung */

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-topic],[data-open],[data-event],[data-src],[data-bulk],[data-max],[data-age],[data-retry]');
  if (!target) return;

  if (target.dataset.topic) {
    settings.filter = target.dataset.topic;
    save(); render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (target.dataset.open === 'cal') {
    openSheet('cal');
  } else if (target.dataset.event) {
    const event_ = upcoming(now).find((e) => e.id === target.dataset.event);
    if (event_) window.open(safeUrl(event_.url), '_blank', 'noopener');
  } else if (target.dataset.src) {
    const id = target.dataset.src;
    settings.off = isOn(id) ? [...settings.off, id] : settings.off.filter((x) => x !== id);
    save(); openSheet('set', true); render();
  } else if (target.dataset.bulk) {
    const ids = SOURCES.filter((s) => s.topic === target.dataset.bulk).map((s) => s.id);
    const allOn = ids.every(isOn);
    settings.off = allOn
      ? [...new Set([...settings.off, ...ids])]
      : settings.off.filter((x) => !ids.includes(x));
    save(); openSheet('set', true); render();
  } else if (target.dataset.max) {
    settings.maxItems = Number(target.dataset.max);
    save(); openSheet('set', true); render();
  } else if (target.dataset.age) {
    settings.maxAgeDays = Number(target.dataset.age);
    save(); openSheet('set', true); render();
  } else if (target.dataset.retry) {
    refresh();
  }
});

$('btn-cal').addEventListener('click', () => openSheet('cal'));
$('btn-set').addEventListener('click', () => openSheet('set'));
$('sheet-close').addEventListener('click', () => { $('sheet').hidden = true; });

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
  if (distance > 70) $('pull-label').textContent = 'Loslassen zum Aktualisieren';
}, { passive: true });

scroller.addEventListener('touchend', () => {
  if (pulling && $('pull').classList.contains('armed')) {
    $('pull-label').textContent = 'wird geladen …';
    refresh().then(() => {
      $('pull').classList.remove('armed');
      $('pull-label').textContent = 'Zum Aktualisieren ziehen';
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
  const stale = !digest || Date.now() - digest.generatedAt > 600000;
  if (stale) refresh({ silent: true });
  else render();
});

/**
 * Tote Bildadressen kommen in Feeds ständig vor. Ohne das hier zeigt der
 * Browser sein Platzhalter-Symbol mitten in der Karte -- das sieht kaputt aus,
 * obwohl nur ein Bild fehlt. Die Karte ohne Bild sieht dagegen ordentlich aus.
 * Muss in der Erfassungsphase lauschen: Bildfehler steigen nicht auf.
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
  const cached = localStorage.getItem('radar.digest.v3');
  if (cached) { digest = JSON.parse(cached); render(); }
} catch {}

refresh();
