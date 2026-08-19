#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Allineamento del template dal progetto principale
//
//  Il portale è una repo separata, per scelta. Il prezzo di quella
//  scelta è la deriva: correggi qualcosa nel template e le demo
//  continuano a mostrare la versione vecchia — cioè proprio le pagine
//  che il cliente guarda per decidere.
//
//  Questo script paga quel prezzo in un comando. Ricopia dal progetto
//  principale le cartelle che NON sono del portale (temi, componenti,
//  sezioni, dizionari, utilità) e lascia stare tutto il resto.
//
//    npm run allinea            → mostra cosa cambierebbe, senza toccare
//    npm run allinea -- --scrivi → applica
//
//  Le cartelle del portale (src/pages, src/portale) non vengono mai
//  toccate: sono roba nostra e nel progetto principale non esistono.
// ─────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const PORTALE = join(QUI, '..')

/** Dove sta il progetto principale. Cambiabile con TEMPLATE_DIR. */
const TEMPLATE =
  process.env.TEMPLATE_DIR || join(PORTALE, '..', 'Website bnb', 'frontend')

/** Cartelle che arrivano dal template, così come sono. */
const CARTELLE = ['src/themes', 'src/components', 'src/sections', 'src/config', 'src/i18n', 'src/lib']

/** File singoli che arrivano dal template. */
const FILE = ['src/index.css', 'tailwind.config.js', 'postcss.config.js', 'src/content/empty.js']

/**
 * Cosa NON copiare, anche se sta dentro le cartelle sopra.
 *
 *  · vetrina.js  — l'interruttore del template guarda VITE_DEMO; qui
 *    il portale È la vetrina, e la regola è un'altra.
 *  · api.js      — il template chiama /api/site; il portale legge da
 *    file. Sono due modi diversi di prendere i contenuti.
 *  · privacy-link.js — nel template l'informativa sta su /privacy;
 *    qui ogni demo ha la sua, su /<slug>/privacy.
 */
const ESCLUSI = ['src/config/vetrina.js', 'src/lib/api.js', 'src/lib/privacy-link.js']

const scrivi = process.argv.includes('--scrivi')

if (!existsSync(TEMPLATE)) {
  console.error(`\n  Non trovo il progetto principale in:\n    ${TEMPLATE}\n`)
  console.error('  Se sta altrove, indicalo così:')
  console.error('    TEMPLATE_DIR="C:/percorso/al/frontend" npm run allinea\n')
  process.exit(1)
}

const nuovi = []
const cambiati = []
const uguali = []
const spariti = []

for (const cartella of CARTELLE) {
  const origine = join(TEMPLATE, cartella)
  if (!existsSync(origine)) continue
  for (const file of elencaRicorsivo(origine)) {
    const rel = join(cartella, relative(origine, file)).replaceAll('\\', '/')
    if (ESCLUSI.includes(rel)) continue
    confronta(rel)
  }
}
for (const rel of FILE) {
  if (existsSync(join(TEMPLATE, rel))) confronta(rel)
}

// File che avevamo e che nel template non ci sono più: quasi sempre
// vuol dire che qualcosa è stato rinominato, e va guardato a mano.
for (const cartella of CARTELLE) {
  const nostra = join(PORTALE, cartella)
  if (!existsSync(nostra)) continue
  for (const file of elencaRicorsivo(nostra)) {
    const rel = join(cartella, relative(nostra, file)).replaceAll('\\', '/')
    if (ESCLUSI.includes(rel)) continue
    if (!existsSync(join(TEMPLATE, rel))) spariti.push(rel)
  }
}

function confronta(rel) {
  const daTemplate = readFileSync(join(TEMPLATE, rel), 'utf8')
  const destinazione = join(PORTALE, rel)

  if (!existsSync(destinazione)) {
    nuovi.push(rel)
  } else if (readFileSync(destinazione, 'utf8') === daTemplate) {
    uguali.push(rel)
    return
  } else {
    cambiati.push(rel)
  }

  if (scrivi) {
    mkdirSync(dirname(destinazione), { recursive: true })
    writeFileSync(destinazione, daTemplate)
  }
}

function elencaRicorsivo(dir) {
  const out = []
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome)
    if (statSync(p).isDirectory()) out.push(...elencaRicorsivo(p))
    else out.push(p)
  }
  return out
}

// ── Esito ─────────────────────────────────────────────────────
console.log(`\n  Template: ${TEMPLATE}\n`)
if (nuovi.length) {
  console.log(`  Nuovi (${nuovi.length}):`)
  for (const f of nuovi) console.log(`    + ${f}`)
  console.log('')
}
if (cambiati.length) {
  console.log(`  Aggiornati (${cambiati.length}):`)
  for (const f of cambiati) console.log(`    ~ ${f}`)
  console.log('')
}
if (spariti.length) {
  console.log(`  Non esistono più nel template (${spariti.length}) — controllali a mano:`)
  for (const f of spariti) console.log(`    ? ${f}`)
  console.log('')
}
console.log(`  Già allineati: ${uguali.length}`)

if (!scrivi && (nuovi.length || cambiati.length)) {
  console.log('\n  Nessun file toccato. Per applicare:\n    npm run allinea -- --scrivi\n')
} else if (scrivi) {
  console.log('\n  Fatto. Ora lancia `npm run check` prima di pubblicare.\n')
} else {
  console.log('\n  Tutto allineato.\n')
}
