import { motion } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn, prefersReducedMotion, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import HeroBooking from '@/components/booking/HeroBooking'
import Particelle from './Particelle'

// ─────────────────────────────────────────────────────────────
//  Apertura · tema NOIR
//
//  Fotografia a tutto schermo dietro, tenuta al buio: sopra ci
//  passano sfumature pesanti che la fondono col fondo nero, così il
//  serif chiaro resta leggibile e l'immagine diventa atmosfera invece
//  che soggetto. Movimento di camera lentissimo, da locandina.
// ─────────────────────────────────────────────────────────────

export default function HeroNoir() {
  const { t } = useI18n()
  const s = useStyles()
  const { site, features } = useSite()
  const hero = site.hero || {}
  const useVideo = features['hero.video'] && hero.video
  const fermo = prefersReducedMotion()

  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 sm:pt-36">
      {/* `isolate` non e' cosmetico: lo sfondo qui sotto e' `-z-10` e la
          sezione, da sola, non apre un contesto di impilamento. Senza,
          quel livello finisce dietro al fondo opaco di <body> e di
          `s.page`, e sparisce tutto — fotografia compresa. Con
          `isolate` il -z-10 resta dentro la sezione: sotto ai contenuti,
          sopra al fondo pagina. */}
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
            imgClassName={fermo ? '' : 'animate-pan-slow'}
          />
        )}
        {/* Velo più leggero di prima: col fondo schiarito la fotografia
            non ha più bisogno di essere spenta per far leggere il testo,
            e in apertura è la cosa che il visitatore guarda per prima. */}
        <div className="absolute inset-0 bg-bg/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/25 to-bg" />
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--backdrop)' }} />
        {features['hero.particles'] && <Particelle />}
      </div>

      <div className={cn(s.container, 'text-center')}>
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.36em' }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(s.eyebrow, 'justify-center')}
        >
          {t(hero.eyebrow)}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(s.h1, 'mx-auto mt-8 max-w-4xl whitespace-pre-line')}
        >
          {t(hero.title)}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.9 }}
          className="mx-auto mt-10 h-px w-40 bg-gradient-to-r from-transparent via-brand to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.7 }}
          className={cn(s.lead, 'mx-auto mt-8 text-center')}
        >
          {t(hero.subtitle)}
        </motion.p>

        {features['booking.hero_bar'] && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.95 }}
            className="mx-auto mt-12 max-w-4xl text-left"
          >
            <HeroBooking />
          </motion.div>
        )}

        {Array.isArray(hero.badges) && hero.badges.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          >
            {hero.badges.map((b, i) => (
              <li key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[0.78rem] uppercase tracking-wider2 text-ink-muted">
                <Icon name={b.icon} size={16} className="text-brand" />
                {t(b.label)}
              </li>
            ))}
          </motion.ul>
        )}

        {site.reviews?.rating && (
          <p className="mt-10 flex items-center justify-center gap-2.5 whitespace-nowrap text-[0.76rem] uppercase tracking-wider2 text-ink-muted">
            <Icon name="star" size={15} className="text-brand" />
            {site.reviews.rating} · {site.reviews.count} {site.reviews.source || ''}
          </p>
        )}
      </div>
    </section>
  )
}
