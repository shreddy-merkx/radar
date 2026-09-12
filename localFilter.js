/**
 * Filtern ohne KI, ohne Konto, ohne Netz. Das ist der Standardmodus.
 *
 * Die Leitidee: Eine Nachricht ist nur so viel wert wie ihre Aktualität.
 * "Wer hat die Etappe gewonnen" ist heute die wichtigste Meldung der Seite und
 * übermorgen Altpapier. Deshalb werden zeitkritische Signale mit einem
 * Frischefaktor multipliziert, zeitlose Signale dagegen nicht.
 */

                                                                        

/** Keine Nachricht. Treffer = fliegt praktisch immer raus. */
const NOISE = [
  'gewinnspiel', 'verlosung', 'gutschein', 'rabatt', 'deal des', 'angebot des',
  'schnäppchen', 'prime day', 'black friday', 'sale:', 'im sale', 'sparen sie',
  'werbung', 'anzeige:', 'gesponsert', 'sponsored', 'advertorial', 'giveaway',
  'discount', 'newsletter', 'jetzt bestellen', 'im preisvergleich', 'coupon',
  'affiliate', 'best deals', 'deals of the', 'save up to', 'win a ',
];

/** Formate, die selten neue Information tragen. Leichter Abzug. */
const WEAK_FORMAT = [
  'podcast', 'kolumne', 'kommentar:', 'meinung:', 'leserbrief', 'bildergalerie',
  'tv-programm', 'das war der tag', 'wochenrückblick', 'weekly recap',
  'die besten', 'best of', 'buyer\'s guide', 'kaufberatung', 'archiv',
];

/**
 * ZEITKRITISCH. Voller Bonus nur, wenn die Meldung frisch ist.
 * Genau das, was Atze wollte: Etappensieg von gestern ja, von letzter Woche nein.
 */
const TIME_CRITICAL                          = [
  // Rennergebnisse
  ['gewinnt', 34], ['siegt', 34], ['sieg', 26], ['wins', 34], ['victory', 26],
  ['etappe', 30], ['stage ', 26], ['zeitfahren', 22], ['sprint', 18],
  ['podium', 20], ['weltmeister', 30], ['world champion', 30], ['titel', 18],
  ['ergebnis', 20], ['results', 20], ['klassement', 20], ['gelbes trikot', 28],
  ['yellow jersey', 28], ['final', 16], ['qualifying', 16], ['world cup', 22],
  // Stürze, Verletzungen, Ausfälle
  ['gestürzt', 32], ['sturz', 30], ['crash', 30], ['verletzt', 32],
  ['injury', 30], ['gebrochen', 34], ['broken', 30], ['aufgegeben', 28],
  ['abandons', 28], ['ausgestiegen', 24], ['out of the', 20],
  // Produktvorstellungen
  ['vorgestellt', 30], ['launch', 26], ['launches', 26], ['premiere', 22],
  ['erste fahrt', 24], ['first ride', 24], ['first look', 24], ['unveil', 26],
  ['neue ', 14], ['neuer ', 14], ['neues ', 14], ['neuen ', 14],
  ['introduces', 24], ['releases', 24], ['announce', 22], ['ab sofort', 20],
  // Personalien
  ['transfer', 26], ['wechselt', 26], ['verpflichtet', 24], ['signs', 24],
  ['tritt zurück', 26], ['retires', 24], ['gesperrt', 30], ['doping', 32],
];

/**
 * Deutsche Trennverben lassen sich mit einfacher Wortsuche nicht fassen:
 * "Bosch stellt einen neuen Motor vor" enthält weder "vorgestellt" noch
 * "Vorstellung". Deshalb zusätzlich ein paar Muster.
 */
const TIME_CRITICAL_PATTERNS                          = [
  [/\bstellt\b.{0,60}\bvor\b/, 30], // stellt ... vor
  [/\bbringt\b.{0,60}\b(auf den markt|heraus|an den start)\b/, 26],
  [/\bkommt\b.{0,60}\bauf den markt\b/, 24],
  [/\bfährt\b.{0,40}\b(sieg|bestzeit)\b/, 26],
  [/\bholt\b.{0,40}\b(sieg|titel|gold)\b/, 30],
  [/\bsagt\b.{0,40}\bab\b/, 20], // sagt ... ab
  [/\bfällt\b.{0,40}\baus\b/, 26], // fällt ... aus
  [/\bsteigt\b.{0,40}\baus\b/, 24], // steigt ... aus
  [/\bruft\b.{0,60}\bzurück\b/, 40], // ruft ... zurück (Rückruf!)
];

