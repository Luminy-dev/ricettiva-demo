import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'
import SmartImage from '@/components/SmartImage'

// Sezione arrivo / check-in autonomo: pertinente per affittacamere
// e case vacanza, dove "come entro?" è la domanda numero uno.
export default function CheckIn({ id = 'arrivo' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site } = useSite()
  const c = site.checkin || {}
  const steps = Array.isArray(c.steps) ? c.steps : []

  return (
    <section id={id} className={cn(s.section, s.surfaceAlt)}>
      <div className={s.container}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <span className={s.eyebrow}>{ui('section.checkin.eyebrow')}</span>
            <h2 className={cn(s.h2, 'mt-5')}>{t(c.title)}</h2>
            <p className={cn(s.lead, 'mt-5')}>{t(c.text)}</p>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.85rem] text-ink-muted">
              {site.contact?.checkinTime && (
                <span className="flex items-center gap-2">
                  <Icon name="key" size={16} className="text-brand" /> Check-in {site.contact.checkinTime}
                </span>
              )}
              {site.contact?.checkoutTime && (
                <span className="flex items-center gap-2">
                  <Icon name="clock" size={16} className="text-brand" /> Check-out {site.contact.checkoutTime}
                </span>
              )}
            </div>

            {steps.length > 0 && (
              <RevealGroup className="mt-10 space-y-4" delay={0.1}>
                {steps.map((st, i) => (
                  <RevealItem key={i}>
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/40',
                          'font-display text-sm font-bold text-brand'
                        )}
                      >
                        {i + 1}
                      </span>
                      <p className={cn(s.body, 'pt-1.5')}>{t(st)}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <SmartImage src={c.image} alt={t(c.title)} ratio="4/5" className={s.imageWrap} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
