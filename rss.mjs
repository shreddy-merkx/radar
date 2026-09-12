import { XMLParser } from 'fast-xml-parser';
import { mentionsBelt } from './localFilter.js';
                                               

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  processEntities: true,
  trimValues: true,
});

const FETCH_TIMEOUT_MS = 12000;
/**
 * Wie viele Feeds gleichzeitig. Mobilfunk verträgt keine 120 offenen
 * Verbindungen. Von 8 auf 12 erhöht, als die Liste auf knapp 200 Quellen
 * wuchs -- sonst wächst die Wartezeit linear mit jeder neuen Quelle. Höher
 * nicht: iOS drosselt viele parallele Verbindungen selbst, und im Mobilfunk
 * führt Übertreiben zu mehr Abbrüchen statt zu mehr Tempo.
 */
const CONCURRENCY = 12;
/** Pro Quelle. Verhindert, dass ein Vielschreiber den Speicher flutet. */
const MAX_ITEMS_PER_SOURCE = 12;
/**
 * Rückblick für die Rubrik „Riemen & Getriebe" -- unabhängig davon, was in den
 * Einstellungen steht. Drei Wochen, weil dort oft wochenlang nichts passiert.
 */
export const BELT_MAX_AGE_DAYS = 21;

/**
 * Inhalte in CDATA reicht der XML-Parser unverändert durch, deshalb überleben
 * HTML-Entities und müssen hier aufgelöst werden -- sonst kommen deutsche
 * Umlaute als "&auml;" an.
 */
const NAMED_ENTITIES                         = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
  auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß',
  eacute: 'é', egrave: 'è', ecirc: 'ê', agrave: 'à', aacute: 'á', acirc: 'â',
  iacute: 'í', oacute: 'ó', ocirc: 'ô', uacute: 'ú', ccedil: 'ç', ntilde: 'ñ',
  aring: 'å', oslash: 'ø', aelig: 'æ',
  ndash: '–', mdash: '—', hellip: '…', middot: '·', bull: '•',
  laquo: '«', raquo: '»', bdquo: '„', ldquo: '“', rdquo: '”',
  sbquo: '‚', lsquo: '‘', rsquo: '’',
  euro: '€', pound: '£', deg: '°', times: '×', copy: '©', reg: '®', trade: '™',
};

function decodeEntities(text        )         {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body        ) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      if (Number.isFinite(code) && code > 0 && code <= 0x10ffff) {
        try {
          return String.fromCodePoint(code);
        } catch {
          return match;
        }
      }
      return match;
    }
    return NAMED_ENTITIES[body] ?? match;
  });
}

function stripHtml(input         )         {
  if (typeof input !== 'string') return '';
  const withoutTags = input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decodeEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

function asText(value         )         {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    const obj = value                           ;
    if (typeof obj['#text'] === 'string') return obj['#text'];
  }
  return '';
}

function toArray   (value                     )      {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function extractLink(entry                         )         {
  const raw = entry.link;
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) {
    const alternate = raw.find(
      (l) => l && typeof l === 'object' && (l       )['@_rel'] !== 'self',
    );
    const chosen = alternate ?? raw[0];
    if (typeof chosen === 'string') return chosen;
    if (chosen && typeof chosen === 'object') return String((chosen       )['@_href'] ?? '');
  }
  if (raw && typeof raw === 'object') {
    const obj = raw                           ;
    return String(obj['@_href'] ?? obj['#text'] ?? '');
  }
  const guid = asText(entry.guid);
  return guid.startsWith('http') ? guid : '';
}

function parseDate(entry                         )                {
  const candidates = [entry.pubDate, entry.published, entry.updated, entry['dc:date']];
  for (const c of candidates) {
    const text = asText(c);
    if (!text) continue;
    const ms = Date.parse(text);
    if (!Number.isNaN(ms)) return ms;
  }
  return null;
}

function isUsableImage(url        )          {
  if (!/^https?:\/\//i.test(url)) return false;
  // Zählpixel und Platzhalter aussortieren.
  if (/\b(pixel|spacer|blank|1x1|avatar|gravatar|feedburner|badge|button)\b/i.test(url)) return false;
  if (/\.(gif)(\?|$)/i.test(url) && /\b(1x1|pixel)\b/i.test(url)) return false;
  return true;
}

/**
 * Vorschaubild finden. Feeds verstecken es an sechs verschiedenen Stellen,
 * je nach CMS -- deshalb der Reihe nach durchprobieren.
 */
function extractImage(entry                         )                     {
  const candidates           = [];

  // YouTube: media:group > media:thumbnail
  const group = entry['media:group']                                       ;
  if (group) {
    const thumb = group['media:thumbnail'];
    for (const t of toArray(thumb       )) {
      if (t && typeof t === 'object') candidates.push(String((t       )['@_url'] ?? ''));
    }
  }

  // media:thumbnail und media:content auf Item-Ebene
  for (const key of ['media:thumbnail', 'media:content']) {
    for (const node of toArray(entry[key]       )) {
      if (typeof node === 'string') candidates.push(node);
      else if (node && typeof node === 'object') {
        const type = String((node       )['@_type'] ?? '');
        const medium = String((node       )['@_medium'] ?? '');
        if (type && !type.startsWith('image') && medium !== 'image') continue;
        candidates.push(String((node       )['@_url'] ?? ''));
      }
    }
  }

  // RSS enclosure
  for (const node of toArray(entry.enclosure       )) {
    if (node && typeof node === 'object') {
      const type = String((node       )['@_type'] ?? '');
      if (type && !type.startsWith('image')) continue;
      candidates.push(String((node       )['@_url'] ?? ''));
    }
  }

  // itunes / og style
  const image = entry.image       ;
  if (image && typeof image === 'object') {
    candidates.push(String(image['@_href'] ?? image.url ?? ''));
  }

  // Letzter Ausweg: Bilder aus dem HTML-Inhalt. ALLE einsammeln, nicht nur das
  // erste -- viele Feeds setzen ein Zählpixel an den Anfang des Textes.
  const html =
    asText(entry['content:encoded']) || asText(entry.content) || asText(entry.description);
  if (html) {
    for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
      candidates.push(decodeEntities(match[1]));
    }
  }

  for (const candidate of candidates) {
    const trimmed = candidate.trim();
    if (trimmed && isUsableImage(trimmed)) return trimmed;
  }
  return undefined;
}

