import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite } from '@/lib/site'
import { waLink } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  Bottone WhatsApp flottante
//
//  Compare solo da desktop in su: su mobile c'è già nella barra fissa
//  in basso, e due bottoni per la stessa cosa a mezzo centimetro di
//  distanza sono un difetto.
//
//  E solo dopo 600px di scorrimento. Non è un vezzo: in cima alla
//  pagina l'ospite sta ancora capendo dove si trova, e un invito a
//  scrivere arriva prima della domanda. Dopo due schermate, invece, la
//  domanda ce l'ha.
// ─────────────────────────────────────────────────────────────
export default function WhatsAppButton() {
  const { ui, t } = useI18n()
  const { site, features } = useSite()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!features['contact.whatsapp_button']) return null
  const href = waLink(site.contact?.whatsapp, t(site.contact?.whatsappMessage))
  if (!href) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileHover={{ scale: 1.06 }}
          className="fixed bottom-24 right-4 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-theme-lg lg:flex"
          aria-label={ui('cta.whatsapp')}
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/40" />
          <Icon name="whatsapp" size={22} className="relative" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
