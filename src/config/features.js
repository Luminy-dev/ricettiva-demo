// ─────────────────────────────────────────────────────────────
//  StayKit — Feature flag su DUE livelli
//
//  · tier "reseller"  → le decidi TU (chi vende il servizio).
//    Stanno in `tenants.plan`, protette da RLS: il cliente le vede
//    (in grigio) ma non può toccarle. Sono ciò che vendi.
//
//  · tier "client"    → le decide il CLIENTE dal suo pannello.
//    Stanno in `tenants.settings`. Ognuna può dipendere (`requires`)
//    da una feature di livello rivenditore: se non l'hai attivata,
//    l'interruttore del cliente resta spento e bloccato.
//
//  Regola d'oro: `resolveFeatures()` è l'UNICA fonte di verità.
//  Nessun componente deve leggere plan/settings direttamente.
// ─────────────────────────────────────────────────────────────

export const FEATURE_GROUPS = {
  core: 'Contenuti base',
  booking: 'Prenotazioni',
  content: 'Sezioni del sito',
  nav: 'Voci del menu',
  growth: 'Marketing e SEO',
  branding: 'Personalizzazione',
  ops: 'Operativo',
}

/**
 * @typedef {Object} Feature
 * @property {'reseller'|'client'} tier   chi può attivarla
 * @property {string}  group              raggruppamento nel pannello
 * @property {string}  label              etichetta in italiano
 * @property {string}  hint               spiegazione per il pannello
 * @property {boolean} default            valore se non specificato
 * @property {string} [requires]          feature rivenditore da cui dipende
 * @property {string[]} [presets]         limita la feature ad alcune tipologie
 */

