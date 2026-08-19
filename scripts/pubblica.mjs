#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  Manda tutto online
//
//    npm run pubblica
//    npm run pubblica -- "nuove foto Palazzo Fiorillo"
//    npm run pubblica -- --veloce      → salta i controlli
//
//  Un comando solo: controlla, salva, spinge su GitHub. Vercel si
//  accorge del push da sé e ricostruisce il sito: non c'è un secondo
//  passaggio da ricordare, e non c'è modo di pubblicare metà lavoro.
//
//  Se i controlli falliscono non parte niente: meglio accorgersene
//  qui che davanti al cliente, con il sito già aggiornato.
// ─────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROGETTO = join(dirname(fileURLToPath(import.meta.url)), '..')
const RAMO = 'main'

const argomenti = process.argv.slice(2)
const veloce = argomenti.includes('--veloce')
const messaggio =
  argomenti.filter((a) => !a.startsWith('--')).join(' ').trim() ||
  `aggiornamento demo — ${new Date().toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}`

const esegui = (comando, args, { silenzioso = false } = {}) =>
  spawnSync(comando, args, {
    cwd: PROGETTO,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    stdio: silenzioso ? 'pipe' : 'inherit',
  })

const leggi = (comando, args) => (esegui(comando, args, { silenzioso: true }).stdout || '').trim()

const stop = (testo, suggerimento) => {
  console.error(`\n  ✗ ${testo}`)
  if (suggerimento) console.error(`    ${suggerimento}\n`)
  process.exit(1)
}

// ── 1. siamo in una repo, con un origin? ────────────────────
if (leggi('git', ['rev-parse', '--is-inside-work-tree']) !== 'true')
  stop("Qui non c'è nessuna repo git.", 'git init -b main && git remote add origin <indirizzo>')

const origin = leggi('git', ['remote', 'get-url', 'origin'])
if (!origin) stop('Manca il remote origin.', 'git remote add origin https://github.com/<utente>/<repo>.git')

// ── 2. i controlli, prima di toccare qualsiasi cosa ─────────
if (!veloce) {
  console.log('\n  Controlli e build…\n')
  if (esegui('npm', ['run', 'check']).status !== 0)
    stop('I controlli non passano: non pubblico niente.', 'Sistema quello che segnala qui sopra, poi rilancia.')
}

// ── 3. c'è davvero qualcosa da pubblicare? ──────────────────
esegui('git', ['add', '-A'], { silenzioso: true })
const modifiche = leggi('git', ['status', '--porcelain'])

// Non bastano i file cambiati: può esserci un commit già fatto e mai
// spinto — è il caso della primissima volta, e di ogni push fallito.
const conUpstream = leggi('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']) !== ''
const arretrati = Number(leggi('git', ['rev-list', '--count', conUpstream ? '@{u}..HEAD' : 'HEAD'])) || 0

if (!modifiche && arretrati === 0) {
  console.log('\n  · Niente di nuovo da pubblicare: GitHub è già allineato.\n')
  process.exit(0)
}

if (modifiche) {
  const righe = modifiche.split('\n')
  console.log(`\n  ${righe.length} file ${righe.length === 1 ? 'cambiato' : 'cambiati'}:\n`)
  console.log(righe.slice(0, 12).map((r) => `    ${r}`).join('\n'))
  if (righe.length > 12) console.log(`    … e altri ${righe.length - 12}`)

  console.log(`\n  Salvo: "${messaggio}"\n`)
  if (esegui('git', ['commit', '-m', messaggio]).status !== 0) stop('Il commit non è andato a buon fine.')
} else {
  console.log(`\n  Nessun file cambiato, ma ${arretrati} commit ancora da spingere.`)
}

// ── 4. spingi ───────────────────────────────────────────────
console.log(`\n  Spingo su ${origin} (${RAMO})…\n`)
if (esegui('git', ['push', '-u', 'origin', RAMO]).status !== 0)
  stop(
    'Il push è fallito.',
    'Se è la prima volta: gh auth login. Se qualcun altro ha spinto prima di te: git pull --rebase, poi rilancia.',
  )

console.log('\n  ✓ Fatto. Vercel sta già ricostruendo il sito (di solito ~1 minuto).\n')
