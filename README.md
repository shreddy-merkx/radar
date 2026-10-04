# Radar — als eigene App auf dem Startbildschirm

Kein Expo mehr, keine App in der App. Ein Symbol auf dem Startbildschirm,
antippen, Radar ist da. Vollbild, ohne Adressleiste, ohne Browser-Knöpfe.

**Kostet nichts** und braucht kein Konto — weder bei dir noch bei Leuten, denen
du den Link schickst. Jeder mit dem Link kann Radar benutzen, auf iPhone und
Android gleichermaßen.

---

## Was sich hinter den Kulissen geändert hat

Vorher hat dein Handy beim Öffnen ~200 Feeds selbst abgerufen. Im Browser geht
das nicht: Fremde Webseiten erlauben es nicht, dass eine andere Seite ihre
Inhalte direkt ausliest. Fast jeder Feed wäre blockiert.

Deshalb läuft das Einsammeln jetzt woanders: **Ein Rechner von GitHub holt alle
30 Minuten alle Feeds und legt das Ergebnis als eine einzige Datei neben die
App.** Dort gilt die Sperre nicht. Deine App lädt nur noch diese eine Datei.

Das macht sie nebenbei deutlich besser:

- **Sofort da.** Kein Warten auf 200 Verbindungen.
- **Funktioniert offline.** Der letzte Stand bleibt auf dem Gerät.
- **Kein Konto für niemanden.** Link schicken reicht.

Die Filter- und Sortierlogik ist unverändert dieselbe: 199 Quellen, neun
Rubriken, Frischefaktor, Rubrikmischung, Riemen-Reiter, Terminkalender.

---

## Sprachen

Die Bedienung gibt es in **Deutsch, English, Nederlands, Français, Italiano
und Հայերեն (Armenisch)**. Beim ersten Öffnen nimmt Radar die Sprache des
Geräts, sofern sie dabei ist — sonst Deutsch. Umstellen in den Einstellungen
unter **Sprache**, ganz oben.

Mit umgestellt werden auch Monatsnamen, Wochentage und Angaben wie „in drei
Tagen".

**Nicht übersetzt werden die Meldungen selbst.** Die kommen so, wie die Quelle
sie geschrieben hat — meist deutsch oder englisch. Sie zu übersetzen bräuchte
eine KI bei jedem Abruf; das wäre ein eigenes Vorhaben. Auch die Termine
behalten ihre Namen: „Downhill-Weltcup Whistler" ist zum größten Teil ein
Eigenname.

---

## Was Radar jetzt anders macht

Eine Runde Selbstkritik, umgesetzt. Das Wichtigste zuerst:

**Ein Reiter zeigt jetzt die ganze Rubrik.** Vorher war „MTB" nur ein Filter
über die dreißig Meldungen der Frontpage — man tippte drauf und bekam drei.
Jetzt kommt die vollständige Rubrik, nach Aktualität, mit **Mehr laden** am
Ende. Die Startseite bleibt die kuratierte Mischung; die Reiter sind das
Nachschlagewerk.

**Dieselbe Meldung steht nur noch einmal da.** 199 Quellen schreiben über
dasselbe Rennen. Radar erkennt das jetzt nicht mehr nur bei gleichlautenden
Überschriften, sondern an den Wörtern, die etwas bedeuten — aus fünf Karten
wird eine mit der Zeile „auch bei Cyclingnews, road.cc und 3 weiteren".
Schaltest du die Hauptquelle ab, rückt eine der anderen nach.

**Suche.** Lupe oben rechts. Durchsucht alles, was geladen ist — auch die
Meldungen, die es nicht auf die Frontpage geschafft haben, und auch die, die
älter sind als das eingestellte Zeitfenster.

**Gemerkt.** Das Lesezeichen an jeder Karte legt eine Meldung beiseite. Sie
bleibt dort, auch wenn die Quelle sie längst aus ihrem Feed geschoben hat —
abgelegt wird die Meldung selbst, nicht nur ihre Adresse.

