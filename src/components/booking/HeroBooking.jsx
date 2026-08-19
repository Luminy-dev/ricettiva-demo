import { useCallback, useState } from 'react'
import { useSite } from '@/lib/site'
import BookingBar from './BookingBar'
import EmbedFrame from './EmbedFrame'

// ─────────────────────────────────────────────────────────────
//  StayKit — Cosa va al centro dell'apertura
//
//  Il posto è uno solo, il più visibile della pagina, e ci va la
//  cosa che l'ospite sta cercando. Cosa sia dipende da come la
//  struttura prende le prenotazioni:
//
//   · il motore del gestionale, se c'è ed è da incorporare
//   · la nostra barra in tutti gli altri casi — collegamento con le
//     date, portale esterno, richiesta, solo contatti
//
//  Se il widget del gestionale non parte, si ricade sulla barra:
//  meglio un percorso più lungo che un buco al centro della pagina.
// ─────────────────────────────────────────────────────────────

export default function HeroBooking() {
  const { booking, features } = useSite()
  const [widgetKo, setWidgetKo] = useState(false)
  const onFail = useCallback(() => setWidgetKo(true), [])

  const daIncorporare =
    features.booking_engine &&
    booking.mode === 'widget' &&
    booking.embed?.type !== 'deeplink' &&
    !widgetKo

  if (daIncorporare) return <EmbedFrame embed={booking.embed} onFail={onFail} />
  return <BookingBar />
}
