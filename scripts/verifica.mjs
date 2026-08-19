#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Controlli prima di pubblicare
//
//    npm run check   → questi controlli, poi la build
//
//  Non sono test del template (quelli stanno nel progetto
//  principale): qui si controllano le cose che possono andare storte
//  *sul portale*, e sono quasi tutte cose che si notano solo davanti
//  al cliente. Una foto che non c'è, una demo che copre una pagina
//  del portale, un noindex tolto per sbaglio.
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROGETTO = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEMO = join(PROGETTO, 'demo')
const PUBBLICA = join(PROGETTO, 'public')

const RISERVATI = ['come-funziona', 'assets', 'pannello', 'privacy']
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

let ok = 0
const errori = []
const avvisi = []

const check = (etichetta, fn) => {
  try {
    const esito = fn()
    if (esito === true) ok++
    else errori.push(`${etichetta} → ${esito || 'non soddisfatto'}`)
  } catch (err) {
    errori.push(`${etichetta} → ${err.message}`)
  }
}

// ── 1. Il portale resta fuori dai motori di ricerca ──
//
//  Ogni demo mostra i contenuti di una struttura vera su un dominio
//  che non è il suo: indicizzata, farebbe concorrenza al cliente con
//  una copia del suo stesso sito.
check('robots.txt vieta tutto', () => {
  const robots = readFileSync(join(PUBBLICA, 'robots.txt'), 'utf8')
  return /^\s*Disallow:\s*\/\s*$/m.test(robots) || 'manca «Disallow: /»'
})
check('index.html dichiara noindex', () => {
  const html = readFileSync(join(PROGETTO, 'index.html'), 'utf8')
  return /name="robots"[^>]*noindex/.test(html) || 'manca il meta robots'
})
check('le intestazioni HTTP dichiarano noindex', () => {
  const conf = JSON.parse(readFileSync(join(PROGETTO, 'vercel.json'), 'utf8'))
  const tutte = JSON.stringify(conf.headers || [])
  return /X-Robots-Tag/.test(tutte) && /noindex/.test(tutte) || 'manca X-Robots-Tag in vercel.json'
})
check('le pagine delle demo passano noindex a <Seo />', () => {
  const app = readFileSync(join(PROGETTO, 'src', 'App.jsx'), 'utf8')
  return /<Seo noindex \/>/.test(app) || 'App.jsx non forza il noindex'
})

// ── L'elenco delle demo non deve tornare ──
//
//  Era l'unico punto da cui un cliente, cancellando il proprio nome
//  dall'indirizzo, arrivava alle anteprime dei suoi concorrenti.
check('la radice non elenca le demo', () => {
  const app = readFileSync(join(PROGETTO, 'src', 'App.jsx'), 'utf8')
  return !/Indice/.test(app) || 'App.jsx rimanda ancora a una pagina indice'
})
check('nessuna pagina elenca le strutture', () =>
  !existsSync(join(PROGETTO, 'src', 'pages', 'Indice.jsx')) || 'src/pages/Indice.jsx è tornato')
check('un indirizzo sbagliato non rivela niente', () => {
  const app = readFileSync(join(PROGETTO, 'src', 'App.jsx'), 'utf8')
  // Radice e indirizzo inventato devono dare la stessa pagina: se
  // fossero diverse, chi prova indirizzi a caso saprebbe quando ha
  // indovinato.
  return /return \{ tipo: 'riservata' \}/.test(app) || 'la rotta distingue ancora i due casi'
})

// ── 2. Ogni demo sta in piedi ──
const slug = existsSync(DEMO)
  ? readdirSync(DEMO).filter((n) => existsSync(join(DEMO, n, 'sito.json')))
  : []

if (!slug.length) avvisi.push('Nessuna demo in demo/: il portale mostrerà solo la pagina vuota.')

