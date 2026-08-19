import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSite, useStyles } from '@/lib/site'
import { THEMES, THEME_IDS } from '@/themes'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  StayKit — Selettore temi per le demo
//
//  Serve a far vedere al cliente i tre stili sui SUOI contenuti, dal
//  vivo, in dieci secondi. È uno strumento di vendita, e si accende
//  apposta: VITE_SHOW_THEME_SWITCHER sul deploy di prova, oppure
//  `force` dentro la vetrina.
//
//  NON dipende più da `theme_switching`. Quella feature significa «il
//  cliente può cambiare tema dal pannello», e il posto giusto per
//  farlo è la scheda Aspetto. Legarci anche questo pulsante voleva
//  dire che un ospite qualsiasi, sul sito di una struttura vera, si
//  trovava una tavolozza flottante capace di cambiare l'aspetto del
//  sito — cosa che nessun visitatore si aspetta e che al gestore
//  sembra un difetto.
// ─────────────────────────────────────────────────────────────

const SHOW = import.meta.env.VITE_SHOW_THEME_SWITCHER === 'true'

export default function ThemeSwitcher({ force = false }) {
  const { themeId, setTheme } = useSite()
  const s = useStyles()
  const [open, setOpen] = useState(false)

  if (!force && !SHOW) return null

  return (
    <div className="fixed bottom-5 right-4 z-50 hidden lg:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className={cn(s.panel, 'mb-3 w-64 overflow-hidden p-2')}
          >
            <p className="px-2 pb-2 pt-1 text-[0.7rem] font-bold uppercase tracking-wider2 text-ink-muted">
              Stile del sito
            </p>
            {THEME_IDS.map((id) => {
              const th = THEMES[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-theme px-2.5 py-2.5 text-left transition',
                    id === themeId ? 'bg-brand/12' : 'hover:bg-ink/[0.06]'
                  )}
                >
                  <span className="flex shrink-0 gap-1">
                    {th.preview.map((c) => (
                      <span
                        key={c}
                        className="h-5 w-2.5 rounded-[3px] ring-1 ring-black/10"
                        style={{ background: c }}
                      />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{th.name}</span>
                    <span className="block truncate text-[0.72rem] text-ink-muted">{th.tagline}</span>
                  </span>
                  {id === themeId && <Icon name="check" size={15} className="shrink-0 text-brand" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(s.glassBar, 'flex items-center gap-2 px-4 py-3 text-sm font-semibold text-ink')}
        aria-label="Cambia stile del sito"
      >
        <Icon name="palette" size={18} className="text-brand" />
        {THEMES[themeId]?.name}
      </button>
    </div>
  )
}
