/**
 * Service Worker -- der Teil, der aus einer Webseite eine App macht.
 *
 * Zwei Aufgaben:
 *
 * 1. Die App startet sofort, auch ohne Netz. Gerüst, Schrift, Logik und
 *    Quellenliste liegen im Zwischenspeicher des Geräts.
 * 2. Die Nachrichten sind auch in der U-Bahn da -- der zuletzt geladene
 *    Stand bleibt liegen, statt eine Fehlerseite zu zeigen.
 *
 * Zwei verschiedene Strategien, weil die Dateien verschieden sind:
 *
 * - **Gerüst** (HTML, CSS, Logik): erst Zwischenspeicher, dann Netz. Ändert
 *   sich selten, soll aber blitzschnell da sein.
 * - **Nachrichten** (digest.json): erst Netz, dann Zwischenspeicher. Ändert
 *   sich alle 30 Minuten, da ist Aktualität wichtiger als Tempo.
 */

/**
 * Bei jeder Änderung am Gerüst hochzählen. Der alte Zwischenspeicher wird
 * dann beim nächsten Start weggeräumt -- sonst sieht man nach einer
 * Aktualisierung wochenlang die alte Fassung.
 */
const CACHE = 'radar-v3.0.0';

const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'lib/localFilter.js',
  'lib/sources.js',
  'lib/events.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // Einzeln statt addAll: Scheitert eine Datei, soll nicht die ganze
      // Installation scheitern und die App ungespeichert bleiben.
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Fremde Adressen (Vorschaubilder der Quellen) nicht anfassen: Die liegen
  // auf anderen Servern, sind beliebig groß und würden den Speicher fluten.
  if (url.origin !== self.location.origin) return;

  // Nachrichten: Netz zuerst.
  if (url.pathname.endsWith('/data/digest.json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('data/digest.json', copy));
          return response;
        })
        .catch(() => caches.match('data/digest.json')
          .then((hit) => hit ?? new Response('{}', { status: 503 }))),
    );
    return;
  }

  // Gerüst: Zwischenspeicher zuerst, im Hintergrund erneuern.
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      }).catch(() => hit);
      return hit ?? network;
    }),
  );
});
