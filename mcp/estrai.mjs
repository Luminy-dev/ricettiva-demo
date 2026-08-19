// ─────────────────────────────────────────────────────────────
//  Estrazione dei dati da una pagina di una struttura
//
//  Il problema da cui nasce questo file: chi crea la demo legge le
//  pagine con la ricerca web, che restituisce testo ripulito. Il testo
//  non contiene gli indirizzi delle immagini — quindi le foto, che
//  sono la cosa più importante di una demo, non si riuscivano a
//  prendere. Non era un limite del modello: non aveva proprio modo
//  di vederle.
//
//  Qui si scarica l'HTML grezzo e si tira fuori tutto quello che una
//  pagina di struttura di solito contiene ma non mostra:
//
//   · dati strutturati JSON-LD (nome, indirizzo, coordinate, voto,
//     recensioni, telefono) — quasi tutti i portali li mettono, sono
//     lì per Google
//   · meta Open Graph
//   · immagini: <img>, srcset, data-*, JSON-LD, e le gallerie che i
//     portali tengono dentro blocchi JSON
//
//  Nessun servizio esterno, nessuna chiave: sono le stesse cose che
//  legge un motore di ricerca.
// ─────────────────────────────────────────────────────────────

const AGENTE =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/124.0 Safari/537.36 StayKit-Demo/1.0'

