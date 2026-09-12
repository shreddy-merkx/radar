                                       

/**
 * Der Terminkalender.
 *
 * Warum die Termine fest in der App stehen und nicht abgerufen werden:
 * Rennkalender und Messetermine liegen nirgends in einer Form vor, die eine
 * App verlässlich auslesen kann. Es gibt keine offiziellen Kalenderdateien für
 * die UCI-Weltcups, Crankworx oder Taichung Bike Week -- nur Webseiten, die
 * jedes Jahr anders aufgebaut sind. Ein Abruf würde also genau dann scheitern,
 * wenn es darauf ankommt: kurz vor dem Termin.
 *
 * Deshalb sind die Termine hier fest hinterlegt und einzeln an der offiziellen
 * Quelle nachgeschlagen (Stand siehe COMPILED_ON). Das kostet nichts, braucht
 * kein Konto, funktioniert offline und ist sofort da.
 *
 * Aktualisiert wird der Kalender über `eas update` -- dieselbe Leitung, über
 * die Atze die App bekommt. Er muss dafür nichts installieren; die neue
 * Terminliste ist beim nächsten Öffnen da.
 *
 * `confirmed: false` heißt: Termin gefunden, aber die Quellen widersprachen
 * sich um einen Tag oder die offizielle Seite war noch nicht aktualisiert. Die
 * App zeigt solche Termine mit Hinweis an -- ein unsicherer Termin ist besser
 * als ein fehlender, weil das ganze Problem lautet: „Die habe ich verpasst."
 */

/** Wann diese Liste zuletzt an den offiziellen Quellen geprüft wurde. */
export const COMPILED_ON = '2026-08-09';

/**
 * Ab wann die App darauf hinweist, dass der Kalender nachgeführt werden sollte.
 * Bewusst nicht als Fehler: Ein alter Kalender ist immer noch nützlich, er
 * wird nur dünner. Der Hinweis ist an Atze gerichtet, nicht an das Programm.
 */
export const STALE_AFTER_DAYS = 120;

                       
                                            
          
                                                
                  
                                       
              
                                
           

                            
             
               
                                                                               
                  
                 
                  
                                                                               
                
              
                   
              
                                                          
                         
                                                                              
                     
                
 

/**
 * Reihenfolge in der Liste egal -- sortiert wird beim Anzeigen.
 * Jeder Eintrag wurde am 09.08.2026 an der offiziellen Seite nachgeschlagen.
 */