/** ZEITLOS. Bonus unabhängig vom Alter -- ein guter Test bleibt ein guter Test. */
const EVERGREEN                          = [
  ['rückruf', 40], ['recall', 40], ['sicherheitswarnung', 38],
  ['urteil', 20], ['gericht', 16], ['gesetz', 22], ['stvo', 22],
  ['verordnung', 16], ['verboten', 18], ['pflicht', 14], ['regulation', 16],
  ['studie', 14], ['insolvenz', 26], ['übernahme', 20], ['übernimmt', 18],
  ['acquisition', 20], ['im test', 16], ['test:', 16], ['testbericht', 16],
  ['review', 12], ['getestet', 16], ['langzeittest', 18], ['vergleich', 10],
  ['diebstahl', 12], ['gehackt', 16],
];

/** Themen-Erkennung. Wichtig für breite Quellen, die alles mischen. */
const TOPIC_WORDS                            = {
  road: ['tour de france', 'giro', 'vuelta', 'etappe', 'stage', 'peloton', 'uci', 'worldtour', 'klassiker', 'monument', 'zeitfahren', 'rennrad', 'road race', 'criterium', 'pogacar', 'vingegaard', 'evenepoel', 'van der poel', 'van aert'],
  gravity: ['downhill', 'enduro', 'freeride', 'slopestyle', 'dirt jump', 'trail', 'singletrack', 'mtb', 'mountainbike', 'mountain bike', 'world cup dh', 'fullface', 'federgabel', 'dämpfer', 'hardtail', 'whistler', 'red bull rampage'],
  ebike: ['e-bike', 'ebike', 'pedelec', 'e-mtb', 'emtb', 'akku', 'battery', 'motor', 'reichweite', 'range', 's-pedelec', 'mittelmotor', 'wattstunden', 'bosch performance', 'shimano ep', 'drive unit'],
  tech: ['schaltung', 'groupset', 'laufrad', 'wheelset', 'rahmen', 'frameset', 'carbon', 'bremse', 'brake', 'reifen', 'tyre', 'tire', 'sattel', 'lenker', 'kette', 'kassette', 'powermeter', 'wattmesser', 'garmin', 'wahoo', 'komponente'],
  gravel: ['gravel', 'bikepacking', 'radreise', 'touring', 'adventure', 'unbound', 'schotter', 'randonneur', 'ultracycling', 'divide'],
  urban: ['radweg', 'radverkehr', 'radentscheid', 'fahrradstraße', 'infrastruktur', 'stadtrat', 'verkehrswende', 'pendel', 'commut', 'lastenrad', 'cargo bike', 'cargobike', 'abstellanlage', 'leihrad', 'bike share', 'radschnellweg', 'unfall', 'stvo'],
  scene: ['vlog', 'edit', 'video', 'youtube', 'behind the scenes', 'q&a', 'challenge'],
  industry: ['insolvenz', 'übernahme', 'acquisition', 'umsatz', 'revenue', 'quartal', 'geschäftsjahr', 'händler', 'retailer', 'lieferkette', 'supply chain', 'zoll', 'tariff', 'entlassungen', 'layoffs', 'ceo'],
  belt: [],
};

/**
 * Riemenantrieb, Nabenschaltung, Getriebe -- Atzes eigene Rubrik.
 *
 * Warum das eine Sonderbehandlung braucht und nicht einfach eine weitere Zeile
 * in TOPIC_WORDS ist: `detectTopic` zählt Treffer und lässt das Thema mit den
 * meisten gewinnen. Eine Meldung wie „Neues Lastenrad mit Gates Carbon Drive
 * und Enviolo-Nabe" trifft `urban` zweimal und Riemen einmal -- sie landete
 * also unter Alltag, und die Riemen-Rubrik bliebe für immer leer. Genau das
 * wollte Atze nicht. Deshalb ist ein Treffer hier ein **Überstimmen**: Wo
 * Riemen oder Getriebe vorkommt, gehört die Meldung in diese Rubrik.
 *
 * Das funktioniert nur, weil jeder Begriff hier eindeutig ist. Der Abgleich
 * ist reine Teilstring-Suche, und damit ist die Auswahl heikler, als sie
 * aussieht. Diese Begriffe wurden **absichtlich weggelassen**:
 *
 * - `pinion` -- steckt in „opinion". Nur mit Zusatz aufgenommen.
 * - `gates`  -- steckt in „delegates", „tailgates", und es gibt Bill Gates.
 *               Nur als „gates carbon"/„gates cdx".
 * - `igh`    -- steckt in „high", „light", „eight". Unbrauchbar.
 * - `belt`   -- allein zu breit (Sicherheitsgurt, Gürtel). Nur mit „drive".
 * - `riemen` -- allein mehrdeutig: auch Pedalriemen und Schulterriemen.
 *               Nur die Zusammensetzungen.
 * - `nexus`  -- allein zu breit. Nur als „shimano nexus".
 *
 * Wer hier etwas ergänzt, prüft zuerst, ob das Wort in einem anderen Wort
 * steckt. Ein Fehlgriff füllt eine bewusst schmale Rubrik mit Unsinn, und
 * das fällt lange nicht auf, weil hier ohnehin selten etwas steht.
 */
