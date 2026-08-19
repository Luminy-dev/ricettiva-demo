// ─────────────────────────────────────────────────────────────
//  StayKit — Design token dei tre temi
//
//  Ogni tema è un insieme di token (colori in HEX + geometria +
//  tipografia). Vengono trasformati in variabili CSS su <html> da
//  `applyTheme()`, così Tailwind (`bg-brand`, `text-ink`, …) segue
//  automaticamente il tema attivo.
//
//  Il cliente, dal pannello admin, può sovrascrivere SOLO i colori
//  di marca (brand/accent) e poco altro: la struttura resta coerente.
// ─────────────────────────────────────────────────────────────

/** Colori sovrascrivibili dal cliente dal pannello (vedi admin/ThemeEditor). */
export const OVERRIDABLE_COLORS = ['brand', 'brandSoft', 'brandDeep', 'accent']

export const THEMES = {
  // ───────────────────────────────────────────────────────────
  //  GLASS — Apple / visionOS: vetro smerigliato, luce, aria
  // ───────────────────────────────────────────────────────────
  glass: {
    id: 'glass',
    name: 'Vetro',
    tagline: 'Moderno, luminoso, effetto vetro smerigliato',
    scheme: 'light',
    preview: ['#F4F6F8', '#0E9AA7', '#F5A25D'],
    colors: {
      bg: '#F3F6F9',
      bgAlt: '#E9EFF4',
      bgDeep: '#DCE5EC',
      surface: '#FFFFFF',
      surfaceRaised: '#FFFFFF',
      ink: '#0F1725',
      inkSoft: '#3A4759',
      inkMuted: '#68758A',
      line: '#D9E1E9',
      lineStrong: '#BCC8D6',
      brand: '#0E9AA7',
      brandSoft: '#5CC6CF',
      brandDeep: '#0A7680',
      brandInk: '#FFFFFF',
      accent: '#F5A25D',
      accentSoft: '#FBD3AC',
      ok: '#16A34A',
      warn: '#D97706',
      danger: '#DC2626',
    },
    geometry: {
      radius: '18px',
      radiusLg: '26px',
      radiusXl: '36px',
      blur: '22px',
      shadowCard: '0 10px 34px -18px rgba(15, 23, 37, .35)',
      shadowFloat: '0 28px 70px -30px rgba(15, 23, 37, .45)',
      shadowGlow: '0 14px 44px -14px rgba(14, 154, 167, .55)',
      borderWidth: '1px',
    },
    fonts: {
      display: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
      sans: '"Inter Variable", Inter, system-ui, sans-serif',
    },
    // Sfondo decorativo della pagina (mesh di luce dietro il vetro)
    backdrop:
      'radial-gradient(1100px 620px at 12% -8%, rgba(92,198,207,.42), transparent 62%),' +
      'radial-gradient(880px 520px at 88% 4%, rgba(245,162,93,.30), transparent 60%),' +
      'radial-gradient(900px 700px at 50% 108%, rgba(14,154,167,.20), transparent 66%)',
  },

  // ───────────────────────────────────────────────────────────
  //  HERITAGE — classico ma attuale: carta, serif, verde bosco
  // ───────────────────────────────────────────────────────────
  heritage: {
    id: 'heritage',
    name: 'Heritage',
    tagline: 'Classico e curato, tipografia serif e toni caldi',
    scheme: 'light',
    preview: ['#FAF7F1', '#3F5B4C', '#B08947'],
    colors: {
      bg: '#FAF7F1',
      bgAlt: '#F2EDE3',
      bgDeep: '#E7DFD0',
      surface: '#FFFDF9',
      surfaceRaised: '#FFFFFF',
      ink: '#241F1A',
      inkSoft: '#4A423A',
      inkMuted: '#6E6459',
      line: '#DFD5C4',
      lineStrong: '#C6B79E',
      brand: '#3F5B4C',
      brandSoft: '#6E8C7B',
      brandDeep: '#2C4237',
      brandInk: '#FBF8F2',
      accent: '#B08947',
      accentSoft: '#DEC79A',
      ok: '#3F7D4E',
      warn: '#B07B29',
      danger: '#A63A2E',
    },
    geometry: {
      radius: '3px',
      radiusLg: '6px',
      radiusXl: '10px',
      blur: '8px',
      shadowCard: '0 2px 0 0 rgba(36,31,26,.06), 0 14px 34px -26px rgba(36,31,26,.5)',
      shadowFloat: '0 26px 60px -34px rgba(36,31,26,.55)',
      shadowGlow: '0 10px 30px -14px rgba(176,137,71,.5)',
      borderWidth: '1px',
    },
    fonts: {
      display: '"Fraunces Variable", Fraunces, "Iowan Old Style", Georgia, serif',
      sans: '"Inter Variable", Inter, system-ui, sans-serif',
    },
    backdrop:
      'radial-gradient(900px 520px at 100% 0%, rgba(176,137,71,.16), transparent 60%),' +
      'radial-gradient(760px 520px at 0% 30%, rgba(63,91,76,.12), transparent 62%)',
  },

  // ───────────────────────────────────────────────────────────
  //  NOIR — dark cinematic: notte, ottone, contrasto alto
  // ───────────────────────────────────────────────────────────
  noir: {
    id: 'noir',
    name: 'Noir',
    tagline: 'Sera elegante, ottone caldo e ombre morbide',
    scheme: 'dark',
    preview: ['#1B1E25', '#D4AF37', '#9CB3C6'],
    // ── Perché non è nero ──
    //
    //  La prima versione partiva da #0B0C0F, praticamente nero. Su
    //  schermo sembrava una fotografia sottoesposta: le foto delle
    //  camere ci sparivano dentro, i bordi non si vedevano e su un
    //  portatile con la luminosità bassa il testo secondario era
    //  illeggibile.
    //
    //  Il fondo ora è un grigio-blu scuro: mantiene il carattere
    //  serale ma lascia respirare le immagini e permette a superfici
    //  e filetti di distinguersi dallo sfondo. Il contrasto del testo
    //  principale resta oltre 12:1, molto sopra il minimo AA.
    colors: {
      bg: '#1B1E25',
      bgAlt: '#232730',
      bgDeep: '#141720',
      surface: '#272B35',
      surfaceRaised: '#313641',
      ink: '#F6F4F0',
      inkSoft: '#D2CDC5',
      inkMuted: '#9E998F',
      line: '#3C414C',
      lineStrong: '#565D6A',
      brand: '#D4AF37',
      brandSoft: '#EBCF74',
      brandDeep: '#A8801E',
      brandInk: '#14171E',
      accent: '#9CB3C6',
      accentSoft: '#C8D6E1',
      ok: '#4ADE80',
      warn: '#FBBF24',
      danger: '#F87171',
    },
    geometry: {
      radius: '2px',
      radiusLg: '4px',
      radiusXl: '8px',
      blur: '16px',
      // Ombre più morbide: su un fondo meno cupo un nero pieno
      // creerebbe aloni invece di profondità.
      shadowCard: '0 18px 44px -28px rgba(0,0,0,.75)',
      shadowFloat: '0 40px 90px -44px rgba(0,0,0,.85)',
      shadowGlow: '0 12px 40px -14px rgba(212,175,55,.38)',
      borderWidth: '1px',
    },
    fonts: {
      display: '"Fraunces Variable", Fraunces, "Times New Roman", serif',
      sans: '"Inter Variable", Inter, system-ui, sans-serif',
    },
    backdrop:
      'radial-gradient(1000px 620px at 50% -10%, rgba(212,175,55,.14), transparent 64%),' +
      'radial-gradient(760px 620px at 8% 100%, rgba(156,179,198,.10), transparent 62%)',
  },
}

