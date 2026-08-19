// ─────────────────────────────────────────────────────────────
//  StayKit — Struttura vuota
//
//  È la base su cui si innestano i dati veri del cliente.
//
//  Perché non usare i contenuti demo come base: se una struttura non
//  ha ancora scritto le recensioni, con il merge sui dati demo sul suo
//  sito comparirebbero le recensioni inventate di «Palazzo Fiorillo». Su un
//  sito di una struttura vera sarebbero recensioni false pubblicate a
//  suo nome — un problema serio, non un dettaglio estetico.
//
//  Con questa base, ciò che il cliente non ha compilato semplicemente
//  non compare. I contenuti demo restano solo per le prove in locale.
// ─────────────────────────────────────────────────────────────

export const EMPTY_SITE = {
  slug: '',
  preset: 'bnb',
  theme: 'glass',
  themeOverrides: {},
  languages: ['it'],
  defaultLang: 'it',

  brand: { name: '', tagline: {}, logo: '', logoText: '' },

  contact: {
    phone: '', phoneRaw: '', email: '', whatsapp: '', whatsappMessage: {},
    address: { street: '', city: '', zip: '', province: '', country: 'Italia' },
    coords: {}, checkinTime: '', checkoutTime: '',
  },

  legal: {
    company: '', vat: '', cin: '', cir: '', privacyUrl: '', credits: {},
    // Dati del titolare del trattamento: li compila il cliente, il resto
    // dell'informativa lo scrive il software. Vedi src/lib/privacy.js.
    privacy: {
      controller: '', address: {}, email: '', pec: '', dpo: '',
      retentionMonths: 24, analyticsName: '', externalUrl: '', updatedAt: '',
    },
  },
  social: { instagram: '', facebook: '', tripadvisor: '', google: '' },

  hero: { eyebrow: {}, title: {}, subtitle: {}, image: '', video: '', badges: [] },
  story: { title: {}, paragraphs: {}, image: '', highlights: [] },

  units: [],
  amenities: [],
  amenitiesCustom: [],

  breakfast: { title: {}, text: {}, hours: '', image: '', items: [] },
  checkin: { title: {}, text: {}, steps: [], image: '' },

  gallery: [],
  reviews: { rating: null, count: null, source: '', items: [] },
  offers: [],
  blog: { title: {}, intro: {} },
  posts: [],
  location: { intro: {}, pois: [] },

  booking: {
    mode: 'internal',
    provider: null,
    embed: { type: 'html', html: '', url: '', scriptSrc: '', mountId: 'booking-widget', height: 640, headExtra: '' },
    link: { url: '', channel: 'booking', label: '' },
    fallback: 'internal',
    showDirectHint: true,
  },

  seo: { title: {}, description: {}, ogImage: '' },

  plan: {},
  settings: {},
}

export default EMPTY_SITE
