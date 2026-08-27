import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import { useStyles } from '@/lib/site'
import { cn, nightsBetween } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  StayKit — Calendario a intervallo
//
//  Quello a cui sono abituati gli ospiti sui siti delle strutture:
//  un solo calendario, primo clic = arrivo, secondo = partenza, con
//  l'intervallo che si colora seguendo il mouse. Niente due campi
//  separati da aprire uno alla volta.
//
//  Scritto a mano invece di aggiungere una libreria: i calendari
//  pronti portano il loro foglio di stile e vanno poi combattuti per
//  farli somigliare al tema: qui prende i colori del sito perché usa
//  le stesse variabili di tutto il resto.
//
//  Nomi di mesi e giorni da Intl: seguono la lingua attiva senza
//  bisogno di tradurli a mano. La settimana comincia di lunedì.
// ─────────────────────────────────────────────────────────────

const GIORNO = 86400000

export default function DateRangePicker({ value, onChange, minNotti = 1, className }) {
  const { ui, lang } = useI18n()
  const s = useStyles()

  const [aperto, setAperto] = useState(false)
  const [fase, setFase] = useState('in') // quale estremo si sta scegliendo
  const [hover, setHover] = useState(null)
  const [mese, setMese] = useState(() => primoDelMese(value?.checkIn ? daIso(value.checkIn) : new Date()))
  const box = useRef(null)

  const oggi = useMemo(() => azzera(new Date()), [])
  const inizio = value?.checkIn ? daIso(value.checkIn) : null
  const fine = value?.checkOut ? daIso(value.checkOut) : null

  // ── Chiusura: clic fuori o Esc ──
  useEffect(() => {
    if (!aperto) return undefined
    const fuori = (e) => {
      if (box.current && !box.current.contains(e.target)) setAperto(false)
    }
    const tasto = (e) => e.key === 'Escape' && setAperto(false)
    document.addEventListener('mousedown', fuori)
    document.addEventListener('keydown', tasto)
    return () => {
      document.removeEventListener('mousedown', fuori)
      document.removeEventListener('keydown', tasto)
    }
  }, [aperto])

  function apri(quale) {
    setFase(quale)
    setAperto(true)
    const riferimento = quale === 'out' && inizio ? inizio : inizio || new Date()
    setMese(primoDelMese(riferimento))
  }

  function scegli(giorno) {
    // Primo clic, oppure intervallo già completo: si ricomincia
    if (fase === 'in' || !inizio || (inizio && fine)) {
      onChange({ checkIn: aIso(giorno), checkOut: '' })
      setFase('out')
      return
    }
    // Secondo clic prima dell'arrivo: diventa il nuovo arrivo
    if (giorno <= inizio) {
      onChange({ checkIn: aIso(giorno), checkOut: '' })
      setFase('out')
      return
    }
    // Soggiorno troppo breve: si tiene la scelta ma non si chiude
    if (nightsBetween(aIso(inizio), aIso(giorno)) < minNotti) return

    onChange({ checkIn: aIso(inizio), checkOut: aIso(giorno) })
    setFase('in')
    setTimeout(() => setAperto(false), 180)
  }

  const notti = nightsBetween(value?.checkIn, value?.checkOut)
  const finePreview = fine || (fase === 'out' && hover && hover > inizio ? hover : null)

  return (
    <div ref={box} className={cn('relative', className)}>
      {/* I due campi: non sono input, sono bottoni che aprono il calendario */}
      <div className="grid h-full grid-cols-2 gap-2">
        <Campo
          etichetta={ui('booking.checkin')}
          valore={inizio}
          lang={lang}
          attivo={aperto && fase === 'in'}
          onClick={() => apri('in')}
        />
        <Campo
          etichetta={ui('booking.checkout')}
          valore={fine}
          lang={lang}
          attivo={aperto && fase === 'out'}
          onClick={() => apri('out')}
        />
      </div>

      {aperto && (
        <div
          className={cn(
            s.panel,
            // `!bg-surface`: il pannello dei temi e' semitrasparente e
            // sotto il calendario ci finisce il testo della pagina.
            // Qui serve un fondo pieno per leggere i giorni. L'! non e'
            // pigrizia: `cn` concatena e basta, senza tailwind-merge, e
            // fra `bg-surface` e `bg-surface/60` vincerebbe l'ordine del
            // CSS generato, che non e' garantito.
            'absolute left-0 right-0 z-50 mt-2 p-4 !bg-surface sm:right-auto sm:min-w-[34rem]',
            'max-h-[70svh] overflow-y-auto'
          )}
          role="dialog"
          aria-label={ui('booking.title')}
        >
          {/* Intestazione: mese e frecce */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMese(spostaMese(mese, -1))}
              disabled={mese <= primoDelMese(oggi)}
              className={cn(s.btnIcon, 'h-9 w-9 disabled:opacity-30')}
              aria-label="Mese precedente"
            >
              <Icon name="chevronLeft" size={16} />
            </button>
            <p className="text-[0.85rem] font-semibold capitalize text-ink">
              {titoloMese(mese, lang)}
              <span className="hidden sm:inline"> — {titoloMese(spostaMese(mese, 1), lang)}</span>
            </p>
            <button
              type="button"
              onClick={() => setMese(spostaMese(mese, 1))}
              className={cn(s.btnIcon, 'h-9 w-9')}
              aria-label="Mese successivo"
            >
              <Icon name="chevronRight" size={16} />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Mese
              mese={mese}
              oggi={oggi}
              inizio={inizio}
              fine={finePreview}
              lang={lang}
              onHover={setHover}
              onPick={scegli}
            />
            <div className="hidden sm:block">
              <Mese
                mese={spostaMese(mese, 1)}
                oggi={oggi}
                inizio={inizio}
                fine={finePreview}
                lang={lang}
                onHover={setHover}
                onPick={scegli}
              />
            </div>
          </div>

          {/* Riepilogo e azioni */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
            <p className={cn(s.small, 'text-[0.78rem]')}>
              {notti > 0
                ? `${notti} ${ui('field.nights')}`
                : inizio
                  ? ui('booking.checkout')
                  : ui('booking.checkin')}
            </p>
            <div className="flex gap-2">
              {(inizio || fine) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange({ checkIn: '', checkOut: '' })
                    setFase('in')
                  }}
                  className={cn(s.btnGhost, 'text-[0.78rem]')}
                >
                  {ui('booking.clearDates')}
                </button>
              )}
              <button type="button" onClick={() => setAperto(false)} className={cn(s.btnSecondary, 'px-4 py-2 text-[0.78rem]')}>
                {ui('booking.done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Contenitore di un campo della barra: etichetta piccola sopra il valore,
 * dentro il riquadro. Esportato perché anche il numero di ospiti deve
 * avere lo stesso aspetto: campi accostati con impaginazioni diverse
 * fanno sembrare la barra montata a pezzi.
 */
export function CampoBase({ etichetta, attivo, children, className, ...rest }) {
  const s = useStyles()
  return (
    <div
      className={cn(
        s.input,
        'flex h-full flex-col items-start justify-center gap-0.5 text-left',
        attivo && 'border-brand ring-2 ring-brand/20',
        className
      )}
      {...rest}
    >
      <span className="text-[0.62rem] font-semibold uppercase tracking-wider2 text-ink-muted">{etichetta}</span>
      {children}
    </div>
  )
}

/** Campo cliccabile che mostra la data scelta. */
function Campo({ etichetta, valore, lang, attivo, onClick }) {
  const s = useStyles()
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        s.input,
        'flex h-full flex-col items-start justify-center gap-0.5 text-left',
        attivo && 'border-brand ring-2 ring-brand/20'
      )}
    >
      <span className="text-[0.62rem] font-semibold uppercase tracking-wider2 text-ink-muted">{etichetta}</span>
      <span className={cn('text-[0.9rem] leading-tight', valore ? 'text-ink' : 'text-ink-muted')}>
        {valore ? formatoBreve(valore, lang) : '—'}
      </span>
    </button>
  )
}

/** Griglia di un singolo mese. */
function Mese({ mese, oggi, inizio, fine, lang, onHover, onPick }) {
  const giorni = useMemo(() => celleDelMese(mese), [mese])

  return (
    <div>
      <p className="mb-2 text-center text-[0.75rem] font-semibold capitalize text-ink-soft sm:hidden">
        {titoloMese(mese, lang)}
      </p>
      <div className="mb-1 grid grid-cols-7 gap-0.5">
        {nomiGiorni(lang).map((g, i) => (
          <span key={i} className="py-1 text-center text-[0.62rem] font-semibold uppercase text-ink-muted">
            {g}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5" onMouseLeave={() => onHover(null)}>
        {giorni.map((giorno, i) => {
          if (!giorno) return <span key={i} />

          const passato = giorno < oggi
          const isInizio = inizio && stessoGiorno(giorno, inizio)
          const isFine = fine && stessoGiorno(giorno, fine)
          const dentro = inizio && fine && giorno > inizio && giorno < fine

          return (
            <button
              key={i}
              type="button"
              disabled={passato}
              onMouseEnter={() => onHover(giorno)}
              onClick={() => onPick(giorno)}
              className={cn(
                'relative h-9 text-[0.82rem] transition-colors',
                'disabled:cursor-not-allowed disabled:text-ink-muted disabled:opacity-35',
                // Gli estremi sono pieni, il mezzo è una fascia tenue:
                // così si legge dove comincia e dove finisce il soggiorno.
                isInizio || isFine
                  ? 'rounded-theme bg-brand font-semibold text-brand-ink'
                  : dentro
                    ? 'bg-brand/12 text-ink'
                    : 'rounded-theme text-ink-soft hover:bg-ink/[0.07]',
                stessoGiorno(giorno, oggi) && !isInizio && !isFine && 'font-semibold text-brand'
              )}
            >
              {giorno.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Utilità sulle date ────────────────────────────────────────
//  Tutto in orario locale e formattato a mano: `toISOString()`
//  converte in UTC e in Italia farebbe scivolare la data indietro
//  di un giorno per tutta la sera.

function azzera(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function primoDelMese(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function spostaMese(d, n) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}
function aIso(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const g = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${g}`
}
function daIso(s) {
  const [y, m, g] = String(s).split('-').map(Number)
  return new Date(y, (m || 1) - 1, g || 1)
}
function stessoGiorno(a, b) {
  return a && b && a.getTime() === b.getTime()
}

/** Celle del mese, con i vuoti iniziali per far cominciare da lunedì. */
function celleDelMese(mese) {
  const primo = primoDelMese(mese)
  const vuoti = (primo.getDay() + 6) % 7 // domenica = 0 → sposta a fine settimana
  const ultimo = new Date(mese.getFullYear(), mese.getMonth() + 1, 0).getDate()
  const celle = Array(vuoti).fill(null)
  for (let g = 1; g <= ultimo; g++) celle.push(new Date(mese.getFullYear(), mese.getMonth(), g))
  return celle
}

function titoloMese(d, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(d)
  } catch {
    return `${d.getMonth() + 1}/${d.getFullYear()}`
  }
}

function formatoBreve(d, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(d)
  } catch {
    return aIso(d)
  }
}

/** Iniziali dei giorni, dalla lingua attiva, con lunedì per primo. */
function nomiGiorni(lang) {
  try {
    const fmt = new Intl.DateTimeFormat(lang, { weekday: 'short' })
    // 5 gennaio 2026 è un lunedì
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2026, 0, 5 + i)).slice(0, 2))
  } catch {
    return ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do']
  }
}