export const BELT_TERMS           = [
  // Riemen
  'riemenantrieb',
  'zahnriemen',
  'riemenscheibe',
  'riemenspanner',
  'riemengetrieben',
  'belt drive',
  'belt-drive',
  'belt driven',
  'belt-driven',
  'carbon drive',
  'gates carbon',
  'gates cdx',
  // Nabenschaltung
  'nabenschaltung',
  'nabengetriebe',
  'getriebeschaltung',
  'internally geared hub',
  'hub gear',
  'rohloff',
  'speedhub',
  'alfine',
  'shimano nexus',
  'enviolo',
  'nuvinci',
  'kindernay',
  // Tretlagergetriebe
  'tretlagergetriebe',
  'pinion getriebe',
  'pinion gearbox',
  'pinion drive',
  'pinion smart',
  'effigear',
  'gearbox',
];

/** Kommt Riemen oder Getriebe in diesem Text vor? */
export function mentionsBelt(text        )          {
  const haystack = text.toLowerCase();
  return BELT_TERMS.some((term) => haystack.includes(term));
}

/** Standardsätze, die CMS an jeden Feed-Text hängen. */
const BOILERPLATE = [
  /Der Beitrag\s.*?erschien zuerst auf.*$/i,
  /The post\s.*?appeared first on.*$/i,
  /Dieser Artikel .*?erschien zuerst.*$/i,
  /Weiterlesen\s*(auf|bei)?.*$/i,
  /Read more.*$/i,
  /Continue reading.*$/i,
  /\[…\]\s*$/,
  /\.\.\.\s*$/,
];

/** YouTube-Beschreibungen sind zur Hälfte Links und Sponsorenblöcke. */
const VIDEO_JUNK = [
  /https?:\/\/\S+/g,
  /\b(subscribe|abonniere|abonnieren|instagram|tiktok|facebook|twitter|patreon|merch|discount code|use code|shop here|link in)\b.*$/gi,
  /#\w+/g,
];

function clean(text        , kind             = 'article')         {
  let out = text;
  for (const pattern of BOILERPLATE) out = out.replace(pattern, '');
  if (kind === 'video') {
    for (const pattern of VIDEO_JUNK) out = out.replace(pattern, ' ');
  }
  return out.replace(/\s+/g, ' ').trim();
}

function excerptSentences(text        , kind            , maxChars = 240)         {
  const cleaned = clean(text, kind);
  if (!cleaned) return '';
  if (cleaned.length <= maxChars) return cleaned;

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) ?? [];
  let out = '';
  for (const sentence of sentences) {
    if ((out + sentence).length > maxChars) break;
    out += sentence;
  }
  if (out.trim().length > 40) return out.trim();

  const cut = cleaned.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + ' …';
}

function detectTopic(haystack        , fallback         )          {
  // Riemen und Getriebe überstimmen die Trefferzählung -- Begründung bei
  // BELT_TERMS. Ohne das bliebe die Rubrik dauerhaft leer.
  if (mentionsBelt(haystack)) return 'belt';

  let best          = fallback;
  let bestHits = 0;
  (Object.keys(TOPIC_WORDS)             ).forEach((topic) => {
    const hits = TOPIC_WORDS[topic].filter((word) => haystack.includes(word)).length;
    // Bei Gleichstand gewinnt das Thema der Quelle.
    if (hits > bestHits) {
      bestHits = hits;
      best = topic;
    }
  });
  return bestHits > 0 ? best : fallback;
}

