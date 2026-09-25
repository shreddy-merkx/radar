/**
 * Sprachen der Bedienoberfläche.
 *
 * Übersetzt wird die **Oberfläche**, nicht die Nachrichten. Die Meldungen
 * kommen so, wie die Quelle sie geschrieben hat -- meist deutsch oder
 * englisch. Sie zu übersetzen bräuchte eine KI bei jedem Abruf; das wäre ein
 * eigenes Vorhaben und kostet Geld oder ein Konto.
 *
 * Auch die Termine im Kalender bleiben, wie sie sind: „Downhill-Weltcup
 * Whistler" ist zum größten Teil ein Eigenname. Datumsangaben, Monatsnamen und
 * Wochentage richten sich dagegen sehr wohl nach der gewählten Sprache --
 * dafür sorgt `Intl`, nicht diese Datei.
 *
 * Neue Sprache ergänzen: Abschnitt kopieren, übersetzen, in `LANGUAGES`
 * eintragen. Fehlt ein Eintrag, greift automatisch das deutsche Wort -- die
 * App bleibt also immer bedienbar, auch bei halbfertiger Übersetzung.
 */

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'hy', label: 'Հայերեն' },
];

const STRINGS = {
  de: {
    loading: 'wird geladen …',
    subline: '{items} Meldungen · {ok}/{total} Quellen · {when}',
    all: 'Alle',
    soonHead: 'DEMNÄCHST',
    fullCalendar: 'ganzer Kalender ›',
    badgeNew: 'NEU',

    staleTitle: 'Stand von vor {age}',
    staleBody: 'Normalerweise wird alle 30 Minuten nachgeladen. Wenn das länger so bleibt, steht die Aktualisierung bei GitHub still — einmal „Run workflow" drücken weckt sie.',
    ageHours: '{n} Stunden',
    ageDay: '1 Tag',
    ageDays: '{n} Tagen',

    emptyBeltTitle: 'Gerade nichts zum Riemenantrieb',
    emptyBeltBody: 'Radar durchsucht alle {sources} Quellen nach Riemenantrieb, Nabenschaltung und Getriebe und schaut dabei drei Wochen zurück. Im Moment gibt es nichts — das ist normal.',
    emptyTitle: 'Hier ist gerade nichts',
    emptyBody: 'In dieser Rubrik ist bei der letzten Aktualisierung nichts angekommen.',
    showAll: 'Alles anzeigen',
    offlineTitle: 'Keine Verbindung',
    offlineBody: 'Radar konnte die Nachrichten nicht laden und hat auch keinen gespeicherten Stand.',
    retry: 'Nochmal versuchen',

    pullToRefresh: 'Zum Aktualisieren ziehen',
    releaseToRefresh: 'Loslassen zum Aktualisieren',
    colophon: '{sources} Quellen · {topics} Rubriken · sortiert auf dem Gerät',
    colophonFailed: '{n} Quellen waren beim letzten Einsammeln stumm — bei {total} ist das normal.',

    justNow: 'gerade eben',
    minutesAgo: 'vor {n} Min.',
    hoursAgo: 'vor {n} Std.',
    yesterday: 'gestern',
    daysAgo: 'vor {n} Tagen',

    eventsTitle: 'Termine',
    eventsCount: '{n} Termine vor dir',
    eventsCountOne: '1 Termin vor dir',
    done: 'Fertig',
    running: 'läuft — Tag {day} von {total}',
    today: 'heute',
    tomorrow: 'morgen',
    inDays: 'in {n} Tagen',
    nextWeek: 'nächste Woche',
    inWeeks: 'in {n} Wochen',
    inMonths: 'in {n} Monaten',
    unconfirmed: 'Termin noch nicht endgültig bestätigt — vor der Anreise prüfen',
    calendarFooter: 'Termine einzeln an den offiziellen Seiten nachgeschlagen, Stand {date}. Tippen öffnet die Veranstalterseite.',
    kindRace: 'RENNEN',
    kindChampionship: 'MEISTERSCHAFT',
    kindFestival: 'FESTIVAL',
    kindShow: 'MESSE',

    settingsTitle: 'Einstellungen',
    settingsSub: '{on} von {total} Quellen an',
    secLanguage: 'SPRACHE',
    languageHint: 'Gilt für die Bedienung. Die Meldungen selbst bleiben in der Sprache ihrer Quelle.',
    secScope: 'UMFANG',
    scopeHint: 'Wie viele Meldungen die Frontpage zeigt und wie weit Radar zurückschaut.',
    nItems: '{n} Meldungen',
    nDay: '1 Tag',
    nDays: '{n} Tage',
    secSources: 'QUELLEN · {on} VON {total} AN',
    sourcesHint: 'Abschalten blendet eine Quelle sofort aus. Eingesammelt wird trotzdem weiter — das passiert nicht auf deinem Handy, kostet dich also keine Zeit.',
    allOn: 'alle an',
    allOff: 'alle aus',
    tagVideo: 'VIDEO',
    tagForum: 'FORUM',

    topics: {
      road: ['Straße & Rennsport', 'Rennsport'],
      gravity: ['MTB & Gravity', 'MTB'],
      ebike: ['E-Bike & E-MTB', 'E-Bike'],
      tech: ['Technik & Neuheiten', 'Technik'],
      gravel: ['Gravel & Bikepacking', 'Gravel'],
      urban: ['Alltag, Cargo & Verkehr', 'Alltag'],
      scene: ['Szene & Videos', 'Szene'],
      industry: ['Branche & Business', 'Branche'],
      belt: ['Riemen & Getriebe', 'Riemen'],
    },
  },

  en: {
    loading: 'loading …',
    subline: '{items} stories · {ok}/{total} sources · {when}',
    all: 'All',
    soonHead: 'COMING UP',
    fullCalendar: 'full calendar ›',
    badgeNew: 'NEW',

    staleTitle: 'Last updated {age} ago',
    staleBody: 'Normally this refreshes every 30 minutes. If it stays this way, the update job on GitHub has stopped — pressing "Run workflow" once wakes it up.',
    ageHours: '{n} hours',
    ageDay: '1 day',
    ageDays: '{n} days',

    emptyBeltTitle: 'Nothing on belt drives right now',
    emptyBeltBody: 'Radar searches all {sources} sources for belt drives, hub gears and gearboxes, looking back three weeks. There is nothing at the moment — that is normal.',
    emptyTitle: 'Nothing here right now',
    emptyBody: 'Nothing came in for this section at the last update.',
    showAll: 'Show everything',
    offlineTitle: 'No connection',
    offlineBody: 'Radar could not load the news and has no saved copy either.',
    retry: 'Try again',

    pullToRefresh: 'Pull to refresh',
    releaseToRefresh: 'Release to refresh',
    colophon: '{sources} sources · {topics} sections · sorted on your device',
    colophonFailed: '{n} sources were silent at the last collection — with {total} that is normal.',

    justNow: 'just now',
    minutesAgo: '{n} min ago',
    hoursAgo: '{n} h ago',
    yesterday: 'yesterday',
    daysAgo: '{n} days ago',

    eventsTitle: 'Calendar',
    eventsCount: '{n} events ahead',
    eventsCountOne: '1 event ahead',
    done: 'Done',
    running: 'under way — day {day} of {total}',
    today: 'today',
    tomorrow: 'tomorrow',
    inDays: 'in {n} days',
    nextWeek: 'next week',
    inWeeks: 'in {n} weeks',
    inMonths: 'in {n} months',
    unconfirmed: 'Date not fully confirmed — check before travelling',
    calendarFooter: 'Each date looked up on the official site, as of {date}. Tap to open the organiser page.',
    kindRace: 'RACE',
    kindChampionship: 'CHAMPIONSHIP',
    kindFestival: 'FESTIVAL',
    kindShow: 'TRADE SHOW',

    settingsTitle: 'Settings',
    settingsSub: '{on} of {total} sources on',
    secLanguage: 'LANGUAGE',
    languageHint: 'Applies to the interface. The stories themselves stay in the language of their source.',
    secScope: 'SCOPE',
    scopeHint: 'How many stories the front page shows and how far back Radar looks.',
    nItems: '{n} stories',
    nDay: '1 day',
    nDays: '{n} days',
    secSources: 'SOURCES · {on} OF {total} ON',
    sourcesHint: 'Switching one off hides it immediately. Collecting continues anyway — that does not happen on your phone, so it costs you no time.',
    allOn: 'all on',
    allOff: 'all off',
    tagVideo: 'VIDEO',
    tagForum: 'FORUM',

    topics: {
      road: ['Road & Racing', 'Racing'],
      gravity: ['MTB & Gravity', 'MTB'],
      ebike: ['E-Bike & E-MTB', 'E-Bike'],
      tech: ['Tech & New Gear', 'Tech'],
      gravel: ['Gravel & Bikepacking', 'Gravel'],
      urban: ['Everyday, Cargo & Traffic', 'Everyday'],
      scene: ['Scene & Videos', 'Scene'],
      industry: ['Industry & Business', 'Industry'],
      belt: ['Belt Drive & Gearboxes', 'Belt'],
    },
  },

  nl: {
    loading: 'wordt geladen …',
    subline: '{items} berichten · {ok}/{total} bronnen · {when}',
    all: 'Alles',
    soonHead: 'BINNENKORT',
    fullCalendar: 'hele agenda ›',
    badgeNew: 'NIEUW',

    staleTitle: 'Stand van {age} geleden',
    staleBody: 'Normaal wordt er elke 30 minuten bijgewerkt. Blijft dit zo, dan ligt de update bij GitHub stil — één keer op „Run workflow" drukken start hem weer.',
    ageHours: '{n} uur',
    ageDay: '1 dag',
    ageDays: '{n} dagen',

    emptyBeltTitle: 'Nu even niets over riemaandrijving',
    emptyBeltBody: 'Radar doorzoekt alle {sources} bronnen op riemaandrijving, naafversnellingen en versnellingsbakken, en kijkt daarbij drie weken terug. Op dit moment is er niets — dat is normaal.',
    emptyTitle: 'Hier is nu niets',
    emptyBody: 'Bij de laatste update is er niets binnengekomen voor deze rubriek.',
    showAll: 'Alles tonen',
    offlineTitle: 'Geen verbinding',
    offlineBody: 'Radar kon het nieuws niet laden en heeft ook geen opgeslagen versie.',
    retry: 'Opnieuw proberen',

    pullToRefresh: 'Trek omlaag om te vernieuwen',
    releaseToRefresh: 'Loslaten om te vernieuwen',
    colophon: '{sources} bronnen · {topics} rubrieken · gesorteerd op je toestel',
    colophonFailed: '{n} bronnen zwegen bij de laatste ronde — bij {total} is dat normaal.',

    justNow: 'zojuist',
    minutesAgo: '{n} min geleden',
    hoursAgo: '{n} uur geleden',
    yesterday: 'gisteren',
    daysAgo: '{n} dagen geleden',

    eventsTitle: 'Agenda',
    eventsCount: 'nog {n} evenementen',
    eventsCountOne: 'nog 1 evenement',
    done: 'Klaar',
    running: 'bezig — dag {day} van {total}',
    today: 'vandaag',
    tomorrow: 'morgen',
    inDays: 'over {n} dagen',
    nextWeek: 'volgende week',
    inWeeks: 'over {n} weken',
    inMonths: 'over {n} maanden',
    unconfirmed: 'Datum nog niet definitief — controleer voor vertrek',
    calendarFooter: 'Elke datum nagekeken op de officiële site, stand {date}. Tik om de pagina van de organisator te openen.',
    kindRace: 'WEDSTRIJD',
    kindChampionship: 'KAMPIOENSCHAP',
    kindFestival: 'FESTIVAL',
    kindShow: 'BEURS',

    settingsTitle: 'Instellingen',
    settingsSub: '{on} van {total} bronnen aan',
    secLanguage: 'TAAL',
    languageHint: 'Geldt voor de bediening. De berichten zelf blijven in de taal van hun bron.',
    secScope: 'OMVANG',
    scopeHint: 'Hoeveel berichten de voorpagina toont en hoe ver Radar terugkijkt.',
    nItems: '{n} berichten',
    nDay: '1 dag',
    nDays: '{n} dagen',
    secSources: 'BRONNEN · {on} VAN {total} AAN',
    sourcesHint: 'Uitschakelen verbergt een bron meteen. Het verzamelen gaat gewoon door — dat gebeurt niet op je telefoon en kost je dus geen tijd.',
    allOn: 'alles aan',
    allOff: 'alles uit',
    tagVideo: 'VIDEO',
    tagForum: 'FORUM',

    topics: {
      road: ['Weg & Wedstrijd', 'Wedstrijd'],
      gravity: ['MTB & Gravity', 'MTB'],
      ebike: ['E-bike & E-MTB', 'E-bike'],
      tech: ['Techniek & Nieuws', 'Techniek'],
      gravel: ['Gravel & Bikepacking', 'Gravel'],
      urban: ['Dagelijks, Cargo & Verkeer', 'Dagelijks'],
      scene: ['Scene & Video', 'Scene'],
      industry: ['Branche & Business', 'Branche'],
      belt: ['Riemaandrijving & Naven', 'Riem'],
    },
  },

  fr: {
    loading: 'chargement …',
    subline: '{items} actus · {ok}/{total} sources · {when}',
    all: 'Tout',
    soonHead: 'À VENIR',
    fullCalendar: 'calendrier complet ›',
    badgeNew: 'NOUVEAU',

    staleTitle: 'Données d’il y a {age}',
    staleBody: 'Normalement, la mise à jour a lieu toutes les 30 minutes. Si cela persiste, le processus sur GitHub est arrêté — appuyer une fois sur « Run workflow » le relance.',
    ageHours: '{n} heures',
    ageDay: '1 jour',
    ageDays: '{n} jours',

    emptyBeltTitle: 'Rien sur la courroie pour l’instant',
    emptyBeltBody: 'Radar parcourt les {sources} sources à la recherche de courroies, moyeux à vitesses intégrées et boîtes de vitesses, sur trois semaines. Il n’y a rien en ce moment — c’est normal.',
    emptyTitle: 'Rien ici pour l’instant',
    emptyBody: 'Rien n’est arrivé dans cette rubrique lors de la dernière mise à jour.',
    showAll: 'Tout afficher',
    offlineTitle: 'Pas de connexion',
    offlineBody: 'Radar n’a pas pu charger les actualités et n’a aucune copie enregistrée.',
    retry: 'Réessayer',

    pullToRefresh: 'Tirer pour actualiser',
    releaseToRefresh: 'Relâcher pour actualiser',
    colophon: '{sources} sources · {topics} rubriques · trié sur votre appareil',
    colophonFailed: '{n} sources sont restées muettes lors de la dernière collecte — sur {total}, c’est normal.',

    justNow: 'à l’instant',
    minutesAgo: 'il y a {n} min',
    hoursAgo: 'il y a {n} h',
    yesterday: 'hier',
    daysAgo: 'il y a {n} jours',

    eventsTitle: 'Calendrier',
    eventsCount: '{n} événements à venir',
    eventsCountOne: '1 événement à venir',
    done: 'Terminé',
    running: 'en cours — jour {day} sur {total}',
    today: 'aujourd’hui',
    tomorrow: 'demain',
    inDays: 'dans {n} jours',
    nextWeek: 'la semaine prochaine',
    inWeeks: 'dans {n} semaines',
    inMonths: 'dans {n} mois',
    unconfirmed: 'Date pas encore définitive — à vérifier avant de partir',
    calendarFooter: 'Chaque date vérifiée sur le site officiel, au {date}. Toucher pour ouvrir la page de l’organisateur.',
    kindRace: 'COURSE',
    kindChampionship: 'CHAMPIONNAT',
    kindFestival: 'FESTIVAL',
    kindShow: 'SALON',

    settingsTitle: 'Réglages',
    settingsSub: '{on} sources sur {total} activées',
    secLanguage: 'LANGUE',
    languageHint: 'S’applique à l’interface. Les actualités restent dans la langue de leur source.',
    secScope: 'ÉTENDUE',
    scopeHint: 'Combien d’actus la page d’accueil affiche et jusqu’où Radar remonte.',
    nItems: '{n} actus',
    nDay: '1 jour',
    nDays: '{n} jours',
    secSources: 'SOURCES · {on} SUR {total} ACTIVÉES',
    sourcesHint: 'Désactiver masque une source immédiatement. La collecte continue quand même — elle n’a pas lieu sur votre téléphone et ne vous coûte donc aucun temps.',
    allOn: 'tout activer',
    allOff: 'tout désactiver',
    tagVideo: 'VIDÉO',
    tagForum: 'FORUM',

    topics: {
      road: ['Route & Compétition', 'Route'],
      gravity: ['VTT & Gravity', 'VTT'],
      ebike: ['Vélo électrique & VTTAE', 'VAE'],
      tech: ['Technique & Nouveautés', 'Technique'],
      gravel: ['Gravel & Bikepacking', 'Gravel'],
      urban: ['Quotidien, Cargo & Circulation', 'Quotidien'],
      scene: ['Scène & Vidéos', 'Scène'],
      industry: ['Industrie & Business', 'Industrie'],
      belt: ['Courroie & Boîtes de vitesses', 'Courroie'],
    },
  },

  it: {
    loading: 'caricamento …',
    subline: '{items} notizie · {ok}/{total} fonti · {when}',
    all: 'Tutto',
    soonHead: 'PROSSIMAMENTE',
    fullCalendar: 'calendario completo ›',
    badgeNew: 'NUOVO',

    staleTitle: 'Dati di {age} fa',
    staleBody: 'Di norma l’aggiornamento avviene ogni 30 minuti. Se la situazione persiste, il processo su GitHub è fermo — basta premere una volta «Run workflow» per riavviarlo.',
    ageHours: '{n} ore',
    ageDay: '1 giorno',
    ageDays: '{n} giorni',

    emptyBeltTitle: 'Al momento niente sulla cinghia',
    emptyBeltBody: 'Radar cerca in tutte le {sources} fonti notizie su cinghia, cambi al mozzo e cambi a scatola, guardando indietro tre settimane. Ora non c’è nulla — è normale.',
    emptyTitle: 'Qui al momento non c’è nulla',
    emptyBody: 'Per questa sezione non è arrivato nulla con l’ultimo aggiornamento.',
    showAll: 'Mostra tutto',
    offlineTitle: 'Nessuna connessione',
    offlineBody: 'Radar non è riuscito a caricare le notizie e non ha nemmeno una copia salvata.',
    retry: 'Riprova',

    pullToRefresh: 'Tira per aggiornare',
    releaseToRefresh: 'Rilascia per aggiornare',
    colophon: '{sources} fonti · {topics} sezioni · ordinate sul tuo dispositivo',
    colophonFailed: '{n} fonti non hanno risposto nell’ultima raccolta — su {total} è normale.',

    justNow: 'proprio ora',
    minutesAgo: '{n} min fa',
    hoursAgo: '{n} h fa',
    yesterday: 'ieri',
    daysAgo: '{n} giorni fa',

    eventsTitle: 'Calendario',
    eventsCount: '{n} appuntamenti in arrivo',
    eventsCountOne: '1 appuntamento in arrivo',
    done: 'Fatto',
    running: 'in corso — giorno {day} di {total}',
    today: 'oggi',
    tomorrow: 'domani',
    inDays: 'tra {n} giorni',
    nextWeek: 'la prossima settimana',
    inWeeks: 'tra {n} settimane',
    inMonths: 'tra {n} mesi',
    unconfirmed: 'Data non ancora definitiva — verificare prima di partire',
    calendarFooter: 'Ogni data verificata sul sito ufficiale, aggiornata al {date}. Tocca per aprire la pagina dell’organizzatore.',
    kindRace: 'GARA',
    kindChampionship: 'CAMPIONATO',
    kindFestival: 'FESTIVAL',
    kindShow: 'FIERA',

    settingsTitle: 'Impostazioni',
    settingsSub: '{on} di {total} fonti attive',
    secLanguage: 'LINGUA',
    languageHint: 'Vale per l’interfaccia. Le notizie restano nella lingua della loro fonte.',
    secScope: 'AMPIEZZA',
    scopeHint: 'Quante notizie mostra la prima pagina e quanto indietro guarda Radar.',
    nItems: '{n} notizie',
    nDay: '1 giorno',
    nDays: '{n} giorni',
    secSources: 'FONTI · {on} DI {total} ATTIVE',
    sourcesHint: 'Disattivarne una la nasconde subito. La raccolta prosegue comunque — non avviene sul tuo telefono e quindi non ti costa tempo.',
    allOn: 'attiva tutto',
    allOff: 'disattiva tutto',
    tagVideo: 'VIDEO',
    tagForum: 'FORUM',

    topics: {
      road: ['Strada & Corse', 'Corse'],
      gravity: ['MTB & Gravity', 'MTB'],
      ebike: ['E-Bike & E-MTB', 'E-Bike'],
      tech: ['Tecnica & Novità', 'Tecnica'],
      gravel: ['Gravel & Bikepacking', 'Gravel'],
      urban: ['Quotidiano, Cargo & Traffico', 'Quotidiano'],
      scene: ['Scena & Video', 'Scena'],
      industry: ['Settore & Business', 'Settore'],
      belt: ['Cinghia & Cambi', 'Cinghia'],
    },
  },

  hy: {
    loading: 'բեռնվում է …',
    subline: '{items} նյութ · {ok}/{total} աղբյուր · {when}',
    all: 'Բոլորը',
    soonHead: 'ՇՈՒՏՈՎ',
    fullCalendar: 'ամբողջ օրացույցը ›',
    badgeNew: 'ՆՈՐ',

    staleTitle: '{age} առաջվա տվյալներ',
    staleBody: 'Սովորաբար թարմացումը կատարվում է ամեն 30 րոպեն մեկ։ Եթե այսպես մնա, GitHub-ի գործընթացը կանգ է առել — մեկ անգամ սեղմեք «Run workflow», և այն կվերսկսվի։',
    ageHours: '{n} ժամ',
    ageDay: '1 օր',
    ageDays: '{n} օր',

    emptyBeltTitle: 'Փոկային փոխանցման մասին այս պահին ոչինչ չկա',
    emptyBeltBody: 'Radar-ը որոնում է բոլոր {sources} աղբյուրներում փոկային փոխանցման, թևի փոխանցատուփի և փոխանցատուփերի մասին՝ նայելով երեք շաբաթ հետ։ Այս պահին ոչինչ չկա — դա բնական է։',
    emptyTitle: 'Այստեղ այս պահին ոչինչ չկա',
    emptyBody: 'Վերջին թարմացման ժամանակ այս բաժնում ոչինչ չի ստացվել։',
    showAll: 'Ցույց տալ ամբողջը',
    offlineTitle: 'Կապ չկա',
    offlineBody: 'Radar-ը չկարողացավ բեռնել նորությունները և պահպանված պատճեն նույնպես չունի։',
    retry: 'Կրկին փորձել',

    pullToRefresh: 'Քաշեք՝ թարմացնելու համար',
    releaseToRefresh: 'Բաց թողեք՝ թարմացնելու համար',
    colophon: '{sources} աղբյուր · {topics} բաժին · դասավորված ձեր սարքում',
    colophonFailed: 'Վերջին հավաքման ժամանակ {n} աղբյուր լուռ մնաց — {total}-ի դեպքում դա բնական է։',

    justNow: 'հենց նոր',
    minutesAgo: '{n} րոպե առաջ',
    hoursAgo: '{n} ժամ առաջ',
    yesterday: 'երեկ',
    daysAgo: '{n} օր առաջ',

    eventsTitle: 'Օրացույց',
    eventsCount: 'առջևում {n} միջոցառում',
    eventsCountOne: 'առջևում 1 միջոցառում',
    done: 'Պատրաստ է',
    running: 'ընթանում է — օր {day} / {total}',
    today: 'այսօր',
    tomorrow: 'վաղը',
    inDays: '{n} օրից',
    nextWeek: 'հաջորդ շաբաթ',
    inWeeks: '{n} շաբաթից',
    inMonths: '{n} ամսից',
    unconfirmed: 'Ամսաթիվը վերջնական չէ — ստուգեք մեկնելուց առաջ',
    calendarFooter: 'Յուրաքանչյուր ամսաթիվ ստուգված է պաշտոնական կայքում, վիճակը՝ {date}։ Հպեք՝ կազմակերպչի էջը բացելու համար։',
    kindRace: 'ՄՐՑԱՐՇԱՎ',
    kindChampionship: 'ԱՌԱՋՆՈՒԹՅՈՒՆ',
    kindFestival: 'ՓԱՌԱՏՈՆ',
    kindShow: 'ՑՈՒՑԱՀԱՆԴԵՍ',

    settingsTitle: 'Կարգավորումներ',
    settingsSub: '{total}-ից {on} աղբյուր միացված է',
    secLanguage: 'ԼԵԶՈՒ',
    languageHint: 'Վերաբերում է միջերեսին։ Նյութերն իրենք մնում են իրենց աղբյուրի լեզվով։',
    secScope: 'ԾԱՎԱԼ',
    scopeHint: 'Քանի նյութ է ցույց տալիս գլխավոր էջը և որքան հետ է նայում Radar-ը։',
    nItems: '{n} նյութ',
    nDay: '1 օր',
    nDays: '{n} օր',
    secSources: 'ԱՂԲՅՈՒՐՆԵՐ · {total}-ից {on} ՄԻԱՑՎԱԾ',
    sourcesHint: 'Անջատելը միանգամից թաքցնում է աղբյուրը։ Հավաքումը շարունակվում է — դա չի կատարվում ձեր հեռախոսում, ուստի ժամանակ չի խլում։',
    allOn: 'միացնել բոլորը',
    allOff: 'անջատել բոլորը',
    tagVideo: 'ՏԵՍԱՆՅՈՒԹ',
    tagForum: 'ՖՈՐՈՒՄ',

    topics: {
      road: ['Ճանապարհ և մրցարշավ', 'Մրցարշավ'],
      gravity: ['Լեռնային հեծանիվ', 'MTB'],
      ebike: ['Էլեկտրահեծանիվ', 'E-Bike'],
      tech: ['Տեխնիկա և նորույթներ', 'Տեխնիկա'],
      gravel: ['Գրավել և բայքփաքինգ', 'Գրավել'],
      urban: ['Ամենօրյա և բեռնահեծանիվ', 'Ամենօրյա'],
      scene: ['Համայնք և տեսանյութեր', 'Համայնք'],
      industry: ['Ոլորտ և բիզնես', 'Ոլորտ'],
      belt: ['Փոկային փոխանցում', 'Փոկ'],
    },
  },
};

