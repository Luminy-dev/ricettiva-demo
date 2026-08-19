// ─────────────────────────────────────────────────────────────
//  StayKit — Adapter prenotazioni multi-gestionale
//
//  Ogni gestionale (PMS / channel manager) fornisce il proprio
//  booking engine in una di poche forme ricorrenti:
//
//   · html    → uno snippet da incollare (script + div, o iframe già pronto)
//   · script  → un <script src="…"> + un contenitore su cui si monta
//   · iframe  → un URL da mettere dentro un iframe
//   · link    → una pagina esterna su cui mandare l'utente
//
//  Quindi NON serve un'integrazione dedicata per ogni marca: serve
//  un adapter con queste quattro strategie + il posto giusto dove
//  incollare il codice. Il registry qui sotto serve a guidare chi
//  configura ("dove trovo il codice?") e a scegliere i default.
//
//  Se la struttura non ha nessun gestionale: `internal` (form con
//  richiesta disponibilità) oppure `link` verso Booking/Airbnb.
// ─────────────────────────────────────────────────────────────

export const BOOKING_MODES = {
  widget: 'Widget del gestionale nel sito',
  link: 'Bottone verso un sito esterno',
  internal: 'Form richiesta disponibilità (nessun gestionale)',
  none: 'Solo contatti (telefono / email)',
}

export const EMBED_TYPES = {
  deeplink: 'Collegamento con le date (consigliato)',
  html: 'Snippet HTML da incollare',
  script: 'Script + contenitore',
  iframe: 'URL da incorporare in iframe',
}

/**
 * Registry dei gestionali più diffusi tra B&B e affittacamere italiani.
 * `embed` è la forma tipica in cui forniscono il widget; `where` è la
 * traccia che mostriamo nel pannello per trovare il codice.
 */
export const BOOKING_PROVIDERS = {
  octorate: {
    id: 'octorate',
    name: 'Octorate',
    country: 'IT',
    embed: 'deeplink',
    site: 'https://www.octorate.com/booking-engine/',
    where:
      'Serve solo la SiteKey: Octorate → Booking Engine → Widget, è il codice alfanumerico che compare ' +
      'anche nello snippet come data-sitekey. La guida ufficiale di Octorate sconsiglia di incorporare il ' +
      'widget e raccomanda proprio questa strada: le date si scelgono sul sito, il motore si apre con la sua grafica.',
    fields: [],
  },
  wubook: {
    id: 'wubook',
    name: 'WuBook / Zak',
    country: 'IT',
    embed: 'html',
    site: 'https://en.wubook.net/page/Booking-engine-10.html',
    where:
      'Zak → Online Reception: completa la configurazione e genera il widget. WuBook fornisce anche una ' +
      'libreria JavaScript che richiede il solo parametro "lcode" (identificativo della struttura).',
    fields: [{ key: 'lcode', label: 'lcode (identificativo struttura)', required: false }],
  },
  beddy: {
    id: 'beddy',
    name: 'Beddy',
    country: 'IT',
    embed: 'html',
    site: 'https://www.beddy.io/it/booking-engine/',
    where: 'Beddy → Booking Engine → integrazione sito: copia il codice di incorporamento fornito.',
    fields: [],
  },
  krossbooking: {
    id: 'krossbooking',
    name: 'KrossBooking',
    country: 'IT',
    embed: 'html',
    site: 'https://www.krossbooking.com/',
    where:
      'KrossBooking fornisce due blocchi di codice: uno da mettere prima di </head> e uno nel punto della ' +
      'pagina dove deve comparire il widget. Incolla qui il secondo e usa "Codice extra <head>" per il primo.',
    fields: [],
  },
  simplebooking: {
    id: 'simplebooking',
    name: 'Simple Booking',
    country: 'IT',
    embed: 'iframe',
    site: 'https://www.simplebooking.it/',
    where: 'Simple Booking → configurazione booking engine: chiedi al supporto l’URL del motore da incorporare.',
    fields: [],
  },
  scidoo: {
    id: 'scidoo',
    name: 'Scidoo',
    country: 'IT',
    embed: 'html',
    site: 'https://www.scidoo.com/',
    where: 'Scidoo → Booking Engine → widget per il sito: copia lo snippet generato.',
    fields: [],
  },
  smoobu: {
    id: 'smoobu',
    name: 'Smoobu',
    country: 'DE',
    embed: 'html',
    site: 'https://www.smoobu.com/',
    where:
      'Smoobu → Impostazioni → Sito web / Widget: copia il codice HTML del motore di prenotazione o del ' +
      'calendario e incollalo qui.',
    fields: [],
  },
  lodgify: {
    id: 'lodgify',
    name: 'Lodgify',
    country: 'INT',
    embed: 'html',
    site: 'https://www.lodgify.com/',
    where: 'Lodgify → Settings → Widgets: personalizza il widget e copialo negli appunti.',
    fields: [],
  },
  beds24: {
    id: 'beds24',
    name: 'Beds24',
    country: 'INT',
    embed: 'iframe',
    site: 'https://beds24.com/booking-widgets.html',
    where:
      'Beds24 → Settings → Booking Engine → Booking Widgets: usa "Get Code" oppure l’Iframe Generator per ' +
      'ottenere il codice da incorporare.',
    fields: [],
  },
  bookingexpert: {
    id: 'bookingexpert',
    name: 'Booking Expert',
    country: 'IT',
    embed: 'html',
    site: 'https://www.bookingexpert.it/',
    where: 'Booking Expert → Booking engine → integrazione: richiedi lo snippet al supporto e incollalo qui.',
    fields: [],
  },
  slope: {
    id: 'slope',
    name: 'Slope',
    country: 'IT',
    embed: 'html',
    site: 'https://www.slope.it/',
    where: 'Slope → Booking engine → codice di integrazione per il sito.',
    fields: [],
  },
  custom: {
    id: 'custom',
    name: 'Altro gestionale',
    country: '—',
    embed: 'html',
    site: '',
    where:
      'Qualsiasi gestionale che fornisca uno snippet, uno script o un iframe è compatibile: incolla qui il ' +
      'codice che ti hanno dato.',
    fields: [],
  },
}

