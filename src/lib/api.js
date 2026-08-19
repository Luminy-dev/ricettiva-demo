// ─────────────────────────────────────────────────────────────
//  Il portale non ha un backend — versione portale di api.js
//
//  Nel progetto principale questo file parla con /api/*. Qui non c'è
//  niente con cui parlare: le demo sono file, il portale è statico.
//
//  ⚠ Escluso da `npm run allinea`: è una differenza voluta fra i due
//  progetti, non una copia rimasta indietro.
//
//  ── Cosa succede se un cliente compila il modulo durante la demo ──
//
//  Il modulo si comporta come se avesse inviato. È una scelta, e la
//  motivo: la cosa che vuoi far vedere è il percorso — sceglie le
//  date, lascia i recapiti, riceve conferma — e un errore rosso in
//  mezzo alla dimostrazione sembra un sito rotto, non una demo.
//
//  Il rischio è che qualcuno creda di aver mandato davvero una
//  richiesta. Per questo la barra di regia lo dice, per tutto il tempo
//  in cui la demo è aperta, invece di lasciarlo intuire.
// ─────────────────────────────────────────────────────────────

const RITARDO = 700 // quanto basta a far vedere lo stato "invio in corso"

const finge = (valore) =>
  new Promise((risolvi) => setTimeout(() => risolvi(valore), RITARDO))

/** Sul portale i contenuti arrivano dai file, non dalla rete. */
export function fetchSite() {
  return Promise.reject(new Error('Il portale legge le demo dai file, non da un’API.'))
}

export function submitRequest() {
  console.info('[Portale demo] Richiesta non inviata: questa è un’anteprima.')
  return finge({ ok: true, demo: true })
}

export function submitContact() {
  console.info('[Portale demo] Messaggio non inviato: questa è un’anteprima.')
  return finge({ ok: true, demo: true })
}

// ── Pannello ──
//  Sul portale non esiste: le demo si creano con l'MCP e si
//  modificano riscrivendo il file. Le funzioni ci sono solo perché
//  qualche componente del template le importa.

const senzaPannello = () => Promise.reject(new Error('Il pannello non è disponibile sul portale delle demo.'))

export const adminLoadSite = senzaPannello
export const adminSaveSite = senzaPannello
export const adminListRequests = senzaPannello
export const adminUpdateRequest = senzaPannello
export const adminDeleteRequest = senzaPannello
export const adminUsage = senzaPannello
export const resellerSavePlan = senzaPannello

export const TENANT = ''
