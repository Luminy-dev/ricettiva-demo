import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'

// Recensioni: voto medio + tre citazioni. Non sostituisce i portali,
// li anticipa — così chi arriva dal sito non se ne va a cercarle altrove.
export default function Reviews({ id = 'recensioni' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site, themeId } = useSite()
  const r = site.reviews || {}
  const items = (r.items || []).filter((x) => t(x.text))

  if (!items.length) return null

  return (
    <section id={id} className={cn(s.section, themeId !== 'noir' && s.surfaceAlt)}>
      <div className={s.container}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className={s.eyebrow}>{ui('section.reviews.eyebrow')}</span>
            <h2 className={cn(s.h2, 'mt-4')}>{ui('section.reviews.title')}</h2>
          </div>

          {r.rating && (
            <div className={cn(themeId === 'glass' ? cn(s.card, 'px-6 py-4') : 'border-l-2 border-brand pl-5')}>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-ink">{r.rating}</span>
                <span className="text-sm text-ink-muted">/ 10</span>
              </div>
              <p className="mt-1 text-[0.75rem] text-ink-muted">
                {r.count} {ui('section.reviews.eyebrow').toLowerCase()} {r.source ? `· ${r.source}` : ''}
              </p>
            </div>
          )}
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" delay={0.05}>
          {items.map((rev, i) => (
            <RevealItem key={i}>
              <figure className={cn(s.card, 'flex h-full flex-col p-6')}>
                <div className="flex items-center gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Icon
                      key={k}
                      name="star"
                      size={14}
                      className={k < Math.round((rev.rating || 10) / 2) ? 'fill-current' : 'opacity-25'}
                    />
                  ))}
                </div>
                <blockquote className={cn(s.body, 'mt-4 flex-1 italic')}>“{t(rev.text)}”</blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <span className="text-[0.85rem] font-semibold text-ink">{rev.author}</span>
                  <span className="text-[0.72rem] uppercase tracking-wider2 text-ink-muted">
                    {rev.country} {rev.date ? `· ${rev.date}` : ''}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