export const PROVIDER_IDS = Object.keys(BOOKING_PROVIDERS)

/** Canali esterni per la modalità "link" quando non c'è un gestionale. */
export const EXTERNAL_CHANNELS = {
  booking: { id: 'booking', name: 'Booking.com', color: '#003580' },
  airbnb: { id: 'airbnb', name: 'Airbnb', color: '#FF5A5F' },
  expedia: { id: 'expedia', name: 'Expedia', color: '#FFC94D' },
  vrbo: { id: 'vrbo', name: 'Vrbo', color: '#245ABC' },
  google: { id: 'google', name: 'Google Hotel', color: '#4285F4' },
  direct: { id: 'direct', name: 'Sito di prenotazione', color: '#0E9AA7' },
}

/** Configurazione di partenza (nessun gestionale: form interno). */
export const DEFAULT_BOOKING = {
  mode: 'internal',
  provider: null,
  embed: { type: 'html', html: '', url: '', scriptSrc: '', mountId: 'booking-widget', height: 640, headExtra: '' },
  link: { url: '', channel: 'booking', label: '' },
  // Se il widget non parte (adblocker, script bloccato, consenso mancante)
  fallback: 'internal', // internal | link | contact
  // Mostrare "prenota direttamente e risparmi la commissione"
  showDirectHint: true,
}

/**
 * Normalizza la configurazione salvata nel DB, riempiendo i buchi.
 * Se una modalità è incoerente (es. "widget" senza codice) ricade su
 * qualcosa che funziona: meglio un form che una sezione vuota.
 */
export function normalizeBooking(raw) {
  const cfg = {
    ...DEFAULT_BOOKING,
    ...(raw || {}),
    embed: { ...DEFAULT_BOOKING.embed, ...(raw?.embed || {}) },
    link: { ...DEFAULT_BOOKING.link, ...(raw?.link || {}) },
  }

  if (cfg.mode === 'widget' && !hasEmbedCode(cfg.embed)) {
    cfg.mode = cfg.link.url ? 'link' : 'internal'
    cfg.degraded = true
  }
  if (cfg.mode === 'link' && !cfg.link.url) {
    cfg.mode = 'internal'
    cfg.degraded = true
  }
  return cfg
}

export function hasEmbedCode(embed) {
  if (!embed) return false
  if (embed.type === 'deeplink') return !!embed.siteKey?.trim()
  if (embed.type === 'html') return !!embed.html?.trim()
  if (embed.type === 'iframe') return !!embed.url?.trim()
  if (embed.type === 'script') return !!embed.scriptSrc?.trim()
  return false
}

export function providerName(id) {
  return BOOKING_PROVIDERS[id]?.name || 'Gestionale'
}

export function channelName(id) {
  return EXTERNAL_CHANNELS[id]?.name || 'Prenota'
}
