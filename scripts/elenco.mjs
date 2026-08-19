#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Le demo che hai in casa
//
//    npm run demo
//
//  L'elenco non è più una pagina del portale: era l'unico punto da
//  cui un cliente, cancellando il proprio nome dall'indirizzo, poteva
//  arrivare alle anteprime degli altri. Vive qui, dove solo tu lo vedi.
// ─────────────────────────────────────────────────────────────

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROGETTO = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEMO = join(PROGETTO, 'demo')
const base = (process.env.DEMO_BASE_URL || '').replace(/\/+$/, '')

const slug = existsSync(DEMO)
  ? readdirSync(DEMO).filter((n) => existsSync(join(DEMO, n, 'sito.json')))
  : []

if (!slug.length) {
  console.log('\n  Nessuna demo. Se ne crea una parlando con l’assistente.\n')
  process.exit(0)
}

console.log('')
for (const s of slug) {
  const sito = JSON.parse(readFileSync(join(DEMO, s, 'sito.json'), 'utf8'))
  const foto = existsSync(join(PROGETTO, 'public', 'demo', s))
    ? readdirSync(join(PROGETTO, 'public', 'demo', s)).length
    : 0
  const v = sito.vetrina || {}

  console.log(`  ${sito.brand?.name || s}`)
  console.log(`    ${base || 'http://localhost:5174'}/${s}`)
  const pezzi = [
    v.luogo,
    `${(sito.units || []).length} unità`,
    `${foto} foto`,
    `${(sito.posts || []).length} articoli`,
    `${(sito.offers || []).length} offerte`,
    v.creata,
  ].filter(Boolean)
  console.log(`    ${pezzi.join(' · ')}`)
  if (v.nota) console.log(`    ${v.nota}`)
  console.log('')
}
console.log(`  ${slug.length} demo. Al cliente manda il link diretto alla sua.\n`)