export const EVENTS              = [
  // ============================================= MTB: Weltcup und Weltmeister
  {
    id: 'edr-morillon-2026',
    name: 'Enduro-Weltcup Morillon — Finale',
    series: 'UCI Enduro World Cup',
    topic: 'gravity',
    kind: 'race',
    start: '2026-08-14',
    end: '2026-08-16',
    location: 'Morillon, Haute-Savoie, Frankreich',
    url: 'https://www.ucimtbworldseries.com/events/haute-savoie-edr-2026',
    disciplines: ['Enduro'],
    confirmed: true,
    note: 'Saisonfinale der Enduro-Serie',
  },
  {
    id: 'wc-les-gets-2026',
    name: 'MTB-Weltcup Les Gets',
    series: 'UCI MTB World Series',
    topic: 'gravity',
    kind: 'race',
    start: '2026-08-21',
    end: '2026-08-23',
    location: 'Les Gets, Haute-Savoie, Frankreich',
    url: 'https://www.ucimtbworldseries.com/events/haute-savoie-2026',
    disciplines: ['Downhill', 'XCO', 'XCC'],
    confirmed: true,
  },
  {
    id: 'mtb-worlds-2026',
    name: 'MTB-Weltmeisterschaft Val di Sole',
    series: 'UCI Weltmeisterschaft',
    topic: 'gravity',
    kind: 'championship',
    start: '2026-08-25',
    end: '2026-08-30',
    location: 'Val di Sole, Trentino, Italien',
    url: 'https://www.valdisolebikeland.com',
    disciplines: ['Downhill', 'XCO', 'XCC', 'E-MTB', '4X'],
    confirmed: true,
    note: '17 Weltmeistertitel in sechs Tagen',
  },
  {
    id: 'wc-soldier-hollow-2026',
    name: 'MTB-Weltcup Soldier Hollow',
    series: 'UCI MTB World Series',
    topic: 'gravity',
    kind: 'race',
    start: '2026-09-19',
    end: '2026-09-20',
    location: 'Midway, Utah, USA',
    url: 'https://www.ucimtbworldseries.com/events/soldier-hollow-2026',
    disciplines: ['XCO', 'XCC'],
    confirmed: true,
  },
  {
    id: 'wc-whistler-2026',
    name: 'Downhill-Weltcup Whistler',
    series: 'UCI MTB World Series',
    topic: 'gravity',
    kind: 'race',
    start: '2026-09-25',
    end: '2026-09-27',
    location: 'Whistler, British Columbia, Kanada',
    url: 'https://www.ucimtbworldseries.com/events/whistler-2026',
    disciplines: ['Downhill'],
    confirmed: true,
    note: 'Reiner Downhill im Whistler Bike Park',
  },
  {
    id: 'wc-lake-placid-2026',
    name: 'MTB-Weltcup Lake Placid — Finale',
    series: 'UCI MTB World Series',
    topic: 'gravity',
    kind: 'race',
    start: '2026-10-02',
    end: '2026-10-04',
    location: 'Lake Placid, New York, USA',
    url: 'https://www.ucimtbworldseries.com/events/lake-placid-2026',
    disciplines: ['Downhill', 'XCO', 'XCC'],
    confirmed: true,
    note: 'Letzter Weltcup der Saison, Gesamtwertung fällt hier',
  },

  // ================================================= Crankworx und Freeride
  {
    id: 'crankworx-msa-2026',
    name: 'Crankworx Mont-Sainte-Anne — Grand Final',
    series: 'Crankworx World Tour',
    topic: 'gravity',
    kind: 'festival',
    start: '2026-09-03',
    end: '2026-09-07',
    location: 'Mont-Sainte-Anne, Québec, Kanada',
    url: 'https://www.crankworx.com/mont-sainte-anne/',
    disciplines: ['Slopestyle', 'Downhill', 'Pumptrack', 'Speed & Style'],
    confirmed: true,
    note: 'Finale der Crankworx-Saison, neuer Austragungsort',
  },
  {
    id: 'rampage-2026',
    name: 'Red Bull Rampage',
    topic: 'gravity',
    kind: 'festival',
    start: '2026-10-08',
    end: '2026-10-10',
    location: 'Virgin, Utah, USA',
    url: 'https://www.redbull.com/int-en/events/red-bull-rampage',
    disciplines: ['Freeride'],
    confirmed: true,
    note: '25. Ausgabe. Frauen am 8., Männer am 10. Oktober',
  },
  {
    id: 'hardline-bc-2026',
    name: 'Red Bull Hardline British Columbia',
    topic: 'gravity',
    kind: 'festival',
    start: '2026-10-16',
    end: '2026-10-17',
    location: 'Cypress Mountain, British Columbia, Kanada',
    url: 'https://www.redbull.com/int-en/events/red-bull-hardline-british-columbia',
    disciplines: ['Downhill'],
    confirmed: false,
    note: 'Neuer Austragungsort. Renntag laut Veranstalter 17.10., Angaben schwanken um einen Tag',
  },
  {
    id: 'crankworx-christchurch-2027',
    name: 'Crankworx Christchurch',
    series: 'Crankworx World Tour',
    topic: 'gravity',
    kind: 'festival',
    start: '2027-02-18',
    end: '2027-02-21',
    location: 'Christchurch, Neuseeland',
    url: 'https://www.crankworx.com/christchurch/',
    confirmed: true,
    note: 'Auftakt der Saison 2027',
  },
  {
    id: 'crankworx-rotorua-2027',
    name: 'Crankworx Rotorua',
    series: 'Crankworx World Tour',
    topic: 'gravity',
    kind: 'festival',
    start: '2027-03-10',
    end: '2027-03-14',
    location: 'Rotorua, Neuseeland',
    url: 'https://www.crankworx.com/rotorua/',
    confirmed: true,
  },

  // ======================================================= Straße: Rennsport
  {
    id: 'cyclassics-2026',
    name: 'Cyclassics Hamburg',
    series: 'UCI WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-08-16',
    end: '2026-08-16',
    location: 'Hamburg, Deutschland',
    url: 'https://www.cyclassics.de',
    confirmed: true,
    note: 'Einziges deutsches WorldTour-Eintagesrennen',
  },
  {
    id: 'renewi-2026',
    name: 'Renewi Tour',
    series: 'UCI WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-08-19',
    end: '2026-08-23',
    location: 'Diest bis Leuven, Belgien',
    url: 'https://www.renewitour.com',
    confirmed: true,
  },
  {
    id: 'deutschland-tour-2026',
    name: 'Deutschland Tour',
    topic: 'road',
    kind: 'race',
    start: '2026-08-19',
    end: '2026-08-23',
    location: 'Schwäbisch Hall und weitere, Deutschland',
    url: 'https://www.deutschland-tour.com',
    confirmed: true,
  },
  {
    id: 'tob-women-2026',
    name: 'Tour of Britain Women',
    series: 'UCI Women’s WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-08-20',
    end: '2026-08-23',
    location: 'Großbritannien',
    url: 'https://www.britishcycling.org.uk',
    confirmed: true,
  },
  {
    id: 'vuelta-2026',
    name: 'Vuelta a España',
    series: 'Grand Tour',
    topic: 'road',
    kind: 'race',
    start: '2026-08-22',
    end: '2026-09-13',
    location: 'Monaco bis Granada',
    url: 'https://www.lavuelta.es',
    confirmed: true,
    note: 'Große Landesrundfahrt über 23 Tage. Start ausnahmsweise in Monaco, Ziel in Granada',
  },
  {
    id: 'bretagne-classic-2026',
    name: 'Bretagne Classic Ouest-France',
    series: 'UCI WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-08-30',
    end: '2026-08-30',
    location: 'Plouay, Frankreich',
    url: 'https://www.bretagne-classic.fr',
    confirmed: true,
  },
  {
    id: 'tob-men-2026',
    name: 'Tour of Britain Men',
    topic: 'road',
    kind: 'race',
    start: '2026-09-02',
    end: '2026-09-06',
    location: 'Lincoln bis Earlston, Großbritannien',
    url: 'https://www.britishcycling.org.uk/tourofbritain',
    confirmed: true,
  },
  {
    id: 'romandie-fem-2026',
    name: 'Tour de Romandie Féminin',
    series: 'UCI Women’s WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-09-04',
    end: '2026-09-06',
    location: 'Romandie, Schweiz',
    url: 'https://www.tourderomandie.ch',
    confirmed: true,
  },
  {
    id: 'simac-2026',
    name: 'Simac Ladies Tour',
    series: 'UCI Women’s WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-09-09',
    end: '2026-09-13',
    location: 'Niederlande',
    url: 'https://www.simacladiestour.nl',
    confirmed: true,
  },
  {
    id: 'gp-quebec-2026',
    name: 'GP Cycliste de Québec',
    series: 'UCI WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-09-11',
    end: '2026-09-11',
    location: 'Québec, Kanada',
    url: 'https://gpcqm.ca',
    confirmed: true,
  },
  {
    id: 'gp-montreal-2026',
    name: 'GP Cycliste de Montréal',
    series: 'UCI WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-09-13',
    end: '2026-09-13',
    location: 'Montréal, Kanada',
    url: 'https://gpcqm.ca',
    confirmed: true,
  },
  {
    id: 'road-worlds-2026',
    name: 'Straßen-Weltmeisterschaft Montréal',
    series: 'UCI Weltmeisterschaft',
    topic: 'road',
    kind: 'championship',
    start: '2026-09-20',
    end: '2026-09-27',
    location: 'Montréal, Kanada',
    url: 'https://www.uci.org',
    confirmed: true,
    note: 'Straßenrennen und Zeitfahren, Männer und Frauen',
  },
  {
    id: 'cro-race-2026',
    name: 'CRO Race',
    topic: 'road',
    kind: 'race',
    start: '2026-09-22',
    end: '2026-09-27',
    location: 'Kroatien',
    url: 'https://crorace.com',
    confirmed: false,
    note: 'Termin aus dem Rennkalender, Veranstalterseite noch nicht aktualisiert',
  },
  {
    id: 'emilia-2026',
    name: 'Giro dell’Emilia',
    topic: 'road',
    kind: 'race',
    start: '2026-10-03',
    end: '2026-10-03',
    location: 'Bologna, Italien',
    url: 'https://www.procyclingstats.com/race/giro-dell-emilia/2026',
    confirmed: true,
  },
  {
    id: 'euro-champs-2026',
    name: 'Europameisterschaft Straße',
    series: 'UEC Europameisterschaft',
    topic: 'road',
    kind: 'championship',
    start: '2026-10-03',
    end: '2026-10-07',
    location: 'Ljubljana, Slowenien',
    url: 'https://www.uec.ch',
    confirmed: true,
    note: 'Heimrennen für Pogačar und Roglič',
  },
  {
    id: 'tre-valli-2026',
    name: 'Tre Valli Varesine',
    topic: 'road',
    kind: 'race',
    start: '2026-10-06',
    end: '2026-10-06',
    location: 'Varese, Italien',
    url: 'https://www.procyclingstats.com/race/tre-valli-varesine/2026',
    confirmed: true,
  },
  {
    id: 'gran-piemonte-2026',
    name: 'Gran Piemonte',
    topic: 'road',
    kind: 'race',
    start: '2026-10-08',
    end: '2026-10-08',
    location: 'Piemont, Italien',
    url: 'https://www.procyclingstats.com/race/gran-piemonte/2026',
    confirmed: true,
  },
  {
    id: 'lombardia-2026',
    name: 'Il Lombardia',
    series: 'Monument',
    topic: 'road',
    kind: 'race',
    start: '2026-10-10',
    end: '2026-10-10',
    location: 'Bergamo, Italien',
    url: 'https://www.illombardia.it',
    confirmed: true,
    note: 'Letztes Monument des Jahres, „Rennen der fallenden Blätter"',
  },
  {
    id: 'paris-tours-2026',
    name: 'Paris–Tours',
    topic: 'road',
    kind: 'race',
    start: '2026-10-11',
    end: '2026-10-11',
    location: 'Tours, Frankreich',
    url: 'https://www.procyclingstats.com/race/paris-tours/2026',
    confirmed: true,
  },
  {
    id: 'guangxi-2026',
    name: 'Tour of Guangxi',
    series: 'UCI WorldTour',
    topic: 'road',
    kind: 'race',
    start: '2026-10-13',
    end: '2026-10-18',
    location: 'Guangxi, China',
    url: 'https://www.uci.org',
    confirmed: true,
    note: 'Abschluss der WorldTour-Saison',
  },
  {
    id: 'cx-worldcup-start-2026',
    name: 'Cyclocross-Weltcup, Auftakt',
    series: 'UCI Cyclocross World Cup',
    topic: 'road',
    kind: 'race',
    start: '2026-11-27',
    end: '2026-11-27',
    location: 'Ostrava, Tschechien',
    url: 'https://www.uci.org',
    confirmed: true,
    note: 'Beginn der Querfeldein-Saison 2026/27',
  },
  {
    id: 'cx-worlds-2027',
    name: 'Cyclocross-Weltmeisterschaft',
    series: 'UCI Weltmeisterschaft',
    topic: 'road',
    kind: 'championship',
    start: '2027-01-29',
    end: '2027-01-31',
    location: 'Ostende, Belgien',
    url: 'https://www.uci.org',
    confirmed: true,
  },
  {
    id: 'tdf-2027',
    name: 'Tour de France',
    series: 'Grand Tour',
    topic: 'road',
    kind: 'race',
    start: '2027-07-02',
    end: '2027-07-25',
    location: 'Grand Départ Edinburgh, Schottland',
    url: 'https://www.letour.fr',
    confirmed: true,
    note: 'Start erstmals in Schottland. Streckenverlauf ab Etappe 4 kommt im Oktober 2026',
  },
  {
    id: 'giro-2027',
    name: 'Giro d’Italia',
    series: 'Grand Tour',
    topic: 'road',
    kind: 'race',
    start: '2027-05-08',
    end: '2027-05-30',
    location: 'Italien',
    url: 'https://www.giroditalia.it',
    confirmed: true,
    note: 'Startort noch nicht bekannt, Strecke kommt November 2026',
  },
  {
    id: 'super-worlds-2027',
    name: 'UCI Cycling World Championships',
    series: 'UCI Weltmeisterschaft',
    topic: 'road',
    kind: 'championship',
    start: '2027-08-24',
    end: '2027-09-05',
    location: 'Haute-Savoie, Frankreich',
    url: 'https://www.uci.org',
    confirmed: true,
    note: 'Alle Rad-Disziplinen in einer WM. Einzeltermine noch offen',
  },
  {
    id: 'vuelta-2027',
    name: 'Vuelta a España',
    series: 'Grand Tour',
    topic: 'road',
    kind: 'race',
    start: '2027-09-04',
    end: '2027-09-26',
    location: 'Spanien',
    url: 'https://www.lavuelta.es',
    confirmed: true,
    note: 'Wegen der Super-WM erstmals im September',
  },

  // ================================================== Gravel & Bikepacking
  {
    id: 'gravel-worlds-2026',
    name: 'Gravel-Weltmeisterschaft Nannup',
    series: 'UCI Weltmeisterschaft',
    topic: 'gravel',
    kind: 'championship',
    start: '2026-10-10',
    end: '2026-10-11',
    location: 'Nannup, Westaustralien',
    url: 'https://www.uci.org',
    confirmed: true,
  },

  // ============================================== Messen & Branchentreffen
  {
    id: 'made-2026',
    name: 'MADE Bike Show',
    topic: 'tech',
    kind: 'show',
    start: '2026-08-21',
    end: '2026-08-23',
    location: 'Portland, Oregon, USA',
    url: 'https://made.bike/',
    confirmed: true,
    note: 'Rahmenbau von Hand',
  },
  {
    id: 'bespoked-dresden-2026',
    name: 'Bespoked Dresden',
    topic: 'tech',
    kind: 'show',
    start: '2026-09-11',
    end: '2026-09-13',
    location: 'Dresden, Deutschland',
    url: 'https://bespoked.cc/shows/dresden',
    confirmed: true,
    note: 'Europas Schau für handgebaute Räder',
  },
  {
    id: 'taichung-bike-week-2026',
    name: 'Taichung Bike Week',
    topic: 'industry',
    kind: 'show',
    start: '2026-09-15',
    end: '2026-09-18',
    location: 'Taichung, Taiwan',
    url: 'https://www.tbw.com.tw/',
    confirmed: true,
    note: 'Wo die Zulieferer zeigen, was in den Rädern der nächsten Saison steckt',
  },
  {
    id: 'sea-otter-europe-2026',
    name: 'Sea Otter Europe',
    topic: 'tech',
    kind: 'show',
    start: '2026-09-18',
    end: '2026-09-20',
    location: 'Girona, Spanien',
    url: 'https://www.seaottereurope.com/',
    confirmed: true,
    note: 'Messe und Rennen zugleich',
  },
  {
    id: 'cargobike-festival-2026',
    name: 'International Cargo Bike Festival',
    topic: 'urban',
    kind: 'show',
    start: '2026-10-12',
    end: '2026-10-13',
    location: 'Utrecht, Niederlande',
    url: 'https://cargobikefestival.com/',
    confirmed: true,
    note: 'Das Lastenrad-Treffen in Europa',
  },
  {
    id: 'e4-testival-2026',
    name: 'e4 Testival',
    topic: 'ebike',
    kind: 'show',
    start: '2026-10-16',
    end: '2026-10-18',
    location: 'Hockenheimring, Deutschland',
    url: 'https://www.e4testival.com/',
    confirmed: true,
    note: 'E-Bikes selbst fahren, nicht nur ansehen',
  },
  {
    id: 'bespoked-osaka-2026',
    name: 'Bespoked Osaka',
    topic: 'tech',
    kind: 'show',
    start: '2026-10-23',
    end: '2026-10-25',
    location: 'Osaka, Japan',
    url: 'https://bespoked.cc/',
    confirmed: true,
  },
  {
    id: 'corebike-2027',
    name: 'COREbike',
    topic: 'industry',
    kind: 'show',
    start: '2027-02-21',
    end: '2027-02-23',
    location: 'Towcester, Großbritannien',
    url: 'https://www.corebike.co.uk/',
    confirmed: true,
  },
  {
    id: 'fahrrad-essen-2027',
    name: 'Fahrrad Essen',
    topic: 'urban',
    kind: 'show',
    start: '2027-02-25',
    end: '2027-02-28',
    location: 'Messe Essen, Deutschland',
    url: 'https://www.fahrrad-essen.de/',
    confirmed: true,
    note: 'Publikumsmesse',
  },
  {
    id: 'cyclingworld-2027',
    name: 'Cyclingworld Europe',
    topic: 'urban',
    kind: 'show',
    start: '2027-03-12',
    end: '2027-03-14',
    location: 'Areal Böhler, Düsseldorf',
    url: 'https://cyclingworld.de/',
    confirmed: true,
  },
  {
    id: 'taipei-cycle-2027',
    name: 'Taipei Cycle Show',
    topic: 'industry',
    kind: 'show',
    start: '2027-03-24',
    end: '2027-03-27',
    location: 'Taipei, Taiwan',
    url: 'https://www.taipeicycle.com.tw/',
    confirmed: true,
  },
  {
    id: 'veloberlin-2027',
    name: 'VELOBerlin',
    topic: 'urban',
    kind: 'show',
    start: '2027-04-10',
    end: '2027-04-11',
    location: 'Flughafen Tempelhof, Berlin',
    url: 'https://veloberlin.com/',
    confirmed: true,
  },
  {
    id: 'sea-otter-classic-2027',
    name: 'Sea Otter Classic',
    topic: 'tech',
    kind: 'show',
    start: '2027-04-15',
    end: '2027-04-18',
    location: 'Monterey, Kalifornien, USA',
    url: 'https://www.seaotterclassic.com/',
    confirmed: true,
  },
  {
    id: 'ebikedays-2027',
    name: 'E-Bike Days München',
    topic: 'ebike',
    kind: 'show',
    start: '2027-04-23',
    end: '2027-04-25',
    location: 'Olympiapark, München',
    url: 'https://ebikedays.de/',
    confirmed: true,
  },
  {
    id: 'eurobike-2027',
    name: 'Eurobike',
    topic: 'industry',
    kind: 'show',
    start: '2027-09-01',
    end: '2027-09-03',
    location: 'Messe Frankfurt, Deutschland',
    url: 'https://eurobike.com',
    confirmed: true,
    note: 'Ab 2027 nur noch für die Branche, kein Publikumstag. Danach Pause bis 2029',
  },
  {
    id: 'towards-tomorrow-2027',
    name: 'towards tomorrow — European Bike Show',
    topic: 'industry',
    kind: 'show',
    start: '2027-09-06',
    end: '2027-09-08',
    location: 'Koelnmesse, Köln',
    url: 'https://show.twrds.com',
    confirmed: true,
    note: 'Neue Messe des deutschen Branchenverbands, Konkurrenz zur Eurobike',
  },
  {
    id: 'cycleexpo-amsterdam-2027',
    name: 'CycleExpo Amsterdam',
    topic: 'industry',
    kind: 'show',
    start: '2027-10-06',
    end: '2027-10-08',
    location: 'Vijfhuizen bei Amsterdam, Niederlande',
    url: 'https://nieuwsfiets.nu/cycle-expo/',
    confirmed: true,
  },
];

