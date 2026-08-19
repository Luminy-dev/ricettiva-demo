import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'
import SmartImage from '@/components/SmartImage'

// Sezione colazione: presente solo per B&B e agriturismi.
// È il principale argomento di vendita di un B&B, quindi ha una
// sezione sua e non una riga persa tra i servizi.
export default function Breakfast({ id = 'colazione' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site, themeId } = useSite()
  const b = site.breakfast || {}
  // Ogni voce è un oggetto multilingua: { it: '…', en: '…' }
  const items = Array.isArray(b.items) ? b.items : []

  return (
    <section id={id} className={cn(s.section, themeId === 'noir' && s.surfaceAlt)}>
      <div className={s.container}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SmartImage src={b.image} alt={t(b.title)} ratio="5/4" className={s.imageWrap} />
          </Reveal>

          <Reveal delay={0.1}>
            <span className={s.eyebrow}>{ui('section.breakfast.eyebrow')}</span>
            <h2 className={cn(s.h2, 'mt-5')}>{t(b.title)}</h2>
            <p className={cn(s.lead, 'mt-5')}>{t(b.text)}</p>

            {b.hours && (
              <p className="mt-6 flex items-center gap-2.5 text-[0.85rem] text-ink-muted">
                <Icon name="clock" size={17} className="text-brand" />
                {b.hours}
              </p>
            )}

            {items.length > 0 && (
              <ul className="mt-8 space-y-3">
                {items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 text-[0.9rem] text-ink-soft">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand" />
                    {t(it)}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
