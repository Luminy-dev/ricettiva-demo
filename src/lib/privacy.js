import { LEGAL } from '@/i18n/legal'
import { DEFAULT_LANG } from '@/i18n/dictionary'
import { BOOKING_PROVIDERS } from '@/config/booking-providers'
import { nomeCanale } from '@/config/booking-links'

// ─────────────────────────────────────────────────────────────
//  StayKit — Costruzione dell'informativa privacy
//
//  L'informativa non è un testo fisso: dice quello che il sito fa
//  DAVVERO, e due siti fatti con lo stesso template fanno cose
//  diverse. Se non c'è il modulo statistiche non ci sono cookie di
//  misurazione, e scriverlo lo stesso sarebbe una bugia; se non c'è
//  la mappa il browser non si collega a Google.
//
//  Quindi: le sezioni si accendono con i moduli. Le uniche cose che
//  arrivano dal cliente sono i dati che lo identificano come titolare
//  del trattamento — quelli il software non può inventarli.
//
//  Conseguenza pratica: quando accendi un modulo a un cliente,
//  l'informativa del suo sito si aggiorna da sola. Non c'è un
//  documento da rigenerare e nessuno se ne dimentica.
// ─────────────────────────────────────────────────────────────

/** Mesi di conservazione delle richieste, se il cliente non decide altro. */
export const CONSERVAZIONE_PREDEFINITA = 24

/** Traduzione di una chiave legale, con ricaduta sull'italiano. */
function L(lang, key) {
  return LEGAL[lang]?.[key] || LEGAL[DEFAULT_LANG][key] || ''
}

/** Sostituisce i {segnaposto}; quelli senza valore spariscono. */
function riempi(testo, valori) {
  return testo
    .replace(/\{(\w+)\}/g, (_, k) => valori[k] ?? '')
    .replace(/\s+([,.;])/g, '$1')
    .replace(/ {2,}/g, ' ')
    .trim()
}

/** Indirizzo su una riga, saltando i pezzi che mancano. */
export function indirizzoInLinea(address = {}) {
  const via = [address.street, address.zip, address.city].filter(Boolean).join(', ')
  const provincia = address.province ? ` (${address.province})` : ''
  return via ? `${via}${provincia}` : ''
}

/**
 * Nome leggibile di chi gestisce le prenotazioni: prima il gestionale,
 * poi il portale, altrimenti niente e la sezione non compare.
 */
function nomeFornitore(booking) {
  if (booking?.mode === 'widget') {
    return BOOKING_PROVIDERS[booking.provider]?.name || booking.provider || ''
  }
  if (booking?.mode === 'link') {
    const nome = nomeCanale(booking.link?.channel)
    return nome === 'Prenota' ? '' : nome
  }
  return ''
}

/**
 * Monta l'informativa per questo sito.
 *
 * @returns {{ titolo, intro, aggiornata, completa, sezioni: Array }}
 *   `completa` è false finché mancano i dati del titolare: la pagina
 *   lo dice in chiaro invece di pubblicare un documento monco.
 */
export function costruisciInformativa({ site, features, booking, lang = DEFAULT_LANG }) {
  const legal = site.legal || {}
  const priv = legal.privacy || {}
  const contact = site.contact || {}

  const titolare = (priv.controller || legal.company || site.brand?.name || '').trim()
  const indirizzo = indirizzoInLinea(priv.address || contact.address)
  const email = (priv.email || contact.email || '').trim()
  const pec = (priv.pec || '').trim()
  const dpo = (priv.dpo || '').trim()
  const mesi = Number(priv.retentionMonths) > 0 ? Number(priv.retentionMonths) : CONSERVAZIONE_PREDEFINITA

  const valori = {
    titolare,
    indirizzo: indirizzo ? `, ${indirizzo}` : '',
    email: email || '—',
    pec: pec ? ` (PEC ${pec})` : '',
    dpo,
    mesi: String(mesi),
    strumento: (priv.analyticsName || '').trim() || (lang === 'it' ? 'uno strumento di statistiche' : 'an analytics tool'),
    fornitore: nomeFornitore(booking),
  }

  const t = (key) => riempi(L(lang, key), valori)
  const sezioni = []
  const agg = (id, titolo, paragrafi, elenco) =>
    sezioni.push({ id, titolo, paragrafi: paragrafi.filter(Boolean), elenco: (elenco || []).filter(Boolean) })

  // ── Titolare ──
  agg('titolare', t('privacy.owner.title'), [
    titolare && email ? t('privacy.owner.body') : t('privacy.owner.missing'),
    dpo ? t('privacy.owner.dpo') : '',
  ])

  // ── Moduli del sito ──
  //  Il modulo contatti c'è sempre: anche a prenotazioni spente resta
  //  la richiesta di informazioni.
  agg(
    'moduli',
    t('privacy.form.title'),
    [t('privacy.form.body')],
    [
      t('privacy.form.list.data'),
      t('privacy.form.list.base'),
      t('privacy.form.list.need'),
      t('privacy.form.list.keep'),
      t('privacy.form.list.spam'),
    ]
  )

  // ── Cookie ──
  agg('cookie', t('privacy.cookie.title'), [
    t('privacy.cookie.body'),
    features.analytics ? t('privacy.cookie.analytics') : t('privacy.cookie.none'),
  ])

  // ── Motore di prenotazione esterno ──
  if (valori.fornitore) {
    const incorporato =
      booking.mode === 'widget' && booking.embed?.type !== 'deeplink' && features.booking_engine
    agg('prenotazioni', t('privacy.engine.title'), [
      t('privacy.engine.body'),
      incorporato ? t('privacy.engine.embedded') : '',
    ])
  }

  // ── Mappa ──
  if (features['section.map']) {
    agg('mappa', t('privacy.map.title'), [t('privacy.map.body')])
  }

  // ── WhatsApp ──
  if (contact.whatsapp && features['contact.whatsapp_button']) {
    agg('whatsapp', t('privacy.whatsapp.title'), [t('privacy.whatsapp.body')])
  }

  // ── Fornitori, diritti, chiusura ──
  agg('fornitori', t('privacy.hosting.title'), [t('privacy.hosting.body'), t('privacy.hosting.nosale')])
  agg('diritti', t('privacy.rights.title'), [t('privacy.rights.body')])
  agg('minori', t('privacy.minors.title'), [t('privacy.minors.body')])
  agg('modifiche', t('privacy.changes.title'), [t('privacy.changes.body')])

  return {
    titolo: t('privacy.title'),
    intro: t('privacy.intro'),
    etichettaAggiornamento: t('privacy.updated'),
    etichettaRitorno: t('privacy.back'),
    aggiornata: priv.updatedAt || '',
    completa: Boolean(titolare && email),
    sezioni,
  }
}

export { linkPrivacy } from '@/lib/privacy-link'