/** @type {Record<string, Feature>} */
export const FEATURES = {
  // ── Livello RIVENDITORE — il pacchetto che vendi ────────────
  booking_engine: {
    tier: 'reseller',
    group: 'booking',
    label: 'Motore di prenotazione integrato',
    hint: 'Abilita il widget del gestionale (Octorate, WuBook/Zak, Beddy, Krossbooking, Smoobu…) dentro al sito.',
    default: true,
  },
  direct_requests: {
    tier: 'reseller',
    group: 'booking',
    label: 'Richieste diretta dal sito',
    hint: 'Form "verifica disponibilità" con salvataggio delle richieste e notifica via email.',
    default: true,
  },
  multilanguage: {
    tier: 'reseller',
    group: 'growth',
    label: 'Sito multilingua',
    hint: 'Attiva il selettore lingua e i campi tradotti nel pannello.',
    default: true,
  },
  media_upload: {
    tier: 'reseller',
    group: 'branding',
    label: 'Upload foto dal pannello',
    hint: 'Se disattivo, il cliente può modificare i testi ma non caricare o sostituire immagini.',
    default: true,
  },
  theme_switching: {
    tier: 'reseller',
    group: 'branding',
    label: 'Cambio tema autonomo',
    hint: 'Permette al cliente di passare da un tema all’altro senza chiamarti.',
    default: false,
  },
  color_customization: {
    tier: 'reseller',
    group: 'branding',
    label: 'Personalizzazione colori',
    hint: 'Sblocca i selettori di colore primario e accento nel pannello cliente.',
    default: false,
  },
  gallery: {
    tier: 'reseller',
    group: 'content',
    label: 'Galleria fotografica',
    hint: 'Sezione galleria con lightbox, oltre alle foto delle unità.',
    default: true,
  },
  reviews: {
    tier: 'reseller',
    group: 'growth',
    label: 'Recensioni e testimonianze',
    hint: 'Sezione recensioni con voto e citazioni degli ospiti.',
    default: true,
  },
  map: {
    tier: 'reseller',
    group: 'content',
    label: 'Mappa e dintorni',
    hint: 'Mappa della posizione + elenco di cosa vedere nei dintorni.',
    default: true,
  },
  offers: {
    tier: 'reseller',
    group: 'growth',
    label: 'Offerte e pacchetti',
    hint: 'Sezione con promozioni, minimi notti e pacchetti stagionali.',
    default: false,
  },
  blog: {
    tier: 'reseller',
    group: 'growth',
    label: 'Blog / articoli',
    hint: 'Sezione articoli per posizionamento SEO locale.',
    default: false,
  },
  seo_advanced: {
    tier: 'reseller',
    group: 'growth',
    label: 'SEO avanzata',
    hint: 'Meta tag dinamici, Open Graph e dati strutturati JSON-LD (LodgingBusiness).',
    default: true,
  },
  analytics: {
    tier: 'reseller',
    group: 'growth',
    label: 'Statistiche e consenso cookie',
    hint: 'Banner cookie GDPR + integrazione con lo strumento di analytics scelto.',
    default: false,
  },
  whatsapp: {
    tier: 'reseller',
    group: 'booking',
    label: 'Contatto WhatsApp',
    hint: 'Bottone flottante che apre una chat WhatsApp precompilata.',
    default: true,
  },
  extra_pages: {
    tier: 'reseller',
    group: 'content',
    label: 'Pagine extra',
    hint: 'Pagine aggiuntive gestite dal cliente (es. "Come arrivare", "Regolamento").',
    default: false,
  },
  guest_area: {
    tier: 'reseller',
    group: 'ops',
    label: 'Area ospiti',
    hint: 'Pagina riservata con istruzioni di check-in, wifi e info pratiche.',
    default: false,
  },

  // ── Livello CLIENTE — accende/spegne ciò che ha comprato ────
  'section.rooms': {
    tier: 'client',
    group: 'core',
    label: 'Mostra sezione unità',
    hint: 'Camere, appartamenti o unità a seconda della tipologia di struttura.',
    default: true,
  },
  'section.amenities': {
    tier: 'client',
    group: 'core',
    label: 'Mostra sezione servizi',
    hint: 'Elenco delle dotazioni e dei servizi della struttura.',
    default: true,
  },
  'section.story': {
    tier: 'client',
    group: 'core',
    label: 'Mostra sezione "chi siamo"',
    hint: 'Il racconto della struttura e di chi la gestisce.',
    default: true,
  },
  'section.gallery': {
    tier: 'client',
    group: 'content',
    label: 'Mostra galleria',
    hint: '',
    default: true,
    requires: 'gallery',
  },
  'section.reviews': {
    tier: 'client',
    group: 'content',
    label: 'Mostra recensioni',
    hint: '',
    default: true,
    requires: 'reviews',
  },
  'section.map': {
    tier: 'client',
    group: 'content',
    label: 'Mostra mappa e dintorni',
    hint: '',
    default: true,
    requires: 'map',
  },
  'section.offers': {
    tier: 'client',
    group: 'content',
    label: 'Mostra offerte',
    hint: '',
    default: true,
    requires: 'offers',
  },
  'section.blog': {
    tier: 'client',
    group: 'content',
    label: 'Mostra articoli',
    hint: '',
    default: true,
    requires: 'blog',
  },
  'section.breakfast': {
    tier: 'client',
    group: 'content',
    label: 'Mostra sezione colazione',
    hint: 'Dedicata alla colazione: prodotti, orari, dove viene servita.',
    default: true,
    presets: ['bnb', 'agriturismo'],
  },
  'section.checkin': {
    tier: 'client',
    group: 'content',
    label: 'Mostra sezione check-in autonomo',
    hint: 'Istruzioni per l’arrivo self check-in, utile per case e appartamenti.',
    default: true,
    presets: ['case_vacanza', 'affittacamere'],
  },
  // ── Voci del menu ────────────────────────────────────────────
  //
  //  Separate da «mostra la sezione» di proposito: una sezione può
  //  servire sul sito senza dover occupare un posto nella barra in alto.
  //  Con otto voci il menu diventa illeggibile, e la galleria si trova
  //  benissimo scorrendo. Restano comunque tutte nel piè di pagina.
  'nav.story': { tier: 'client', group: 'nav', label: 'Chi siamo', hint: '', default: true, requires: 'section.story' },
  'nav.rooms': { tier: 'client', group: 'nav', label: 'Unità', hint: '', default: true, requires: 'section.rooms' },
  'nav.breakfast': {
    tier: 'client', group: 'nav', label: 'Colazione', hint: '', default: true,
    requires: 'section.breakfast', presets: ['bnb', 'agriturismo'],
  },
  'nav.checkin': {
    tier: 'client', group: 'nav', label: 'Arrivo', hint: '', default: false,
    requires: 'section.checkin', presets: ['case_vacanza', 'affittacamere'],
  },
  'nav.amenities': {
    tier: 'client', group: 'nav', label: 'Servizi', hint: '', default: true, requires: 'section.amenities',
  },
  // La galleria si trova benissimo scorrendo, e in una barra con otto
  // voci è quella che si toglie senza che manchi a nessuno. La sezione
  // resta nel sito: sparisce solo dal menu.
  'nav.gallery': {
    tier: 'client', group: 'nav', label: 'Galleria', requires: 'section.gallery', default: false,
    hint: 'Spenta di norma: la galleria resta nella pagina, non nella barra in alto.',
  },
  'nav.offers': { tier: 'client', group: 'nav', label: 'Offerte', hint: '', default: true, requires: 'section.offers' },
  'nav.reviews': { tier: 'client', group: 'nav', label: 'Recensioni', hint: '', default: true, requires: 'section.reviews' },
  'nav.map': { tier: 'client', group: 'nav', label: 'Dove siamo', hint: '', default: true, requires: 'section.map' },
  'nav.contact': { tier: 'client', group: 'nav', label: 'Contatti', hint: '', default: true },

  'booking.hero_bar': {
    tier: 'client',
    group: 'booking',
    label: 'Verifica disponibilità in apertura',
    hint: 'La barra con le date subito sotto il titolo. È la prima cosa che un ospite cerca: toglierla si paga in prenotazioni.',
    default: true,
  },
  'booking.sticky_bar': {
    tier: 'client',
    group: 'booking',
    label: 'Barra prenota sempre visibile',
    hint: 'Barra fissa in basso su mobile con "Verifica disponibilità".',
    default: true,
  },
  'booking.show_prices': {
    tier: 'client',
    group: 'booking',
    label: 'Mostra prezzi indicativi',
    hint: 'Mostra il "a partire da" sulle unità. Disattivalo se i prezzi cambiano spesso.',
    default: false,
  },
  'hero.video': {
    tier: 'client',
    group: 'core',
    label: 'Video nell’intestazione',
    hint: 'Usa un video di sfondo al posto della foto principale.',
    default: false,
  },
  'contact.whatsapp_button': {
    tier: 'client',
    group: 'booking',
    label: 'Bottone WhatsApp flottante',
    hint: '',
    default: true,
    requires: 'whatsapp',
  },
}

