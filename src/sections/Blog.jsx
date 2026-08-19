import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import SmartImage from '@/components/SmartImage'
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal'

// ─────────────────────────────────────────────────────────────
//  Articoli
//
//  Non è «un blog» nel senso di un diario da aggiornare ogni
//  settimana: quello nessun gestore lo mantiene, e un blog fermo da
//  due anni fa più danno che bene.
//
//  È la sezione dei consigli: dove mangiare, cosa vedere in tre
//  giorni, come arrivare dall'aeroporto. Sono i cinque o sei articoli
//  che un ospite cerca prima di prenotare e che portano visite da
//  Google per ricerche («cosa fare a Salerno») su cui la home page non
//  si posizionerebbe mai.
//
//  Ogni articolo ha una pagina sua. È il motivo per cui la sezione
//  esiste: per posizionarsi su «cosa fare a Salerno in tre giorni»
//  serve un indirizzo con quel titolo, e un riquadro che si apre sulla
//  home per un motore di ricerca non esiste.
//
//  `base` serve al portale delle demo, dove ogni struttura vive sotto
//  il proprio percorso: sul sito di un cliente resta vuoto.
// ─────────────────────────────────────────────────────────────

export default function Blog({ id = 'consigli' }) {
  const { ui, t } = useI18n()
  const s = useStyles()
  const { site } = useSite()
  const base = site.basePath || ''

  const articoli = (site.posts || []).filter((p) => p && p.active !== false && t(p.title))
  if (!articoli.length) return null

  return (
    <section id={id} className={s.section}>
      <div className={s.container}>
        <Reveal className="max-w-2xl">
          <span className={s.eyebrow}>{ui('section.blog.eyebrow')}</span>
          <h2 className={cn(s.h2, 'mt-3')}>{t(site.blog?.title) || ui('section.blog.title')}</h2>
          {t(site.blog?.intro) && <p className={cn(s.lead, 'mt-4')}>{t(site.blog.intro)}</p>}
        </Reveal>

        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3" delay={0.05}>
          {articoli.map((p) => (
            <RevealItem key={p.id}>
              <article className={cn(s.card, s.cardHover, 'flex h-full flex-col overflow-hidden')}>
                {p.cover && (
                  <SmartImage src={p.cover} alt={t(p.title)} ratio="16/10" className="w-full" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  {t(p.tag) && <span className={cn(s.badge, 'self-start')}>{t(p.tag)}</span>}
                  <h3 className={cn(s.h3, 'mt-3 text-[1.15rem]')}>{t(p.title)}</h3>
                  <p className={cn(s.body, 'mt-2 flex-1 text-[0.9rem]')}>{t(p.excerpt)}</p>
                  <a href={`${base}/blog/${p.id}`} className={cn(s.btnGhost, 'mt-4 self-start px-0')}>
                    {ui('cta.read')} <Icon name="arrowRight" size={15} />
                  </a>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
