import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { goTo } from '@/lib/nav'
import { cn, waLink } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  StayKit — Barra prenota fissa (mobile)
//
//  Compare dopo l'hero e resta a portata di pollice: su mobile è
//  la principale fonte di conversione. Su desktop resta nascosta,
//  dove ci sono già i bottoni nella navigazione.
// ─────────────────────────────────────────────────────────────

export default function StickyBookingBar({ target = '#home' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site, features } = useSite()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!features['booking.sticky_bar']) return null

  const wa = features['contact.whatsapp_button']
    ? waLink(site.contact?.whatsapp, t(site.contact?.whatsappMessage))
    : ''

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className={cn(s.glassBar, 'flex items-center gap-2 p-2')}>
            {site.contact?.phone && (
              <a
                href={`tel:${site.contact.phoneRaw || site.contact.phone}`}
                className={cn(s.btnIcon, 'shrink-0')}
                aria-label={ui('cta.call')}
              >
                <Icon name="phone" size={18} />
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(s.btnIcon, 'shrink-0')}
                aria-label={ui('cta.whatsapp')}
              >
                <Icon name="whatsapp" size={18} />
              </a>
            )}
            <a href={target} onClick={goTo(target.replace('#', ''))} className={cn(s.btnPrimary, 'flex-1')}>
              {ui('cta.check')}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
