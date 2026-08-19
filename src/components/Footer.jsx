import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { linkPrivacy } from '@/lib/privacy-link'
import { useSectionLinks, scrollToSection } from '@/lib/nav'
import { cn, safeUrl, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'

export default function Footer() {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site } = useSite()
  // Elenco completo, non filtrato: se una sezione è nascosta dalla barra
  // in alto, qui resta comunque raggiungibile.
  const links = useSectionLinks()
  const year = new Date().getFullYear()
  const addr = site.contact?.address || {}
  const legal = site.legal || {}

  return (
    <footer className={cn('border-t border-line bg-bg-alt pt-16')}>
      <div className={s.container}>
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marchio */}
          <div className="lg:col-span-2">
            {site.brand?.logo ? (
              <img src={safeMediaUrl(site.brand.logo)} alt={site.brand.name} className="h-10 w-auto object-contain" />
            ) : (
              <span className="font-display text-xl font-bold text-ink">{site.brand?.name}</span>
            )}
            <p className={cn(s.body, 'mt-4 max-w-sm text-[0.9rem]')}>{t(site.brand?.tagline)}</p>

            <div className="mt-6 flex gap-2">
              {site.social?.instagram && (
                <a href={safeUrl(site.social.instagram)} target="_blank" rel="noopener noreferrer" className={s.btnIcon} aria-label="Instagram">
                  <Icon name="instagram" size={16} />
                </a>
              )}
              {site.social?.facebook && (
                <a href={safeUrl(site.social.facebook)} target="_blank" rel="noopener noreferrer" className={s.btnIcon} aria-label="Facebook">
                  <Icon name="facebook" size={16} />
                </a>
              )}
              {site.social?.tripadvisor && (
                <a href={safeUrl(site.social.tripadvisor)} target="_blank" rel="noopener noreferrer" className={s.btnIcon} aria-label="Tripadvisor">
                  <Icon name="star" size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Navigazione */}
          <nav>
            <p className={cn(s.label, 'mb-4')}>{ui('nav.menu')}</p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.key}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(l.id)
                    }}
                    className="text-[0.88rem] text-ink-soft transition hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contatti */}
          <div>
            <p className={cn(s.label, 'mb-4')}>{ui('section.contact.eyebrow')}</p>
            <address className="space-y-2.5 not-italic text-[0.88rem] text-ink-soft">
              <p>
                {addr.street}
                <br />
                {addr.zip} {addr.city} {addr.province && `(${addr.province})`}
              </p>
              {site.contact?.phone && (
                <p>
                  <a href={`tel:${site.contact.phoneRaw || site.contact.phone}`} className="transition hover:text-ink">
                    {site.contact.phone}
                  </a>
                </p>
              )}
              {site.contact?.email && (
                <p>
                  <a href={`mailto:${site.contact.email}`} className="transition hover:text-ink">
                    {site.contact.email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-[0.78rem] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {legal.company || site.brand?.name} · {ui('footer.rights')}
            {legal.vat && <> · {ui('footer.vat')} {legal.vat}</>}
            {legal.cin && <> · {ui('footer.cin')} {legal.cin}</>}
          </p>
          <p className="flex flex-wrap items-center gap-4">
            {/* L'informativa esiste sempre: la genera il sito. Se il
                cliente ne ha una sua, linkPrivacy porta alla sua. */}
            <a href={safeUrl(linkPrivacy(site))} className="transition hover:text-ink">
              {ui('footer.privacy')}
            </a>
            {legal.credits?.label && (
              <span>
                {ui('footer.credits')}{' '}
                {legal.credits.url ? (
                  <a href={safeUrl(legal.credits.url)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition hover:text-ink">
                    {legal.credits.label}
                  </a>
                ) : (
                  legal.credits.label
                )}
              </span>
            )}
          </p>
        </div>
      </div>
    </footer>
  )
}
