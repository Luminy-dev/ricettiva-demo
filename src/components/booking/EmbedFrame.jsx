import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import { useStyles } from '@/lib/site'
import { safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  StayKit — Incorporamento del booking engine
//
//  I gestionali distribuiscono il widget in tre forme: uno snippet
//  HTML, uno script più un contenitore, o un indirizzo da mettere in
//  un iframe.
//
//  PERCHÉ LO SNIPPET GIRA IN UN RIQUADRO ISOLATO
//
//  Molti widget — Octorate fra questi — danno solo un <script> che si
//  disegna «dove sta», tipicamente con document.write(). Quel metodo
//  funziona solo mentre la pagina si sta caricando: uno script
//  inserito dopo, come facciamo noi, viene semplicemente ignorato dal
//  browser. Il widget non compare e non dà errore.
//
//  La soluzione è farlo girare dentro un iframe costruito al volo:
//  lì il documento è davvero in fase di caricamento, quindi
//  document.write funziona, e funziona anche document.currentScript
//  per chi lo usa. In più il foglio di stile del gestionale resta
//  chiuso lì dentro e non può scompaginare il sito.
//
//  `<base target="_top">` serve perché i link e i form del widget
//  aprano la pagina intera invece che il riquadro: senza, i risultati
//  della ricerca comparirebbero dentro il rettangolo.
//
//  Resta possibile eseguire lo snippet direttamente nella pagina
//  (opzione «esecuzione diretta»), per i rari widget che hanno
//  bisogno di parlare col resto del documento.
// ─────────────────────────────────────────────────────────────

export default function EmbedFrame({ embed, onFail, watchdogMs = 9000 }) {
  const { ui } = useI18n()
  const s = useStyles()
  const [state, setState] = useState('loading')

  const isolato = embed?.type === 'html' && embed?.diretto !== true

  useEffect(() => {
    if (state === 'failed') onFail?.()
  }, [state, onFail])

  // ── Codice extra nel <head> della pagina ──
  useEffect(() => {
    const head = embed?.headExtra?.trim()
    if (!head) return undefined
    const frag = document.createRange().createContextualFragment(head)
    const inseriti = []
    for (const node of Array.from(frag.childNodes)) {
      if (node.nodeType === Node.ELEMENT_NODE) node.setAttribute('data-staykit-head', 'booking')
      inseriti.push(node)
    }
    document.head.appendChild(frag)
    return () => {
      for (const node of inseriti) node.parentNode?.removeChild(node)
    }
  }, [embed?.headExtra])

  if (embed?.type === 'iframe') {
    const url = safeMediaUrl(embed.url)
    if (!url) return null
    return (
      <div className={`${s.panel} overflow-hidden`}>
        <iframe
          src={url}
          title="Booking engine"
          loading="lazy"
          className="w-full border-0"
          style={{ height: `${embed.height || 640}px` }}
          allow="payment"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  return (
    <div className={`${s.panel} relative overflow-hidden`}>
      {isolato ? (
        <RiquadroIsolato html={embed.html} altezzaMin={embed.height || 260} onStato={setState} watchdogMs={watchdogMs} />
      ) : (
        <EsecuzioneDiretta embed={embed} onStato={setState} watchdogMs={watchdogMs} />
      )}

      {state === 'loading' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3 text-ink-muted">
          <Icon name="spinner" className="animate-spin" />
          <span className="text-sm">{ui('booking.loading')}</span>
        </div>
      )}
    </div>
  )
}

/** Lo snippet gira in un documento suo, che si sta davvero caricando. */
function RiquadroIsolato({ html, altezzaMin, onStato, watchdogMs }) {
  const ref = useRef(null)
  const [altezza, setAltezza] = useState(altezzaMin)

  const documento = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<base target="_top">
<style>html,body{margin:0;padding:0;background:transparent;font-family:system-ui,-apple-system,sans-serif}</style>
</head><body>${html || ''}</body></html>`

  const misura = useCallback(() => {
    const frame = ref.current
    const doc = frame?.contentDocument
    if (!doc?.body) return 0
    const h = Math.max(doc.body.scrollHeight, doc.documentElement?.scrollHeight || 0)
    if (h > 0) setAltezza(Math.max(h, 80))
    return doc.body.querySelectorAll('*').length
  }, [])

  useEffect(() => {
    // Il widget si monta quando gli pare: si continua a misurare per un
    // po', invece di fidarsi del solo evento di caricamento.
    const tick = setInterval(() => {
      if (misura() > 0) onStato('ready')
    }, 400)
    const stop = setTimeout(() => {
      clearInterval(tick)
      if (misura() === 0) {
        console.warn(
          '[StayKit] Il widget del gestionale non ha disegnato niente. Cause tipiche: blocco ' +
            'pubblicità attivo, snippet incompleto, oppure codice da mettere nel <head>.'
        )
        onStato('failed')
      }
    }, watchdogMs)
    return () => {
      clearInterval(tick)
      clearTimeout(stop)
    }
  }, [misura, onStato, watchdogMs, documento])

  return (
    <iframe
      ref={ref}
      srcDoc={documento}
      title="Booking engine"
      onLoad={misura}
      className="w-full border-0"
      style={{ height: `${altezza}px`, minHeight: `${altezzaMin}px` }}
      allow="payment"
      sandbox="allow-scripts allow-forms allow-popups allow-top-navigation-by-user-activation allow-same-origin"
    />
  )
}

/** Lo snippet viene eseguito nella pagina, come se fosse nostro. */
function EsecuzioneDiretta({ embed, onStato, watchdogMs }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined
    host.innerHTML = ''

    try {
      if (embed.type === 'html' && embed.html?.trim()) {
        host.appendChild(document.createRange().createContextualFragment(embed.html))
      } else if (embed.type === 'script' && embed.scriptSrc?.trim()) {
        const mount = document.createElement('div')
        mount.id = embed.mountId || 'booking-widget'
        host.appendChild(mount)
        const tag = document.createElement('script')
        tag.src = embed.scriptSrc
        tag.async = true
        for (const [k, v] of Object.entries(embed.dataAttrs || {})) tag.setAttribute(k, String(v))
        tag.onerror = () => onStato('failed')
        host.appendChild(tag)
      } else {
        onStato('failed')
        return undefined
      }
    } catch (err) {
      console.warn('[StayKit] Widget non iniettabile:', err)
      onStato('failed')
      return undefined
    }

    // Ha disegnato qualcosa? Si contano gli elementi che non abbiamo messo noi.
    const disegnato = () =>
      Array.from(host.querySelectorAll('*')).some(
        (el) =>
          el.tagName !== 'SCRIPT' &&
          !(el.tagName === 'DIV' && el.id === (embed.mountId || 'booking-widget') && !el.children.length)
      )

    if (disegnato()) onStato('ready')
    const osservatore = new MutationObserver(() => disegnato() && onStato('ready'))
    osservatore.observe(host, { childList: true, subtree: true })
    const timer = setTimeout(() => !disegnato() && onStato('failed'), watchdogMs)

    return () => {
      clearTimeout(timer)
      osservatore.disconnect()
      host.innerHTML = ''
    }
  }, [embed, onStato, watchdogMs])

  return <div ref={hostRef} className="p-1 sm:p-2" style={{ minHeight: '240px' }} />
}