for (const s of slug) {
  const dove = `demo/${s}`
  let sito

  check(`${dove}: il file è JSON valido`, () => {
    sito = JSON.parse(readFileSync(join(DEMO, s, 'sito.json'), 'utf8'))
    return true
  })
  if (!sito) continue

  check(`${dove}: il nome della cartella è un indirizzo valido`, () => SLUG.test(s) || 'usa minuscole e trattini')
  check(`${dove}: non copre una pagina del portale`, () => !RISERVATI.includes(s) || `"${s}" è riservato`)
  check(`${dove}: lo slug interno combacia con la cartella`, () =>
    !sito.slug || sito.slug === s || `nel file c'è "${sito.slug}"`)
  check(`${dove}: ha un nome`, () => Boolean(sito.brand?.name?.trim()) || 'brand.name vuoto')

  // ── Le foto: il difetto che si vede di più ──
  //
  //  Un percorso sbagliato non rompe la build, rompe la pagina davanti
  //  al cliente. Meglio scoprirlo qui.
  check(`${dove}: tutte le foto esistono`, () => {
    const mancanti = fotoUsate(sito).filter((p) => !existsSync(join(PUBBLICA, p.replace(/^\//, ''))))
    return mancanti.length === 0 || `mancano ${mancanti.length}: ${mancanti.slice(0, 3).join(', ')}`
  })

  // Le foto linkate da fuori spariscono quando il portale le sposta:
  // è un avviso, non un errore, perché a volte è voluto.
  const esterne = fotoUsate(sito, true).filter((p) => /^https?:/i.test(p))
  if (esterne.length) {
    avvisi.push(
      `${dove}: ${esterne.length} foto sono linkate da un altro sito. Scaricale con l'MCP: se quel sito le sposta, la demo si buca.`
    )
  }

  // Non errori, ma sono le cose che fanno sembrare una demo non finita.
  if (!sito.hero?.image) avvisi.push(`${dove}: manca la foto di apertura, la prima cosa che si vede.`)
  if (!(sito.units || []).length) avvisi.push(`${dove}: nessuna camera o appartamento.`)
  if ((sito.posts || []).length < 2) {
    avvisi.push(`${dove}: meno di due articoli nei consigli — «come arrivare» e «dove mangiare» funzionano quasi ovunque.`)
  }
  if (!(sito.offers || []).length) avvisi.push(`${dove}: nessuna offerta da mostrare.`)
  // Solo per le strutture vere: quelle inventate una pagina Booking non
  // ce l'hanno, e va benissimo che la barra apra il modulo di richiesta.
  if (sito.vetrina?.fonte && (sito.booking?.mode !== 'link' || !sito.booking?.link?.url)) {
    avvisi.push(
      `${dove}: la barra delle date non porta a Booking — metti il link della struttura in booking.link.url, ` +
        'così arrivo, partenza e ospiti arrivano già filtrati.'
    )
  }
  // Un link di ricerca sembra funzionare e invece porta alla home del
  // portale con i filtri vuoti: è il difetto peggiore, perché lo scopri
  // davanti al cliente mentre gli stai mostrando la prenotazione.
  const linkPrenota = sito.booking?.link?.url || ''
  if (linkPrenota.includes('searchresults')) {
    errori.push(
      `${dove}: la barra delle date porta a una RICERCA di Booking, non alla scheda. ` +
        'Booking ignora i filtri e apre la home: serve l’indirizzo con /hotel/ dentro.'
    )
  }
  if (/[?&](aid|label|sid|srepoch|srpvid)=/.test(linkPrenota)) {
    avvisi.push(
      `${dove}: il link di prenotazione ha dentro parametri di sessione (aid, label, sid…). ` +
        'Rilancia collega_booking: vengono tolti.'
    )
  }

  if (sito.settings?.['nav.gallery'] === true) {
    avvisi.push(`${dove}: la galleria è nel menu in alto; di norma si lascia solo nella pagina.`)
  }

  // Gli articoli hanno una pagina propria: l'id diventa l'indirizzo.
  const idStrani = (sito.posts || [])
    .filter((p) => p?.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id))
    .map((p) => p.id)
  if (idStrani.length) {
    errori.push(`${dove}: id di articolo non validi (diventano indirizzi): ${idStrani.join(', ')}`)
  }
}

// ── 3. Le foto non devono pesare quanto un film ──
const pesanti = []
for (const s of slug) {
  const dir = join(PUBBLICA, 'demo', s)
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir)) {
    const peso = readFileSync(join(dir, f)).length
    if (peso > 500_000) pesanti.push(`demo/${s}/${f} (${Math.round(peso / 1024)} KB)`)
  }
}
if (pesanti.length) {
  avvisi.push(
    `${pesanti.length} foto sopra i 500 KB — lancia \`npm run foto\`:\n      ${pesanti.slice(0, 5).join('\n      ')}`
  )
}

/** Tutti i percorsi immagine usati in una demo. */
function fotoUsate(s, includiEsterne = false) {
  const trovate = []
  const aggiungi = (v) => {
    if (typeof v !== 'string' || !v.trim()) return
    if (!includiEsterne && /^https?:/i.test(v)) return
    trovate.push(v)
  }
  aggiungi(s.hero?.image)
  aggiungi(s.hero?.video)
  aggiungi(s.story?.image)
  aggiungi(s.breakfast?.image)
  aggiungi(s.checkin?.image)
  aggiungi(s.brand?.logo)
  aggiungi(s.seo?.ogImage)
  for (const g of s.gallery || []) aggiungi(g?.src)
  for (const u of s.units || []) {
    aggiungi(u?.cover)
    for (const g of u?.gallery || []) aggiungi(g)
  }
  return trovate
}

// ── Esito ─────────────────────────────────────────────────────
console.log(`\n  ${slug.length} demo · ${ok} controlli superati, ${errori.length} falliti\n`)

for (const a of avvisi) console.log(`  ⚠ ${a}`)
if (avvisi.length) console.log('')

if (errori.length) {
  for (const e of errori) console.log(`  ✗ ${e}`)
  console.log('')
  process.exit(1)
}
console.log('  Tutto a posto.\n')
