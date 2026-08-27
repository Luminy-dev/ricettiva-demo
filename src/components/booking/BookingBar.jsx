import { useState } from 'react'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { canaleDaNominare, linkConDate, linkMotore, motoreConLink, nomeCanale, supportaDate } from '@/config/booking-links'
import { cn, nightsBetween } from '@/lib/utils'
import Icon from '@/components/Icon'
import QuickModal from './QuickModal'
import DateRangePicker, { CampoBase } from './DateRangePicker'

// ─────────────────────────────────────────────────────────────
//  StayKit — Barra "verifica disponibilità"
//
//  È la prima cosa che un ospite cerca, quindi c'è sempre — in
//  apertura di pagina, qualunque sia il modo in cui la struttura
//  prende le prenotazioni. Cambia solo cosa succede dopo:
//
//   widget   → apre il motore del gestionale con le date impostate
//              (o, se non ha caricato, raccoglie la richiesta qui)
//   link     → apre il portale CON LE DATE già impostate
//   internal → apre la finestra per farsi ricontattare
//   none     → apre la finestra con i recapiti per telefonare
//
//  Il punto è che il visitatore fa sempre lo stesso gesto: sceglie
//  le date. Che dietro ci sia Octorate o un numero di telefono è un
//  dettaglio nostro, non suo.
// ─────────────────────────────────────────────────────────────

export default function BookingBar() {
  const { ui, lang } = useI18n()
  const s = useStyles()
  const { booking, features, site } = useSite()

  const [date, setDate] = useState({ checkIn: '', checkOut: '', guests: 2 })
  const [errore, setErrore] = useState('')
  const [modale, setModale] = useState(null) // null | 'richiesta' | 'chiamata'

  const notti = nightsBetween(date.checkIn, date.checkOut)
  const modo = !features.booking_engine && booking.mode === 'widget' ? 'internal' : booking.mode

  const set = (k) => (e) => {
    setDate((d) => ({ ...d, [k]: e.target.value }))
    setErrore('')
  }

  function verifica(e) {
    e.preventDefault()
    if (!date.checkIn || !date.checkOut) return setErrore(ui('form.required'))
    if (notti <= 0) return setErrore(ui('form.invalidDates'))

    // Motore del gestionale raggiungibile con un collegamento: si apre la
    // sua pagina con le date già impostate. Nessuno script da incorporare.
    if (viaCollegamento) {
      const url = linkMotore(booking.provider, booking.embed?.siteKey, { ...date, lang })
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    if (modo === 'link') {
      const url = linkConDate(booking.link?.url, booking.link?.channel, date)
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    if (modo === 'none') return setModale('chiamata')
    // 'internal', o widget del gestionale che non ha caricato: in
    // entrambi i casi la richiesta la raccogliamo noi.
    setModale('richiesta')
  }

  const viaCollegamento =
    modo === 'widget' &&
    booking.embed?.type === 'deeplink' &&
    Boolean(motoreConLink(booking.provider)) &&
    Boolean(booking.embed?.siteKey)

  // Le date arriveranno a destinazione, o si aprirà una pagina vuota?
  const conDate = viaCollegamento || (modo === 'link' && supportaDate(booking.link?.channel))

  // Il nome del portale sul bottone solo se è un marchio riconoscibile:
  // «Prenota su Booking.com» dice dove si finisce, «Prenota su Sito di
  // prenotazione» occupa spazio senza dire niente.
  const esterno = modo === 'link'
  const etichetta =
    esterno && canaleDaNominare(booking.link?.channel)
      ? `${ui('booking.external')} ${nomeCanale(booking.link.channel)}`
      : esterno
        ? ui('cta.book')
        : ui('cta.check')

  // Riga di servizio: si compone di quello che c'è davvero, così non
  // restano puntini di separazione appesi al nulla.
  const nota = [
    notti > 0 ? `${notti} ${ui('field.nights')}` : '',
    conDate ? ui('quick.hintPortal') : booking.showDirectHint ? ui('booking.directHint') : '',
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      {/* `relative z-30` non e' decorativo: il pannello del calendario e'
          `absolute z-50`, ma `s.panel` ha un backdrop-blur e crea un
          contesto di impilamento, quindi quello z-50 vale solo qui
          dentro. Senza uno z esplicito sulla barra, i chip dell'hero —
          che vengono dopo nel DOM e hanno anch'essi un backdrop-blur —
          finiscono sopra il calendario aperto. Si vede da mobile, dove
          il calendario e' largo quanto la barra. */}
      <form onSubmit={verifica} className={cn(s.panel, 'relative z-30 p-2.5 sm:p-3')}>
        {/* Una riga sola: date, ospiti, azione. Le colonne "auto" tengono
            il bottone stretto quanto la sua etichetta e lasciano tutto
            lo spazio residuo al calendario. */}
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_7rem_auto]">
          <DateRangePicker
            value={date}
            onChange={(d) => {
              setDate((prev) => ({ ...prev, ...d }))
              setErrore('')
            }}
          />

          {/* Stesso contenitore dei campi data: etichetta piccola dentro,
              non sopra. Tre campi accostati con impaginazioni diverse
              fanno sembrare la barra montata a pezzi. */}
          <CampoBase etichetta={ui('booking.guests')}>
            <select
              value={date.guests}
              onChange={set('guests')}
              className="-ml-0.5 w-full cursor-pointer border-0 bg-transparent p-0 text-[0.9rem] leading-tight text-ink focus:outline-none"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </CampoBase>

          <button type="submit" className={cn(s.btnPrimary, 'h-full w-full px-7 sm:w-auto')}>
            {etichetta}
            <Icon name={esterno ? 'external' : 'arrowRight'} size={16} />
          </button>
        </div>

        {(errore || nota) && (
          <div className="px-1.5 pt-2">
            {errore ? (
              <p className="flex items-center gap-1.5 text-[0.78rem] text-danger">
                <Icon name="warning" size={13} /> {errore}
              </p>
            ) : (
              <p className={cn(s.small, 'text-[0.75rem]')}>{nota}</p>
            )}
          </div>
        )}
      </form>

      <QuickModal aperto={Boolean(modale)} variante={modale} date={date} onClose={() => setModale(null)} />
    </>
  )
}
