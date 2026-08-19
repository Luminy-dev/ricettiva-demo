import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { AMENITIES, amenityLabel, groupAmenities } from '@/config/amenities'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'

// Servizi e dotazioni della struttura, raggruppati per categoria.
// Le voci arrivano da un catalogo chiuso (traduzioni e icone già
// pronte) più eventuali voci libere aggiunte dal cliente.
export default function Amenities({ id = 'servizi' }) {
  const { ui, t, lang } = useI18n()
  const s = useStyles()
  const { site, themeId } = useSite()

  const keys = (site.amenities || []).filter((k) => AMENITIES[k])
  const custom = site.amenitiesCustom || []
  if (!keys.length && !custom.length) return null

  const groups = groupAmenities(keys)

  return (
    <section id={id} className={s.section}>
      <div className={s.container}>
        <Reveal className="max-w-2xl">
          <span className={s.eyebrow}>{ui('section.amenities.eyebrow')}</span>
          <h2 className={cn(s.h2, 'mt-4')}>{ui('section.amenities.title')}</h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {groups.map((g) => (
            <RevealItem key={g.cat}>
              <div className={cn(themeId === 'glass' ? cn(s.card, 'h-full p-6') : 'h-full border-t border-line pt-5')}>
                <p className={cn(s.label, 'mb-4')}>{g.label}</p>
                <ul className="space-y-3">
                  {g.items.map((k) => (
                    <li key={k} className="flex items-center gap-3 text-[0.9rem] text-ink-soft">
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center text-brand',
                          themeId === 'glass' ? 'rounded-full bg-brand/10' : 'rounded-theme border border-line'
                        )}
                      >
                        <Icon name={AMENITIES[k].icon} size={16} />
                      </span>
                      {amenityLabel(k, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}

          {custom.length > 0 && (
            <RevealItem>
              <div className={cn(themeId === 'glass' ? cn(s.card, 'h-full p-6') : 'h-full border-t border-line pt-5')}>
                <p className={cn(s.label, 'mb-4')}>{ui('section.amenities.eyebrow')}</p>
                <ul className="space-y-3">
                  {custom.map((c, i) => (
                    <li key={i} className="flex items-center gap-3 text-[0.9rem] text-ink-soft">
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center text-brand',
                          themeId === 'glass' ? 'rounded-full bg-brand/10' : 'rounded-theme border border-line'
                        )}
                      >
                        <Icon name={c.icon || 'check'} size={16} />
                      </span>
                      {t(c.label)}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          )}
        </RevealGroup>
      </div>
    </section>
  )
}