**Radar merkt sich, was du gelesen hast.** Gelesene Karten treten zurück, und
oben steht, wie viel seit deinem letzten Besuch dazugekommen ist.

**Doppelt so viel auf einem Bildschirm.** Anrisstexte, die nur die Überschrift
wiederholen, fallen weg; der Rest ist auf zwei Zeilen gekürzt. Wer es noch
enger mag: **Einstellungen → Darstellung → Kompakt**.

**Termine wandern in deinen Kalender.** Unter jedem Termin steht
„+ In meinen Kalender". Außerdem sagt die Liste jetzt selbst, bis wann sie
reicht — sie ist von Hand gepflegt und endet irgendwann.

Dazu repariert: Die Rubrik-Reiter verschwanden beim Scrollen hinter der
Kopfzeile, das „EN" in der Quellenliste wurde zu einem leeren Kasten über die
ganze Breite, die Zahl im Reiter stimmte nie mit der Zahl in der Rubrik
überein, und das Zahnrad sah aus wie ein Umschalter für hell und dunkel. Die
199 giftgrünen Schalter sind jetzt schwarz, die Quellenliste klappt zusammen
und lässt sich durchsuchen, und nach langem Scrollen bringt ein Knopf unten
rechts zurück nach oben.

> **Ein Fehler, der nichts mit dem Aussehen zu tun hatte:** Beim Erkennen
> doppelter Beiträge hat Radar alles hinter dem Fragezeichen einer Adresse
> abgeschnitten. Bei YouTube steht die Videonummer genau dort
> (`watch?v=…`) — alle 69 Kanäle sahen damit gleich aus, und von sämtlichen
> Videos überlebte pro Lauf **ein einziges**. Deshalb war „Szene & Videos"
> immer so leer. Jetzt fliegen nur noch Zählpixel und Kampagnen-Anhängsel
> raus. Aus 200 gefundenen Meldungen wurden damit knapp 400.

---

## Top 10 der Videoszene — freiwillig

Unter dem Aufmacher steht ein Streifen **„Meistgesehen"**: die zehn
meistgesehenen Videos der letzten sieben Tage aus den 69 YouTube-Kanälen, die
Radar ohnehin schon liest. In der Rubrik **Szene & Videos** steht er ganz oben.

Dafür braucht Radar einen Schlüssel von Google. Der ist **kostenlos und ohne
Kreditkarte** — Google will dafür keine Zahlungsdaten. Ohne Schlüssel läuft
alles wie bisher, der Streifen bleibt einfach weg.

> **Warum das nichts kostet und auch nicht ausfallen kann:** Google gibt 10.000
> Punkte am Tag her. Suchen wäre teuer (100 Punkte pro Suche), deshalb sucht
> Radar nicht: Die Videonummern hat es aus den Kanal-Feeds schon, es fragt nur
> die Zahlen dazu ab — bis zu 50 Videos für **einen** Punkt. Macht rund 200
> Punkte am Tag. Von 10.000.

### Den Schlüssel holen — einmalig, etwa 5 Minuten

1. **console.cloud.google.com** öffnen und mit dem Google-Konto anmelden.
2. Oben in der blauen Leiste auf die Projektauswahl → **Neues Projekt** →
   Name `Radar` → **Erstellen**. Kurz warten, bis es oben ausgewählt ist.
3. Links **APIs und Dienste** → **Bibliothek**. Oben `YouTube Data API v3`
   eintippen, draufklicken, **Aktivieren**.
4. Links **Anmeldedaten** → oben **Anmeldedaten erstellen** → **API-Schlüssel**.
5. Der Schlüssel erscheint in einem Fenster. **Kopieren.**

Falls Google zwischendurch nach einem Zweck fragt: „Öffentliche Daten" oder
„Public data" anklicken. Nach Geld fragt es nicht.

