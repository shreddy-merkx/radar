/**
 * Die Top 10 der Videoszene: „Meistgesehen".
 *
 * ---------------------------------------------------------------------------
 * Warum es so und nicht anders gebaut ist
 * ---------------------------------------------------------------------------
 *
 * Der naheliegende Weg wäre, YouTube suchen zu lassen ("search.list" mit
 * Suchwort "cycling"). Das geht technisch, hat aber zwei Haken:
 *
 *   1. Eine einzige Suche kostet 100 von 10.000 Punkten am Tag. Radar läuft
 *      48-mal täglich. Mit vier Suchen pro Lauf wäre das Tagesbudget schon am
 *      Vormittag aufgebraucht -- und danach bleibt der Abschnitt leer.
 *   2. Die Suche findet, was YouTube für passend hält. Bei "cycling" ist das
 *      zur Hälfte Spinning-Kurse, Werbung und Zusammenschnitte fremder Leute.
 *
 * Deshalb der andere Weg: Radar kennt bereits 69 Kanäle der Szene und holt
 * deren Feeds ohnehin bei jedem Lauf -- kostenlos, ohne Schlüssel. Daraus
 * fallen die Video-Nummern der letzten Tage sowieso an. Es fehlen nur die
 * Zahlen dazu, und genau die liefert ein einziger Aufruf für bis zu 50 Videos
 * auf einmal -- für **einen** Punkt.
 *
 * Macht vier Punkte pro Lauf, rund 200 am Tag. Von 10.000. Der Abschnitt kann
 * also nicht "wegen Überlastung" ausfallen, und die Liste enthält nur Kanäle,
 * die ohnehin in den Quellen stehen.
 *
 * ---------------------------------------------------------------------------
 * Ohne Schlüssel passiert gar nichts
 * ---------------------------------------------------------------------------
 *
 * Fehlt YOUTUBE_API_KEY, gibt diese Datei null zurück, der Lauf geht normal
 * weiter und die App lässt den Abschnitt einfach weg. Nichts bricht.
 */

/** Wie weit zurück. Eine Woche: Ein Tag wäre bei 69 Kanälen zu dünn. */
const WINDOW_DAYS = 7;

/** So viele Videos stehen am Ende in der Liste. */
const TOP_N = 10;

/**
 * Höchstens so viele Videos nachfragen. 300 sind sechs Aufrufe à 50 Stück,
 * also sechs Punkte -- rund 290 am Tag von 10.000. Die Zahlen werden zweimal
 * gebraucht: für die Top 10 und für die Länge und Aufrufzahl, die an jeder
 * einzelnen Videokachel steht. Beides aus einem Abruf.
 */
const MAX_LOOKUPS = 300;

/**
 * Alles unter 75 Sekunden fliegt raus -- das sind YouTube-Shorts. Die bekommen
 * durch den Endlos-Schieber dort Aufrufzahlen, gegen die kein richtiges Video
 * ankommt; die Top 10 bestünde sonst nur noch aus Zehnsekündern. Wer Shorts
 * dabeihaben will, setzt diese Zahl auf 0.
 */
const MIN_SECONDS = 75;

const API = 'https://www.googleapis.com/youtube/v3/videos';
const TIMEOUT_MS = 12000;

