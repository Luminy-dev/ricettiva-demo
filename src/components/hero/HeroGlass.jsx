import { motion } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import HeroBooking from '@/components/booking/HeroBooking'

// ─────────────────────────────────────────────────────────────
//  Apertura · tema VETRO
//
//  La fotografia sta dietro, a tutto schermo; sopra ci sono il
//  titolo e la verifica disponibilità. È l'impaginazione dei siti
//  delle strutture, e c'è un motivo: la foto dice «questo posto»,
//  il calendario dice «è libero?» — le due cose che un ospite
//  guarda nei primi secondi, senza doverne cercare nessuna.
//
//  Sopra la foto c'è un velo chiaro sfocato: senza, il testo scuro
//  diventa illeggibile appena il cliente carica una foto luminosa.
//  Ed è anche il carattere del tema — vetro smerigliato su luce.
// ─────────────────────────────────────────────────────────────

export default function HeroGlass() {
  const { t } = useI18n()
  const s = useStyles()
  const { site, features } = useSite()
  const hero = site.hero || {}
  const useVideo = features['hero.video'] && hero.video

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pt-32">
      {/* Sfondo */}
      <div className="absolute inset-0 -z-10">
        {useVideo ? (
          <video
            src={safeMediaUrl(hero.video)}
            poster={safeMediaUrl(hero.image)}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <SmartImage src={hero.image} alt="" ratio="auto" priority className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-bg/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--backdrop)', opacity: 0.75 }} />
      </div>

      <div className={cn(s.container, 'relative')}>
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(s.eyebrow, 'justify-center')}
          >
            {t(hero.eyebrow)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={cn(s.h1, 'mt-5 whitespace-pre-line')}
          >
            {t(hero.title)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
            className={cn(s.lead, 'mx-auto mt-6 text-center')}
          >
            {t(hero.subtitle)}
          </motion.p>
        </div>

        {features['booking.hero_bar'] && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36 }}
            className="mx-auto mt-10 max-w-4xl"
          >
            <HeroBooking />
          </motion.div>
        )}

        {Array.isArray(hero.badges) && hero.badges.length > 0 && (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.55 } } }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          >
            {hero.badges.map((b, i) => (
              <motion.li
                key={i}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className={cn(s.chip, 'gap-2 px-4 py-2.5')}
              >
                <Icon name={b.icon} size={16} className="text-brand" />
                {t(b.label)}
              </motion.li>
            ))}
          </motion.ul>
        )}

        {site.reviews?.rating && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex items-center justify-center gap-2 text-[0.8rem] text-ink-muted"
          >
            <Icon name="star" size={14} className="text-brand" />
            <span className="font-semibold text-ink">{site.reviews.rating}</span>
            {site.reviews.count} {site.reviews.source ? `· ${site.reviews.source}` : ''}
          </motion.p>
        )}
      </div>
    </section>
  )
}