### Den Schlüssel bei GitHub hinterlegen

Der Schlüssel darf **nicht** in eine Datei — die sind öffentlich. Er kommt an
die Stelle, die GitHub genau dafür hat:

1. Im Projekt oben auf **Settings**
2. Links **Secrets and variables** → **Actions**
3. **New repository secret**
4. **Name:** genau `YOUTUBE_API_KEY` (Großbuchstaben, mit Unterstrichen)
5. **Secret:** den kopierten Schlüssel einfügen
6. **Add secret**

Danach einmal **Actions** → **Run workflow**. Beim nächsten Öffnen der App ist
der Streifen da.

### Wenn der Streifen nicht erscheint

Unter **Actions** den letzten Lauf anklicken und beim Schritt „Feeds abrufen"
nach der Zeile `Top 10:` schauen. Dort steht im Klartext, was los ist:

| Zeile | Bedeutung |
|---|---|
| `Top 10: ausgelassen (kein YOUTUBE_API_KEY hinterlegt)` | Das Secret fehlt oder heißt anders |
| `Top 10 ausgelassen: HTTP 400 (badRequest)` | Schlüssel falsch kopiert |
| `Top 10 ausgelassen: HTTP 403 (accessNotConfigured)` | Schritt 3 fehlt: YouTube Data API v3 ist nicht aktiviert |
| `Top 10 ausgelassen: HTTP 403 (quotaExceeded)` | Tagesbudget leer — sollte nicht vorkommen, dann stimmt etwas mit dem Projekt nicht |

In allen diesen Fällen läuft Radar ganz normal weiter, nur ohne den Streifen.
Ausschalten lässt er sich auch von Hand: **Einstellungen → Top 10**.

---

## Einrichten — einmalig, etwa 10 Minuten

### 1. Neues Projekt bei GitHub anlegen

Auf **github.com** oben rechts auf **+** → **New repository**.

- **Repository name:** `radar`
- **Wichtig: auf `Public` stellen.** Bei `Private` verlangt GitHub für die
  Veröffentlichung ein Bezahlpaket. Öffentlich ist kostenlos. In den Dateien
  steht nichts Geheimes — keine Passwörter, keine Schlüssel.
- Sonst nichts ankreuzen, dann **Create repository**.

### 2. Dateien hochladen

Auf der Seite, die jetzt kommt: **uploading an existing file** anklicken.
Dann alle Dateien aus dem entpackten Ordner in das Feld ziehen. Sie liegen
absichtlich alle nebeneinander — nichts kann dabei durcheinandergeraten.

Unten auf **Commit changes** drücken.

### 2b. Die eine Datei, die in einen Ordner muss

`build.yml` ist die Ausnahme: GitHub sucht Abläufe **nur** unter
`.github/workflows/`. Über das Ziehfeld geht das nicht zuverlässig, deshalb
von Hand:

1. **Add file** → **Create new file**
2. Als Namen genau eintippen: `.github/workflows/build.yml`
   (die Schrägstriche legen die Ordner automatisch mit an)
3. `build.yml` aus dem entpackten Ordner mit dem Editor öffnen, alles
   markieren, kopieren und in das große Feld einfügen
4. **Commit changes**

Erst danach erscheint überhaupt etwas unter **Actions**.

### 3. Veröffentlichung einschalten

Im Projekt oben auf **Settings** → links auf **Pages**.

Bei **Source** von „Deploy from a branch" auf **GitHub Actions** umstellen.

> Das ist der eine Schalter, an dem es sonst hängenbleibt. Ohne ihn passiert
> nichts, und GitHub sagt auch nicht, warum.

### 4. Einmal laufen lassen

Oben auf **Actions**. Links **Radar bauen und veröffentlichen** anklicken,
rechts auf **Run workflow** → **Run workflow**.

Das dauert ein bis zwei Minuten. Wenn der Haken grün ist, steht Radar unter:

