import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn, safeMediaUrl } from '@/lib/utils'
import { linkPrivacy } from '@/lib/privacy-link'

// ─────────────────────────────────────────────────────────────
//  Banner cookie
//
//  Compare solo se è attivo il modulo statistiche: senza analytics
//  il sito usa solo cookie tecnici e il banner non serve.
//  La scelta resta in localStorage e, finché non c'è consenso,
//  nessuno script di misurazione viene caricato.
// ─────────────────────────────────────────────────────────────

const KEY = 'staykit:consent'

export default function CookieBar() {
  const { ui } = useI18n()
  const s = useStyles()
  const { site, features } = useSite()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!features.analytics) return
    try {
      if (!localStorage.getItem(KEY)) setVisible(true)
      else if (localStorage.getItem(KEY) === 'all') loadAnalytics(site.analytics)
    } catch {
      /* localStorage non disponibile */
    }
  }, [features.analytics, site.analytics])

  const decide = (value) => {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      /* ignora */
    }
    if (value === 'all') loadAnalytics(site.analytics)
    setVisible(false)
  }

  if (!features.analytics) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-2xl lg:inset-x-auto lg:left-4"
        >
          <div className={cn(s.panel, 'flex flex-col gap-4 p-5 sm:flex-row sm:items-center')}>
            <div className="flex-1">
              <p className="text-[0.9rem] font-semibold text-ink">{ui('cookie.title')}</p>
              <p className={cn(s.small, 'mt-1')}>
                {ui('cookie.text')}{' '}
                <a
                  href={`${linkPrivacy(site)}#cookie`}
                  className="whitespace-nowrap underline underline-offset-2 transition hover:text-ink"
                >
                  {ui('cookie.more')}
                </a>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => decide('necessary')} className={s.btnSecondary}>
                {ui('cookie.reject')}
              </button>
              <button type="button" onClick={() => decide('all')} className={s.btnPrimary}>
                {ui('cookie.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Carica lo script di misurazione SOLO dopo il consenso.
 *
 * L'indirizzo dello script NON è fra i campi modificabili dal pannello
 * (vedi CONTENT_KEYS in api/admin/site.js): lo imposta chi fornisce il
 * sito, direttamente sul database. Altrimenti chi ha il permesso di
 * scrivere i testi potrebbe caricare qualunque codice sul sito.
 */
function loadAnalytics(cfg) {
  if (!cfg?.src || document.querySelector('[data-staykit-analytics]')) return
  const src = safeMediaUrl(cfg.src)
  if (!src) return
  const tag = document.createElement('script')
  tag.src = src
  tag.async = true
  tag.dataset.staykitAnalytics = 'true'
  if (cfg.attrs && typeof cfg.attrs === 'object') {
    for (const [k, v] of Object.entries(cfg.attrs)) tag.setAttribute(k, String(v))
  }
  document.head.appendChild(tag)
}
