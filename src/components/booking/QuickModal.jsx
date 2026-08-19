import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { linkPrivacy } from '@/lib/privacy-link'
import { submitRequest } from '@/lib/api'
import { cn, formatDateLong, nightsBetween, waLink } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  Finestra che si apre dopo aver scelto le date
//
//  Due varianti, a seconda di come la struttura prende le
//  prenotazioni:
//
//   · richiesta → si chiedono i recapiti e si invia (il gestore
//     risponde con una proposta)
//   · chiamata  → non c'è nessun canale online: si mostrano le date
//     scelte e si invita a telefonare, con il numero già pronto
//
//  In entrambi i casi le date scelte restano in vista: chi ha appena
//  compilato un modulo non deve chiedersi se sono state registrate.
// ─────────────────────────────────────────────────────────────

export default function QuickModal({ aperto, variante, date, onClose }) {
  const { ui, t, lang } = useI18n()
  const s = useStyles()
  const { site, units } = useSite()

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', unit: '', privacy: false, website: '' })
  const [errori, setErrori] = useState({})
  const [stato, setStato] = useState('idle')

  useEffect(() => {
    if (aperto) {
      setStato('idle')
      setErrori({})
    }
  }, [aperto])

  useEffect(() => {
    if (!aperto) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [aperto, onClose])

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrori((x) => ({ ...x, [k]: undefined }))
  }

  const notti = nightsBetween(date?.checkIn, date?.checkOut)

  async function invia(e) {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = ui('form.required')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email)) err.email = ui('form.invalidEmail')
    if (!form.privacy) err.privacy = ui('form.required')
    setErrori(err)
    if (Object.keys(err).length) return

    setStato('invio')
    try {
      await submitRequest({ ...form, ...date, guests: Number(date?.guests) || 2, nights: notti })
      setStato('fatto')
    } catch {
      setStato('errore')
    }
  }

  const telefono = site.contact?.phoneRaw || site.contact?.phone
  const wa = waLink(site.contact?.whatsapp, t(site.contact?.whatsappMessage))

  return (
    <AnimatePresence>
      {aperto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[65] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(s.panel, 'relative max-h-[92svh] w-full max-w-lg overflow-y-auto p-6 sm:p-7')}
          >
            <button
              type="button"
              onClick={onClose}
              className={cn(s.btnIcon, 'absolute right-4 top-4')}
              aria-label={ui('nav.close')}
            >
              <Icon name="close" size={18} />
            </button>

            {/* Le date scelte restano sempre in vista */}
            <div className={cn('mb-5 rounded-theme border border-line px-4 py-3', s.surfaceAlt)}>
              <p className={cn(s.label, 'mb-1')}>{ui('availability.result')}</p>
              <p className="text-[0.92rem] font-semibold text-ink">
                {formatDateLong(date?.checkIn, lang)} → {formatDateLong(date?.checkOut, lang)}
              </p>
              <p className={cn(s.small, 'mt-0.5')}>
                {notti} {ui('field.nights')} · {date?.guests} {ui('booking.guests').toLowerCase()}
              </p>
            </div>

            {variante === 'chiamata' ? (
              <>
                <h3 className={s.h3}>{ui('quick.callTitle')}</h3>
                <p className={cn(s.body, 'mt-2')}>{ui('quick.callText')}</p>
                <div className="mt-6 flex flex-col gap-2.5">
                  {telefono && (
                    <a href={`tel:${telefono}`} className={s.btnPrimary}>
                      <Icon name="phone" size={16} /> {site.contact?.phone}
                    </a>
                  )}
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className={s.btnSecondary}>
                      <Icon name="whatsapp" size={16} /> {ui('cta.whatsapp')}
                    </a>
                  )}
                  {site.contact?.email && (
                    <a href={`mailto:${site.contact.email}`} className={s.btnGhost}>
                      <Icon name="mail" size={16} /> {site.contact.email}
                    </a>
                  )}
                </div>
              </>
            ) : stato === 'fatto' ? (
              <div className="py-4 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ok/15 text-ok">
                  <Icon name="check" size={24} />
                </span>
                <p className={cn(s.h3, 'mt-4')}>{ui('form.success')}</p>
                <button type="button" onClick={onClose} className={cn(s.btnSecondary, 'mt-5')}>
                  {ui('nav.close')}
                </button>
              </div>
            ) : (
              <form onSubmit={invia} className="relative" noValidate>
                <h3 className={s.h3}>{ui('quick.requestTitle')}</h3>
                <p className={cn(s.body, 'mt-1.5 text-[0.88rem]')}>{ui('quick.requestText')}</p>

                {/* Trappola per i bot */}
                <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={s.label}>{ui('form.name')}</span>
                    <input className={s.input} value={form.name} onChange={set('name')} autoComplete="name" />
                    {errori.name && <span className="mt-1 block text-[0.75rem] text-danger">{errori.name}</span>}
                  </label>
                  <label className="block">
                    <span className={s.label}>{ui('form.phone')}</span>
                    <input className={s.input} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={s.label}>{ui('form.email')}</span>
                    <input className={s.input} type="email" value={form.email} onChange={set('email')} autoComplete="email" />
                    {errori.email && <span className="mt-1 block text-[0.75rem] text-danger">{errori.email}</span>}
                  </label>
                  {units.length > 1 && (
                    <label className="block sm:col-span-2">
                      <span className={s.label}>{ui('booking.unit')}</span>
                      <select className={s.input} value={form.unit} onChange={set('unit')}>
                        <option value="">{ui('booking.anyUnit')}</option>
                        {units.map((u) => (
                          <option key={u.id} value={u.id}>
                            {t(u.name)}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label className="block sm:col-span-2">
                    <span className={s.label}>{ui('form.message')}</span>
                    <textarea rows={2} className={cn(s.input, 'resize-y')} value={form.message} onChange={set('message')} />
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
                    {ui('form.privacy')}
                    {errori.privacy && <span className="ml-1 text-danger">*</span>}
                    <a
                      href={linkPrivacy(site)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 whitespace-nowrap underline underline-offset-2 transition hover:text-brand"
                    >
                      {ui('form.privacyLink')}
                    </a>
                  </span>
                </label>

                <button type="submit" className={cn(s.btnPrimary, 'mt-5 w-full')} disabled={stato === 'invio'}>
                  {stato === 'invio' ? ui('cta.sending') : ui('cta.send')}
                </button>

                {stato === 'errore' && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-danger">
                    <Icon name="warning" size={16} /> {ui('form.error')}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