export const THEME_IDS = Object.keys(THEMES)
export const DEFAULT_THEME = 'glass'

/** '#0E9AA7' → '14 154 167' (formato richiesto da `rgb(var(--x) / <alpha>)`). */
export function hexToRgbTriplet(hex) {
  if (typeof hex !== 'string') return '0 0 0'
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return '0 0 0'
  const n = parseInt(h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

/** camelCase → kebab-case, per i nomi delle variabili CSS. */
const kebab = (s) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())

/**
 * Applica un tema al documento.
 * @param {string} themeId  glass | heritage | noir
 * @param {object} overrides  colori personalizzati del cliente, es. { brand: '#B03060' }
 */
export function applyTheme(themeId, overrides = {}) {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME]
  const root = document.documentElement
  const colors = { ...theme.colors, ...cleanOverrides(overrides) }

  for (const [key, hex] of Object.entries(colors)) {
    root.style.setProperty(`--c-${kebab(key)}`, hexToRgbTriplet(hex))
    root.style.setProperty(`--hex-${kebab(key)}`, hex)
  }
  root.style.setProperty('--radius', theme.geometry.radius)
  root.style.setProperty('--radius-lg', theme.geometry.radiusLg)
  root.style.setProperty('--radius-xl', theme.geometry.radiusXl)
  root.style.setProperty('--blur', theme.geometry.blur)
  root.style.setProperty('--shadow-card', theme.geometry.shadowCard)
  root.style.setProperty('--shadow-float', theme.geometry.shadowFloat)
  root.style.setProperty('--shadow-glow', theme.geometry.shadowGlow)
  root.style.setProperty('--font-display', theme.fonts.display)
  root.style.setProperty('--font-sans', theme.fonts.sans)
  root.style.setProperty('--backdrop', theme.backdrop)

  root.setAttribute('data-theme', theme.id)
  root.style.colorScheme = theme.scheme
  return theme
}

/** Tiene solo gli override validi e consentiti. */
function cleanOverrides(overrides) {
  const out = {}
  if (!overrides || typeof overrides !== 'object') return out
  for (const key of OVERRIDABLE_COLORS) {
    const val = overrides[key]
    if (typeof val === 'string' && /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(val.trim())) {
      out[key] = val.trim().startsWith('#') ? val.trim() : `#${val.trim()}`
    }
  }
  return out
}
