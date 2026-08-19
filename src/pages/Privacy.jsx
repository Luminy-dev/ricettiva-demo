import { useMemo } from 'react'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { costruisciInformativa } from '@/lib/privacy'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Footer from '@/components/Footer'

// ─────────────────────────────────────────────────────────────
//  StayKit — Pagina dell'informativa privacy
//
//  Impaginata col tema del sito ma senza la navigazione: da qui si
//  torna indietro, non si va altrove. Le voci del menu puntano ad
//  ancore che su questa pagina non esistono, e un menu che non porta
//  da nessuna parte è peggio di nessun menu.
//
//  Sul portale «torna al sito» deve riportare alla demo di QUESTA
//  struttura, non alla radice del dominio: da lì si finirebbe
//  nell'elenco di tutti i clienti. Per questo l'indirizzo di ritorno
//  arriva da fuori invece di essere scritto qui.
//
//  Testo lungo, quindi: colonna stretta (circa 70 caratteri per riga),
//  interlinea larga, titoli distanziati. Un'informativa che nessuno
//  riesce a leggere è formalmente a posto e sostanzialmente inutile.
// ─────────────────────────────────────────────────────────────

export default function Privacy({ base = '/' }) {
  const { lang, ui } = useI18n()
  const s = useStyles()
  const { site, features, booking } = useSite()

  const doc = useMemo(
    () => costruisciInformativa({ site, features, booking, lang }),
    [site, features, booking, lang]
  )

  return (
    <div className={s.page}>
      {/* Barra minima: marchio, lingua, ritorno */}
      <header className="border-b border-line bg-surface/80 backdrop-blur-theme">
        <div className={cn(s.container, 'flex items-center justify-between gap-4 py-4')}>
          <a href={base} className="font-display text-lg font-bold tracking-tight text-ink">
            {site.brand?.logoText || site.brand?.name}
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a href={base} className={cn(s.btnSecondary, 'px-4 py-2 text-[0.82rem]')}>
              <Icon name="arrowLeft" size={15} />
              <span className="hidden sm:inline">{doc.etichettaRitorno}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="py-14 sm:py-20">
        <div className={cn(s.container, 'max-w-[46rem]')}>
          <h1 className={cn(s.h1, 'text-[clamp(1.9rem,4vw,2.6rem)]')}>{doc.titolo}</h1>

          {doc.aggiornata && (
            <p className="mt-3 text-[0.8rem] uppercase tracking-wider2 text-ink-muted">
              {doc.etichettaAggiornamento}: {formattaData(doc.aggiornata, lang)}
            </p>
          )}

          <p className={cn(s.lead, 'mt-6')}>{doc.intro}</p>

          {/* Indice: il documento è lungo, e quasi sempre si cerca una
              cosa sola — di solito «come faccio a farmi cancellare». */}
          <nav className={cn(s.panel, 'mt-10 p-5')}>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {doc.sezioni.map((sez, i) => (
                <li key={sez.id}>
                  <a
                    href={`#${sez.id}`}
                    className="flex gap-2 text-[0.88rem] text-ink-soft transition hover:text-brand"
                  >
                    <span className="text-ink-muted">{i + 1}.</span>
                    {sez.titolo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 space-y-11">
            {doc.sezioni.map((sez, i) => (
              <section key={sez.id} id={sez.id} className="scroll-mt-24">
                <h2 className={cn(s.h3, 'flex items-baseline gap-2.5')}>
                  <span className="text-[0.8em] font-normal text-ink-muted">{i + 1}.</span>
                  {sez.titolo}
                </h2>

                {sez.paragrafi.map((testo, k) => (
                  <p key={k} className="mt-4 text-[0.95rem] leading-[1.75] text-ink-soft">
                    {testo}
                  </p>
                ))}

                {sez.elenco.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {sez.elenco.map((voce, k) => (
                      <li key={k} className="flex gap-3 text-[0.92rem] leading-[1.7] text-ink-soft">
                        <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-brand" />
                        {voce}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Manca il titolare: chi gestisce il sito deve accorgersene,
              il visitatore no. Perciò il riquadro compare solo in locale. */}
          {!doc.completa && import.meta.env.DEV && (
            <p className="mt-12 flex items-start gap-2.5 rounded-theme border border-warn/40 bg-warn/10 p-4 text-[0.85rem] text-ink-soft">
              <Icon name="warning" size={16} className="mt-0.5 shrink-0 text-warn" />
              Mancano i dati del titolare del trattamento: compilali nel pannello, scheda «Privacy».
              Questo avviso non compare sul sito pubblicato.
            </p>
          )}

          <p className="mt-14 border-t border-line pt-6 text-[0.82rem] text-ink-muted">
            {ui('footer.privacy')} · {site.brand?.name}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

/** '2026-08-13' → '13 agosto 2026', nella lingua che si sta leggendo. */
function formattaData(iso, lang) {
  const [y, m, g] = String(iso).split('-').map(Number)
  if (!y || !m || !g) return iso
  try {
    return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(y, m - 1, g)
    )
  } catch {
    return iso
  }
}