/** Deutsch ist die Rückfallebene -- diese Fassung ist immer vollständig. */
const FALLBACK = 'de';

let current = FALLBACK;

export function setLanguage(code) {
  current = STRINGS[code] ? code : FALLBACK;
  return current;
}

export function getLanguage() {
  return current;
}

/**
 * Sprache des Geräts, sofern Radar sie kennt -- das ist gemeint, wenn jemand
 * „Systemsprache" sagt. `navigator.languages` ist die Wunschliste des Nutzers
 * in seiner Reihenfolge; die erste, die wir können, gewinnt.
 */
export function detectLanguage() {
  const wanted = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of wanted) {
    const base = String(tag ?? '').toLowerCase().split('-')[0];
    if (STRINGS[base]) return base;
  }
  return FALLBACK;
}

/**
 * Ein Text in der aktuellen Sprache. Platzhalter in geschweiften Klammern
 * werden ersetzt: t('inDays', { n: 5 }).
 *
 * Fehlt ein Eintrag, kommt der deutsche -- lieber ein Wort in der falschen
 * Sprache als eine leere Stelle in der Oberfläche.
 */
export function t(key, params) {
  const text = STRINGS[current]?.[key] ?? STRINGS[FALLBACK][key] ?? key;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    (name in params ? String(params[name]) : match));
}

/** Rubrikname in der aktuellen Sprache: [lang, kurz]. */
export function topicNames(id) {
  return STRINGS[current]?.topics?.[id] ?? STRINGS[FALLBACK].topics[id] ?? [id, id];
}

/** Für Intl: Monatsnamen, Wochentage, Zahlen richten sich danach. */
export function locale() {
  return current;
}
