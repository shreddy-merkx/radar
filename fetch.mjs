/**
 * Holt alle Feeds und schreibt eine einzige Datei: app/data/digest.json.
 *
 * Das ist der entscheidende Unterschied zur alten App. Früher hat das Handy
 * beim Öffnen ~200 Feeds selbst abgerufen. Im Browser geht das gar nicht:
 * Fremde Webseiten erlauben es nicht, dass eine andere Seite ihre Inhalte
 * direkt ausliest (CORS). Fast jeder Feed wäre blockiert.
 *
 * Deshalb läuft der Abruf jetzt hier, auf einem Rechner von GitHub, alle 30
 * Minuten. Dort gibt es kein CORS -- die Sperre gilt nur für Browser. Das
 * Ergebnis ist eine einzelne Datei, die neben der App liegt. Die App lädt nur
 * noch diese eine Datei von ihrer eigenen Adresse: erlaubt, schnell, und auch
 * dann noch da, wenn gerade kein Netz ist.
 *
 * Nebeneffekt, der die App spürbar besser macht: Sie ist sofort da. Kein
 * Warten auf 200 Verbindungen mehr.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOURCES } from '../app/lib/sources.js';
import { fetchAll } from './rss.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'app', 'data', 'digest.json');

/**
 * Rückblick beim Einsammeln. Großzügiger als das, was die App am Ende zeigt:
 * In den Einstellungen lassen sich 1 bis 14 Tage wählen, und diese Auswahl
 * soll auch dann etwas finden, wenn gerade nicht neu eingesammelt wurde.
 */
const COLLECT_DAYS = 14;

/** Obergrenze für die Datei. 350 Meldungen sind rund 150 KB -- schnell genug. */
const MAX_ITEMS = 350;

/** Anrisstexte hier schon kürzen; die App zeigt ohnehin nie mehr. */
const MAX_EXCERPT = 400;

function log(...args) {
  console.log(...args);
}

const started = Date.now();
log(`Radar: ${SOURCES.length} Quellen werden abgerufen …`);

const { items, problems, sourcesOk, okIds } = await fetchAll(SOURCES, COLLECT_DAYS);

const trimmed = items.slice(0, MAX_ITEMS).map((item) => ({
  ...item,
  excerpt: item.excerpt.length > MAX_EXCERPT
    ? item.excerpt.slice(0, MAX_EXCERPT).replace(/\s+\S*$/, '') + ' …'
    : item.excerpt,
}));

const byTopic = {};
for (const item of trimmed) byTopic[item.topic] = (byTopic[item.topic] ?? 0) + 1;

const digest = {
  /**
   * Formatfassung. Die App weigert sich, eine Datei zu lesen, deren Aufbau sie
   * nicht kennt -- lieber der alte, zwischengespeicherte Stand als eine leere
   * oder falsch dargestellte Seite.
   */
  version: 1,
  generatedAt: Date.now(),
  sourcesTotal: SOURCES.length,
  sourcesOk,
  /** Nur die Namen, nicht die vollen Fehlertexte -- die stehen im Protokoll. */
  sourcesFailed: SOURCES.filter((s) => !okIds.includes(s.id)).map((s) => s.name),
  itemsTotal: items.length,
  byTopic,
  items: trimmed,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(digest));

const seconds = ((Date.now() - started) / 1000).toFixed(1);
const kb = (JSON.stringify(digest).length / 1024).toFixed(0);

log('');
log(`Fertig in ${seconds}s.`);
log(`  ${sourcesOk} von ${SOURCES.length} Quellen haben geantwortet`);
log(`  ${items.length} Meldungen gefunden, ${trimmed.length} behalten (${kb} KB)`);
log(`  Rubriken: ${Object.entries(byTopic).map(([k, v]) => `${k} ${v}`).join(', ')}`);

if (problems.length > 0) {
  log('');
  log(`Stumm geblieben (${problems.length}) -- bei ~200 Quellen normal:`);
  for (const p of problems) log(`  ${p}`);
}

/**
 * Wenn fast nichts durchkommt, stimmt etwas Grundsätzliches nicht (Netz,
 * Fehler im Abruf). Dann lieber den Lauf scheitern lassen, als eine fast
 * leere Datei zu veröffentlichen und die bisherige zu überschreiben.
 */
if (sourcesOk < SOURCES.length * 0.25) {
  console.error('');
  console.error(`Abbruch: Nur ${sourcesOk} Quellen erreichbar. Das ist zu wenig,`);
  console.error('die bisherige Fassung bleibt lieber stehen.');
  process.exit(1);
}
