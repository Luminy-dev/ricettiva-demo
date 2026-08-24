import { useState } from 'react'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
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
//
//  Cambia anche l'impaginazione, perché quasi tutte le strutture
//  piccole hanno una sola unità: "1 appartamenti" non si può
//  leggere, e una card sola dentro una griglia da tre lascia due
//  terzi di sezione vuoti. Quindi:
//    · 1 unità  → titolo al singolare e scheda grande a due colonne
//    · 2 unità  → griglia da due, centrata
//    · 3+ unità → griglia da tre
// ─────────────────────────────────────────────────────────────

export default function Units({ id = 'camere' }) {
  const { ui } = useI18n()
  const s = useStyles()
  const { units, preset, themeId } = useSite()
  // { unit, index }: l'indice serve alle miniature, che aprono la
  // galleria già sulla foto scelta.
  const [open, setOpen] = useState(null)

  if (!units.length) return null

  const single = units.length === 1
  const heading = single ? ui(preset.unit.a) : `${units.length} ${ui(preset.unit.plural)}`

  return (
    <section id={id} className={cn(s.section, themeId !== 'noir' && s.surfaceAlt)}>
      <div className={s.container}>
        <Reveal className="max-w-2xl">
          <span className={s.eyebrow}>{ui('section.rooms.eyebrow')}</span>
          <h2 className={cn(s.h2, 'mt-4 first-letter:uppercase')}>{heading}</h2>
        </Reveal>

        {single ? (
          <Reveal className="mt-12">
            <UnitFeature unit={units[0]} onOpen={(index) => setOpen({ unit: units[0], index })} />
          </Reveal>
        ) : (
          <RevealGroup
            className={cn(
              'mt-12 grid gap-6 sm:grid-cols-2',
              units.length === 2 ? 'lg:mx-auto lg:max-w-4xl' : 'lg:grid-cols-3'
            )}
            delay={0.05}
          >
            {units.map((u) => (
              <RevealItem key={u.id}>
                <UnitCard unit={u} onOpen={() => setOpen({ unit: u, index: 0 })} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>

      <UnitModal unit={open?.unit || null} startIndex={open?.index || 0} onClose={() => setOpen(null)} />
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
//  Struttura con una sola unità
//
//  Niente griglia: foto grande a tutta colonna, testo disteso,
//  specifiche per esteso e tutti i servizi. È la stessa sostanza
//  della card, ma occupa la sezione invece di galleggiarci dentro.
// ─────────────────────────────────────────────────────────────

function UnitFeature({ unit, onOpen }) {
  const { ui, t, lang } = useI18n()
  const s = useStyles()
  const { preset, features } = useSite()
  const showPrice = features['booking.show_prices'] && unit.priceFrom

  const gallery = unit.gallery?.length ? unit.gallery : unit.cover ? [unit.cover] : []
  const tiles = gallery.slice(1, 3)
  const rest = gallery.length - 1 - tiles.length
  // Con almeno tre foto la colonna diventa un mosaico: le righe sono
  // proporzionali, quindi qualunque altezza prenda il testo accanto i
  // riquadri restano su un formato vicino al 4:3 delle foto vere.
  const mosaico = gallery.length >= 3
  const amenities = (unit.amenities || []).filter((k) => AMENITIES[k])

  return (
    <article className={cn(s.card, 'overflow-hidden')}>
      <div className="grid lg:grid-cols-[1.08fr_1fr]">
        {/* Foto: da lg in poi riempiono la colonna in altezza, così la
            scheda non resta con un lato più corto dell'altro. */}
        <div className="relative lg:min-h-[26rem]">
          <div
            className={cn(
              'grid gap-1.5 lg:absolute lg:inset-0',
              mosaico && 'lg:grid-cols-2 lg:grid-rows-[minmax(0,2fr)_minmax(0,1fr)]'
            )}
          >
            <button
              type="button"
              onClick={() => onOpen(0)}
              className={cn(
                'group relative block overflow-hidden text-left',
                mosaico && 'lg:col-span-2'
              )}
              aria-label={t(unit.name)}
            >
              <SmartImage
                src={gallery[0]}
                alt={t(unit.name)}
                ratio="4/3"
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="lg:absolute lg:inset-0"
                imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
              />
              <div className={cn('pointer-events-none absolute inset-0', s.imageOverlay)} />
              {gallery.length > 1 && (
                <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[0.72rem] font-medium text-white backdrop-blur-sm">
                  <Icon name="image" size={14} /> {gallery.length}
                </span>
              )}
            </button>

            {/* I riquadri piccoli servono a riempire la colonna: sotto lg
                la foto grande basta, il resto si vede nella galleria. */}
            {mosaico &&
              tiles.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => onOpen(i + 1)}
                  className="group relative hidden overflow-hidden text-left lg:block"
                  aria-label={ui('gallery.counter', { i: i + 2, n: gallery.length })}
                >
                  <SmartImage
                    src={src}
                    alt=""
                    ratio="1/1"
                    className="absolute inset-0"
                    imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                  />
                  {rest > 0 && i === tiles.length - 1 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 font-display text-lg font-semibold text-white">
                      +{rest}
                    </span>
                  )}
                </button>
              ))}
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className={cn(s.h3, 'sm:text-[1.7rem]')}>{t(unit.name)}</h3>
            {showPrice && (
              <div className="text-right">
                <span className="block text-[0.68rem] uppercase tracking-wider2 text-ink-muted">
                  {ui('field.from')}
                </span>
                <span className="block font-display text-xl font-bold text-ink">
                  {formatPrice(unit.priceFrom, lang)}
                </span>
                <span className="block text-[0.7rem] text-ink-muted">{ui('field.perNight')}</span>
              </div>
            )}
          </div>

          <p className={cn(s.body, 'mt-3')}>{t(unit.blurb)}</p>

          <div className={cn(s.divider, 'my-6')} />

          <UnitSpecs unit={unit} preset={preset} className="grid-cols-2" />

          {amenities.length > 0 && (
            <>
              <div className={cn(s.divider, 'my-6')} />
              <div className="flex flex-wrap gap-1.5">
                {amenities.slice(0, 10).map((k) => (
                  <span key={k} className={cn(s.chip, 'text-[0.72rem]')}>
                    <Icon name={AMENITIES[k].icon} size={13} />
                    {amenityLabel(k, lang)}
                  </span>
                ))}
                {amenities.length > 10 && (
                  <span className={cn(s.chip, 'text-[0.72rem]')}>+{amenities.length - 10}</span>
                )}
              </div>
            </>
          )}

          <button type="button" onClick={() => onOpen(0)} className={cn(s.btnPrimary, 'mt-7 self-start')}>
            {ui('cta.details')} <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
    </article>
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
