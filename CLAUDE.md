# Radar — persönliche Fahrrad-Frontpage (Web-Fassung)

Kontextdokument für Claude. Wird zu Beginn jeder Sitzung gelesen, damit Atze
nicht jedes Mal von vorn erklären muss.

> **Diese Fassung hat die Expo-App abgelöst (11.09.2026).** Die alte liegt noch
> unter `C:\Projekte\radar` und hat ihre eigene, ausführlichere `CLAUDE.md` mit
> der Vorgeschichte. Nicht mehr daran weiterbauen, ohne dass Atze das
> ausdrücklich sagt.

## Was das ist

Eine Web-App, die auf dem Startbildschirm liegt wie eine normale App. Sie holt
Beiträge aus **199 Quellen**, filtert, entdoppelt, sortiert und zeigt sie als
eine Frontpage, dazu einen Terminkalender.

Atzes eigene Worte: *„Sie soll für mich das Internet filtern und mir auf einer
Frontpage eine Zusammenfassung dessen geben, was im Bereich Fahrrad an
Neuigkeiten existiert."*

Zwei Nachträge bestimmen die Richtung:

> „Das soll die Frontpage der Fahrrad-Szene sein." — 11 Quellen hat er von sich
> aus als „viel zu wenig" abgelehnt. **Breite ist ausdrücklich gewünscht.**
> Wer hier Quellen streicht, streicht das Produkt.

> „wann welche Etappe gewonnen wurde — aber nur, wenn es top aktuell ist."

**Aktualität schlägt Vollständigkeit.** Umgesetzt als Frischefaktor.

## Die wichtigste Randbedingung

> **Atze zahlt nichts.** Wörtlich: „ich bezahle nichts."

Harte Grenze, keine Preisempfindlichkeit. Alles hier ist kostenlos:
GitHub Pages und Actions sind für **öffentliche** Projekte gratis und ohne
Kreditkarte. Deshalb muss das Projekt öffentlich bleiben — bei einem privaten
verlangt GitHub für Pages ein Bezahlpaket. Im Projekt liegt bewusst nichts
Geheimes.

Schlage niemals etwas vor, das Geld kostet, ohne die Kosten in Euro zu nennen
und eine kostenlose Alternative danebenzustellen.

## Arbeitsweise mit Atze

- **Sprache: Deutsch.** Auch Commit-Nachrichten und Oberflächentexte.
- **„Die App geht nicht" heißt immer: sein iPhone.** Wörtlich: „Bei mir
  impliziert die iPhone-Version." Nicht nachfragen, welche Plattform gemeint ist.
- **„Nur Ergebnis, kein Code."** Keine Code-Schnipsel in Antworten, keine
  Fachbegriffe ohne Erklärung. Beschreiben, was sich *sichtbar* ändert.
  Technische Entscheidungen selbst treffen.
- Er schreibt knapp und erwartet knappe, konkrete Antworten. Entscheiden und
  sagen, was entschieden wurde — keine langen Abwägungen.
- Er misst am Erlebnis: *„Installiere ich sie und öffne sie, will ich, dass die
  geil ist."*
- Er arbeitet auf **Windows**. Kein Mac, kein Xcode.
- Muss er etwas ausführen, ausdrücklich sagen und den Befehl hinschreiben.

## Warum Web und nicht mehr Expo

Sein Wunsch, wörtlich: *„Ich will einfach draufklicken und die App sehen"* —
keine App in der App. Dazu kamen drei Dinge, die den Expo-Weg untragbar machten:

1. **SDK-Zwang.** Expo Go kann immer nur genau eine SDK-Version. Zweimal ging
   die App dadurch gar nicht mehr auf (Mai 2026 zu neu, September 2026 zu alt).
   Jedes Expo-Go-Update konnte das wieder auslösen.
2. **Teilen praktisch unmöglich.** Seit 12.05.2026 lädt Expo Go nur noch
   Projekte, deren Organisation man angehört. Jeder Freund hätte ein
   Expo-Konto und eine Einladung gebraucht.
