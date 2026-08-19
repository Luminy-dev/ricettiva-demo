/** Concatena classi ignorando falsy. */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

/** Numero di notti tra due date ISO (yyyy-mm-dd). */
export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const a = new Date(`${checkIn}T00:00:00`)
  const b = new Date(`${checkOut}T00:00:00`)
  const diff = Math.round((b - a) / 86400000)
  return diff > 0 ? diff : 0
}

/** Oggi in formato yyyy-mm-dd (fuso locale). */
export function todayISO(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export function formatPrice(value, lang = 'it', currency = 'EUR') {
  if (value == null || value === '') return ''
  try {
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value))
  } catch {
    return `€ ${value}`
  }
}

export function formatDateLong(iso, lang = 'it') {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(`${iso}T00:00:00`)
    )
  } catch {
    return iso
  }
}

/** Slug URL-safe da una stringa qualsiasi. */
export function slugify(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

// ─────────────────────────────────────────────────────────────
//  Indirizzi inseriti dal pannello
//
//  Tutto ciò che il cliente scrive e che finisce in un `href` o in un
//  `src` passa da qui. Senza controllo, un indirizzo come
//  `javascript:...` diventa codice eseguito nella pagina: chi ha solo
//  il permesso di scrivere i testi si ritroverebbe a poter eseguire
//  script sul sito, e su un pannello con più collaboratori è un modo
//  per prendersi i permessi degli altri.
//
//  Ammessi: http, https, mailto, tel, e i percorsi interni (/privacy).
// ─────────────────────────────────────────────────────────────
const SCHEMI_AMMESSI = ['http:', 'https:', 'mailto:', 'tel:']

export function safeUrl(value) {
  if (typeof value !== 'string') return ''
  const url = value.trim()
  if (!url) return ''
  // Percorso interno o ancora: sempre sicuro
  if (url.startsWith('/') || url.startsWith('#')) return url
  try {
    const parsed = new URL(url, window.location.origin)
    return SCHEMI_AMMESSI.includes(parsed.protocol) ? url : ''
  } catch {
    return ''
  }
}

/** Come safeUrl, ma per immagini e video: solo http(s) e percorsi interni. */
export function safeMediaUrl(value) {
  const url = safeUrl(value)
  if (!url) return ''
  if (url.startsWith('/') || url.startsWith('data:image/')) return url
  return /^https?:/i.test(url) ? url : ''
}

/** Numero di telefono pulito per href="tel:" e wa.me. */
export function cleanPhone(raw = '') {
  return String(raw).replace(/[^\d+]/g, '')
}

export function waLink(phone, message = '') {
  const num = cleanPhone(phone).replace(/^\+/, '')
  if (!num) return ''
  const q = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${num}${q}`
}

export function mapsLink(address = {}, coords) {
  if (coords?.lat && coords?.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
  }
  const q = [address.street, address.zip, address.city, address.province, address.country]
    .filter(Boolean)
    .join(', ')
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`
}

/** Rispetta "riduci animazioni" del sistema operativo. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Merge profondo non distruttivo (per unire config DB su default). */
export function deepMerge(base, patch) {
  if (Array.isArray(patch)) return patch
  if (!isPlainObject(base) || !isPlainObject(patch)) return patch === undefined ? base : patch
  const out = { ...base }
  for (const [k, v] of Object.entries(patch)) {
    out[k] = k in base ? deepMerge(base[k], v) : v
  }
  return out
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

/** Debounce semplice per gli editor del pannello. */
export function debounce(fn, ms = 400) {
  let timer
  const wrapped = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  wrapped.cancel = () => clearTimeout(timer)
  return wrapped
}
