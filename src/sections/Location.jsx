import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn, mapsLink } from '@/lib/utils'
import Icon from '@/components/Icon'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'

// Posizione + dintorni. La mappa è un iframe di Google Maps senza
// chiave API: si carica in lazy e solo qui, per non appesantire la
// home e non piazzare cookie di terze parti nel resto del sito.
export default function Location({ id = 'dove-siamo' }) {
  const { ui, t, lang } = useI18n()
  const s = useStyles()
  const { site, themeId } = useSite()
  const loc = site.location || {}
  const addr = site.contact?.address || {}
  const pois = loc.pois || []

  const query = encodeURIComponent(
    [addr.street, addr.zip, addr.city, addr.province, addr.country].filter(Boolean).join(', ')
  )
  const mapSrc = `https://www.google.com/maps?q=${query}&output=embed&hl=${lang}`

  return (
    <section id={id} className={s.section}>
      <div className={s.container}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <Reveal>
            <span className={s.eyebrow}>{ui('section.map.eyebrow')}</span>
            <h2 className={cn(s.h2, 'mt-4')}>{ui('section.map.title')}</h2>
            <p className={cn(s.lead, 'mt-5')}>{t(loc.intro)}</p>

            <address className="mt-7 not-italic text-[0.92rem] leading-relaxed text-ink-soft">
              {addr.street}
              <br />
              {addr.zip} {addr.city} {addr.province && `(${addr.province})`}
              <br />
              {addr.country}
            </address>

            <a
              href={mapsLink(addr, site.contact?.coords)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(s.btnSecondary, 'mt-6')}
            >
              <Icon name="map" size={16} /> {ui('cta.directions')}
            </a>

            {pois.length > 0 && (
              <RevealGroup className="mt-10 space-y-px border-t border-line" delay={0.1}>
                {pois.map((p, i) => (
                  <RevealItem key={i}>
                    <div className="flex items-center justify-between gap-4 border-b border-line py-3.5">
                      <span className="flex items-center gap-3 text-[0.9rem] text-ink-soft">
                        <Icon name={p.icon || 'map'} size={16} className="shrink-0 text-brand" />
                        {t(p.name)}
                      </span>
                      <span className="shrink-0 font-mono text-[0.8rem] text-ink-muted">{p.distance}</span>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <div className={cn(s.imageWrap, themeId === 'glass' && s.panel, 'overflow-hidden')}>
              <iframe
                title={ui('section.map.title')}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0 lg:h-full lg:min-h-[520px]"
                style={{ filter: themeId === 'noir' ? 'invert(0.92) hue-rotate(180deg) saturate(0.7)' : undefined }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
