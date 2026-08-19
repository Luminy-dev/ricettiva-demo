import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Reveal from '@/components/Reveal'
import SmartImage from '@/components/SmartImage'

// Sezione "chi siamo": nelle strutture piccole è quella che
// distingue una casa da una stanza qualunque su un portale.
export default function Story({ id = 'struttura' }) {
  const { ui, t, tList } = useI18n()
  const s = useStyles()
  const { site, themeId } = useSite()
  const story = site.story || {}
  const paragraphs = tList(story.paragraphs)

  return (
    <section id={id} className={s.section}>
      <div className={s.container}>
        <div
          className={cn(
            'grid items-center gap-10 lg:gap-16',
            themeId === 'noir' ? 'lg:grid-cols-2' : 'lg:grid-cols-[1fr_1.1fr]'
          )}
        >
          <Reveal className={cn('order-2', themeId === 'heritage' ? 'lg:order-1' : 'lg:order-2')}>
            <SmartImage
              src={story.image}
              alt={t(story.title)}
              ratio={themeId === 'noir' ? '3/4' : '4/3'}
              className={s.imageWrap}
            />
          </Reveal>

          <Reveal delay={0.12} className={cn('order-1', themeId === 'heritage' ? 'lg:order-2' : 'lg:order-1')}>
            <span className={s.eyebrow}>{ui('section.story.eyebrow')}</span>
            <h2 className={cn(s.h2, 'mt-5')}>{t(story.title)}</h2>

            <div className="mt-6 space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className={s.body}>
                  {p}
                </p>
              ))}
            </div>

            {Array.isArray(story.highlights) && story.highlights.length > 0 && (
              <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-line py-5">
                {story.highlights.map((h, i) => (
                  <div key={i}>
                    <dt className="text-[0.68rem] uppercase tracking-label text-ink-muted">{t(h.k)}</dt>
                    <dd className={cn('mt-1.5 font-display text-lg text-ink', themeId === 'glass' && 'font-bold')}>
                      {t(h.v)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
