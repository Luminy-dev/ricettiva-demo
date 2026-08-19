import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Footer from '@/components/Footer'

// ─────────────────────────────────────────────────────────────
//  L'elenco dei consigli, alla sua pagina
//
//  In home c'è già la sezione con le tre schede più recenti: questa
//  pagina serve quando gli articoli diventano dieci, e come punto di
//  arrivo del collegamento «torna ai consigli» dentro un articolo.
//
//  Senza di lei, `/blog` non esisteva e chi ci finiva — togliendo l'id
//  dall'indirizzo, che è una cosa che si fa — vedeva la home. Un vicolo
//  cieco silenzioso: nessun errore, solo la pagina sbagliata.
// ─────────────────────────────────────────────────────────────

export default function Consigli({ base = '' }) {
  const { t, ui } = useI18n()
  const s = useStyles()
  const { site } = useSite()

  const articoli = (site.posts || []).filter((p) => p && p.active !== false && t(p.title))

  return (
    <div className={s.page}>
      <header className="border-b border-line bg-surface/80 backdrop-blur-theme">
        <div className={cn(s.container, 'flex items-center justify-between gap-4 py-4')}>
          <a href={base || '/'} className="font-display text-lg font-bold tracking-tight text-ink">
            {site.brand?.logoText || site.brand?.name}
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a href={base || '/'} className={cn(s.btnSecondary, 'px-4 py-2 text-[0.82rem]')}>
              <Icon name="arrowLeft" size={15} />
              <span className="hidden sm:inline">{ui('privacy.back') || 'Torna al sito'}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-16">
        <div className={s.container}>
          <div className="max-w-2xl">
            <span className={s.eyebrow}>{ui('section.blog.eyebrow')}</span>
            <h1 className={cn(s.h1, 'mt-3 text-[clamp(1.9rem,4.5vw,2.6rem)]')}>
              {t(site.blog?.title) || ui('section.blog.title')}
            </h1>
            {t(site.blog?.intro) && <p className={cn(s.lead, 'mt-4')}>{t(site.blog.intro)}</p>}
          </div>

          {articoli.length === 0 ? (
            <p className={cn(s.small, 'mt-10')}>Non c’è ancora nessun articolo.</p>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articoli.map((p) => (
                <article key={p.id} className={cn(s.card, s.cardHover, 'flex h-full flex-col overflow-hidden')}>
                  {p.cover && <SmartImage src={p.cover} alt={t(p.title)} ratio="16/10" className="w-full" />}
                  <div className="flex flex-1 flex-col p-5">
                    {t(p.tag) && <span className={cn(s.badge, 'self-start')}>{t(p.tag)}</span>}
                    <h2 className={cn(s.h3, 'mt-3 text-[1.15rem]')}>{t(p.title)}</h2>
                    <p className={cn(s.body, 'mt-2 flex-1 text-[0.9rem]')}>{t(p.excerpt)}</p>
                    <a href={`${base}/blog/${p.id}`} className={cn(s.btnGhost, 'mt-4 self-start px-0')}>
                      {ui('cta.read')} <Icon name="arrowRight" size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
