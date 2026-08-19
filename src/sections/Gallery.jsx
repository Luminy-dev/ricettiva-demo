import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'
import SmartImage from '@/components/SmartImage'

// Galleria a mosaico con visualizzatore a schermo intero.
// Le foto sono l'80% della decisione di prenotare: la griglia dà
// respiro alle immagini invece di comprimerle tutte uguali.
export default function Gallery({ id = 'galleria' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site } = useSite()
  const photos = (site.gallery || []).filter((p) => p?.src)
  const [open, setOpen] = useState(-1)

  if (!photos.length) return null

  return (
    <section id={id} className={s.section}>
      <div className={s.container}>
        <Reveal className="max-w-2xl">
          <span className={s.eyebrow}>{ui('section.gallery.eyebrow')}</span>
          <h2 className={cn(s.h2, 'mt-4')}>{ui('section.gallery.title')}</h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-4 lg:grid-cols-4">
          {photos.map((p, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
              className={cn(
                'group relative',
                s.imageWrap,
                // ritmo del mosaico: alcune foto occupano più spazio
                i % 6 === 0 && 'lg:col-span-2 lg:row-span-2',
                i % 6 === 3 && 'sm:row-span-2'
              )}
            >
              <SmartImage
                src={p.src}
                alt={t(p.alt)}
                ratio="auto"
                className="h-full w-full"
                imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/15" />
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox photos={photos} index={open} onClose={() => setOpen(-1)} onNav={setOpen} />
    </section>
  )
}

export function Lightbox({ photos, index, onClose, onNav }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const total = photos.length
  const isOpen = index >= 0

  const go = useCallback(
    (dir) => onNav((i) => {
      const next = (i + dir + total) % total
      return next
    }),
    [onNav, total]
  )

  useEffect(() => {
    if (!isOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, go])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/92 p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={ui('gallery.close')}
          >
            <Icon name="close" size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={ui('gallery.prev')}
          >
            <Icon name="chevronLeft" size={22} />
          </button>

          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86svh] max-w-5xl"
          >
            <img
              src={safeMediaUrl(photos[index].src)}
              alt={t(photos[index].alt)}
              className="max-h-[78svh] w-auto rounded-theme object-contain"
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-[0.8rem] text-white/70">
              <span>{t(photos[index].alt)}</span>
              <span>{ui('gallery.counter', { i: index + 1, n: total })}</span>
            </figcaption>
          </motion.figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={ui('gallery.next')}
          >
            <Icon name="chevronRight" size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
