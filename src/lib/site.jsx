import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { applyTheme, recipesFor, motionFor, DEFAULT_THEME, THEME_IDS } from '@/themes'
import { resolveFeatures } from '@/config/features'
import { presetFor, DEFAULT_PRESET } from '@/config/presets'
import { normalizeBooking } from '@/config/booking-providers'
import { DEMO_SITE } from '@/content/demo'
import { EMPTY_SITE } from '@/content/empty'
import { deepMerge } from '@/lib/utils'
import { fetchSite } from '@/lib/api'

// ─────────────────────────────────────────────────────────────
//  StayKit — Contesto del sito
//
//  Un solo posto da cui tutti i componenti prendono: contenuti,
//  tema attivo, ricette di stile, feature risolte e preset della
//  tipologia di struttura.
//
//  Sui contenuti mancanti la regola è netta, e non è un dettaglio:
//   · sito COLLEGATO a un database → si parte da una struttura vuota.
//     Quello che il cliente non ha compilato non compare. Mai riempire
//     i buchi con i contenuti dimostrativi: significherebbe pubblicare
//     camere e recensioni inventate a nome di una struttura vera.
//   · sito NON collegato (sviluppo in locale) → contenuti dimostrativi,
//     perché lì servono proprio a far vedere com'è fatto.
// ─────────────────────────────────────────────────────────────

const SiteContext = createContext(null)
/**
 * La scelta di tema è per struttura, non per browser.
 *
 * Con una chiave sola, un giro sulla vetrina lasciava «noir» scritto
 * in memoria e il sito del cliente aperto dopo si apriva in noir —
 * sul suo dominio, senza che nessuno avesse toccato niente.
 */
const chiaveTema = (slug) => `staykit:theme:${slug || 'sito'}`

const FORCED_THEME = import.meta.env.VITE_FORCE_THEME || ''

const HA_DATABASE = Boolean(import.meta.env.VITE_SUPABASE_URL)

/**
 * I contenuti dimostrativi valgono in un solo caso: si sta lavorando
 * in locale SENZA database, cioè sul solo aspetto grafico.
 *
 * Le due condizioni servono a cose diverse e servono entrambe:
 *
 *  · `DEV` — in una build di produzione la demo non esiste, qualunque
 *    cosa succeda. Una variabile dimenticata su un deploy vero non può
 *    far comparire «Palazzo Fiorillo» sul dominio di un cliente.
 *
 *  · `!HA_DATABASE` — se un database c'è, si mostra sempre la verità.
 *    Un sito con `is_published = false` deve dire che è in allestimento
 *    anche in locale: rimpiazzarlo con la demo nasconde lo stato reale
 *    proprio nel momento in cui lo si sta verificando.
 */
const DEMO_CONSENTITA = import.meta.env.DEV && !HA_DATABASE

export function SiteProvider({ children, initial = null, offline = false }) {
  const [raw, setRaw] = useState(() => initial || EMPTY_SITE)

  // `initial` non è solo un valore di partenza: la vetrina lo cambia per
  // far vedere la stessa struttura come B&B, come appartamento, come
  // agriturismo. Senza questa sincronizzazione lo stato resterebbe
  // fermo al primo render e i bottoni della tipologia non farebbero
  // niente — cosa che è successa davvero.
  useEffect(() => {
    if (initial) setRaw(initial)
  }, [initial])
  const [status, setStatus] = useState(offline || initial ? 'ready' : 'loading')
  const [error, setError] = useState(null)
  const [previewTheme, setPreviewTheme] = useState(null)

  // ── Caricamento della configurazione ──
  useEffect(() => {
    if (offline || initial) return
    let alive = true
    fetchSite()
      .then((data) => {
        if (!alive) return
        const incoming = data?.site
        if (!incoming || !incoming.slug) throw new Error('Configurazione vuota.')
        setRaw(deepMerge(EMPTY_SITE, incoming))
        setStatus('ready')
      })
      .catch((err) => {
        if (!alive) return
        setError(err)
        if (DEMO_CONSENTITA) {
          console.info('[StayKit] Sviluppo locale senza database: uso i contenuti dimostrativi.')
          setRaw(DEMO_SITE)
          setStatus('ready')
        } else {
          // Sito non ancora pubblicato o database irraggiungibile: meglio una
          // pagina onesta che i contenuti di una struttura inventata.
          console.warn('[StayKit] Configurazione non disponibile.', err)
          setStatus('unavailable')
        }
      })
    return () => {
      alive = false
    }
  }, [offline, initial])

  const site = raw

  // ── Tema attivo ──
  // Ordine: anteprima dal pannello → ?theme= nell'URL (per mostrare
  // i tre stili al cliente) → forzato da env → scelta salvata → DB.
  const themeId = useMemo(() => {
    const candidates = [
      previewTheme,
      readUrlTheme(),
      FORCED_THEME,
      readStoredTheme(site.slug),
      site.theme,
      DEFAULT_THEME,
    ]
    return candidates.find((t) => t && THEME_IDS.includes(t)) || DEFAULT_THEME
  }, [previewTheme, site.theme, site.slug])

  useEffect(() => {
    applyTheme(themeId, site.themeOverrides || {})
  }, [themeId, site.themeOverrides])

  const preset = useMemo(() => presetFor(site.preset || DEFAULT_PRESET), [site.preset])

  const features = useMemo(
    () => resolveFeatures(site.plan, site.settings, site.preset || DEFAULT_PRESET),
    [site.plan, site.settings, site.preset]
  )

  const booking = useMemo(() => normalizeBooking(site.booking), [site.booking])

  const styles = useMemo(() => recipesFor(themeId), [themeId])
  const motion = useMemo(() => motionFor(themeId), [themeId])

  const units = useMemo(() => (site.units || []).filter((u) => u.active !== false), [site.units])

  const setTheme = useCallback(
    (id, { persist = true } = {}) => {
      if (!THEME_IDS.includes(id)) return
      setPreviewTheme(id)
      if (persist) {
        try {
          localStorage.setItem(chiaveTema(site.slug), id)
        } catch {
          /* ignora */
        }
      }
    },
    [site.slug]
  )

  const value = useMemo(
    () => ({
      site,
      setSite: setRaw,
      status,
      error,
      themeId,
      setTheme,
      styles,
      motion,
      preset,
      features,
      booking,
      units,
      /** Scorciatoia: has('section.gallery') */
      has: (key) => features[key] === true,
    }),
    [site, status, error, themeId, setTheme, styles, motion, preset, features, booking, units]
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite va usato dentro <SiteProvider>')
  return ctx
}

/** Solo le ricette di stile del tema attivo. */
export function useStyles() {
  return useSite().styles
}

/** Preset di animazione del tema attivo. */
export function useMotionPreset() {
  return useSite().motion
}

/** Una singola feature risolta. */
export function useFeature(key) {
  return useSite().features[key] === true
}

function readStoredTheme(slug) {
  try {
    return localStorage.getItem(chiaveTema(slug))
  } catch {
    return null
  }
}

/** ?theme=noir — anteprima "usa e getta", non viene memorizzata. */
function readUrlTheme() {
  try {
    return new URLSearchParams(window.location.search).get('theme')
  } catch {
    return null
  }
}
