import { useEffect, useState } from 'react'
import { useSite } from '@/lib/site'
import { useI18n } from '@/i18n'
import { THEMES, THEME_IDS } from '@/themes'
import { PRESETS, PRESET_IDS } from '@/config/presets'
import { LANGUAGES } from '@/i18n/dictionary'
import { cn } from '@/lib/utils'
import Icon from '@/components/Icon'
import { SchermataPannello } from './Disegni'

// ─────────────────────────────────────────────────────────────
//  La barra di regia
//
//  Sta sopra al sito, non dentro: chi guarda deve vedere il prodotto.
//  Ha tre lavori, in ordine di importanza per chi la usa:
//
//   1. far provare stili e tipologie mentre si parla
//   2. spiegare che esiste un pannello, e cosa ci si fa — senza
//      mandare il cliente su un'altra pagina e perdere il filo
//   3. dire che è un'anteprima, in modo che nessuno creda di aver
//      mandato una richiesta compilando il modulo
//
//  Cosa NON fa: riportare all'elenco delle demo. Il cliente non deve
//  poter arrivare alle strutture degli altri. Il ritorno all'indice
//  compare solo quando stai lavorando tu (vedi `siRegia`).
// ─────────────────────────────────────────────────────────────

/**
 * Sei tu che stai preparando, o è il cliente che sta guardando?
 *
 * In locale sei sempre tu. Online serve `?regia` nell'indirizzo: al
 * cliente mandi il link pulito, e sul suo schermo i comandi di
 * servizio non esistono proprio.
 */
function siRegia() {
  try {
    if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return true
    return new URLSearchParams(window.location.search).has('regia')
  } catch {
    return false
  }
}

