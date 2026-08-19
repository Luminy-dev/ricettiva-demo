// ─────────────────────────────────────────────────────────────
//  StayKit — Link ai portali con le date già inserite
//
//  Quando la struttura vende su Booking o Airbnb, il visitatore
//  sceglie comunque le date sul sito: poi lo si manda sul portale
//  con quelle date già impostate, invece di farlo ricominciare da
//  capo. Un passaggio in meno è una prenotazione in più.
//
//  I parametri sono quelli documentati dai portali, ma restano cose
//  che possono cambiare senza preavviso: per questo ogni canale
//  dichiara se sa gestirli e, in caso di dubbio, si apre comunque il
//  link così com'è. Meglio una data da riselezionare che un 404.
// ─────────────────────────────────────────────────────────────

/**
 * Come si chiamano i parametri delle date su ciascun portale.
 * `date: false` significa: non sappiamo passarle, apriamo e basta.
 */
export const CANALI = {
  booking: {
    nome: 'Booking.com',
    date: true,
    param: { checkIn: 'checkin', checkOut: 'checkout', guests: 'group_adults', extra: { no_rooms: '1' } },
  },
  airbnb: {
    nome: 'Airbnb',
    date: true,
    param: { checkIn: 'check_in', checkOut: 'check_out', guests: 'adults' },
  },
  vrbo: {
    nome: 'Vrbo',
    date: true,
    param: { checkIn: 'arrival', checkOut: 'departure', guests: 'adults' },
  },
  expedia: {
    nome: 'Expedia',
    date: true,
    param: { checkIn: 'chkin', checkOut: 'chkout', guests: 'adults' },
  },
  google: { nome: 'Google Hotel', date: false },
  // Nessun marchio da nominare: «Prenota su Sito di prenotazione» non si
  // può leggere. Con generico il bottone dice semplicemente «Prenota ora».
  direct: { nome: 'Sito di prenotazione', date: false, generico: true },
}

export function supportaDate(canale) {
  return CANALI[canale]?.date === true
}

// ─────────────────────────────────────────────────────────────
//  Motori di prenotazione raggiungibili con un collegamento
//
//  Alcuni gestionali, oltre al widget da incorporare, espongono la
//  loro pagina di prenotazione con le date nell'indirizzo. È quasi
//  sempre la strada migliore:
//
//   · la scelta delle date avviene sul sito, con la nostra grafica
//   · il motore vero si apre con la sua, che è quella che il gestore
//     ha già configurato e a cui il gestionale garantisce assistenza
//   · niente script di terze parti dentro le nostre pagine
//
//  Non è una scorciatoia: per Octorate è la soluzione consigliata
//  dalla loro stessa guida, che definisce il widget «piuttosto
//  ostico» proprio perché difficile da armonizzare con un sito.
// ─────────────────────────────────────────────────────────────

export const MOTORI_CON_LINK = {
  octorate: {
    nome: 'Octorate',
    chiave: 'siteKey',
    chiaveEtichetta: 'SiteKey',
    chiaveAiuto:
      'Octorate → Booking Engine → Widget: è il codice alfanumerico indicato come «Sitekey». ' +
      'Compare anche nello snippet, nell’attributo data-sitekey.',
    /** Le date vogliono il formato GG/MM/AAAA, non quello ISO. */
    costruisci: ({ chiave, checkIn, checkOut, guests, lang }) => {
      const u = new URL('https://book.octorate.com/octobook/site/reservation/result.xhtml')
      u.searchParams.set('siteKey', chiave)
      u.searchParams.set('lang', lang || 'it')
      u.searchParams.set('ota', 'false')
      if (checkIn) u.searchParams.set('checkin', aGiornoMeseAnno(checkIn))
      if (checkOut) u.searchParams.set('checkout', aGiornoMeseAnno(checkOut))
      if (guests) u.searchParams.set('pax', String(guests))
      return u.toString()
    },
  },
}

export function motoreConLink(provider) {
  return MOTORI_CON_LINK[provider] || null
}

/** Indirizzo del motore di prenotazione con le date già impostate. */
export function linkMotore(provider, chiave, dati = {}) {
  const motore = MOTORI_CON_LINK[provider]
  if (!motore || !chiave) return ''
  try {
    return motore.costruisci({ chiave, ...dati })
  } catch {
    return ''
  }
}

