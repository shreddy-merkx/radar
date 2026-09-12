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
| `fetch.mjs`, `rss.mjs` | Holen die Feeds, schreiben `data/digest.json` |
| `.github/workflows/build.yml` | Der Zeitplan: alle 30 Minuten, plus bei jeder Änderung |

`data/digest.json` steht bewusst nicht im Projekt — die Datei entsteht bei
jedem Lauf neu.
