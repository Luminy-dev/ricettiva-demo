import { useMemo } from 'react'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Footer from '@/components/Footer'

// ─────────────────────────────────────────────────────────────
//  Un articolo, al suo indirizzo
//
//  Perché una pagina e non un riquadro: il senso dei consigli è
//  portare visite da Google su ricerche come «cosa fare a Salerno in
//  tre giorni». Per posizionarsi su quella ricerca serve un indirizzo
//  proprio, con un titolo proprio — un riquadro che si apre sulla home
//  non esiste per un motore di ricerca.
//
//  In fondo c'è sempre un rimando alla struttura: chi arriva qui da
//  Google sta cercando informazioni, non una camera, e va accompagnato.
//
//  Sul portale `base` vale /nomecliente, così i collegamenti restano
//  dentro la demo di quella struttura e non portano altrove.
// ─────────────────────────────────────────────────────────────

export default function Articolo({ id, base = '' }) {
  const { t, tList, ui, lang } = useI18n()
  const s = useStyles()
  const { site } = useSite()

  const articolo = useMemo(
    () => (site.posts || []).find((p) => p?.id === id && p.active !== false),
    [site.posts, id]
  )

  const altri = useMemo(
    () => (site.posts || []).filter((p) => p?.id !== id && p?.active !== false).slice(0, 3),
    [site.posts, id]
  )

  if (!articolo) return <NonTrovato base={base} s={s} site={site} />

  const paragrafi = tList(articolo.body)

  return (
    <div className={s.page}>
      <header className="border-b border-line bg-surface/80 backdrop-blur-theme">
        <div className={cn(s.container, 'flex items-center justify-between gap-4 py-4')}>
          <a href={base || '/'} className="font-display text-lg font-bold tracking-tight text-ink">
            {site.brand?.logoText || site.brand?.name}
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a href={`${base}/blog`} className={cn(s.btnSecondary, 'px-4 py-2 text-[0.82rem]')}>
              <Icon name="arrowLeft" size={15} />
              <span className="hidden sm:inline">{ui('section.blog.eyebrow')}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-16">
        <article className={cn(s.container, 'max-w-[46rem]')}>
          {t(articolo.tag) && <span className={s.badge}>{t(articolo.tag)}</span>}
          <h1 className={cn(s.h1, 'mt-4 text-[clamp(1.8rem,4.5vw,2.5rem)]')}>{t(articolo.title)}</h1>
          {t(articolo.excerpt) && <p className={cn(s.lead, 'mt-5')}>{t(articolo.excerpt)}</p>}

          {articolo.cover && (
            <SmartImage
              src={articolo.cover}
              alt=""
              ratio="16/9"
              priority
              className={cn(s.imageWrap, 'mt-8 w-full')}
            />
          )}

          <div className="mt-8 space-y-5">
            {paragrafi.map((p, i) => (
              <p key={i} className={cn(s.body, 'text-[1.02rem] leading-[1.8]')}>
                {p}
              </p>
            ))}
          </div>

          {/* Chi arriva da una ricerca sta cercando informazioni, non
              una camera. Il rimando alla struttura va offerto, non
              piazzato in mezzo al testo. */}
          <aside className={cn(s.panel, 'mt-12 flex flex-wrap items-center justify-between gap-4 p-6')}>
            <div>
              <p className="font-display text-lg font-bold text-ink">{site.brand?.name}</p>
              <p className={cn(s.small, 'mt-1')}>{t(site.brand?.tagline)}</p>
            </div>
            <a href={base || '/'} className={s.btnPrimary}>
              {ui('cta.check')}
              <Icon name="arrowRight" size={16} />
            </a>
          </aside>

          {altri.length > 0 && (
            <section className="mt-14">
              <p className={s.eyebrow}>{ui('section.blog.eyebrow')}</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {altri.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`${base}/blog/${p.id}`}
                      className="flex items-center justify-between gap-4 py-4 transition hover:text-brand"
                    >
                      <span className={cn(s.h3, 'text-[1.05rem]')}>{t(p.title)}</span>
                      <Icon name="arrowRight" size={16} className="shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}

function NonTrovato({ base, s, site }) {
  return (
    <div className={cn(s.page, 'flex min-h-screen items-center justify-center px-6 text-center')}>
      <div>
        <p className="font-display text-2xl font-bold text-ink">Articolo non trovato</p>
        <p className={cn(s.small, 'mx-auto mt-3 max-w-sm')}>
          Forse è stato rimosso, o l’indirizzo è scritto diversamente.
        </p>
        <a href={base || '/'} className={cn(s.btnPrimary, 'mt-6')}>
          {site.brand?.name}
        </a>
      </div>
    </div>
  )
}
