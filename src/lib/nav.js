import { useMemo } from 'react'
import { useSite } from '@/lib/site'
import { useI18n } from '@/i18n'

// ─────────────────────────────────────────────────────────────
//  StayKit — Costruzione della navigazione
//
//  Le voci non sono scritte a mano: derivano dalle sezioni previste
//  dal preset (B&B, appartamenti…) filtrate dalle feature attive.
//  Spegni "Recensioni" dal pannello e sparisce anche dal menu.
// ─────────────────────────────────────────────────────────────

/** sezione → { id ancora, chiave di traduzione, feature che la governa } */
export const SECTION_META = {
  hero: { anchor: 'home', labelKey: 'nav.home', feature: null, inNav: false },
  story: { anchor: 'struttura', labelKey: 'nav.story', feature: 'section.story' },
  rooms: { anchor: 'camere', labelKey: 'nav.rooms', feature: 'section.rooms' },
  breakfast: { anchor: 'colazione', labelKey: 'nav.breakfast', feature: 'section.breakfast' },
  checkin: { anchor: 'arrivo', labelKey: 'nav.checkin', feature: 'section.checkin' },
  amenities: { anchor: 'servizi', labelKey: 'nav.amenities', feature: 'section.amenities' },
  gallery: { anchor: 'galleria', labelKey: 'nav.gallery', feature: 'section.gallery' },
  offers: { anchor: 'offerte', labelKey: 'nav.offers', feature: 'section.offers' },
  reviews: { anchor: 'recensioni', labelKey: 'nav.reviews', feature: 'section.reviews' },
  blog: { anchor: 'consigli', labelKey: 'nav.blog', feature: 'section.blog' },
  map: { anchor: 'dove-siamo', labelKey: 'nav.map', feature: 'section.map' },
  contact: { anchor: 'contatti', labelKey: 'nav.contact', feature: null },
}

/** Sezioni da renderizzare, nell'ordine deciso dal preset. */
export function useSections() {
  const { preset, features } = useSite()
  return useMemo(
    () =>
      (preset.sections || []).filter((key) => {
        const meta = SECTION_META[key]
        if (!meta) return false
        return meta.feature ? features[meta.feature] === true : true
      }),
    [preset.sections, features]
  )
}

/**
 * Tutte le sezioni raggiungibili, con la loro etichetta.
 * È l'elenco completo: lo usa il piè di pagina, che fa da mappa del sito.
 */
export function useSectionLinks() {
  const sections = useSections()
  const { ui } = useI18n()
  return useMemo(
    () =>
      sections
        .filter((key) => SECTION_META[key]?.inNav !== false)
        .map((key) => ({
          key,
          id: SECTION_META[key].anchor,
          label: ui(SECTION_META[key].labelKey),
        })),
    [sections, ui]
  )
}

/**
 * Voci della barra in alto.
 *
 * Sottoinsieme delle sezioni: una sezione può esserci sul sito senza
 * stare nel menu. Con otto voci la barra diventa illeggibile, e cose
 * come la galleria si trovano benissimo scorrendo. Chi le vuole tutte
 * le riattiva dal pannello, voce per voce.
 */
export function useNavLinks() {
  const links = useSectionLinks()
  const { features } = useSite()
  return useMemo(() => links.filter((l) => features[`nav.${l.key}`] !== false), [links, features])
}

/**
 * Scorrimento morbido a una sezione.
 *
 * Unico punto da cui passa tutta la navigazione interna del sito, così
 * non restano collegamenti che saltano di colpo mentre gli altri
 * scorrono. Lo scarto non è un numero fisso: viene misurato
 * sull'intestazione vera, che cambia altezza da tema a tema e a
 * seconda che la pagina sia già stata fatta scorrere.
 *
 * Con "riduci animazioni" attivo nel sistema operativo il salto è
 * immediato: lo scorrimento animato dà fastidio a chi soffre di
 * disturbi vestibolari, e non è una preferenza da scavalcare.
 */
export function scrollToSection(anchor, offsetExtra = 12) {
  const el = document.getElementById(anchor)
  if (!el) return

  const header = document.querySelector('header')
  const altezza = header ? header.getBoundingClientRect().height : 72
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - altezza - offsetExtra)

  const ridotte =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.scrollTo({ top, behavior: ridotte ? 'auto' : 'smooth' })
}

/**
 * Gestore pronto per un collegamento interno: impedisce il salto del
 * browser e usa lo scorrimento morbido.
 *
 *   <a href="#camere" onClick={goTo('camere')}>…</a>
 */
export function goTo(anchor, onDone) {
  return (event) => {
    event.preventDefault()
    scrollToSection(anchor)
    onDone?.()
  }
}