/**
 * Frischefaktor für zeitkritische Signale: 1.0 taufrisch, 0 nach drei Tagen.
 * Das ist der Hebel hinter "nur, wenn es top aktuell ist".
 */
export function freshnessFactor(publishedAt               , now        )         {
  if (!publishedAt) return 0.35;
  const hours = (now - publishedAt) / 3600_000;
  if (hours <= 12) return 1;
  if (hours <= 36) return 0.6;
  if (hours <= 72) return 0.25;
  return 0;
}

export function scoreItem(item         , now = Date.now())         {
  const title = item.title.toLowerCase();
  const haystack = `${title} ${item.excerpt.toLowerCase()}`;
  let score = 50;

  if (NOISE.some((word) => haystack.includes(word))) score -= 60;
  if (WEAK_FORMAT.some((word) => title.includes(word))) score -= 14;

  // Zeitkritische Signale, gewichtet nach Frische.
  const fresh = freshnessFactor(item.publishedAt, now);
  for (const [word, bonus] of TIME_CRITICAL) {
    if (title.includes(word)) score += bonus * fresh;
    else if (haystack.includes(word)) score += (bonus / 3) * fresh;
  }
  for (const [pattern, bonus] of TIME_CRITICAL_PATTERNS) {
    if (pattern.test(title)) score += bonus * fresh;
    else if (pattern.test(haystack)) score += (bonus / 3) * fresh;
  }

  // Zeitlose Signale.
  for (const [word, bonus] of EVERGREEN) {
    if (title.includes(word)) score += bonus;
    else if (haystack.includes(word)) score += bonus / 3;
  }

  // Grundaktualität, unabhängig vom Inhalt.
  if (item.publishedAt) {
    const hours = (now - item.publishedAt) / 3600_000;
    if (hours < 3) score += 22;
    else if (hours < 12) score += 15;
    else if (hours < 24) score += 8;
    else if (hours > 96) score -= 14;
  } else {
    score -= 8;
  }

  /**
   * Videos und Forenbeiträge sind Szene, aber selten Aufmacher: Bei gleicher
   * Meldung trägt der Artikel mehr Information als das Video -- diese
   * Rangfolge bleibt unter allen Umständen erhalten.
   *
   * Zusätzlich altern sie schneller. Bei einem Video *ist* das Erscheinen die
   * Nachricht: Ein Upload von heute Morgen ist interessant, derselbe von
   * letzter Woche nicht mehr. Der Abzug wächst deshalb, sobald die Frische
   * nachlässt -- er wird aber nie zum Bonus.
   */
  if (item.kind === 'video') score -= 8 + 14 * (1 - fresh);
  if (item.kind === 'community') score -= 16 + 10 * (1 - fresh);

  // Ein Bild macht eine Meldung nicht wichtiger, aber die Seite besser.
  if (item.image) score += 3;

  if (item.excerpt.length < 80) score -= 10;
  if (item.title.length < 25) score -= 6;
  if (/^\d+\s/.test(item.title)) score -= 8;
  if ((item.title.match(/[!?]/g) ?? []).length > 1) score -= 6;

  // Bewusst kein Deckel bei 100: Bei über 90 Quellen erreichen sonst zu viele
  // starke Meldungen denselben Wert und die Reihenfolge wird zufällig.
  // Der Wert wird nirgends angezeigt, er dient nur dem Sortieren.
  return Math.max(0, Math.round(score));
}

/**
 * Reihum durch die Quellen, damit ein sehr aktiver Feed die Frontpage nicht
 * allein füllt. Innerhalb jeder Quelle zählt die Bewertung.
 */
function interleaveBySource(items              , limit        )               {
  const bySource = new Map                      ();
  for (const item of items) {
    const list = bySource.get(item.sourceName) ?? [];
    list.push(item);
    bySource.set(item.sourceName, list);
  }
  for (const list of bySource.values()) list.sort((a, b) => b.score - a.score);

  const queues = [...bySource.values()];
  const out               = [];
  let round = 0;
  while (out.length < limit) {
    let added = false;
    for (const queue of queues) {
      const next = queue[round];
      if (!next) continue;
      out.push(next);
      added = true;
      if (out.length >= limit) break;
    }
    if (!added) break;
    round += 1;
  }
  return out.sort((a, b) => b.score - a.score);
}

