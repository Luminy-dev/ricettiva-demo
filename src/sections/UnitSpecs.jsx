import { useI18n } from '@/i18n'
import { useStyles } from '@/lib/site'
import { unitFieldEnabled } from '@/config/presets'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'

// Riga di specifiche dell'unità, filtrata dai campi che hanno senso
// per la tipologia di struttura (un B&B non mostra la cucina).
export default function UnitSpecs({ unit, preset, compact = false, className = '' }) {
  const { ui, t } = useI18n()
  const s = useStyles()

  const specs = [
    { field: 'guests', icon: 'users', value: unit.guests, label: ui('field.guests') },
    { field: 'bedrooms', icon: 'bed', value: unit.bedrooms, label: ui('field.bedrooms') },
    { field: 'beds', icon: 'bed', value: t(unit.beds), label: ui('field.beds') },
    { field: 'bathroom', icon: 'bath', value: unit.bathroom, label: ui('field.bathroom') },
    { field: 'size', icon: 'ruler', value: unit.size ? `${unit.size} m²` : '', label: ui('field.size') },
    { field: 'view', icon: 'eye', value: t(unit.view), label: ui('field.view') },
    { field: 'floor', icon: 'stairs', value: t(unit.floor), label: ui('field.floor') },
    { field: 'kitchen', icon: 'kitchen', value: t(unit.kitchen), label: ui('field.kitchen') },
    {
      field: 'minStay',
      icon: 'calendar',
      value: unit.minStay ? `${unit.minStay} ${ui('field.nights')}` : '',
      label: ui('field.minStay'),
    },
  ].filter((x) => unitFieldEnabled(preset.id, x.field) && x.value)

  if (!specs.length) return null

  if (compact) {
    return (
      <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8rem] text-ink-muted">
        {specs.slice(0, 4).map((x) => (
          <li key={x.field} className="flex items-center gap-1.5">
            <Icon name={x.icon} size={14} />
            {x.value}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <dl className={cn('grid gap-4', className || 'grid-cols-2 sm:grid-cols-3')}>
      {specs.map((x) => (
        <div key={x.field} className="flex items-start gap-2.5">
          <Icon name={x.icon} size={17} className="mt-0.5 shrink-0 text-brand" />
          <div className="min-w-0">
            <dt className="text-[0.68rem] uppercase tracking-wider2 text-ink-muted">{x.label}</dt>
            <dd className={cn(s.body, 'mt-0.5 text-[0.88rem] text-ink')}>{x.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
