import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { submitRequest } from '@/lib/api'
import { nightsBetween, todayISO, cn, safeUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import DateRangePicker from './DateRangePicker'

// ─────────────────────────────────────────────────────────────
//  StayKit — Form richiesta disponibilità
//
//  È il percorso di prenotazione quando la struttura NON ha un
//  gestionale, ed è anche il piano B se il widget non si carica.
//  Se il backend è collegato a un DB con le prenotazioni, risponde
//  con lo stato per unità; altrimenti registra la richiesta e basta.
// ─────────────────────────────────────────────────────────────

export default function RequestForm({ compact = false, defaultUnit = '' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { units, site } = useSite()

  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    unit: defaultUnit,
    name: '',
    email: '',
    phone: '',
    message: '',
    privacy: false,
    website: '', // honeypot anti-bot, non visibile
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [result, setResult] = useState(null)

  const nights = useMemo(() => nightsBetween(form.checkIn, form.checkOut), [form.checkIn, form.checkOut])
  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((x) => ({ ...x, [key]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.checkIn) e.checkIn = ui('form.required')
    if (!form.checkOut) e.checkOut = ui('form.required')
    if (form.checkIn && form.checkOut && nights <= 0) e.checkOut = ui('form.invalidDates')
    if (!form.name.trim()) e.name = ui('form.required')
    if (!form.email.trim()) e.email = ui('form.required')
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email)) e.email = ui('form.invalidEmail')
    if (!form.privacy) e.privacy = ui('form.required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      const data = await submitRequest({ ...form, guests: Number(form.guests), nights })
      setResult(data?.availability || null)
      setStatus('done')
    } catch (err) {
      console.warn('[StayKit] Invio richiesta fallito:', err)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(s.panel, 'p-8 text-center')}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ok/15 text-ok">
          <Icon name="check" size={26} />
        </div>
        <p className={cn(s.h3, 'mb-2')}>{ui('form.success')}</p>
        <p className={s.small}>
          {site.contact?.phone && (
            <>
              {ui('cta.call')}:{' '}
              <a className="underline underline-offset-2" href={`tel:${site.contact.phoneRaw || site.contact.phone}`}>
                {site.contact.phone}
              </a>
            </>
          )}
        </p>

        {Array.isArray(result) && result.length > 0 && (
          <div className="mt-6 text-left">
            <p className={cn(s.label, 'mb-2')}>{ui('availability.result')}</p>
            <ul className="space-y-2">
              {result.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-line pb-2 text-sm">
                  <span className="text-ink">{t(unitName(units, r.id)) || r.id}</span>
                  <span
                    className={cn(
                      'font-semibold',
                      r.status === 'free' ? 'text-ok' : r.status === 'small' ? 'text-warn' : 'text-danger'
                    )}
                  >
                    {ui(`availability.${r.status === 'free' ? 'free' : r.status === 'small' ? 'small' : 'busy'}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <form onSubmit={onSubmit} className={cn(s.panel, 'relative', compact ? 'p-5' : 'p-6 sm:p-8')} noValidate>
      <div className={cn('grid gap-4', compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2')}>
        <div className="sm:col-span-2">
          <DateRangePicker
            value={form}
            onChange={(d) => {
              setForm((f) => ({ ...f, ...d }))
              setErrors((x) => ({ ...x, checkIn: undefined, checkOut: undefined }))
            }}
          />
          {(errors.checkIn || errors.checkOut) && (
            <span className="mt-1 block text-[0.75rem] text-danger">{errors.checkIn || errors.checkOut}</span>
          )}
        </div>

        <Field label={ui('booking.guests')}>
          <select className={s.input} value={form.guests} onChange={set('guests')}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <Field label={ui('booking.unit')}>
          <select className={s.input} value={form.unit} onChange={set('unit')}>
            <option value="">{ui('booking.anyUnit')}</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {t(u.name)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {nights > 0 && (
        <p className={cn(s.small, 'mt-3')}>
          {nights} {ui('field.nights')}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={ui('form.name')} error={errors.name}>
          <input className={s.input} value={form.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label={ui('form.email')} error={errors.email}>
          <input className={s.input} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
        </Field>
        <Field label={ui('form.phone')}>
          <input className={s.input} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
        </Field>
        <div className="sm:col-span-2">
          <Field label={ui('form.message')}>
            <textarea
              rows={compact ? 2 : 3}
              className={cn(s.input, 'resize-y')}
              placeholder={ui('form.messagePlaceholder')}
              value={form.message}
              onChange={set('message')}
            />
          </Field>
        </div>
      </div>

      {/* Trappola per i bot: invisibile alle persone, i robot la compilano */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Non compilare
          <input
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={set('website')}
          />
        </label>
      </div>

      <label className="mt-4 flex items-start gap-3 text-[0.82rem] text-ink-soft">
        <input
          type="checkbox"
          checked={form.privacy}
          onChange={set('privacy')}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--hex-brand)]"
        />
        <span>
          {ui('form.privacy')}{' '}
          {site.legal?.privacyUrl && (
            <a href={safeUrl(site.legal.privacyUrl)} className="underline underline-offset-2">
              Privacy
            </a>
          )}
          {errors.privacy && <span className="ml-1 text-danger">*</span>}
        </span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" className={s.btnPrimary} disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Icon name="spinner" size={16} className="animate-spin" /> {ui('cta.sending')}
            </>
          ) : (
            <>
              {ui('cta.send')} <Icon name="arrowRight" size={16} />
            </>
          )}
        </button>
        {site.contact?.phone && (
          <a href={`tel:${site.contact.phoneRaw || site.contact.phone}`} className={s.btnGhost}>
            <Icon name="phone" size={16} /> {site.contact.phone}
          </a>
        )}
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-danger"
          >
            <Icon name="warning" size={16} /> {ui('form.error')}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

function Field({ label, error, children }) {
  const s = useStyles()
  return (
    <label className="block">
      <span className={s.label}>{label}</span>
      {children}
      {error && <span className="mt-1 block text-[0.75rem] text-danger">{error}</span>}
    </label>
  )
}

function unitName(units, id) {
  return units.find((u) => u.id === id)?.name || id
}
