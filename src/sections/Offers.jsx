import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { scrollToSection } from '@/lib/nav'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'

// Offerte e pacchetti: il modo più semplice per spingere la
// prenotazione diretta invece di quella dal portale.
export default function Offers({ id = 'offerte' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site } = useSite()
  const items = (site.offers || []).filter((o) => o.active !== false && t(o.title))

  if (!items.length) return null

  return (
    <section id={id} className={s.sectionTight}>
      <div className={s.container}>
        <Reveal className="max-w-2xl">
          <span className={s.eyebrow}>{ui('section.offers.eyebrow')}</span>
        </Reveal>

        <RevealGroup className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {items.map((o) => (
            <RevealItem key={o.id}>
              <article className={cn(s.card, s.cardHover, 'flex h-full flex-col p-6')}>
                {t(o.badge) && <span className={cn(s.badge, 'self-start')}>{t(o.badge)}</span>}
                <h3 className={cn(s.h3, 'mt-3')}>{t(o.title)}</h3>
                <p className={cn(s.body, 'mt-2 flex-1 text-[0.9rem]')}>{t(o.text)}</p>
                <button
                  type="button"
                  onClick={() => scrollToSection('home')}
                  className={cn(s.btnGhost, 'mt-5 self-start px-0')}
                >
                  {ui('cta.check')} <Icon name="arrowRight" size={15} />
                </button>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