/** '2026-08-13' → '13/08/2026' */
function aGiornoMeseAnno(iso) {
  const [y, m, g] = String(iso).split('-')
  return y && m && g ? `${g}/${m}/${y}` : ''
}

export function nomeCanale(canale) {
  return CANALI[canale]?.nome || 'Prenota'
}

/**
 * Il canale ha un marchio che vale la pena nominare sul bottone?
 * «Prenota su Booking.com» è un'informazione; «Prenota su Sito di
 * prenotazione» è rumore.
 */
export function canaleDaNominare(canale) {
  const cfg = CANALI[canale]
  return Boolean(cfg?.nome) && !cfg.generico
}

// ─────────────────────────────────────────────────────────────
//  Il link della scheda, non quello che hai copiato
//
//  Quando si copia l'indirizzo di una struttura da Booking ci si porta
//  dietro trenta parametri: `aid` e `label` sono l'affiliato che ha
//  originato quella visita, `sid` è la sessione di CHI ha copiato,
//  `srepoch` e `srpvid` la ricerca da cui arrivava, `all_sr_blocks` la
//  camera che era selezionata in quel momento.
//
//  Tre danni, tutti silenziosi:
//   · la sessione scade e il link comincia a comportarsi in modo strano
//   · la prenotazione viene attribuita a un affiliato che non c'entra
//   · le date che aggiungiamo noi vanno in conflitto con quelle già lì
//
//  Resta l'indirizzo della scheda e basta. Le date le mette il sito.
// ─────────────────────────────────────────────────────────────

/** Toglie i parametri di sessione da un indirizzo di portale. */
export function pulisciLinkPortale(url) {
  const v = String(url || '').trim()
  if (!v) return ''
  try {
    const u = new URL(v)
    // La pagina di una struttura non ha bisogno di query: tutto quello
    // che serve sta nel percorso.
    return u.origin + u.pathname
  } catch {
    return v
  }
}

/**
 * È la scheda di una struttura, una pagina di ricerca, o altro?
 *
 * La differenza conta: a una RICERCA per nome Booking non applica i
 * filtri, e apre la home con i campi vuoti. Il visitatore che ha appena
 * scelto le date si ritrova al punto di partenza — un difetto che
 * sembra funzionare finché non lo si prova davvero.
 */
export function tipoLinkPortale(url) {
  try {
    const u = new URL(String(url || ''))
    const host = u.hostname.toLowerCase()
    const p = u.pathname.toLowerCase()

    if (host.endsWith('booking.com')) {
      if (p.startsWith('/hotel/')) return 'scheda'
      if (p.includes('searchresults') || p === '/' || p.includes('/index')) return 'ricerca'
    }
    if (host.includes('airbnb')) return p.startsWith('/rooms/') ? 'scheda' : 'ricerca'
    if (host.includes('vrbo') || host.includes('expedia')) {
      return /\/(h|hotel|rental)\d|\/p\d/.test(p) || p.split('/').length > 2 ? 'scheda' : 'ricerca'
    }
    return 'ignoto'
  } catch {
    return 'ignoto'
  }
}

/**
 * Aggiunge le date all'indirizzo del portale, conservando i parametri
 * che c'erano già (per esempio il codice affiliato).
 * Se qualcosa non torna, restituisce l'indirizzo originale.
 */
export function linkConDate(url, canale, { checkIn, checkOut, guests } = {}) {
  if (!url) return ''
  const cfg = CANALI[canale]
  if (!cfg?.date || !checkIn || !checkOut) return url

  try {
    const u = new URL(url)
    u.searchParams.set(cfg.param.checkIn, checkIn)
    u.searchParams.set(cfg.param.checkOut, checkOut)
    if (guests && cfg.param.guests) u.searchParams.set(cfg.param.guests, String(guests))
    for (const [k, v] of Object.entries(cfg.param.extra || {})) {
      if (!u.searchParams.has(k)) u.searchParams.set(k, v)
    }
    return u.toString()
  } catch {
    // Indirizzo malformato: meglio aprire quello che c'è che non aprire niente
    return url
  }
}