```
https://DEIN-GITHUB-NAME.github.io/radar/
```

### 5. Aufs iPhone holen

Diese Adresse **in Safari** öffnen (nicht Chrome — nur Safari kann Apps auf den
Startbildschirm legen).

Unten auf das **Teilen-Symbol** (Kästchen mit Pfeil nach oben) → nach unten
scrollen → **Zum Home-Bildschirm**.

Fertig. Radar liegt als Symbol zwischen deinen anderen Apps und startet im
Vollbild.

---

## Weitergeben

Einfach die Adresse schicken. Keine Anmeldung, kein Konto, keine Installation
aus fremder Quelle. Auf Android funktioniert derselbe Link genauso — dort heißt
der Menüpunkt **Zum Startbildschirm hinzufügen**.

---

## Wenn etwas nicht stimmt

| Problem | Das hilft |
|---|---|
| Seite ist leer oder zeigt „Keine Verbindung" | Lief der Ablauf unter **Actions** durch? Roter Punkt heißt Fehler — draufklicken, Meldung herschicken |
| „404 — There isn't a GitHub Pages site here" | Schritt 3 fehlt: Bei Settings → Pages muss **GitHub Actions** als Source stehen |
| Nachrichten sind alt | Radar sagt es dir selbst oben auf der Seite. Unter **Actions** → **Run workflow** einmal von Hand anstoßen |
| Nach längerer Pause kommt nichts Neues mehr | GitHub schaltet zeitgesteuerte Abläufe nach **60 Tagen ohne Aktivität** ab. Einmal **Run workflow** drücken weckt sie wieder. Radar weist oben darauf hin, wenn der Stand alt wird |
| Symbol auf dem Startbildschirm sieht falsch aus | Einmal löschen und über Safari neu hinzufügen |
| Änderung am Code wirkt nicht | Nach jedem Hochladen baut GitHub neu. Auf dem iPhone die App einmal ganz schließen und neu öffnen |

---

## Für später

- **Mehr als zehn Videos**, oder Shorts dazunehmen: steht oben in
  `youtube.mjs`, zwei Zahlen.
- **Zusammenfassungen durch eine KI.** Ginge jetzt sogar besser als vorher:
  beim Bauen einmal für alle, statt auf jedem Gerät einzeln. Braucht einen
  kostenlosen Google-Gemini-Schlüssel als *Secret* im Projekt.
- **Eigene Adresse** statt `github.io`, falls du mal eine hast.
- **Erinnerung vor Terminen.** Im Browser heikel auf dem iPhone; dafür wäre
  eine E-Mail aus dem Ablauf heraus der einfachere Weg.

---

## Aufbau der Dateien

**Alle Dateien liegen flach im Hauptverzeichnis** — mit genau einer Ausnahme:
`.github/workflows/build.yml` muss in diesem Unterordner liegen, GitHub sucht
Abläufe nirgendwo sonst.

Das ist Absicht: Beim Hochladen über die GitHub-Webseite gehen Unterordner
leicht verloren, und dann findet nichts mehr zueinander. Flach kann das nicht
passieren.

| Datei | Was |
|---|---|
| `index.html`, `styles.css`, `app.js` | Die App |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Das, was sie zur App auf dem Startbildschirm macht |
| `sources.js`, `localFilter.js`, `events.js` | Quellen, Filterlogik, Termine — aus der bisherigen App übernommen |
| `i18n.js` | Alle Texte der Bedienung in sechs Sprachen |
| `fetch.mjs`, `rss.mjs` | Holen die Feeds, schreiben `data/digest.json` |
| `youtube.mjs` | Die Top 10 der Videoszene — ohne Schlüssel wirkungslos |
| `.github/workflows/build.yml` | Der Zeitplan: alle 30 Minuten, plus bei jeder Änderung |

`data/digest.json` steht bewusst nicht im Projekt — die Datei entsteht bei
jedem Lauf neu.
