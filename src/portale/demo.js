import { EMPTY_SITE } from '@/content/empty'
import { deepMerge } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
//  Le demo: una cartella per struttura, niente database
//
//  Ogni demo è un file `demo/<slug>/sito.json` con esattamente la
//  forma che il pannello salva su Supabase nel progetto principale.
//  Le foto stanno in `public/demo/<slug>/`.
//
//  Perché file e non database:
//   · una demo la crea l'MCP, la guardi, e o va o si rifà. Non ha
//     bisogno di essere modificabile da un pannello.
//   · niente database vuol dire niente credenziali sul portale,
//     niente API da proteggere, niente rischio di arrivare per sbaglio
//     ai dati di un cliente vero.
//   · le demo finiscono in git: sai sempre cosa hai mostrato a chi, e
//     puoi tornare indietro.
//
//  import.meta.glob con eager: i JSON entrano nel bundle in fase di
//  build. Il portale è statico, non c'è niente da chiamare a runtime.
// ─────────────────────────────────────────────────────────────

const FILE = import.meta.glob('#demo/*/sito.json', { eager: true, import: 'default' })

/** slug → contenuti completi, con i buchi riempiti dalla struttura vuota. */
export const DEMO = Object.fromEntries(
  Object.entries(FILE).map(([percorso, dati]) => {
    const slug = percorso.split('/').at(-2)
    return [slug, { ...deepMerge(EMPTY_SITE, dati), slug }]
  })
)

export const SLUG_DEMO = Object.keys(DEMO).sort((a, b) => nome(a).localeCompare(nome(b)))

function nome(slug) {
  return DEMO[slug]?.brand?.name || slug
}

/**
 * Scheda breve di una demo, per l'indice.
 * Legge dal `vetrina` del file, se c'è: sono le note che scrivi tu per
 * ricordarti chi è questo cliente, e non finiscono sul sito.
 */
export function schedaDemo(slug) {
  const sito = DEMO[slug]
  if (!sito) return null
  const v = sito.vetrina || {}
  const indirizzo = sito.contact?.address || {}
  return {
    slug,
    nome: sito.brand?.name || slug,
    tipologia: sito.preset || 'bnb',
    tema: sito.theme || 'glass',
    luogo: v.luogo || [indirizzo.city, indirizzo.province].filter(Boolean).join(' · '),
    nota: v.nota || '',
    creata: v.creata || '',
    fonte: v.fonte || '',
    copertina: sito.hero?.image || sito.gallery?.[0]?.src || '',
    unita: (sito.units || []).filter((u) => u.active !== false).length,
  }
}

export function esisteDemo(slug) {
  return Boolean(DEMO[slug])
}