3. **App-Store kostet.** 99 $/Jahr bei Apple — abgelehnt.

Die Web-Fassung löst alle drei auf einmal: Link schicken reicht, kein Konto,
keine SDK, nichts zu installieren.

## Wie es läuft

**Der Kern: Das Einsammeln passiert nicht mehr auf dem Gerät.** Im Browser
verhindert CORS den direkten Abruf fremder Feeds — fast alle wären blockiert.
Deshalb:

1. `.github/workflows/build.yml` startet alle 30 Minuten (`7,37 * * * *`, nicht
   zur vollen Stunde, dort staut sich GitHubs Warteschlange).
2. `fetch.mjs` ruft alle 199 Feeds ab (serverseitig, kein CORS),
   entdoppelt, siebt nach Alter, und schreibt `data/digest.json`
   (350 Meldungen, ~150 KB).
3. Der Ablauf veröffentlicht das Hauptverzeichnis direkt auf GitHub Pages. **Es wird nichts
   ins Projekt zurückgeschrieben** — kein Commit, keine Schleifen, kein Ballast.
4. Die App lädt nur diese eine Datei von ihrer eigenen Adresse und wendet die
   Sortierung an.

**Die Auswertung läuft bewusst im Browser, nicht beim Bauen.** Nur so wirken
Einstellungen (Rubrik, Zeitraum, abgeschaltete Quellen) sofort, statt bis zum
nächsten Lauf zu warten. `digest.json` enthält deshalb mehr Meldungen, als je
angezeigt werden.

### Dateien

**Alles liegt flach im Hauptverzeichnis**, einzige Ausnahme ist
`.github/workflows/build.yml` (GitHub sucht Abläufe nur dort). Das ist eine
bewusste Entscheidung nach einem konkreten Fehlschlag: Beim ersten Hochladen
über die GitHub-Webseite hat der Browser **alle Unterordner verworfen** und
alles flach abgelegt -- die Importe zeigten ins Leere und unter Actions stand
nichts. Flach kann das nicht mehr passieren. **Nicht wieder in Unterordner
sortieren.**

| Datei | Zweck |
|---|---|
| `index.html` | Gerüst, PWA-Metaangaben |
| `app.js` | Anzeige, Zettel, Einstellungen, Ziehen zum Aktualisieren |
| `styles.css` | Farben unverändert aus der alten App (`theme.ts`) |
| `sw.js` | Offline: Gerüst aus dem Zwischenspeicher, Nachrichten aus dem Netz |
| `sources.js` | **199 Quellen, 9 Rubriken. Hier wächst die App.** |
| `localFilter.js` | Bewerten, mischen, kürzen |
| `events.js` | Terminkalender, 55 Termine |
| `fetch.mjs` | Der Einsammler |
| `rss.mjs` | Abruf und XML-Auswertung |

`sources.js`, `localFilter.js` und `events.js` wurden per
`node:module.stripTypeScriptTypes` aus dem alten TypeScript erzeugt --
inhaltlich Zeile für Zeile dasselbe.

### Regeln, die nicht gebrochen werden dürfen

1. **Es darf nie eine leere Frontpage geben.** Kein Netz ⇒ letzter Stand aus
   `localStorage`. Kaputte Datei ⇒ alter Stand bleibt stehen.
2. **`fetch.mjs` bricht ab, wenn unter 25 % der Quellen antworten.**
   Lieber der alte Stand als eine fast leere Datei.
3. **Fremde Inhalte nie als HTML einsetzen.** `esc()` für jeden Text aus einem
   Feed, `safeUrl()` für jede Adresse. Feeds sind fremder Input.
4. **Mischung vor reiner Bewertung.** Jede Rubrik bekommt Mindestplätze, keine
   mehr als rund ein Drittel. Ohne das besteht die Seite nur aus Rennsport und
   MTB.
5. **Frische wirkt multiplikativ.** `TIME_CRITICAL` verfällt nach drei Tagen,
   `EVERGREEN` nicht. Nicht zusammenlegen.