export function toDigestItem(item         , now = Date.now())             {
  const haystack = `${item.title} ${item.excerpt}`.toLowerCase();
  return {
    id: item.id,
    headline: clean(item.title, item.kind),
    summary: excerptSentences(item.excerpt, item.kind),
    topic: detectTopic(haystack, item.topic),
    score: scoreItem(item, now),
    link: item.link,
    sourceName: item.sourceName,
    publishedAt: item.publishedAt,
    originalTitle: item.title,
    lang: item.lang,
    kind: item.kind,
    image: item.image,
  };
}

export function localDigest(items           , maxItems        )               {
  const now = Date.now();
  const scored = items.map((item) => toDigestItem(item, now));

  // Alles unter 25 ist mit hoher Wahrscheinlichkeit Werbung oder Füllmaterial.
  const worthKeeping = scored.filter((item) => item.score >= 25);
  const pool = worthKeeping.length >= Math.min(8, scored.length) ? worthKeeping : scored;

  /*
   * Ohne Quote gewinnt reine Bewertung -- und dann besteht die Frontpage aus
   * Rennsport und MTB, weil dort die stärksten Signalwörter stecken. Lastenrad,
   * Gravel, Branche und die Videoszene kämen nie vor. Deshalb bekommt jede
   * Rubrik, die überhaupt etwas zu bieten hat, zuerst ein paar feste Plätze.
   * Der Rest wird nach Bewertung aufgefüllt.
   */
  const byTopic = new Map                       ();
  for (const item of pool) {
    const list = byTopic.get(item.topic) ?? [];
    list.push(item);
    byTopic.set(item.topic, list);
  }

  const topicCount = byTopic.size || 1;
  const minPerTopic = Math.max(1, Math.min(3, Math.floor(maxItems / (topicCount * 1.5))));
  // Keine Rubrik darf mehr als rund ein Drittel der Seite belegen.
  const maxPerTopic = Math.max(minPerTopic + 1, Math.ceil(maxItems * 0.3));

  /**
   * Die Szene-Rubrik bekommt doppelt so viele Mindestplätze wie die anderen.
   *
   * Grund: Videos und Forenbeiträge enthalten fast nie die Signalwörter, aus
   * denen sich eine hohe Bewertung ergibt („Etappe", „Rückruf", „stellt vor").
   * Nach reiner Bewertung landet die Szene deshalb immer exakt auf ihrem
   * Mindestwert -- bei über 60 Kanälen also zwei Kacheln. Das widerspricht der
   * Ansage: „Das soll die Frontpage der Fahrrad-Szene sein", ausdrücklich mit
   * Sam Pilgrim und Danny Hart als Beispielen. Die Bewertung selbst wird dafür
   * nicht verbogen -- ein Video überholt bei gleicher Meldung nie den Artikel.
   * Verändert wird nur, wie viel Platz der Rubrik zusteht.
   */
  const floorFor = (topic         ) =>
    topic === 'scene' ? Math.min(maxPerTopic, minPerTopic * 2) : minPerTopic;

  const reserved               = [];
  const leftovers               = [];
  const used = new Map                 ();
  for (const [topic, list] of byTopic) {
    const ordered = interleaveBySource(list, list.length);
    const take = ordered.slice(0, floorFor(topic));
    reserved.push(...take);
    used.set(topic, take.length);
    leftovers.push(...ordered.slice(take.length));
  }

  // Falls die Quoten allein schon mehr ergeben als erlaubt: nach Wert kürzen.
  if (reserved.length >= maxItems) {
    return reserved.sort((a, b) => b.score - a.score).slice(0, maxItems);
  }

  const ordered = interleaveBySource(leftovers, leftovers.length);
  const filler               = [];
  const overflow               = [];
  for (const item of ordered) {
    if (reserved.length + filler.length >= maxItems) break;
    const count = used.get(item.topic) ?? 0;
    if (count >= maxPerTopic) {
      overflow.push(item);
      continue;
    }
    used.set(item.topic, count + 1);
    filler.push(item);
  }

  // Reichte der gedeckelte Vorrat nicht, wird ohne Deckel aufgefüllt --
  // eine halbleere Seite wäre schlechter als eine leicht schiefe.
  let index = 0;
  while (reserved.length + filler.length < maxItems && index < overflow.length) {
    filler.push(overflow[index++]);
  }

  return [...reserved, ...filler].sort((a, b) => b.score - a.score);
}
