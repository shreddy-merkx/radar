                                                      

export const TOPICS          = [
  { id: 'road', label: 'Straße & Rennsport', short: 'Rennsport', accent: '#dc2626' },
  { id: 'gravity', label: 'MTB & Gravity', short: 'MTB', accent: '#7c3aed' },
  { id: 'ebike', label: 'E-Bike & E-MTB', short: 'E-Bike', accent: '#059669' },
  { id: 'tech', label: 'Technik & Neuheiten', short: 'Technik', accent: '#2563eb' },
  { id: 'gravel', label: 'Gravel & Bikepacking', short: 'Gravel', accent: '#b45309' },
  { id: 'urban', label: 'Alltag, Cargo & Verkehr', short: 'Alltag', accent: '#0891b2' },
  { id: 'scene', label: 'Szene & Videos', short: 'Szene', accent: '#db2777' },
  { id: 'industry', label: 'Branche & Business', short: 'Branche', accent: '#65758b' },
  { id: 'belt', label: 'Riemen & Getriebe', short: 'Riemen', accent: '#4d7c0f' },
];

export const TOPIC_BY_ID                         = TOPICS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {}                          ,
);

/**
 * Die Quellenliste.
 *
 * Jede URL wurde am 30.07.2026 einzeln angeklopft. Was nicht antwortete, steht
 * nicht drin -- die Liste ist geprüft, nicht geraten. Ausnahme sind die
 * YouTube-Feeds: die sperrt YouTube gegen automatisiertes Prüfen aus, dort
 * wurde stattdessen jede Kanal-ID einzeln auf der Kanalseite verifiziert.
 *
 * `defaultOn: false` heißt: vorhanden, aber erst mal aus. Das sind meist
 * englische Zweitausgaben deutscher Magazine oder sehr breite Quellen, die
 * viel Rauschen mitbringen.
 */
