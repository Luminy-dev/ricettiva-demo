import { motion } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import HeroBooking from '@/components/booking/HeroBooking'

// ─────────────────────────────────────────────────────────────
//  Apertura · tema HERITAGE
//
//  Fotografia a tutto schermo dietro, titolo e disponibilità sopra,
//  con la grammatica della carta stampata: serif, filetti sottili,
//  molto respiro, movimento quasi assente. Il velo sulla foto è più
//  fitto che negli altri temi: il serif scuro su fotografia perde
//  leggibilità prima di un carattere bastone.
// ─────────────────────────────────────────────────────────────

export default function HeroHeritage() {
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
          <SmartImage
            src={hero.image}
            alt=""
            ratio="auto"
            priority
            className="h-full w-full"
            imgClassName={''}
          />
        )}
        <div className="absolute inset-0 bg-bg/85" />
      </div>


      <div className={cn(s.container, 'text-center')}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={cn(s.eyebrow, 'justify-center')}
        >
          {t(hero.eyebrow)}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={cn(s.h1, 'mx-auto mt-6 max-w-4xl whitespace-pre-line')}
        >
          {t(hero.title)}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mx-auto mt-8 h-px w-24 bg-accent"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className={cn(s.lead, 'mx-auto mt-8 text-center')}
        >
          {t(hero.subtitle)}
        </motion.p>

        {features['booking.hero_bar'] && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mx-auto mt-10 max-w-4xl text-left"
          >
            <HeroBooking />
          </motion.div>
        )}

        {Array.isArray(hero.badges) && hero.badges.length > 0 && (
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mx-auto mt-10 grid max-w-3xl grid-cols-1 border-y border-line sm:grid-cols-3"
          >
            {hero.badges.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2.5 border-b border-line py-4 last:border-b-0 sm:border-b-0"
              >
                <Icon name={b.icon} size={17} className="shrink-0 text-brand" />
                <dt className="text-[0.82rem] text-ink-soft">{t(b.label)}</dt>
              </div>
            ))}
          </motion.dl>
        )}

        {site.reviews?.rating && (
          <p className="mt-8 flex items-center justify-center gap-2 whitespace-nowrap text-[0.78rem] uppercase tracking-wider2 text-ink-muted">
            <span className="font-display text-lg normal-case tracking-normal text-ink">{site.reviews.rating}</span>
            {site.reviews.count} {site.reviews.source || ''}
          </p>
        )}
      </div>
    </section>
  )
}
