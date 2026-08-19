import { useState } from 'react'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { linkPrivacy } from '@/lib/privacy-link'
import { submitContact } from '@/lib/api'
import { cn, waLink, safeUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal from '@/components/Reveal'

// Contatti: recapiti a sinistra, messaggio libero a destra.
// Volutamente separato dalla richiesta di disponibilità: chi vuole
// solo fare una domanda non deve compilare le date.
export default function Contact({ id = 'contatti' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site, features } = useSite()
  const c = site.contact || {}

  const [form, setForm] = useState({ name: '', email: '', message: '', privacy: false, website: '' })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = ui('form.required')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email)) err.email = ui('form.invalidEmail')
    if (!form.message.trim()) err.message = ui('form.required')
    if (!form.privacy) err.privacy = ui('form.required')
    setErrors(err)
    if (Object.keys(err).length) return

    setStatus('sending')
    try {
      await submitContact(form)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const wa = features['contact.whatsapp_button'] ? waLink(c.whatsapp, t(c.whatsappMessage)) : ''

  return (
    <section id={id} className={s.section}>
      <div className={s.container}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className={s.eyebrow}>{ui('section.contact.eyebrow')}</span>
            <h2 className={cn(s.h2, 'mt-4')}>{ui('section.contact.title')}</h2>

            <ul className="mt-8 space-y-4">
              {c.phone && (
                <ContactRow icon="phone" href={`tel:${c.phoneRaw || c.phone}`} label={c.phone} />
              )}
              {c.email && <ContactRow icon="mail" href={`mailto:${c.email}`} label={c.email} />}
              {wa && <ContactRow icon="whatsapp" href={wa} label={ui('cta.whatsapp')} external />}
            </ul>

            <div className="mt-8 flex gap-2">
              {site.social?.instagram && (
                <a
                  href={safeUrl(site.social.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.btnIcon}
                  aria-label="Instagram"
                >
                  <Icon name="instagram" size={17} />
                </a>
              )}
              {site.social?.facebook && (
                <a
                  href={safeUrl(site.social.facebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.btnIcon}
                  aria-label="Facebook"
                >
                  <Icon name="facebook" size={17} />
                </a>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            {status === 'done' ? (
              <div className={cn(s.panel, 'flex flex-col items-center gap-3 p-10 text-center')}>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ok/15 text-ok">
                  <Icon name="check" size={24} />
                </span>
                <p className={s.h3}>{ui('form.success')}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className={cn(s.panel, 'relative p-6 sm:p-8')} noValidate>
                {/* Trappola per i bot */}
                <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Non compilare
                    <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={s.label}>{ui('form.name')}</span>
                    <input className={s.input} value={form.name} onChange={set('name')} autoComplete="name" />
                    {errors.name && <span className="mt-1 block text-[0.75rem] text-danger">{errors.name}</span>}
                  </label>
                  <label className="block">
                    <span className={s.label}>{ui('form.email')}</span>
                    <input
                      type="email"
                      className={s.input}
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                    />
                    {errors.email && <span className="mt-1 block text-[0.75rem] text-danger">{errors.email}</span>}
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className={s.label}>{ui('form.message')}</span>
                  <textarea
                    rows={5}
                    className={cn(s.input, 'resize-y')}
                    placeholder={ui('form.messagePlaceholder')}
                    value={form.message}
                    onChange={set('message')}
                  />
                  {errors.message && <span className="mt-1 block text-[0.75rem] text-danger">{errors.message}</span>}
                </label>

                <label className="mt-4 flex items-start gap-3 text-[0.82rem] text-ink-soft">
                  <input
                    type="checkbox"
                    checked={form.privacy}
                    onChange={set('privacy')}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--hex-brand)]"
                  />
                  <span>
                    {ui('form.privacy')}
                    {errors.privacy && <span className="ml-1 text-danger">*</span>}
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

                <button type="submit" className={cn(s.btnPrimary, 'mt-6')} disabled={status === 'sending'}>
                  {status === 'sending' ? ui('cta.sending') : ui('cta.send')}
                </button>

                {status === 'error' && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-danger">
                    <Icon name="warning" size={16} /> {ui('form.error')}
                  </p>
                )}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ icon, href, label, external }) {
  const s = useStyles()
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="group flex items-center gap-4 text-[0.95rem] text-ink-soft transition hover:text-ink"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-brand-ink">
          <Icon name={icon} size={18} />
        </span>
        {label}
      </a>
    </li>
  )
}
