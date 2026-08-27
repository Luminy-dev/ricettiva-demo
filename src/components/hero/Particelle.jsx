import { useEffect, useRef } from 'react'
import { useSite } from '@/lib/site'
import { prefersReducedMotion } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
//  Particelle — il fondale che si muove piano
//
//  Sotto la barra delle date resta parecchio vuoto, e una pagina
//  ferma in quel punto sembra un'immagine invece che un sito. Questo
//  strato lo riempie senza dire niente: è un fondale, non un
//  contenuto. Poche particelle, opacità bassa, movimento lento — se
//  il visitatore lo nota, è già troppo.
//
//  Il movimento è quello dell'acqua: deriva orizzontale costante più
//  un'oscillazione verticale sfasata particella per particella.
//  Niente linee che collegano i punti: quello è un fondale da
//  software, e qui si vende una casa sul mare.
//
//  I colori li prende dal tema attivo (--c-brand, --c-ink): cambiando
//  stile dalla barra di regia cambiano anche loro, senza toccare
//  niente. Con «riduci le animazioni» disegna un fotogramma e si
//  ferma; fuori schermo o a scheda nascosta non disegna affatto.
// ─────────────────────────────────────────────────────────────

/** Tetto assoluto: oltre, smette di essere minimal e diventa neve. */
const MAX = 44

/** Un punto ogni tot pixel di area. Pochi su un telefono, di più su un desktop. */
const AREA_PER_PUNTO = 26000

export default function Particelle({ className = '' }) {
  const ref = useRef(null)
  const { themeId } = useSite()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stile = getComputedStyle(document.documentElement)
    const brand = leggiColore(stile, '--c-brand', '14 154 167')
    const ink = leggiColore(stile, '--c-ink', '15 23 37')

    let larghezza = 0
    let altezza = 0
    let punti = []
    let frame = 0
    let inVista = true
    let schedaAttiva = true

    function quantiNe() {
      const stimati = Math.round((larghezza * altezza) / AREA_PER_PUNTO)
      return Math.max(10, Math.min(MAX, stimati))
    }

    function nuovo() {
      return {
        x: Math.random() * larghezza,
        y: Math.random() * altezza,
        r: 0.9 + Math.random() * 1.9,
        // Quasi orizzontale: è una corrente, non uno sciame di insetti.
        vx: (0.05 + Math.random() * 0.15) * (Math.random() < 0.25 ? -1 : 1),
        vy: -0.015 - Math.random() * 0.045,
        amp: 3 + Math.random() * 9,
        passo: 0.00016 + Math.random() * 0.00028,
        fase: Math.random() * Math.PI * 2,
        alpha: 0.1 + Math.random() * 0.2,
        colore: Math.random() < 0.72 ? brand : ink,
      }
    }

    function dimensiona() {
      const r = canvas.getBoundingClientRect()
      const nuovaL = Math.max(1, r.width)
      const nuovaA = Math.max(1, r.height)
      if (nuovaL === larghezza && nuovaA === altezza) return

      larghezza = nuovaL
      altezza = nuovaA
      const k = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(larghezza * k)
      canvas.height = Math.round(altezza * k)
      ctx.setTransform(k, 0, 0, k, 0, 0)

      // Non si rifà il campo da capo a ogni ridimensionamento: da
      // telefono la barra degli indirizzi che si apre e chiude ne
      // farebbe uno sfarfallio. Si aggiunge o si toglie il necessario
      // e si riportano dentro i punti rimasti fuori.
      const obiettivo = quantiNe()
      while (punti.length < obiettivo) punti.push(nuovo())
      if (punti.length > obiettivo) punti.length = obiettivo
      for (const p of punti) {
        if (p.x > larghezza) p.x = Math.random() * larghezza
        if (p.y > altezza) p.y = Math.random() * altezza
      }
    }

    function disegna(t) {
      ctx.clearRect(0, 0, larghezza, altezza)
      for (const p of punti) {
        const y = p.y + Math.sin(t * p.passo + p.fase) * p.amp
        ctx.beginPath()
        ctx.arc(p.x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.colore}, ${p.alpha})`
        ctx.fill()
      }
    }

    function avanza(t) {
      frame = requestAnimationFrame(avanza)
      if (!inVista || !schedaAttiva) return
      for (const p of punti) {
        p.x += p.vx
        p.y += p.vy
        // Rientro dal lato opposto: il campo non si svuota mai.
        if (p.x < -8) p.x = larghezza + 8
        else if (p.x > larghezza + 8) p.x = -8
        if (p.y < -12) p.y = altezza + 12
      }
      disegna(t)
    }

    dimensiona()

    if (prefersReducedMotion()) {
      disegna(0)
      return undefined
    }

    const osservaMisura = new ResizeObserver(dimensiona)
    osservaMisura.observe(canvas)

    const osservaVista = new IntersectionObserver(([voce]) => {
      inVista = voce.isIntersecting
    })
    osservaVista.observe(canvas)

    const suScheda = () => {
      schedaAttiva = !document.hidden
    }
    document.addEventListener('visibilitychange', suScheda)

    frame = requestAnimationFrame(avanza)

    return () => {
      cancelAnimationFrame(frame)
      osservaMisura.disconnect()
      osservaVista.disconnect()
      document.removeEventListener('visibilitychange', suScheda)
    }
  }, [themeId])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}

/**
 * I temi scrivono i colori come terna «r g b» (vedi themes/tokens.js).
 * Qui serve la forma con le virgole: `rgba(r, g, b, a)` la capiscono
 * tutti i browser, mentre `rgb(r g b / a)` su canvas è più recente.
 */
function leggiColore(stile, nome, ripiego) {
  const grezzo = (stile.getPropertyValue(nome) || '').trim() || ripiego
  const pezzi = grezzo.split(/[\s,]+/).filter(Boolean).slice(0, 3)
  return pezzi.length === 3 ? pezzi.join(', ') : ripiego.split(' ').join(', ')
}
