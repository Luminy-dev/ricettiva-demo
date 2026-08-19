#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Esporta una demo per metterla live
//
//    npm run esporta -- nomecliente --base https://demo.tuodominio.it
//
//  Produce `export/nomecliente.json`, che si carica dal pannello del
//  sito vero: Esporta e importa → Importa un sito.
//
//  ── Il punto: le foto ──
//
//  Nella demo le immagini sono percorsi tipo /demo/nomecliente/hero.jpg,
//  che esistono solo su questo portale. Nell'export diventano indirizzi
//  completi — https://demo.tuodominio.it/demo/nomecliente/hero.jpg —
//  perché l'import del sito vero deve poterle scaricare.
//
//  E le scarica: le mette nello spazio del cliente e riscrive i
//  percorsi. Perciò l'indirizzo del portale serve solo il giorno del
//  trasferimento, e da lì in poi il sito del cliente non dipende più
//  da niente di tuo. Se lasciassi i link com'erano, il giorno che
//  spegni il portale il suo sito perderebbe tutte le foto.
// ─────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROGETTO = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEMO = join(PROGETTO, 'demo')
const PUBBLICA = join(PROGETTO, 'public')
const USCITA = join(PROGETTO, 'export')

// ── Argomenti ─────────────────────────────────────────────────

const argomenti = process.argv.slice(2)
const slug = argomenti.find((a) => !a.startsWith('--'))
const iBase = argomenti.indexOf('--base')
const base = (iBase >= 0 ? argomenti[iBase + 1] : process.env.DEMO_BASE_URL || '').replace(/\/+$/, '')

if (!slug) {
  console.error('\n  Uso:  npm run esporta -- nomecliente --base https://demo.tuodominio.it\n')
  console.error('  Demo disponibili:')
  for (const d of elenco()) console.error(`    ${d}`)
  console.error('')
  process.exit(1)
}

const file = join(DEMO, slug, 'sito.json')
if (!existsSync(file)) {
  console.error(`\n  La demo "${slug}" non esiste.\n`)
  process.exit(1)
}

if (!base) {
  console.error('\n  Manca l’indirizzo del portale (--base).\n')
  console.error('  Serve perché le foto della demo diventino indirizzi che il')
  console.error('  sito del cliente possa scaricare. Per esempio:\n')
  console.error('    npm run esporta -- ' + slug + ' --base https://demo.tuodominio.it\n')
  console.error('  Se il portale non è ancora online, pubblicalo prima: senza')
  console.error('  un indirizzo raggiungibile le foto non possono essere trasferite.\n')
  process.exit(1)
}
if (!/^https?:\/\//i.test(base)) {
  console.error(`\n  L’indirizzo deve cominciare con https:// — ricevuto "${base}"\n`)
  process.exit(1)
}

// ── Trasformazione ────────────────────────────────────────────

const sito = JSON.parse(readFileSync(file, 'utf8'))
const mancanti = []
let assolute = 0

const assoluto = (percorso) => {
  if (typeof percorso !== 'string' || !percorso.trim()) return percorso
  if (/^https?:\/\//i.test(percorso)) return percorso // già completo
  if (!percorso.startsWith('/')) return percorso

  if (!existsSync(join(PUBBLICA, percorso.replace(/^\//, '')))) mancanti.push(percorso)
  assolute++
  return base + percorso
}

sito.hero = sito.hero || {}
sito.hero.image = assoluto(sito.hero.image)
sito.hero.video = assoluto(sito.hero.video)
if (sito.story) sito.story.image = assoluto(sito.story.image)
if (sito.breakfast) sito.breakfast.image = assoluto(sito.breakfast.image)
if (sito.checkin) sito.checkin.image = assoluto(sito.checkin.image)
if (sito.brand) sito.brand.logo = assoluto(sito.brand.logo)
if (sito.seo) sito.seo.ogImage = assoluto(sito.seo.ogImage)
for (const g of sito.gallery || []) if (g) g.src = assoluto(g.src)
for (const u of sito.units || []) {
  if (!u) continue
  u.cover = assoluto(u.cover)
  if (Array.isArray(u.gallery)) u.gallery = u.gallery.map(assoluto)
}

// Le note di servizio restano tue: nel sito del cliente non c'entrano.
const note = sito.vetrina
delete sito.vetrina
delete sito.slug

const esportato = {
  _formato: 'staykit/sito',
  _versione: 1,
  _origine: `demo/${slug}`,
  _esportato: new Date().toISOString(),
  ...sito,
}

mkdirSync(USCITA, { recursive: true })
const destinazione = join(USCITA, `${slug}.json`)
writeFileSync(destinazione, JSON.stringify(esportato, null, 2) + '\n')

// ── Esito ─────────────────────────────────────────────────────

const peso = Math.round(readFileSync(destinazione).length / 1024)
console.log(`\n  export/${slug}.json  (${peso} KB)\n`)
console.log(`  ${assolute} foto trasformate in indirizzi su ${base}`)
console.log(`  ${(esportato.units || []).length} unità · ${(esportato.gallery || []).length} in galleria`)
if (note?.fonte) console.log(`  Dati presi da: ${note.fonte}`)

if (mancanti.length) {
  console.log(`\n  ⚠ ${mancanti.length} foto non esistono in public/ — l’import non riuscirà a scaricarle:`)
  for (const m of mancanti.slice(0, 8)) console.log(`      ${m}`)
  console.log('')
}

console.log(`
  Come si mette live:

    1. Il portale dev'essere online a ${base}
       (l'import scarica le foto da lì, una volta sola)
    2. Apri il pannello del sito vero, attiva il modo rivenditore
    3. «Esporta e importa» → Importa un sito → scegli questo file
    4. Lascia acceso «scarica le foto»: da quel momento il sito
       del cliente non dipende più dal portale
`)

function elenco() {
  if (!existsSync(DEMO)) return []
  return readdirSync(DEMO).filter((n) => existsSync(join(DEMO, n, 'sito.json')))
}