// =========================================================== Hilfsfunktionen

/**
 * `YYYY-MM-DD` als *lokale* Mitternacht.
 *
 * Wichtig: `new Date('2026-08-21')` liest den String als UTC. Westlich von
 * Greenwich wird daraus der 20. August -- der Termin wäre einen Tag zu früh.
 * Ganztägige Termine haben keine Uhrzeit, also müssen sie lokal gebaut werden.
 */
export function parseDay(day        )       {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Mitternacht des Tages, auf den `at` fällt -- lokal. */
function startOfDay(at      )       {
  return new Date(at.getFullYear(), at.getMonth(), at.getDate());
}

/** Ganze Tage von heute bis zum Termin. 0 = heute, negativ = vorbei. */
export function daysUntil(day        , now = new Date())         {
  const diff = parseDay(day).getTime() - startOfDay(now).getTime();
  return Math.round(diff / 86_400_000);
}

                                                         

export function stateOf(event           , now = new Date())             {
  if (daysUntil(event.end, now) < 0) return 'past';
  if (daysUntil(event.start, now) <= 0) return 'running';
  return 'upcoming';
}

/** Bei mehrtägigen Terminen: „Tag 3 von 23", sonst null. */
export function dayOfEvent(event           , now = new Date())                                        {
  const total = daysUntil(event.end, now) - daysUntil(event.start, now) + 1;
  if (total <= 1) return null;
  if (stateOf(event, now) !== 'running') return null;
  return { day: 1 - daysUntil(event.start, now), total };
}

/**
 * Alles, was noch kommt oder gerade läuft -- nach Datum sortiert.
 * Laufende Termine stehen vorn, denn die sind gerade die Nachricht.
 */
export function upcoming(now = new Date(), topics            )              {
  return EVENTS.filter((e) => stateOf(e, now) !== 'past')
    .filter((e) => !topics || topics.includes(e.topic))
    .sort((a, b) => {
      const sa = stateOf(a, now) === 'running' ? 0 : 1;
      const sb = stateOf(b, now) === 'running' ? 0 : 1;
      if (sa !== sb) return sa - sb;
      if (a.start !== b.start) return a.start < b.start ? -1 : 1;
      return a.end < b.end ? -1 : 1;
    });
}

/**
 * Was jetzt läuft oder in den nächsten `days` Tagen beginnt. Das ist die
 * Auswahl für den Streifen über der Frontpage -- der eigentliche Grund für
 * das ganze Bauteil: Atze soll nichts mehr verpassen, ohne den Kalender
 * überhaupt zu öffnen.
 */
export function soon(now = new Date(), days = 10)              {
  return upcoming(now).filter((e) => daysUntil(e.start, now) <= days);
}

/** Für die Anzeige gruppiert: „August 2026", „September 2026", ... */
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export function monthLabel(day        )         {
  const d = parseDay(day);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function groupByMonth(events             )                                                {
  const out                                                = [];
  for (const event of events) {
    const label = monthLabel(event.start);
    const last = out[out.length - 1];
    if (last && last.label === label) last.events.push(event);
    else out.push({ label, events: [event] });
  }
  return out;
}

/** Datumsangabe, wie ein Mensch sie schreibt: „21.–23. August". */
export function formatRange(event           )         {
  const a = parseDay(event.start);
  const b = parseDay(event.end);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const mA = MONTHS[a.getMonth()];
  const mB = MONTHS[b.getMonth()];
  const yearB = b.getFullYear() !== new Date().getFullYear() ? ` ${b.getFullYear()}` : '';
  if (event.start === event.end) return `${a.getDate()}. ${mA}${yearB}`;
  if (sameMonth) return `${a.getDate()}.–${b.getDate()}. ${mA}${yearB}`;
  return `${a.getDate()}. ${mA} – ${b.getDate()}. ${mB}${yearB}`;
}

/** „heute", „morgen", „in 5 Tagen", „läuft: Tag 3 von 23". */
export function countdownLabel(event           , now = new Date())         {
  const state = stateOf(event, now);
  if (state === 'running') {
    const d = dayOfEvent(event, now);
    return d ? `läuft — Tag ${d.day} von ${d.total}` : 'heute';
  }
  const days = daysUntil(event.start, now);
  if (days === 1) return 'morgen';
  if (days <= 7) return `in ${days} Tagen`;
  if (days <= 13) return 'nächste Woche';
  const weeks = Math.round(days / 7);
  if (days <= 60) return `in ${weeks} Wochen`;
  return `in ${Math.round(days / 30.5)} Monaten`;
}

/**
 * Ist der Kalender noch aktuell? Zwei Anzeichen: Er wurde lange nicht
 * nachgeführt, oder es sind kaum noch Termine übrig. Beides ist ein Hinweis
 * an Atze, keine Störung -- ein dünner Kalender funktioniert weiter.
 */
export function calendarStatus(now = new Date())   
                 
                  
                    
  {
  const ageDays = -daysUntil(COMPILED_ON, now);
  const remaining = upcoming(now).length;
  return { stale: ageDays > STALE_AFTER_DAYS || remaining < 5, ageDays, remaining };
}
