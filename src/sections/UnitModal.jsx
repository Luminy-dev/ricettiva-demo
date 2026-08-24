import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { amenityLabel, AMENITIES, groupAmenities } from '@/config/amenities'
import { scrollToSection } from '@/lib/nav'
import { cn, formatPrice } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import UnitSpecs from './UnitSpecs'

// Scheda completa dell'unità: galleria, specifiche, dotazioni,
// invito a prenotare. Si apre dalla card e si chiude con Esc.
export default function UnitModal({ unit, startIndex = 0, onClose }) {
  const { ui, t, lang } = useI18n()
  const s = useStyles()
  const { preset, features } = useSite()
  const [index, setIndex] = useState(0)

  const gallery = unit?.gallery?.length ? unit.gallery : unit?.cover ? [unit.cover] : []
  const grouped = groupAmenities(unit?.amenities || [])
  const total = gallery.length

  useEffect(() => setIndex(startIndex), [unit?.id, startIndex])

  useEffect(() => {
    if (!unit) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (!total) return
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [unit, total, onClose])

  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t(unit.name)}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              s.panel,
              'relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-b-none sm:rounded-b-theme-xl'
            )}
          >
            <button
              type="button"
              onClick={onClose}
              className={cn(s.btnIcon, 'absolute right-4 top-4 z-10 bg-surface/90')}
              aria-label={ui('nav.close')}
            >
              <Icon name="close" size={19} />
            </button>

            {/* Galleria */}
            {gallery.length > 0 && (
              <div className="relative">
                <SmartImage src={gallery[index]} alt={t(unit.name)} ratio="16/10" priority />
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                      className={cn(s.btnIcon, 'absolute left-3 top-1/2 -translate-y-1/2 bg-surface/85')}
                      aria-label={ui('gallery.prev')}
                    >
                      <Icon name="chevronLeft" size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndex((i) => (i + 1) % gallery.length)}
                      className={cn(s.btnIcon, 'absolute right-3 top-1/2 -translate-y-1/2 bg-surface/85')}
                      aria-label={ui('gallery.next')}
                    >
                      <Icon name="chevronRight" size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                      {gallery.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setIndex(i)}
                          className={cn(
                            'h-1.5 rounded-full transition-all',
                            i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/55'
                          )}
                          aria-label={ui('gallery.counter', { i: i + 1, n: gallery.length })}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className={s.h2}>{t(unit.name)}</h3>
                  <p className={cn(s.lead, 'mt-3')}>{t(unit.blurb)}</p>
                </div>
                {features['booking.show_prices'] && unit.priceFrom && (
                  <div className="text-right">
                    <span className="block text-[0.7rem] uppercase tracking-wider2 text-ink-muted">
                      {ui('field.from')}
                    </span>
                    <span className="block font-display text-2xl font-bold text-ink">
                      {formatPrice(unit.priceFrom, lang)}
                    </span>
                    <span className="block text-[0.72rem] text-ink-muted">{ui('field.perNight')}</span>
                  </div>
                )}
              </div>

              <div className={cn(s.divider, 'my-7')} />

              <UnitSpecs unit={unit} preset={preset} />

              {grouped.length > 0 && (
                <>
                  <div className={cn(s.divider, 'my-7')} />
                  <div className="space-y-6">
                    {grouped.map((g) => (
                      <div key={g.cat}>
                        <p className={cn(s.label, 'mb-3')}>{g.label}</p>
                        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {g.items.map((k) => (
                            <li key={k} className="flex items-center gap-2.5 text-[0.88rem] text-ink-soft">
                              <Icon name={AMENITIES[k]?.icon || 'check'} size={16} className="shrink-0 text-brand" />
                              {amenityLabel(k, lang)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    setTimeout(() => scrollToSection('home'), 220)
                  }}
                  className={s.btnPrimary}
                >
                  {ui('cta.check')} <Icon name="arrowRight" size={16} />
                </button>
                <button type="button" onClick={onClose} className={s.btnSecondary}>
                  {ui('cta.back')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