export const SOURCES           = [
  // ======================================================= Straße & Rennsport
  { id: 'cyclingnews', name: 'Cyclingnews', url: 'https://www.cyclingnews.com/rss/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, note: 'sehr hohe Frequenz' },
  { id: 'radsport-news', name: 'Radsport-News', url: 'https://www.radsport-news.com/rss.xml', topic: 'road', lang: 'de', kind: 'article', defaultOn: true, note: 'stündlich aktualisiert' },
  { id: 'escape', name: 'Escape Collective', url: 'https://escapecollective.com/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, note: 'früheres CyclingTips-Team' },
  { id: 'roadcc', name: 'road.cc', url: 'https://road.cc/feed', topic: 'road', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'inrng', name: 'INRNG', url: 'https://inrng.com/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, note: 'Analyse und Hintergrund' },
  { id: 'cyclingweekly', name: 'Cycling Weekly', url: 'https://www.cyclingweekly.com/rss', topic: 'road', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'sportschau', name: 'Sportschau Radsport', url: 'https://www.sportschau.de/radsport/index~rss2.xml', topic: 'road', lang: 'de', kind: 'article', defaultOn: true, note: 'ARD' },
  { id: 'pez', name: 'PezCyclingNews', url: 'https://www.pezcyclingnews.com/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'roadcycling-de', name: 'roadcycling.de', url: 'https://roadcycling.de/feed', topic: 'road', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'radsport-rennrad', name: 'RennRad Magazin', url: 'https://www.radsport-rennrad.de/feed/', topic: 'road', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'gcn-web', name: 'GCN', url: 'https://www.gcn.com/feed', topic: 'road', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'cyclingmag-ca', name: 'Cycling Magazine', url: 'https://cyclingmagazine.ca/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, note: 'kanadisch' },
  { id: 'ridemedia', name: 'RIDE Media', url: 'https://www.ridemedia.com.au/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, note: 'australisch' },
  { id: 'yahoo-cycling', name: 'Yahoo Radsport', url: 'https://sports.yahoo.com/cycling/rss', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, note: 'Agenturmeldungen' },

  // ============================================================ MTB & Gravity
  { id: 'pinkbike', name: 'Pinkbike', url: 'https://www.pinkbike.com/pinkbike_xml_feed.php', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, note: 'Weltcup, DH, Enduro' },
  { id: 'mtb-news', name: 'MTB-News', url: 'https://www.mtb-news.de/news/feed/', topic: 'gravity', lang: 'de', kind: 'article', defaultOn: true, note: 'größtes deutsches MTB-Portal' },
  { id: 'enduro-mtb-de', name: 'ENDURO Magazin', url: 'https://enduro-mtb.com/feed/', topic: 'gravity', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'nsmb', name: 'NSMB', url: 'https://nsmb.com/rss/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, note: 'North Shore, Freeride' },
  { id: 'singletracks', name: 'Singletracks', url: 'https://www.singletracks.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'singletrackworld', name: 'Singletrack World', url: 'https://singletrackworld.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, note: 'UK' },
  { id: 'flowmtb', name: 'Flow Mountain Bike', url: 'https://flowmountainbike.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'mbr', name: 'MBR', url: 'https://www.mbr.co.uk/feed', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, note: 'UK Trail und Enduro' },
  { id: 'dirtmtb', name: 'Dirt Mountain Bike', url: 'https://www.dirtmountainbike.com/feed', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, note: 'Downhill und Freeride' },
  { id: 'mbaction', name: 'Mountain Bike Action', url: 'https://www.mbaction.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'bikemag', name: 'Bike Magazine', url: 'https://www.bikemag.com/feed', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'imbikemag', name: 'IMB Magazine', url: 'https://www.imbikemag.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false, note: 'Freeride-Reportagen' },
  { id: 'pedalmag', name: 'Pedal Magazine', url: 'https://www.pedalmag.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false },
  { id: 'enduro-mtb-en', name: 'ENDURO Magazine EN', url: 'https://enduro-mtb.com/en/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false, note: 'englische Ausgabe' },

  // ========================================================== E-Bike & E-MTB
  { id: 'wattmoves', name: 'Wattmoves', url: 'https://wattmoves.de/feed', topic: 'ebike', lang: 'de', kind: 'article', defaultOn: true, note: 'früher ebike-news.de' },
  { id: 'ebike-mtb-de', name: 'E-MOUNTAINBIKE', url: 'https://ebike-mtb.com/feed/', topic: 'ebike', lang: 'de', kind: 'article', defaultOn: true, note: 'E-MTB-Tests' },
  { id: 'emtb-news', name: 'eMTB-News', url: 'https://www.emtb-news.de/news/feed/', topic: 'ebike', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'pedelec-efahrrad', name: 'Pedelec & Elektrorad', url: 'https://www.pedelec-elektro-fahrrad.de/feed', topic: 'ebike', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'electricbikereport', name: 'Electric Bike Report', url: 'https://www.electricbikereport.com/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'electrek-ebike', name: 'Electrek E-Bikes', url: 'https://electrek.co/guides/electric-bike/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: true, note: 'nur E-Bike-Rubrik' },
  { id: 'electricbike-com', name: 'ElectricBike.com', url: 'https://www.electricbike.com/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: false },
  { id: 'ebike-mtb-en', name: 'E-MOUNTAINBIKE EN', url: 'https://ebike-mtb.com/en/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: false, note: 'englische Ausgabe' },
  { id: 'electrive', name: 'electrive', url: 'https://www.electrive.net/feed/', topic: 'ebike', lang: 'de', kind: 'article', defaultOn: false, note: 'E-Mobilität allgemein, viel Auto' },
  { id: 'electrek', name: 'Electrek', url: 'https://electrek.co/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: false, note: 'sehr breit, viel Auto' },

  // ====================================================== Technik & Neuheiten
  { id: 'velomotion', name: 'Velomotion', url: 'https://www.velomotion.de/feed/', topic: 'tech', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'rennrad-news', name: 'Rennrad-News', url: 'https://www.rennrad-news.de/news/feed/', topic: 'tech', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'granfondo', name: 'GRAN FONDO', url: 'https://granfondo-cycling.com/feed/', topic: 'tech', lang: 'en', kind: 'article', defaultOn: true, note: 'Rennrad- und Gravel-Tests' },
  { id: 'radfahren-de', name: 'RADfahren.de', url: 'https://www.radfahren.de/feed/', topic: 'tech', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'dcrainmaker', name: 'DC Rainmaker', url: 'https://www.dcrainmaker.com/feed', topic: 'tech', lang: 'en', kind: 'article', defaultOn: true, note: 'GPS, Sensoren, Gadgets' },
  { id: 'gearjunkie', name: 'GearJunkie Bike', url: 'https://www.gearjunkie.com/biking/feed', topic: 'tech', lang: 'en', kind: 'article', defaultOn: false },

  // ==================================================== Gravel & Bikepacking
  { id: 'bikepacking-com', name: 'Bikepacking.com', url: 'https://bikepacking.com/feed/', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'radavist', name: 'The Radavist', url: 'https://theradavist.com/feed/', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: true, note: 'Abenteuer- und Gravelkultur' },
  { id: 'gravelcyclist', name: 'Gravel Cyclist', url: 'https://www.gravelcyclist.com/feed/', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: true },
  { id: 'cyclingabout', name: 'CyclingAbout', url: 'https://www.cyclingabout.com/feed/', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: true, note: 'Radreise-Technik' },
  { id: 'adventurecycling', name: 'Adventure Cycling', url: 'https://www.adventurecycling.org/feed', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: false, note: 'Routen USA' },

  // ============================================== Alltag, Cargo & Verkehr
  { id: 'zukunft-mobilitaet', name: 'Zukunft Mobilität', url: 'https://www.zukunft-mobilitaet.net/feed/', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'cargobike-jetzt', name: 'cargobike.jetzt', url: 'https://cargobike.jetzt/feed/', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true, note: 'Lastenrad-Magazin' },
  { id: 'adfc', name: 'ADFC', url: 'https://www.adfc.de/rss', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true, note: 'Verband, Politik' },
  { id: 'rad-spannerei', name: 'Rad-Spannerei', url: 'https://www.rad-spannerei.de/feed', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true, note: 'Berliner Radblog' },
  { id: 'fahrradzukunft', name: 'Fahrradzukunft', url: 'https://www.fahrradzukunft.de/feed', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'lastenradtest', name: 'Lastenradtest', url: 'https://www.lastenradtest.de/feed', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'velostrom', name: 'Velostrom', url: 'https://www.velostrom.de/feed', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true, note: 'Pedelecs im Alltag' },
  { id: 'velophil', name: 'Velophil', url: 'https://velophil.wordpress.com/feed/', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'bicycledutch', name: 'BicycleDutch', url: 'https://bicycledutch.wordpress.com/feed/', topic: 'urban', lang: 'en', kind: 'article', defaultOn: true, note: 'NL-Radinfrastruktur' },
  { id: 'bikeportland', name: 'BikePortland', url: 'https://bikeportland.org/feed', topic: 'urban', lang: 'en', kind: 'article', defaultOn: false },
  { id: 'streetsblog', name: 'Streetsblog USA', url: 'https://usa.streetsblog.org/feed', topic: 'urban', lang: 'en', kind: 'article', defaultOn: false, note: 'Stadtverkehr USA' },

  // ======================================================= Branche & Business
  { id: 'pd-f', name: 'pressedienst-fahrrad', url: 'https://www.pd-f.de/feed', topic: 'industry', lang: 'de', kind: 'article', defaultOn: true },
  { id: 'bike-eu', name: 'Bike Europe', url: 'https://www.bike-eu.com/rss.xml', topic: 'industry', lang: 'en', kind: 'article', defaultOn: true, note: 'europäischer Branchendienst' },
  { id: 'bicycleretailer', name: 'Bicycle Retailer', url: 'https://www.bicycleretailer.com/rss.xml', topic: 'industry', lang: 'en', kind: 'article', defaultOn: true, note: 'US-Handel' },
  { id: 'bikebiz', name: 'BikeBiz', url: 'https://www.bikebiz.com/feed/', topic: 'industry', lang: 'en', kind: 'article', defaultOn: true, note: 'UK-Branche' },

  // =========================================================== Szene & Videos
  // YouTube-Kanäle. Jede Kanal-ID wurde einzeln auf der Kanalseite geprüft.
  { id: 'yt-sampilgrim', name: 'Sam Pilgrim', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC-WMwOzgFdvvGVLB1EZ-n-w', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Freeride und Dirtjump' },
  { id: 'yt-wibmer', name: 'Fabio Wibmer', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHOtaAJCOBDUWIcL4372D9A', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-macaskill', name: 'Danny MacAskill', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC9kOkY1nYc0uADWRiRH64Rw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-gmbn', name: 'GMBN', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_A--fhX5gea0i4UtpD99Gg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-gmbn-tech', name: 'GMBN Tech', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC6juisijUAHcJLt23nk-qOQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-gcn', name: 'GCN', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCuTaETsuCOkJ0H_GAztWt0Q', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-gcn-tech', name: 'GCN Tech', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC710HJmp-YgNbE5BnFBRoeg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-gcn-racing', name: 'GCN Racing', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCu7phdCr-raU7OaJfEpHZww', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-pinkbike', name: 'Pinkbike Video', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC2GIHZpQiJy-8286f4lj_cg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-vitalmtb', name: 'Vital MTB', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcX5xwMOCt92bi0dmspMFQw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-bermpeak', name: 'Berm Peak', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCu8YylsPiu9XfaQC74Hr_Gw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Seth Alvo' },
  { id: 'yt-metailler', name: 'Remy Metailler', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_wCbFZHCh9amfaXXI4yq_g', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-mattjones', name: 'Matt Jones', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXEuQ_O6BUWwhVhcMyXNHgg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Slopestyle' },
  { id: 'yt-ifht', name: 'IFHT Films', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCTs59UCfP4YLUt6pDR_uLtg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'MTB-Comedy' },
  { id: 'yt-cammccaul', name: 'Cam McCaul', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOEqrlL-PJSmbM9G2fNsDYQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-blakesamson', name: 'Blake Samson', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC_zstLykto7PXTChvKEVTxA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-bermpeakexpress', name: 'Berm Peak Express', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOpP5PqrzODWpFU961acUbg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Zweitkanal' },
  { id: 'yt-dylanjohnson', name: 'Dylan Johnson', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCIf1xvRN8pzyd_VfLgj_dow', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Training nach Studienlage' },
  { id: 'yt-cade', name: 'CADE Media', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCHyBWpfAggsFPDc5A7l_eWA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Francis Cade' },
  { id: 'yt-peaktorque', name: 'Peak Torque', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC08mbQ8UIX8DXSBFBO9VaZw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Technik, kritisch' },
  { id: 'yt-hambini', name: 'Hambini', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCH9263dSaOHFe25dkyGAu3Q', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Ingenieur, sehr direkt' },
  { id: 'yt-escape', name: 'Escape Collective TV', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCilIX8wRR2HPEMzICtJ0j0Q', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },

  // ---- Weitere YouTube-Kanäle. Jede Kanal-ID einzeln auf der Kanalseite
  // ---- geprüft (02.08.2026); die Feed-URL selbst lässt YouTube nicht prüfen.

  // Gravity, Freeride, Weltcup-Fahrer
  { id: 'yt-elias', name: 'Elias Schwärzler', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCGWOKYF5sq1iDkiScn-krPw', topic: 'scene', lang: 'de', kind: 'video', defaultOn: true, note: 'deutschsprachig, Freeride' },
  { id: 'yt-fedko', name: 'Erik Fedko', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCLKk2L-EGzM9V-_V-6Dla7Q', topic: 'scene', lang: 'de', kind: 'video', defaultOn: true },
  { id: 'yt-emiljohansson', name: 'Emil Johansson', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCkxrWMzwWUoro3O09HvK2og', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Slopestyle-Dominator' },
  { id: 'yt-wyntv', name: 'Wyn TV', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCtvJR7iamL8WFAbvpsC2HTw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Wyn Masters, Weltcup-Backstage' },
  { id: 'yt-cathro', name: 'Ben Cathro', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqfVn_4SrTEx4q1OrV1prdg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Streckenanalysen' },
  { id: 'yt-melamed', name: 'Jesse Melamed', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7_D8wURZlvm9CmbH_fiU3g', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Enduro' },
  { id: 'yt-bvs', name: 'Bas van Steenbergen', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCimXveJOKeC3uCB1HnzghfA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-atwill', name: 'Phil Atwill', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCrvCciHxaZAckfRbt7tj1cQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Downhill' },
  { id: 'yt-bruni', name: 'Loïc Bruni', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC-o6vRC2OGxRtA46RVjKXcA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'DH-Weltmeister' },
  { id: 'yt-samreynolds', name: 'Sam Reynolds', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCMWiyxWqrBPboOgrcy2qauA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Freeride, Rampage' },
  { id: 'yt-moimoi', name: 'Moi Moi TV', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCd77cWCYmO6alSLXXRHMoqw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Jack Moir' },
  { id: 'yt-skillswithphil', name: 'Skills With Phil', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC0QuCui5pNF9k9fiNXkqn_w', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-zink', name: 'Cam Zink', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCFqHdCbgU7HoE7_KCeAupPA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-akrigg', name: 'Chris Akrigg', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC4Yg8PeTxqfxyFZ1ykpjJpg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'selten, dafür legendär' },
  { id: 'yt-ashton', name: 'Martyn Ashton', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNsIPYdzsOI3UX9tpIp77CA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-ollywilkins', name: 'Olly Wilkins', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCyfc14ky-t7yZTQ3qkfziwg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-revelco', name: 'Revel Co.', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCBxNnvSOlGM_8t025f2ZDcQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Semenuk-Filme, Kanal ruht seit 2022' },

  // Rennen, Veranstalter, Marken
  { id: 'yt-redbullbike', name: 'Red Bull Bike', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXqlds5f7B2OOs9vQuevl4A', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Rampage, Hardline' },
  { id: 'yt-ucimtb', name: 'UCI MTB World Series', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCWS4nfoou79mwo9nHew49fA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Weltcup-Höhepunkte' },
  { id: 'yt-ytindustries', name: 'YT Industries', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYrqIUqyHKK-9Amfs8tse5w', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-canyon', name: 'Canyon', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCdzosDmAxO6fVDypgBEkLOQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },
  { id: 'yt-santacruz', name: 'Santa Cruz Bicycles', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC-ZdOy00pTvliH3FtW_a_8g', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },
  { id: 'yt-specialized', name: 'Specialized', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcrBtxD8xy2cxeXM7f-xihA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },
  { id: 'yt-commencal', name: 'Commencal', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCuq_rlDQhP5r-vsnYxr-sSg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },
  { id: 'yt-propain', name: 'Propain Bicycles', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXWI7f24tp8t3Yn1o_iBzYg', topic: 'scene', lang: 'de', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },
  { id: 'yt-trek', name: 'Trek Bicycle', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCD9U24ny8q-mh25gCWfjV9g', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },
  { id: 'yt-rockymountain', name: 'Rocky Mountain', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCx84hDAltuLtj1zjX1f2aAA', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Herstellerkanal' },

  // Straße, Gravel, Technik auf YouTube
  { id: 'yt-bikeradar', name: 'BikeRadar', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCyrQSvn6_25rINepVZ6H0qQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'RSS-Feed ist tot, YouTube läuft' },
  { id: 'yt-cyclingweekly', name: 'Cycling Weekly TV', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC2zZkTwX2DtWeBCMdhk6AQQ', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true },
  { id: 'yt-ef', name: 'EF Pro Cycling', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCc1lFRTifsxsW3-QzFN-Eaw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Team-Innenansichten' },
  { id: 'yt-safabrian', name: 'SAFA Brian', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCX1cKCS0LURMO1wQWLfeiUg', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-duzer', name: 'Ryan Van Duzer', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVcUzl95VwxrIEQnu9xI21g', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'Bikepacking' },
  { id: 'yt-camnicholls', name: 'Cam Nicholls', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCCkL8DHm5KSE5MiDWepOHUw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-tracevelo', name: 'Trace Velo', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCYuKCZ35_lrDmFj2gNuAwZw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-manoncarpenter', name: 'Manon Carpenter', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCvBsqDALUwfJl5Vtib9QMpw', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-kookaburra', name: 'Katie Kookaburra', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCCzN8KWKew4fp-AWIuE7E8A', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false },
  { id: 'yt-ferguson', name: 'Mark Ferguson', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCB5vTUmuLCWqiTRDOApgR-g', topic: 'scene', lang: 'en', kind: 'video', defaultOn: false, note: 'früher Cycling Maven' },

  // Deutschsprachige Kanäle
  { id: 'yt-mtbnews', name: 'MTB-News.de TV', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC77ZGc5WlPY-JtRk5TQWtQg', topic: 'scene', lang: 'de', kind: 'video', defaultOn: true },
  { id: 'yt-rennradnews', name: 'Rennrad-News TV', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC-DTgrwsmnJF2rJ6mrh8UDQ', topic: 'scene', lang: 'de', kind: 'video', defaultOn: true },
  { id: 'yt-bikemagazin', name: 'BIKE Magazin', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC5-lOvQcrBwzjBM4xHD8nDg', topic: 'scene', lang: 'de', kind: 'video', defaultOn: true },
  { id: 'yt-worldofmtb', name: 'world of mtb', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcQIWqHCp4JTHO_nSbnMO1A', topic: 'scene', lang: 'de', kind: 'video', defaultOn: true },
  { id: 'yt-schurter', name: 'Nino Schurter', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCOTDjUtlQSI_N7ZWioe65ww', topic: 'scene', lang: 'en', kind: 'video', defaultOn: true, note: 'Cross-Country-Rekordweltmeister' },
  { id: 'yt-fahrradxxl', name: 'Fahrrad XXL', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCiebzeDrWcWiRGKMvFki1uw', topic: 'scene', lang: 'de', kind: 'video', defaultOn: false, note: 'Händlerkanal' },
  { id: 'yt-bikediscount', name: 'Bike-Discount', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCu-wUGvfXh5R7kjQYoB4yfA', topic: 'scene', lang: 'de', kind: 'video', defaultOn: false, note: 'Händlerkanal' },
  { id: 'yt-gegenheimer', name: 'Simon Gegenheimer', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCo-FU9nogpQeBNNCmtpXC9w', topic: 'scene', lang: 'de', kind: 'video', defaultOn: false },
  { id: 'yt-lakata', name: 'Alban Lakata', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCfU_AQ5BLHYGsG_VXTQhkew', topic: 'scene', lang: 'de', kind: 'video', defaultOn: false },
  { id: 'yt-fabioschaefer', name: 'Fabio Schäfer', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCnDquwyoD2AJwGXym_vezHg', topic: 'scene', lang: 'de', kind: 'video', defaultOn: false },

  // Foren -- was die Szene gerade diskutiert.
  { id: 'forum-mtb-news', name: 'MTB-News Forum', url: 'https://www.mtb-news.de/forum/forums/-/index.rss', topic: 'scene', lang: 'de', kind: 'community', defaultOn: false, note: 'sehr hohe Frequenz' },
  { id: 'forum-rennrad-news', name: 'Rennrad-News Forum', url: 'https://www.rennrad-news.de/forum/forums/-/index.rss', topic: 'scene', lang: 'de', kind: 'community', defaultOn: false, note: 'sehr hohe Frequenz' },
  { id: 'forum-pinkbike', name: 'Pinkbike Forum', url: 'https://www.pinkbike.com/rss/forum.rss', topic: 'scene', lang: 'en', kind: 'community', defaultOn: false, note: 'sehr hohe Frequenz' },

  // ======================================================================
  // Zweite Erweiterungsrunde (02.08.2026), `unverified: true`.
  //
  // Diese Feeds konnten nicht vorab angeklopft werden: Das Netz der
  // Entwicklungsumgebung beantwortete an diesem Tag *jeden* Feed-Abruf mit
  // „403 verboten" -- auch die 91 Quellen, die nachweislich laufen. Die
  // Sperre lag also am Testnetz, nicht an den Feeds.
  //
  // Statt sie deshalb weglassen zu müssen, prüft die App sie jetzt selbst:
  // Wer dreimal hintereinander nichts liefert, wird automatisch schlafen
  // gelegt und später erneut versucht (`src/health.ts`). Eine tote Quelle
  // kostet damit einmalig Ladezeit und verschwindet dann von allein.
  //
  // Bewusst *nicht* aufgenommen: BikeRadar, Vital MTB, bikerumor, velobiz,
  // cyclingindustry.news, Rouleur, Tour-Magazin und velo.outsideonline.
  // Deren Feeds wurden am 30.07.2026 bei funktionierendem Netz einzeln
  // geprüft und als tot bestätigt -- das war echte Prüfung, die gilt weiter.
  // ======================================================================

  // ---- Straße & Rennsport
  { id: 'cyclinguptodate', name: 'CyclingUpToDate', url: 'https://cyclinguptodate.com/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'stickybottle', name: 'Sticky Bottle', url: 'https://www.stickybottle.com/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Irland' },
  { id: 'wielerflits', name: 'WielerFlits', url: 'https://www.wielerflits.nl/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'niederländisch, sehr schnell' },
  { id: 'cyclist-uk', name: 'Cyclist', url: 'https://www.cyclist.co.uk/feed', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'bicycling-com', name: 'Bicycling', url: 'https://www.bicycling.com/rss/all.xml/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'USA' },
  { id: 'bbc-cycling', name: 'BBC Sport Radsport', url: 'https://feeds.bbci.co.uk/sport/cycling/rss.xml', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'rad-net', name: 'rad-net (BDR)', url: 'https://www.rad-net.de/rss/news.xml', topic: 'road', lang: 'de', kind: 'article', defaultOn: true, unverified: true, note: 'Bund Deutscher Radfahrer' },
  { id: 'domestique', name: 'Domestique', url: 'https://www.domestiquecycling.com/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'cyclingworld-de', name: 'Cyclingworld', url: 'https://cyclingworld.de/feed/', topic: 'road', lang: 'de', kind: 'article', defaultOn: true, unverified: true },
  { id: 'spaziociclismo', name: 'SpazioCiclismo', url: 'https://www.spaziociclismo.it/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'italienisch' },
  { id: 'directvelo', name: 'DirectVelo', url: 'https://www.directvelo.com/rss', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'französisch' },
  { id: 'velo101', name: 'Vélo 101', url: 'https://www.velo101.com/rss/actualites', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'französisch' },
  { id: 'tuttobiciweb', name: 'tuttoBICI', url: 'https://www.tuttobiciweb.it/rss', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'italienisch' },
  { id: 'indeleiderstrui', name: 'In de Leiderstrui', url: 'https://www.indeleiderstrui.nl/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'niederländisch' },
  { id: 'veloveritas', name: 'VeloVeritas', url: 'https://veloveritas.co.uk/feed/', topic: 'road', lang: 'en', kind: 'article', defaultOn: false, unverified: true },

  // ---- MTB & Gravity
  { id: 'freehub', name: 'Freehub Magazine', url: 'https://freehubmag.com/feed', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Reportagen, Bildstrecken' },
  { id: 'loamwolf', name: 'The Loam Wolf', url: 'https://theloamwolf.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Tests, Enduro' },
  { id: 'betamtb', name: 'Beta MTB', url: 'https://betamtb.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Nachfolger von Bike Mag' },
  { id: 'world-of-mtb', name: 'World of MTB', url: 'https://www.world-of-mtb.de/feed/', topic: 'gravity', lang: 'de', kind: 'article', defaultOn: true, unverified: true },
  { id: 'mountainbike-magazin', name: 'MOUNTAINBIKE Magazin', url: 'https://www.mountainbike-magazin.de/feed/', topic: 'gravity', lang: 'de', kind: 'article', defaultOn: true, unverified: true },
  { id: 'vojomag', name: 'Vojo Magazine', url: 'https://vojomag.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'französisch, Belgien' },
  { id: 'endurotribe', name: 'EnduroTribe', url: 'https://www.endurotribe.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'französisch' },
  { id: 'sicklines', name: 'Sicklines', url: 'https://www.sicklines.com/feed/', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'Downhill-Archiv' },
  { id: 'mtbr', name: 'MTBR', url: 'https://www.mtbr.com/feed', topic: 'gravity', lang: 'en', kind: 'article', defaultOn: false, unverified: true },

  // ---- E-Bike & E-MTB
  { id: 'ebiketips', name: 'eBikeTips', url: 'https://ebiketips.road.cc/feed', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'von road.cc' },
  { id: 'elektrobike-online', name: 'ElektroBIKE', url: 'https://www.elektrobike-online.com/feed/', topic: 'ebike', lang: 'de', kind: 'article', defaultOn: true, unverified: true },
  { id: 'electricbikeaction', name: 'Electric Bike Action', url: 'https://electricbikeaction.com/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'zagdaily', name: 'Zag Daily', url: 'https://zagdaily.com/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Mikromobilität, Branche' },
  { id: 'ebikechoices', name: 'eBike Choices', url: 'https://ebikechoices.com/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: false, unverified: true },
  { id: 'pedelecs-uk', name: 'Pedelecs UK', url: 'https://www.pedelecs.co.uk/feed/', topic: 'ebike', lang: 'en', kind: 'article', defaultOn: false, unverified: true },

  // ---- Technik & Neuheiten
  { id: 'zwiftinsider', name: 'Zwift Insider', url: 'https://zwiftinsider.com/feed/', topic: 'tech', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Indoor-Training' },
  { id: 'the5krunner', name: 'the5krunner', url: 'https://the5krunner.com/feed/', topic: 'tech', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'Sportuhren und Sensoren' },

  // ---- Gravel & Bikepacking
  { id: 'gravelunion', name: 'Gravel Union', url: 'https://gravelunion.cc/feed/', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'bikepackingroots', name: 'Bikepacking Roots', url: 'https://bikepackingroots.org/feed/', topic: 'gravel', lang: 'en', kind: 'article', defaultOn: true, unverified: true },
  { id: 'gravelbike-de', name: 'Gravelbike.de', url: 'https://www.gravelbike.de/feed/', topic: 'gravel', lang: 'de', kind: 'article', defaultOn: true, unverified: true },
  { id: 'komoot-blog', name: 'komoot Magazin', url: 'https://www.komoot.com/blog/feed/', topic: 'gravel', lang: 'de', kind: 'article', defaultOn: false, unverified: true, note: 'Routen und Touren' },

  // ---- Alltag, Cargo & Verkehr
  { id: 'momentummag', name: 'Momentum Mag', url: 'https://momentummag.com/feed/', topic: 'urban', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Alltagsradkultur' },
  { id: 'cyclinguk', name: 'Cycling UK', url: 'https://www.cyclinguk.org/rss.xml', topic: 'urban', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'Verband UK' },
  { id: 'changing-cities', name: 'Changing Cities', url: 'https://www.changing-cities.org/feed/', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true, unverified: true, note: 'Radentscheide' },
  { id: 'nrvp', name: 'Nationaler Radverkehrsplan', url: 'https://nationaler-radverkehrsplan.de/de/rss.xml', topic: 'urban', lang: 'de', kind: 'article', defaultOn: true, unverified: true, note: 'Bundesministerium' },
  { id: 'radlobby', name: 'Radlobby Österreich', url: 'https://www.radlobby.at/rss.xml', topic: 'urban', lang: 'de', kind: 'article', defaultOn: false, unverified: true },
  { id: 'lcc', name: 'London Cycling Campaign', url: 'https://lcc.org.uk/feed/', topic: 'urban', lang: 'en', kind: 'article', defaultOn: false, unverified: true },
  { id: 'streetsblog-nyc', name: 'Streetsblog NYC', url: 'https://nyc.streetsblog.org/feed', topic: 'urban', lang: 'en', kind: 'article', defaultOn: false, unverified: true },
  { id: 'bikesnob', name: 'Bike Snob NYC', url: 'https://bikesnobnyc.com/feed/', topic: 'urban', lang: 'en', kind: 'article', defaultOn: false, unverified: true, note: 'Kolumne, bissig' },

  // ---- Branche & Business
  { id: 'sazbike', name: 'SAZbike', url: 'https://www.sazbike.de/rss', topic: 'industry', lang: 'de', kind: 'article', defaultOn: true, unverified: true, note: 'deutscher Fachhandel' },
  { id: 'radmarkt', name: 'Radmarkt', url: 'https://www.radmarkt.de/feed/', topic: 'industry', lang: 'de', kind: 'article', defaultOn: true, unverified: true },
  { id: 'cyclingelectric', name: 'CyclingElectric', url: 'https://cyclingelectric.com/feed/', topic: 'industry', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'E-Bike-Branche' },

  // ---- Szene: Foren und Subreddits.
  // Reddit war bisher nicht drin, weil der Proxy es sperrte -- nicht weil es
  // kaputt ist. Auf dem Handy läuft es normal. Hier steckt das, was die Szene
  // wirklich gerade diskutiert.
  { id: 'r-mtb', name: 'r/MTB', url: 'https://www.reddit.com/r/MTB/.rss', topic: 'gravity', lang: 'en', kind: 'community', defaultOn: true, unverified: true },
  { id: 'r-peloton', name: 'r/peloton', url: 'https://www.reddit.com/r/peloton/.rss', topic: 'road', lang: 'en', kind: 'community', defaultOn: true, unverified: true, note: 'Profi-Radsport, sehr gut informiert' },
  { id: 'r-mtbde', name: 'r/MountainBiking', url: 'https://www.reddit.com/r/MountainBiking/.rss', topic: 'gravity', lang: 'en', kind: 'community', defaultOn: false, unverified: true },
  { id: 'r-downhill', name: 'r/Downhill', url: 'https://www.reddit.com/r/Downhill/.rss', topic: 'gravity', lang: 'en', kind: 'community', defaultOn: true, unverified: true },
  { id: 'r-ebikes', name: 'r/ebikes', url: 'https://www.reddit.com/r/ebikes/.rss', topic: 'ebike', lang: 'en', kind: 'community', defaultOn: true, unverified: true },
  { id: 'r-gravel', name: 'r/gravelcycling', url: 'https://www.reddit.com/r/gravelcycling/.rss', topic: 'gravel', lang: 'en', kind: 'community', defaultOn: true, unverified: true },
  { id: 'r-bikepacking', name: 'r/bikepacking', url: 'https://www.reddit.com/r/bikepacking/.rss', topic: 'gravel', lang: 'en', kind: 'community', defaultOn: true, unverified: true },
  { id: 'r-fahrrad', name: 'r/Fahrrad', url: 'https://www.reddit.com/r/Fahrrad/.rss', topic: 'urban', lang: 'de', kind: 'community', defaultOn: true, unverified: true, note: 'deutschsprachig' },
  { id: 'r-cargobike', name: 'r/cargobike', url: 'https://www.reddit.com/r/cargobike/.rss', topic: 'urban', lang: 'en', kind: 'community', defaultOn: false, unverified: true },
  { id: 'r-velo', name: 'r/Velo', url: 'https://www.reddit.com/r/Velo/.rss', topic: 'road', lang: 'en', kind: 'community', defaultOn: false, unverified: true, note: 'Training und Leistung' },
  { id: 'r-xbiking', name: 'r/xbiking', url: 'https://www.reddit.com/r/xbiking/.rss', topic: 'gravel', lang: 'en', kind: 'community', defaultOn: false, unverified: true },
  { id: 'r-bicycling', name: 'r/bicycling', url: 'https://www.reddit.com/r/bicycling/.rss', topic: 'urban', lang: 'en', kind: 'community', defaultOn: false, unverified: true, note: 'sehr hohe Frequenz' },

  // Breite Suche über Google News. Aus dem Testnetz nicht prüfbar, deshalb aus.
  { id: 'gnews-urban', name: 'Google News · Radverkehr', url: 'https://news.google.com/rss/search?q=Radverkehr+OR+Fahrradinfrastruktur+OR+Radweg&hl=de&gl=DE&ceid=DE:de', topic: 'urban', lang: 'de', kind: 'article', defaultOn: false, note: 'breite Suche, ungeprüft' },
  { id: 'gnews-road', name: 'Google News · Radsport', url: 'https://news.google.com/rss/search?q=Radsport+OR+%22Tour+de+France%22&hl=de&gl=DE&ceid=DE:de', topic: 'road', lang: 'de', kind: 'article', defaultOn: false, note: 'breite Suche, ungeprüft' },

  // ---- Riemen & Getriebe
  //
  // Diese Rubrik lebt zum größten Teil *nicht* von eigenen Quellen, sondern
  // davon, dass Beiträge aus den anderen ~200 Quellen erkannt und hierher
  // umsortiert werden (BELT_TERMS in localFilter.ts). Es gibt schlicht keine
  // Nachrichtenseite, die nur über Riemenantrieb schreibt.
  //
  // Die beiden Suchen hier sind die Ergänzung dazu: Sie fangen Meldungen aus
  // Quellen ein, die gar nicht in der Liste stehen. Standardmäßig **an**,
  // anders als die übrigen Google-News-Suchen -- bei einer so schmalen Rubrik
  // wäre eine ausgeschaltete Quelle der sichere Weg zu einer leeren Seite.
  { id: 'gnews-belt-de', name: 'Google News · Riemenantrieb', url: 'https://news.google.com/rss/search?q=Riemenantrieb+OR+Nabenschaltung+OR+Rohloff+OR+%22Pinion+Getriebe%22+OR+Zahnriemen+Fahrrad&hl=de&gl=DE&ceid=DE:de', topic: 'belt', lang: 'de', kind: 'article', defaultOn: true, unverified: true, note: 'breite Suche, ungeprüft' },
  { id: 'gnews-belt-en', name: 'Google News · Belt Drive', url: 'https://news.google.com/rss/search?q=%22belt+drive%22+bicycle+OR+%22gearbox+bike%22+OR+Rohloff+OR+Pinion+gearbox+OR+%22Gates+Carbon+Drive%22&hl=en-US&gl=US&ceid=US:en', topic: 'belt', lang: 'en', kind: 'article', defaultOn: true, unverified: true, note: 'breite Suche, ungeprüft' },
];

export const SOURCE_BY_ID                         = SOURCES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {}                          ,
);

export const SOURCE_COUNT = SOURCES.length;
export const DEFAULT_ON_COUNT = SOURCES.filter((s) => s.defaultOn).length;