/** Aus "https://www.youtube.com/watch?v=dQw4w9WgXcQ" wird "dQw4w9WgXcQ". */
function videoIdOf(link) {
  const match = /[?&]v=([A-Za-z0-9_-]{11})(?:[&#]|$)/.exec(String(link ?? ''));
  return match ? match[1] : null;
}

/** "PT1H2M30S" sind 3750 Sekunden. */
function secondsOf(iso) {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(String(iso ?? ''));
  if (!m) return null;
  const [, d, h, min, s] = m;
  return (Number(d ?? 0) * 86400) + (Number(h ?? 0) * 3600) + (Number(min ?? 0) * 60) + Number(s ?? 0);
}

/** Das schärfste Vorschaubild, das YouTube für dieses Video hat. */
function thumbOf(thumbnails) {
  const order = ['maxres', 'standard', 'high', 'medium', 'default'];
  for (const name of order) {
    const url = thumbnails?.[name]?.url;
    if (typeof url === 'string' && url) return url;
  }
  return null;
}

async function askYouTube(ids, key) {
  const url = `${API}?part=snippet,statistics,contentDetails`
    + `&id=${ids.join(',')}&maxResults=50&key=${encodeURIComponent(key)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      /*
       * Der Fehlertext von Google sagt genau, was los ist ("quotaExceeded",
       * "API key not valid", "accessNotConfigured"). Den mitzuloggen erspart
       * stundenlanges Raten -- der Schlüssel selbst steht nicht darin.
       */
      const body = await response.text().catch(() => '');
      const reason = /"reason":\s*"([^"]+)"/.exec(body)?.[1] ?? '';
      throw new Error(`HTTP ${response.status}${reason ? ` (${reason})` : ''}`);
    }
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Die Reihenfolge.
 *
 * Nach reinen Aufrufen stünde eine Woche lang dasselbe Video oben -- ein Video
 * von vor sechs Tagen hatte sechsmal so lange Zeit zu sammeln wie eines von
 * gestern. Die „tägliche" Top 10 wäre dann eine wöchentliche.
 *
 * Nach Aufrufen *pro Tag* kippt es ins andere Extrem: Dann führt ein zwei
 * Stunden altes Video mit 3.000 Aufrufen die Liste an, während das mit 200.000
 * weiter unten steht. Das sieht für jeden, der die Zahlen danebenstehen sieht,
 * schlicht kaputt aus.
 *
 * Deshalb die Wurzel aus dem Alter: Die Liste bleibt von oben nach unten
 * grob nach Aufrufen sortiert -- aber ein Video, das gerade durch die Decke
 * geht, kann sich nach vorn schieben, statt sechs Tage warten zu müssen.
 *
 * Der Like-Zuschlag liegt zwischen 0 und 40 Prozent. Übliche Quote sind zwei
 * bis fünf Prozent; bei acht Prozent ist Schluss, damit ein kleines Video mit
 * treuer Fangemeinde nicht an einem Weltcup-Zusammenschnitt vorbeizieht.
 */
function score(views, likes, ageHours) {
  const days = Math.max(ageHours, 6) / 24;
  const likeRate = views > 0 ? Math.min(likes / views, 0.08) : 0;
  return (views / Math.sqrt(days)) * (1 + likeRate * 5);
}

/**
 * Ein Abruf, zwei Ergebnisse.
 *
 * @param items   Alle eingesammelten Meldungen (aus rss.mjs).
 * @param sources Die Quellenliste -- daraus kommt, welche davon Videos sind.
 * @param key     Der Google-Schlüssel, oder nichts.
 * @returns `{ stats, top }` -- `stats` ist eine Tabelle Videonummer → Länge und
 *          Aufrufe (für die Angaben an jeder Videokachel), `top` die Top 10.
 *          Ohne Schlüssel: `{ stats: null, top: null }`.
 */
export async function videoIntel(items, sources, key) {
  if (!key) return { stats: null, top: null };

  const videoSources = new Set(sources.filter((s) => s.kind === 'video').map((s) => s.id));
  const cutoff = Date.now() - WINDOW_DAYS * 86400000;

  /* Pro Video-Nummer nur einmal fragen -- Kanäle spiegeln sich gegenseitig. */
  const wanted = new Map();
  for (const item of items) {
    if (!videoSources.has(item.sourceId)) continue;
    if (item.publishedAt === null || item.publishedAt < cutoff) continue;
    const id = videoIdOf(item.link);
    if (id && !wanted.has(id)) wanted.set(id, item.sourceName);
    if (wanted.size >= MAX_LOOKUPS) break;
  }

  if (wanted.size === 0) return { stats: null, top: null };

  const ids = [...wanted.keys()];
  const batches = [];
  for (let i = 0; i < ids.length; i += 50) batches.push(ids.slice(i, i + 50));

  const raw = [];
  for (const batch of batches) {
    /*
     * Nacheinander, nicht gleichzeitig: Ist das Tagesbudget aufgebraucht,
     * scheitert schon der erste Aufruf und die übrigen entfallen.
     */
    raw.push(...await askYouTube(batch, key));
  }

  const now = Date.now();

  /*
   * Länge und Aufrufe für jedes abgefragte Video. Daraus bekommt später jede
   * einzelne Videokachel ihre Laufzeit -- das war bisher der Grund, warum ein
   * Video in der Liste wie ein Textbeitrag aussah.
   */
  const stats = {};
  for (const video of raw) {
    const seconds = secondsOf(video.contentDetails?.duration);
    const views = Number(video.statistics?.viewCount ?? 0);
    if (video.id && (seconds !== null || views > 0)) {
      stats[video.id] = { seconds, views };
    }
  }

  const ranked = raw.map((video) => {
    const published = Date.parse(video.snippet?.publishedAt ?? '');
    const seconds = secondsOf(video.contentDetails?.duration);
    const views = Number(video.statistics?.viewCount ?? 0);
    /* Wer die Likes versteckt hat, bekommt eben keinen Zuschlag. */
    const likes = Number(video.statistics?.likeCount ?? 0);
    return {
      id: video.id,
      title: video.snippet?.title ?? '',
      channel: video.snippet?.channelTitle ?? '',
      publishedAt: Number.isFinite(published) ? published : null,
      seconds,
      views,
      likes,
      thumb: thumbOf(video.snippet?.thumbnails),
      _score: Number.isFinite(published)
        ? score(views, likes, (now - published) / 3600000)
        : 0,
    };
  }).filter((video) => {
    if (!video.id || !video.title) return false;
    if (video.publishedAt === null || video.publishedAt < cutoff) return false;
    if (video.views <= 0) return false;
    if (MIN_SECONDS > 0 && video.seconds !== null && video.seconds < MIN_SECONDS) return false;
    return true;
  });

  ranked.sort((a, b) => b._score - a._score);

  /*
   * Höchstens zwei Videos pro Kanal. Ohne diese Grenze füllt an einem starken
   * Tag ein einziger großer Kanal die halbe Liste, und genau das soll die
   * Rubrik nicht sein.
   */
  const perChannel = new Map();
  const picked = [];
  for (const video of ranked) {
    const seen = perChannel.get(video.channel) ?? 0;
    if (seen >= 2) continue;
    perChannel.set(video.channel, seen + 1);
    delete video._score;
    picked.push(video);
    if (picked.length >= TOP_N) break;
  }

  return {
    stats,
    top: picked.length === 0
      ? null
      : { windowDays: WINDOW_DAYS, checked: raw.length, items: picked },
  };
}

/** Die Videonummer aus einem Link -- fetch.mjs braucht sie für die Zuordnung. */
export { videoIdOf };
