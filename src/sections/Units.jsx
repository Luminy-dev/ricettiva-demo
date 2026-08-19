import { useState } from 'react'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { unitFieldEnabled } from '@/config/presets'
import { amenityLabel, AMENITIES } from '@/config/amenities'
import { cn, formatPrice } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'
import SmartImage from '@/components/SmartImage'
import UnitModal from './UnitModal'
import UnitSpecs from './UnitSpecs'

// ─────────────────────────────────────────────────────────────
//  Sezione unità (camere / appartamenti / unità)
//
//  Il vocabolario e i campi visibili cambiano con la tipologia di
//  struttura: un B&B mostra i letti, un appartamento mostra anche
//  cucina e soggiorno minimo, l'agriturismo nasconde il piano.
// ─────────────────────────────────────────────────────────────

export default function Units({ id = 'camere' }) {
  const { ui } = useI18n()
  const s = useStyles()
  const { units, preset, themeId } = useSite()
  const [openUnit, setOpenUnit] = useState(null)

  if (!units.length) return null
  const unitWord = ui(preset.unit.plural)

  return (
    <section id={id} className={cn(s.section, themeId !== 'noir' && s.surfaceAlt)}>
      <div className={s.container}>
        <Reveal className="max-w-2xl">
          <span className={s.eyebrow}>{ui('section.rooms.eyebrow')}</span>
          <h2 className={cn(s.h2, 'mt-4 first-letter:uppercase')}>
            {units.length} {unitWord}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {units.map((u) => (
            <RevealItem key={u.id}>
              <UnitCard unit={u} onOpen={() => setOpenUnit(u)} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <UnitModal unit={openUnit} onClose={() => setOpenUnit(null)} />
    </section>
  )
}

function UnitCard({ unit, onOpen }) {
  const { ui, t, lang } = useI18n()
  const s = useStyles()
  const { preset, features } = useSite()
  const showPrice = features['booking.show_prices'] && unit.priceFrom

  return (
    <article className={cn(s.card, s.cardHover, 'group flex h-full flex-col overflow-hidden')}>
      <button type="button" onClick={onOpen} className="relative block text-left">
        <SmartImage
          src={unit.cover}
          alt={t(unit.name)}
          ratio="4/3"
          imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
        />
        <div className={cn('pointer-events-none absolute inset-0', s.imageOverlay)} />
        {showPrice && (
          <span className={cn(s.badge, 'absolute left-3 top-3')}>
            {ui('field.from')} {formatPrice(unit.priceFrom, lang)}
          </span>
        )}
        {unit.gallery?.length > 1 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur-sm">
            <Icon name="image" size={13} /> {unit.gallery.length}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className={s.h3}>{t(unit.name)}</h3>
        <p className={cn(s.body, 'mt-2 line-clamp-3 flex-1 text-[0.9rem]')}>{t(unit.blurb)}</p>

        <UnitSpecs unit={unit} preset={preset} compact />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {(unit.amenities || []).slice(0, 4).map((k) =>
            AMENITIES[k] ? (
              <span key={k} className={cn(s.chip, 'text-[0.72rem]')}>
                <Icon name={AMENITIES[k].icon} size={13} />
                {amenityLabel(k, lang)}
              </span>
            ) : null
          )}
          {(unit.amenities || []).length > 4 && (
            <span className={cn(s.chip, 'text-[0.72rem]')}>+{unit.amenities.length - 4}</span>
          )}
        </div>

        <button type="button" onClick={onOpen} className={cn(s.btnGhost, 'mt-5 self-start px-0')}>
          {ui('cta.details')} <Icon name="arrowRight" size={15} />
        </button>
      </div>
    </article>
  )
}