6. **Bei gleicher Meldung steht der Artikel vor dem Video, immer.**
7. **„Riemen & Getriebe" ist eine Sonderrubrik** (Atzes Wunsch vom 11.09.2026,
   „Der wird ja meistens leer sein"): `BELT_TERMS` überstimmt die
   Trefferzählung, das Zeitfenster ist länger, der Reiter bleibt auch leer
   sichtbar. **Beim Ergänzen von Begriffen aufpassen** — der Abgleich ist reine
   Teilstring-Suche: `pinion` steckt in „opinion", `gates` in „delegates",
   `igh` in „high". Begründungen stehen im Kommentar über `BELT_TERMS`.
8. **Links, Quellennamen, Bilder und Zeitstempel kommen immer aus dem
   Originalartikel.**
9. **Das Projekt muss öffentlich bleiben** (siehe Kostengrenze).
10. **Beim Ändern von `sw.js` oder dem Gerüst die Zahl in `CACHE`
    hochzählen.** Sonst sehen Geräte wochenlang die alte Fassung.

### Fallen

- **GitHub schaltet zeitgesteuerte Abläufe nach 60 Tagen ohne Aktivität ab.**
  Betrifft öffentliche Projekte. Ob ein Commit des Ablaufs selbst als Aktivität
  zählt, dokumentiert GitHub nicht — nicht darauf verlassen. Die App weist
  oben darauf hin, wenn der Stand alt wird; geweckt wird mit **Run workflow**.
- **Bei Settings → Pages muss „GitHub Actions" als Source stehen**, nicht
  „Deploy from a branch". Sonst kommt 404 ohne Erklärung.
- **Die npm-Registry und alle Feeds sind aus der Sitzungsumgebung zeitweise
  gesperrt** (403 vom Egress-Proxy). Dann hier weder `npm install` noch ein
  echter Feed-Abruf möglich. Ersatz: Node führt TypeScript und ES-Module selbst
  aus, und `fetch.mjs` lässt sich mit einer `fetch`-Attrappe komplett
  durchspielen. Ehrlich sagen, was dadurch ungeprüft bleibt.
- Chromium liegt unter `/opt/pw-browsers/chromium` und kann die Seite headless
  rendern (`--screenshot`, `--dump-dom`) — nützlich, um die Anzeige einmal
  wirklich anzusehen, statt sie sich vorzustellen.

## Quellen

199 Feeds, 9 Rubriken, 125 standardmäßig an. Aufteilung: 32 Straße, 26 MTB,
17 E-Bike, 8 Technik, 12 Gravel, 23 Alltag, 7 Branche, 72 Szene
(69 YouTube-Kanäle, 3 Foren), 2 Riemen; dazu 12 Subreddits thematisch verteilt.

Leicht wieder falsch gemacht:

- `ebike-news.de` heißt jetzt **wattmoves.de**.
- **BikeRadar**, **Vital MTB**, **velobiz**, **bikerumor**,
  **cyclingindustry.news**, **Rouleur**, **Tour-Magazin** und
  **velo.outsideonline** haben keinen funktionierenden Feed mehr — geprüft,
  nicht wieder aufnehmen.
- Pinkbike liegt auf `pinkbike_xml_feed.php`, Cycling Weekly auf `/rss`.
- **YouTube** sperrt `/feeds/videos.xml` gegen Prüfung. Kanal-IDs stattdessen
  einzeln über `youtube.com/channel/UC…` verifizieren — das fing schon zwei
  falsche IDs ab. Nicht abkürzen.

## Offene Punkte

- **KI-Zusammenfassungen.** Ginge jetzt besser als früher: einmal beim Bauen
  für alle, statt auf jedem Gerät. Braucht einen kostenlosen Gemini-Schlüssel
  als GitHub-Secret. Mit Atze noch nicht besprochen.
- **Terminkalender nachführen.** `COMPILED_ON` in `events.js` mitziehen,
  `calendarStatus()` warnt sonst nicht.
- Artikel merken, eigene Suchbegriffe, Erinnerung vor Terminen.
