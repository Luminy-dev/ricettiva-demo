import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, languages, multilingual, ui } = useI18n()
  const s = useStyles()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!multilingual) return null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(s.btnGhost, 'gap-1.5')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ui('misc.language')}
      >
        <Icon name="globe" size={16} />
        <span className="font-semibold">{lang.toUpperCase()}</span>
        {!compact && <Icon name="chevronDown" size={14} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            role="listbox"
            className={cn(s.panel, 'absolute right-0 z-50 mt-2 min-w-[10rem] overflow-hidden p-1.5')}
          >
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.code === lang}
                  onClick={() => {
                    setLang(l.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-theme px-3 py-2 text-left text-sm transition',
                    l.code === lang ? 'bg-brand/12 text-ink' : 'text-ink-soft hover:bg-ink/[0.06]'
                  )}
                >
                  <span aria-hidden>{l.flag}</span>
                  <span className="flex-1">{l.label}</span>
                  {l.code === lang && <Icon name="check" size={14} className="text-brand" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
