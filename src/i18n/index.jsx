import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DICT, LANGUAGES, LANG_CODES, DEFAULT_LANG } from './dictionary'

// ─────────────────────────────────────────────────────────────
//  StayKit — Provider lingua
//
//  · `ui(key)`     stringhe fisse dell'interfaccia (dizionario)
//  · `t(value)`    contenuti dal DB: { it: '…', en: '…' } → stringa
//                  con catena di fallback lingua → default → prima
//                  lingua valorizzata. Accetta anche stringhe secche.
// ─────────────────────────────────────────────────────────────

const I18nContext = createContext(null)
const STORAGE_KEY = 'staykit:lang'

function detectLang(available, fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && available.includes(saved)) return saved
  } catch {
    /* localStorage non disponibile */
  }
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl && available.includes(fromUrl)) return fromUrl
  for (const nav of navigator.languages || [navigator.language || '']) {
    const code = String(nav).slice(0, 2).toLowerCase()
    if (available.includes(code)) return code
  }
  return fallback
}

export function I18nProvider({ children, languages, defaultLang = DEFAULT_LANG, enabled = true }) {
  const available = useMemo(() => {
    const list = (languages || [defaultLang]).filter((l) => LANG_CODES.includes(l))
    return list.length ? list : [DEFAULT_LANG]
  }, [languages, defaultLang])

  const fallback = available.includes(defaultLang) ? defaultLang : available[0]
  const [lang, setLangState] = useState(() => (enabled ? detectLang(available, fallback) : fallback))

  // Se il set di lingue cambia (es. il cliente ne disattiva una), riallinea
  useEffect(() => {
    if (!available.includes(lang)) setLangState(fallback)
  }, [available, lang, fallback])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignora */
    }
  }, [lang])

  const setLang = useCallback(
    (next) => {
      if (available.includes(next)) setLangState(next)
    },
    [available]
  )

  /** Stringa fissa dell'interfaccia. Supporta i placeholder {nome}. */
  const ui = useCallback(
    (key, vars) => {
      const table = DICT[lang] || DICT[fallback] || DICT.it
      let out = table[key] ?? DICT.it[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v))
      }
      return out
    },
    [lang, fallback]
  )

  /** Contenuto multilingua dal DB. */
  const t = useCallback(
    (value) => {
      if (value == null) return ''
      if (typeof value === 'string' || typeof value === 'number') return String(value)
      if (Array.isArray(value)) return value.map(t).filter(Boolean).join(' ')
      if (typeof value !== 'object') return ''
      const direct = value[lang]
      if (isFilled(direct)) return String(direct).trim()
      const def = value[fallback]
      if (isFilled(def)) return String(def).trim()
      for (const code of LANG_CODES) {
        if (isFilled(value[code])) return String(value[code]).trim()
      }
      return ''
    },
    [lang, fallback]
  )

  /**
   * Come `t`, ma per i campi che contengono LISTE per lingua:
   * { it: ['…','…'], en: ['…'] } → array di stringhe.
   */
  const tList = useCallback(
    (value) => {
      if (!value) return []
      if (Array.isArray(value)) return value.map((v) => t(v)).filter(Boolean)
      if (typeof value !== 'object') return [String(value)]
      const order = [lang, fallback, ...LANG_CODES]
      for (const code of order) {
        const v = value[code]
        if (Array.isArray(v) && v.length) return v.map(String)
        if (typeof v === 'string' && v.trim()) return [v.trim()]
      }
      return []
    },
    [lang, fallback, t]
  )

  const value = useMemo(
    () => ({
      lang,
      setLang,
      ui,
      t,
      tList,
      available,
      defaultLang: fallback,
      multilingual: enabled && available.length > 1,
      languages: available.map((code) => LANGUAGES[code]),
    }),
    [lang, setLang, ui, t, tList, available, fallback, enabled]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n va usato dentro <I18nProvider>')
  return ctx
}

function isFilled(v) {
  return typeof v === 'string' ? v.trim().length > 0 : v != null && v !== ''
}

export { LANGUAGES, LANG_CODES, DEFAULT_LANG }
