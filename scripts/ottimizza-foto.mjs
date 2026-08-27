#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Ottimizzazione delle immagini
//
//    npm run foto            → tutte le cartelle
//    npm run foto -- pannello → solo le schermate del pannello
//    npm run foto -- demo/nomecliente
//
//  Cosa fa: ridimensiona, converte in WebP, riscrive il file. Le
//  schermate di un portatile pesano 800 KB l'una in PNG; sette di
//  quelle sono 5 MB su una pagina che dovrebbe convincere qualcuno a
//  comprare, e su rete mobile non la guarda nessuno.
//
//  È idempotente: rilanciarlo su file già ottimizzati non li rovina
//  (li salta se sono già WebP sotto la soglia).
// ─────────────────────────────────────────────────────────────

import { readdirSync, statSync, existsSync, renameSync, unlinkSync } from 'node:fs'
import { join, extname, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORTALE = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBBLICA = join(PORTALE, 'public')

/** Larghezza massima e qualità, per tipo di cartella. */
const REGOLE = {
  // Le schermate vanno lette: servono i pixel, ma non quelli di un 5K.
  pannello: { larghezza: 1600, qualita: 82 },
  // Le foto delle strutture: coprono l'intera pagina, ma 2000px bastano.
  demo: { larghezza: 2000, qualita: 80 },
}

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('\n  Manca sharp. Installalo con:\n    npm install\n')
  process.exit(1)
}

const argomento = process.argv[2] || ''
const cartelle = argomento
  ? [join(PUBBLICA, argomento)]
  : [join(PUBBLICA, 'pannello'), join(PUBBLICA, 'demo')]

let convertiti = 0
let saltati = 0
let risparmio = 0

for (const cartella of cartelle) {
  if (!existsSync(cartella)) continue
  for (const file of immagini(cartella)) await elabora(file)
}

console.log(
  `\n  ${convertiti} immagini ottimizzate, ${saltati} già a posto` +
    (risparmio > 0 ? ` — risparmiati ${(risparmio / 1048576).toFixed(1)} MB` : '') +
    '\n'
)

async function elabora(file) {
  const est = extname(file).toLowerCase()
  const regola = file.includes(`${sep()}pannello${sep()}`) ? REGOLE.pannello : REGOLE.demo
  const prima = statSync(file).size

  // Già WebP e già leggera: non la tocco.
  if (est === '.webp' && prima < 350_000) {
    saltati++
    return
  }
  // Gli SVG sono già vettoriali, convertirli sarebbe un peggioramento.
  if (est === '.svg') {
    saltati++
    return
  }

  const destinazione = join(dirname(file), `${basename(file, est)}.webp`)
  const temporaneo = `${destinazione}.tmp`

  try {
    await sharp(file)
      .rotate() // rispetta l'orientamento delle foto scattate col telefono
      .resize({ width: regola.larghezza, withoutEnlargement: true })
      .webp({ quality: regola.qualita })
      .toFile(temporaneo)

    const dopo = statSync(temporaneo).size

    // Se la conversione peggiora le cose, si tiene l'originale.
    if (est === '.webp' && dopo >= prima) {
      unlinkSync(temporaneo)
      saltati++
      return
    }

    if (file !== destinazione) unlinkSync(file)
    renameSync(temporaneo, destinazione)

    convertiti++
    risparmio += prima - dopo
    console.log(`  ${basename(file)} → ${basename(destinazione)}  ${kb(prima)} → ${kb(dopo)}`)
  } catch (err) {
    if (existsSync(temporaneo)) unlinkSync(temporaneo)
    console.error(`  ✗ ${basename(file)}: ${err.message}`)
  }
}

function immagini(dir) {
  const out = []
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome)
    if (statSync(p).isDirectory()) out.push(...immagini(p))
    else if (/\.(png|jpe?g|webp|avif|svg)$/i.test(nome)) out.push(p)
  }
  return out
}

function kb(b) {
  return `${Math.round(b / 1024)} KB`
}
function sep() {
  return process.platform === 'win32' ? '\\' : '/'
}