/** Scarica l'HTML di una pagina. */
export async function scaricaPagina(url) {
  if (!/^https?:\/\//i.test(url)) throw new Error(`Indirizzo non valido: ${url}`)
  const risposta = await fetch(url, {
    headers: {
      'User-Agent': AGENTE,
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
  })
  if (!risposta.ok) throw new Error(`La pagina risponde ${risposta.status}`)
  return { html: await risposta.text(), url: risposta.url }
}

// ── Dati strutturati ──────────────────────────────────────────

/**
 * I blocchi JSON-LD della pagina, appiattiti.
 *
 * Li mettono quasi tutti — portali, gestionali, siti fatti bene —
 * perché servono a Google. È la fonte più affidabile che ci sia:
 * sono dati dichiarati, non testo da interpretare.
 */
export function datiStrutturati(html) {
  const blocchi = []
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    try {
      const dati = JSON.parse(m[1].trim())
      blocchi.push(...appiattisci(dati))
    } catch {
      /* JSON-LD malformato: capita, si tira avanti */
    }
  }
  return blocchi
}

function appiattisci(nodo, out = []) {
  if (Array.isArray(nodo)) {
    for (const n of nodo) appiattisci(n, out)
    return out
  }
  if (nodo && typeof nodo === 'object') {
    out.push(nodo)
    if (nodo['@graph']) appiattisci(nodo['@graph'], out)
  }
  return out
}

/** I meta della pagina: og:*, twitter:*, description. */
export function metaTag(html) {
  const out = {}
  const re = /<meta[^>]+>/gi
  let m
  while ((m = re.exec(html))) {
    const tag = m[0]
    const nome = (tag.match(/(?:property|name)=["']([^"']+)["']/i) || [])[1]
    const valore = (tag.match(/content=["']([^"']*)["']/i) || [])[1]
    if (nome && valore) out[nome.toLowerCase()] = decodifica(valore)
  }
  return out
}

/**
 * Le coordinate, cercate dove i vari portali le mettono.
 *
 * Booking usa `data-atlas-latlng`, altri le mettono nel JSON-LD, altri
 * ancora in un link a Google Maps. Senza coordinate la mappa del sito
 * non si posiziona, quindi vale la pena guardare in tutti i posti.
 */
export function coordinate(html, strutturati) {
  for (const d of strutturati) {
    const geo = d.geo || d.location?.geo
    const lat = Number(geo?.latitude)
    const lng = Number(geo?.longitude)
    if (valide(lat, lng)) return { lat, lng, fonte: 'dati strutturati' }
  }

  const atlas = html.match(/data-atlas-latlng=["'](-?[\d.]+),(-?[\d.]+)["']/i)
  if (atlas && valide(+atlas[1], +atlas[2])) {
    return { lat: +atlas[1], lng: +atlas[2], fonte: 'attributo della mappa' }
  }

  const maps = html.match(/[?&]q=(-?\d{1,2}\.\d{4,}),(-?\d{1,3}\.\d{4,})/)
  if (maps && valide(+maps[1], +maps[2])) {
    return { lat: +maps[1], lng: +maps[2], fonte: 'link a Google Maps' }
  }

  const at = html.match(/@(-?\d{1,2}\.\d{4,}),(-?\d{1,3}\.\d{4,})/)
  if (at && valide(+at[1], +at[2])) return { lat: +at[1], lng: +at[2], fonte: 'indirizzo della mappa' }

  return null
}

const valide = (lat, lng) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && (lat || lng)

/** Quello che si riesce a ricavare su recapiti e identità. */
export function scheda(html, strutturati, meta) {
  const alloggio = strutturati.find((d) =>
    /Hotel|LodgingBusiness|BedAndBreakfast|Apartment|Resort|Hostel|Campground|VacationRental|LocalBusiness/i.test(
      String(d['@type'] || '')
    )
  )
  const indirizzo = alloggio?.address || {}
  const voto = alloggio?.aggregateRating || strutturati.find((d) => d.aggregateRating)?.aggregateRating

  const out = {
    nome: alloggio?.name || meta['og:site_name'] || titolo(html) || '',
    descrizione: alloggio?.description || meta['og:description'] || meta.description || '',
    telefono: alloggio?.telephone || primoTelefono(html) || '',
    email: alloggio?.email || primaEmail(html) || '',
    indirizzo: {
      street: indirizzo.streetAddress || '',
      city: indirizzo.addressLocality || '',
      zip: indirizzo.postalCode || '',
      province: indirizzo.addressRegion || '',
      country: indirizzo.addressCountry?.name || indirizzo.addressCountry || '',
    },
    voto: voto ? { valore: Number(voto.ratingValue) || null, quanti: Number(voto.reviewCount || voto.ratingCount) || null } : null,
    stelle: Number(alloggio?.starRating?.ratingValue) || null,
    sito: alloggio?.url || '',
  }

  // Recensioni dichiarate nei dati strutturati: sono già pubbliche e
  // riportabili citando la fonte. Meglio queste che riscritte a mano.
  const recensioni = []
  for (const d of strutturati) {
    for (const r of [].concat(d.review || [])) {
      const testo = String(r.reviewBody || r.description || '').trim()
      if (!testo) continue
      recensioni.push({
        autore: String(r.author?.name || r.author || '').trim(),
        voto: Number(r.reviewRating?.ratingValue) || null,
        data: String(r.datePublished || '').slice(0, 7),
        testo: testo.slice(0, 600),
      })
    }
  }
  if (recensioni.length) out.recensioni = recensioni.slice(0, 8)

  return out
}

function titolo(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? decodifica(m[1]).trim() : ''
}

function primaEmail(html) {
  const m = html.match(/mailto:([^"'?\s>]+@[^"'?\s>]+)/i) || html.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)
  const email = m ? (m[1] || m[0]) : ''
  // Gli indirizzi dei portali non sono quelli della struttura.
  return /sentry|example|@2x|\.png|booking\.com|expedia|airbnb/i.test(email) ? '' : email
}

function primoTelefono(html) {
  const m = html.match(/tel:(\+?[\d\s().-]{7,20})/i)
  return m ? m[1].trim() : ''
}

function decodifica(s = '') {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
}

// ── Immagini ──────────────────────────────────────────────────

/**
 * Tutte le immagini plausibili della pagina, in alta risoluzione.
 *
 * Il lavoro vero è scartare la spazzatura: loghi, bandierine delle
 * lingue, avatar dei recensori, pixel di tracciamento, icone. Su una
 * pagina di Booking le immagini vere sono una trentina e il rumore è
 * cinque volte tanto.
 */
export function immagini(html, urlPagina) {
  const trovate = new Map() // chiave → { url, punteggio, dove }

  const aggiungi = (grezzo, dove, punteggio = 0) => {
    const url = normalizza(grezzo, urlPagina)
    if (!url) return

    // Prima si porta alla risoluzione buona, POI si giudica. Nell'ordine
    // opposto una miniatura `square60` finiva nel cestino insieme alle
    // icone — e con lei la foto principale della struttura, che i
    // portali mettono in og:image proprio in quel formato.
    const grande = allaMassimaRisoluzione(url)
    if (!sembraFoto(grande)) return

    const chiave = identita(grande)
    const prima = trovate.get(chiave)
    if (!prima || punteggio > prima.punteggio) {
      trovate.set(chiave, { url: grande, punteggio, dove })
    }
  }

  // 1. Open Graph: è la foto che la struttura ha scelto per farsi
  //    rappresentare. Quasi sempre è la migliore che ha.
  const meta = metaTag(html)
  for (const chiave of ['og:image', 'og:image:secure_url', 'twitter:image']) {
    if (meta[chiave]) aggiungi(meta[chiave], 'og:image', 100)
  }

  // 2. Dati strutturati: dichiarate dalla struttura stessa.
  for (const d of datiStrutturati(html)) {
    for (const i of [].concat(d.image || d.photo || [])) {
      aggiungi(typeof i === 'string' ? i : i?.url || i?.contentUrl, 'dati strutturati', 90)
    }
  }

  // 3. I tag <img>, con srcset quando c'è (contiene le versioni grandi).
  const re = /<img[^>]+>/gi
  let m
  while ((m = re.exec(html))) {
    const tag = m[0]
    const alt = (tag.match(/alt=["']([^"']*)["']/i) || [])[1] || ''
    const punti = /logo|icon|bandier|flag|avatar/i.test(alt) ? -50 : 50

    const srcset = (tag.match(/(?:data-)?srcset=["']([^"']+)["']/i) || [])[1]
    if (srcset) {
      // L'ultima voce di un srcset è la più grande
      const ultima = srcset.split(',').pop().trim().split(/\s+/)[0]
      aggiungi(ultima, 'srcset', punti + 5)
    }
    for (const attr of ['src', 'data-src', 'data-lazy', 'data-original', 'data-highres']) {
      const v = (tag.match(new RegExp(`${attr}=["']([^"']+)["']`, 'i')) || [])[1]
      if (v) aggiungi(v, `img[${attr}]`, punti)
    }
  }

  // 4. Le gallerie che i portali tengono dentro blocchi JSON.
  //    Booking, per esempio, non mette in pagina tutte le <img>: le
  //    carica dopo, da un JSON incorporato.
  //    Gli indirizzi lì dentro hanno le barre "scappate" (https:\/\/…),
  //    quindi il modello di ricerca deve accettarle e poi ripulirle.
  for (const u of html.match(/https?:(?:\\?\/){2}[^"'\s<>()]+?\.(?:jpe?g|png|webp|avif)/gi) || []) {
    aggiungi(u.replace(/\\/g, ''), 'json nella pagina', 30)
  }

  return [...trovate.values()]
    .filter((f) => f.punteggio > 0)
    .sort((a, b) => b.punteggio - a.punteggio)
    .map((f) => ({ url: f.url, dove: f.dove }))
}

function normalizza(grezzo, base) {
  if (!grezzo || typeof grezzo !== 'string') return ''
  let u = grezzo.trim().replace(/&amp;/g, '&')
  if (u.startsWith('//')) u = 'https:' + u
  if (u.startsWith('/') && base) {
    try {
      u = new URL(u, base).toString()
    } catch {
      return ''
    }
  }
  return /^https?:\/\//i.test(u) ? u : ''
}

/** Icone, loghi, pixel e affini: fuori. */
function sembraFoto(url) {
  const u = url.toLowerCase()
  if (!/\.(jpe?g|png|webp|avif)(\?|$)/.test(u) && !/bstatic\.com|muscache\.com|cloudfront|imgix|cdn/.test(u)) {
    return false
  }
  const cestino = [
    'logo', 'sprite', 'icon', 'favicon', 'pixel', 'tracking', 'beacon', 'placeholder',
    'avatar', 'flag', '/flags/', 'badge', 'banner', 'button', 'arrow', 'star',
    'square60', 'square100', 'square200', 'max200', 'max300', 'thumb', '/50x50', '/1x1',
    'blank.gif', 'spacer',
  ]
  if (cestino.some((c) => u.includes(c))) return false
  // Dimensioni scritte nel nome: sotto i 400px non è una foto da sito.
  const dim = u.match(/(\d{2,4})x(\d{2,4})/)
  if (dim && Math.max(+dim[1], +dim[2]) < 400) return false
  return true
}

/**
 * La stessa foto in versione grande.
 *
 * I portali servono la stessa immagine in dieci misure cambiando un
 * pezzo dell'indirizzo. Prendere la miniatura e metterla a tutto
 * schermo su una demo è il modo più veloce per farla sembrare fatta
 * male, e basta una sostituzione per evitarlo.
 */
export function allaMassimaRisoluzione(url) {
  let u = url

  // Booking / bstatic: .../hotel/max500/123.jpg → max1280x900
  u = u.replace(
    /\/(square\d+|max\d+(?:x\d+)?|mini|thumb)\//i,
    '/max1280x900/'
  )

  // Airbnb / muscache: ?im_w=720 → 1440
  u = u.replace(/([?&]im_w=)\d+/i, '$11440')

  // Parametri di ridimensionamento generici
  u = u.replace(/([?&](?:w|width))=\d+/gi, '$1=1600')
  u = u.replace(/([?&](?:h|height))=\d+/gi, '$1=1200')

  // Nomi di file con la misura dentro: hero-400x300.jpg → hero.jpg
  u = u.replace(/-\d{2,4}x\d{2,4}(\.(?:jpe?g|png|webp|avif))/i, '$1')

  return u
}

/** Due indirizzi diversi della stessa foto devono contare per una. */
function identita(url) {
  try {
    const u = new URL(url)
    // Su bstatic il numero identifica la foto, il resto è contorno.
    const numero = u.pathname.match(/(\d{6,})\.(jpe?g|png|webp|avif)/i)
    if (numero) return `${u.hostname}:${numero[1]}`
    return u.hostname + u.pathname.toLowerCase()
  } catch {
    return url
  }
}

// ── Indirizzi dei portali ─────────────────────────────────────
//
//  Le due funzioni vivono nel template, in src/config/booking-links.js:
//  le stesse regole valgono per il sito del cliente e per la demo, e
//  una sola implementazione vuol dire che non possono divergere.
//
//  Il portale riceve quel file con `npm run allinea`.

export { pulisciLinkPortale, tipoLinkPortale } from '../src/config/booking-links.js'

// ── Geocodifica ───────────────────────────────────────────────

/**
 * Indirizzo → coordinate, con OpenStreetMap.
 *
 * Gratuito e senza chiavi, ma chiede due cose in cambio: un
 * User-Agent che dica chi sei, e non più di una richiesta al secondo.
 * Le rispettiamo entrambe — chi abusa viene bloccato, e giustamente.
 */
export async function geocodifica(indirizzo) {
  const q = String(indirizzo || '').trim()
  if (!q) throw new Error('Serve un indirizzo.')

  const u = new URL('https://nominatim.openstreetmap.org/search')
  u.searchParams.set('q', q)
  u.searchParams.set('format', 'jsonv2')
  u.searchParams.set('limit', '3')
  u.searchParams.set('addressdetails', '1')

  const risposta = await fetch(u, {
    headers: { 'User-Agent': 'StayKit-Demo/1.0 (preparazione anteprime siti)', 'Accept-Language': 'it' },
  })
  if (!risposta.ok) throw new Error(`OpenStreetMap risponde ${risposta.status}`)

  const esiti = await risposta.json()
  if (!esiti.length) return { trovato: false, indirizzo: q }

  return {
    trovato: true,
    risultati: esiti.map((e) => ({
      lat: Number(e.lat),
      lng: Number(e.lon),
      descrizione: e.display_name,
      tipo: e.type,
      // Sotto 0.4 la corrispondenza è debole: meglio controllare a mano
      // che pubblicare una mappa che punta al paese sbagliato.
      attendibilita: Number(e.importance || 0),
    })),
  }
}