/** Holt einen Feed. Wirft nie -- eine tote Quelle darf die Seite nicht leeren. */
export async function fetchSource(
  source        ,
)                                                {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        'User-Agent': 'RadarNews/2.0 (personal reader)',
      },
    });
    if (!response.ok) {
      return { items: [], error: `${source.name}: HTTP ${response.status}` };
    }
    const xml = await response.text();
    const doc = parser.parse(xml);

    const channel = doc?.rss?.channel ?? doc?.['rdf:RDF'] ?? null;
    const atomFeed = doc?.feed ?? null;
    const entries                            = channel
      ? toArray(channel.item)
      : atomFeed
        ? toArray(atomFeed.entry)
        : [];

    if (entries.length === 0) {
      return { items: [], error: `${source.name}: keine Artikel im Feed` };
    }

    const items            = entries
      .slice(0, MAX_ITEMS_PER_SOURCE)
      .map((entry, index) => {
        const group = entry['media:group']                                       ;
        const title = stripHtml(asText(entry.title) || asText(group?.['media:title']));
        const link = extractLink(entry);
        const excerptRaw =
          asText(entry.description) ||
          asText(entry.summary) ||
          asText(group?.['media:description']) ||
          asText(entry['content:encoded']) ||
          asText(entry.content);
        return {
          id: `${source.id}-${index}`,
          title,
          link,
          excerpt: stripHtml(excerptRaw).slice(0, 600),
          publishedAt: parseDate(entry),
          sourceId: source.id,
          sourceName: source.name,
          topic: source.topic,
          lang: source.lang,
          kind: source.kind,
          image: extractImage(entry),
        };
      })
      .filter((item) => item.title.length > 3 && item.link.startsWith('http'));

    return { items };
  } catch (error         ) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Zeitüberschreitung'
        : error instanceof Error
          ? error.message
          : 'unbekannter Fehler';
    return { items: [], error: `${source.name}: ${message}` };
  } finally {
    clearTimeout(timer);
  }
}

/** Titel so normalisieren, dass fast gleiche Meldungen aufeinanderfallen. */
function fingerprint(title        )         {
  return title
    .toLowerCase()
    .replace(/[^a-zäöüß0-9 ]/g, '')
    .split(' ')
    .filter((w) => w.length > 3)
    .slice(0, 6)
    .join(' ');
}

/** Feste Anzahl gleichzeitiger Aufrufe, mit Rückmeldung nach jedem fertigen Feed. */
async function pooled      (
  items     ,
  limit        ,
  worker                         ,
  onDone                                        ,
)               {
  const results = new Array   (items.length);
  let next = 0;
  let finished = 0;

  async function runner() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
      finished += 1;
      onDone?.(finished, items.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => runner()),
  );
  return results;
}

export async function fetchAll(
  sources          ,
  maxAgeDays        ,
  onProgress                                        ,
)           
                   
                     
                    
                                                                                 
                  
   {
  const results = await pooled(sources, CONCURRENCY, fetchSource, onProgress);
  const problems = results.map((r) => r.error).filter((e)              => Boolean(e));
  const sourcesOk = results.filter((r) => r.items.length > 0).length;
  // `pooled` behält die Reihenfolge der Eingabe, deshalb passt der Index.
  const okIds = sources.filter((_, i) => (results[i]?.items.length ?? 0) > 0).map((s) => s.id);

  const DAY = 24 * 60 * 60 * 1000;
  const cutoff = Date.now() - maxAgeDays * DAY;
  /**
   * Riemen und Getriebe bekommen ein längeres Gedächtnis.
   *
   * Grund: Die Rubrik ist absichtlich sehr schmal -- es kann Wochen dauern,
   * bis überhaupt etwas erscheint. Mit dem normalen Fenster (Standard drei
   * Tage) wäre die einzige Meldung des Monats schon wieder aussortiert, bevor
   * Atze sie je zu sehen bekommt. Genau davor wollte er bewahrt werden.
   *
   * Das gilt nur für das Aussortieren nach Alter. Bei der Bewertung altern
   * diese Meldungen ganz normal, stehen also nicht künstlich weit oben.
   */
  const beltCutoff = Date.now() - Math.max(maxAgeDays, BELT_MAX_AGE_DAYS) * DAY;
  const seenLinks = new Set        ();
  const seenTitles = new Set        ();
  const items            = [];

  for (const result of results) {
    for (const item of result.items) {
      const limit = mentionsBelt(`${item.title} ${item.excerpt}`) ? beltCutoff : cutoff;
      if (item.publishedAt !== null && item.publishedAt < limit) continue;
      const linkKey = item.link.split('?')[0];
      if (seenLinks.has(linkKey)) continue;
      const titleKey = fingerprint(item.title);
      if (titleKey.length > 10 && seenTitles.has(titleKey)) continue;
      seenLinks.add(linkKey);
      if (titleKey.length > 10) seenTitles.add(titleKey);
      items.push(item);
    }
  }

  items.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
  return { items, problems, sourcesOk, okIds };
}