export const FEATURE_KEYS = Object.keys(FEATURES)
export const RESELLER_FEATURES = FEATURE_KEYS.filter((k) => FEATURES[k].tier === 'reseller')
export const CLIENT_FEATURES = FEATURE_KEYS.filter((k) => FEATURES[k].tier === 'client')

/**
 * Calcola lo stato finale di ogni feature.
 * Precedenza: preset → default → piano rivenditore → preferenze cliente,
 * con le dipendenze (`requires`) che possono sempre forzare "spento".
 *
 * @param {object} plan      tenants.plan      (scritto solo dal rivenditore)
 * @param {object} settings  tenants.settings  (scritto dal cliente)
 * @param {string} preset    tipologia struttura (bnb | affittacamere | …)
 * @returns {Record<string, boolean>}
 */
export function resolveFeatures(plan = {}, settings = {}, preset = 'bnb') {
  const out = {}

  // 1) livello rivenditore
  for (const key of RESELLER_FEATURES) {
    const f = FEATURES[key]
    const allowedByPreset = !f.presets || f.presets.includes(preset)
    out[key] = allowedByPreset && bool(plan[key], f.default)
  }

  // 2) livello cliente (subordinato al livello rivenditore)
  //
    //  Risolto in più passate: un interruttore può dipendere da un altro
    //  dello stesso livello — «Galleria nel menu» dipende da «Mostra la
    //  galleria». Una passata sola darebbe risultati diversi a seconda
    //  dell'ordine in cui le voci sono scritte qui sopra, che è un modo
    //  perfetto per introdurre un errore difficile da trovare.
  const inSospeso = new Set(CLIENT_FEATURES)
  for (let passata = 0; passata < 4 && inSospeso.size; passata++) {
    for (const key of [...inSospeso]) {
      const f = FEATURES[key]
      // Dipendenza non ancora risolta: si riprova al giro dopo
      if (f.requires && !(f.requires in out)) continue

      const allowedByPreset = !f.presets || f.presets.includes(preset)
      const parentOk = !f.requires || out[f.requires] === true
      out[key] = allowedByPreset && parentOk && bool(settings[key], f.default)
      inSospeso.delete(key)
    }
  }
  // Dipendenze circolari o inesistenti: spente, mai indefinite
  for (const key of inSospeso) out[key] = false

  return out
}

/** Il cliente può agire su questo interruttore? */
export function isEditableByClient(key, resolved) {
  const f = FEATURES[key]
  if (!f || f.tier !== 'client') return false
  if (f.requires && resolved[f.requires] !== true) return false
  return true
}

/** Motivo del blocco, da mostrare nel pannello cliente. */
export function lockReason(key, resolved) {
  const f = FEATURES[key]
  if (!f) return null
  if (f.tier === 'reseller') return 'Gestito dal fornitore del sito.'
  if (f.requires && resolved[f.requires] !== true) {
    return `Richiede il modulo "${FEATURES[f.requires]?.label || f.requires}", non attivo sul tuo piano.`
  }
  return null
}

function bool(value, fallback) {
  return typeof value === 'boolean' ? value : !!fallback
}