export default function BarraRegia({ slug, preset, onPreset }) {
  const { themeId, setTheme } = useSite()
  const { lang, setLang, available } = useI18n()
  // Chiusa di default: aperta occupa mezzo schermo da telefono e il
  // cliente vede i nostri comandi prima del suo sito. Si apre col
  // pulsante «Comandi» in basso a sinistra.
  const [aperta, setAperta] = useState(false)
  const [pannello, setPannello] = useState(false)
  const [regia] = useState(siRegia)

  // persist: false — quello che si prova qui non deve restare scritto
  // nel browser di chi guarda.
  const provaStile = (id) => setTheme(id, { persist: false })

  useEffect(() => {
    const tasto = (e) => {
      if (e.target.matches('input, textarea, select')) return
      if (e.key === 'Escape') return setPannello(false)
      const i = ['1', '2', '3'].indexOf(e.key)
      if (i >= 0 && THEME_IDS[i]) provaStile(THEME_IDS[i])
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  })

  useEffect(() => {
    document.body.style.overflow = pannello ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [pannello])

  if (!aperta) {
    return (
      <button
        type="button"
        onClick={() => setAperta(true)}
        className="fixed bottom-4 left-4 z-[90] flex h-11 items-center gap-2 rounded-full bg-slate-900 pl-3.5 pr-4 text-[0.8rem] font-medium text-white shadow-xl transition hover:bg-slate-800"
      >
        <Icon name="palette" size={16} />
        Comandi
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-5xl lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2">
        <div className="overflow-hidden rounded-2xl bg-slate-900/95 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur">
          {/* Riga dei comandi */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
            <Gruppo etichetta="Stile">
              {THEME_IDS.map((id, i) => (
                <Scelta
                  key={id}
                  attiva={id === themeId}
                  onClick={() => provaStile(id)}
                  title={`Tasto ${i + 1}`}
                >
                  <span className="flex gap-0.5">
                    {THEMES[id].preview.slice(0, 3).map((c) => (
                      <span key={c} className="h-3.5 w-1.5 rounded-[2px]" style={{ background: c }} />
                    ))}
                  </span>
                  {THEMES[id].name}
                </Scelta>
              ))}
            </Gruppo>

            <Gruppo etichetta="Tipologia">
              {PRESET_IDS.map((id) => (
                <Scelta key={id} attiva={id === preset} onClick={() => onPreset(id)}>
                  {PRESETS[id].label}
                </Scelta>
              ))}
            </Gruppo>

            {available.length > 1 && (
              <Gruppo etichetta="Lingua">
                {available.map((code) => (
                  <Scelta key={code} attiva={code === lang} onClick={() => setLang(code)}>
                    {LANGUAGES[code]?.short || code.toUpperCase()}
                  </Scelta>
                ))}
              </Gruppo>
            )}

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPannello(true)}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-3.5 py-2 text-[0.8rem] font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <Icon name="settings" size={15} />
                Come si aggiorna
              </button>
              <button
                type="button"
                onClick={() => setAperta(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-white/10 text-white transition hover:border-white/40 hover:bg-white/20"
                aria-label="Nascondi i comandi"
                title="Nascondi i comandi"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>

          {/* Riga di servizio: cosa è appena cambiato, e i due avvisi
              che evitano fraintendimenti durante la dimostrazione. */}
          <div className="border-t border-white/10 bg-black/20 px-4 py-2">
            <p className="text-[0.72rem] leading-relaxed text-slate-300">
              <span className="font-semibold text-white">{PRESETS[preset]?.label}:</span>{' '}
              <span className="text-slate-400">{differenze(preset)}</span>
            </p>
            {/* Niente avvisi qui sotto: al cliente non servono e da
                telefono rubavano una riga alla barra. Resta il rientro
                all'elenco, che vedi solo tu (localhost o ?regia). */}
            {regia && (
              <p className="mt-0.5 text-[0.68rem] text-slate-500">
                <a href="/" className="underline underline-offset-2 transition hover:text-slate-300">
                  elenco demo
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {pannello && <SpiegazionePannello onClose={() => setPannello(false)} />}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
//  «Come si aggiorna»
//
//  Sta dentro un riquadro sovrapposto, non in una pagina a parte: la
//  domanda «e poi chi lo aggiorna?» arriva mentre il cliente guarda il
//  sito, e mandarlo altrove per rispondere gli fa perdere il filo.
//
//  Grafica dichiaratamente diversa dal sito — scura, squadrata —
//  perché nessuno pensi che quei riquadri li vedranno i suoi ospiti.
// ─────────────────────────────────────────────────────────────

const PASSI = [
  {
    id: 'panoramica',
    titolo: 'Ti dice cosa manca',
    testo:
      'Appena entri trovi una percentuale di completamento e l’elenco delle cose da sistemare, in ordine di importanza. Non devi sapere da dove cominciare: te lo dice lui.',
  },
  {
    id: 'testi',
    titolo: 'I testi, campo per campo',
    testo:
      'Ogni campo ha il suo nome e un esempio in grigio. Se il sito è in più lingue, le bandierine sopra il campo segnano quelle ancora da tradurre.',
  },
  {
    id: 'foto',
    titolo: 'Le foto si trascinano dentro',
    testo:
      'Si caricano trascinandole nella pagina e vengono ridimensionate da sole: il sito resta veloce anche con le foto fatte col telefono.',
  },
  {
    id: 'prenotazioni',
    titolo: 'Come si prenota',
    testo:
      'Widget del gestionale, link al portale con le date già impostate, oppure richiesta via email. Si cambia idea quando si vuole, senza rifare il sito.',
  },
  {
    id: 'richieste',
    titolo: 'Le richieste che arrivano',
    testo:
      'Con date, ospiti e recapito. Ognuna ha uno stato — nuova, contattato, prenotato — così non ricontatti due volte le stesse persone.',
  },
]

function SpiegazionePannello({ onClose }) {
  const [passo, setPasso] = useState(0)
  const p = PASSI[passo]

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-slate-400">
              Incluso nel sito
            </p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Il sito lo aggiorni tu, senza chiamare nessuno
            </h2>
            <p className="mt-2 max-w-xl text-[0.88rem] leading-relaxed text-slate-500">
              Testi, foto, camere, prezzi e periodi si cambiano da soli, dal browser. Non serve sapere
              niente di programmazione, e i tuoi ospiti non vedono nulla di tutto questo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Chiudi"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="flex flex-wrap gap-1.5">
            {PASSI.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setPasso(i)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[0.78rem] font-medium transition',
                  i === passo ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {x.titolo}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <SchermataPannello tipo={p.id} />
          </div>

          <p className="mt-4 text-[0.92rem] leading-relaxed text-slate-600">{p.testo}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
            <a
              href="/come-funziona"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-[0.85rem] font-semibold text-white transition hover:bg-slate-800"
            >
              Vedilo tutto
            </a>
            <p className="text-[0.78rem] leading-relaxed text-slate-400">
              Gli schemi mostrano com’è organizzato il pannello. Il primo giro richiede mezz’ora; dopo,
              cambiare un prezzo è questione di un minuto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Le differenze visibili fra una tipologia e l'altra, in una riga. */
function differenze(preset) {
  switch (preset) {
    case 'bnb':
      return 'si parla di camere, c’è la sezione colazione, le schede mostrano letti e vista.'
    case 'affittacamere':
      return 'sempre camere ma niente colazione: al suo posto la sezione arrivo e check-in autonomo.'
    case 'case_vacanza':
      return 'diventano appartamenti: compaiono camere da letto, cucina e notti minime, sparisce la colazione.'
    case 'agriturismo':
      return 'si parla di unità, torna la colazione e le schede tengono cucina e camere da letto.'
    default:
      return ''
  }
}

function Gruppo({ etichetta, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/35 sm:inline">
        {etichetta}
      </span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  )
}

function Scelta({ attiva, children, ...rest }) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.78rem] font-medium transition',
        attiva ? 'bg-white text-slate-900 shadow-sm' : 'text-white/65 hover:bg-white/10 hover:text-white'
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
