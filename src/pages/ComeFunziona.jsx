import { useState } from 'react'
import { SchermataPannello } from '@/portale/Disegni'

// ─────────────────────────────────────────────────────────────
//  Come funziona il pannello
//
//  Sta FUORI dai siti demo, e non è un dettaglio: se questa
//  spiegazione comparisse dentro /nomecliente, il cliente penserebbe
//  che quei riquadri li vedranno anche i suoi ospiti. Perciò ha una
//  grafica sua, dichiaratamente diversa dal prodotto, e si apre in
//  una scheda nuova dalla barra di regia.
//
//  Il tono è quello di chi spiega a voce a una persona che gestisce un
//  B&B, non a uno sviluppatore: niente «CMS», niente «istanza»,
//  niente «configurare». Le schermate stanno in public/pannello/ e si
//  aggiungono senza toccare questo file (vedi SCHERMATE).
// ─────────────────────────────────────────────────────────────

/**
 * Le sezioni della guida.
 *
 * `img` è il nome del file in public/pannello/, senza estensione.
 * Se il file non c'è, al suo posto compare un segnaposto grigio: la
 * pagina resta leggibile anche prima che tu abbia fatto le catture.
 */
const SCHERMATE = [
  {
    id: 'accesso',
    titolo: 'Si entra con email e password',
    img: 'accesso',
    testo: [
      'Il pannello vive allo stesso indirizzo del sito, con /admin alla fine. Nessun programma da installare: si apre dal browser, anche dal telefono.',
      'Ogni struttura vede solo la propria: non c’è modo di finire per sbaglio nei dati di qualcun altro.',
    ],
  },
  {
    id: 'panoramica',
    titolo: 'La panoramica dice cosa manca',
    img: 'panoramica',
    testo: [
      'Appena entri trovi una percentuale di completamento e l’elenco delle cose ancora da fare, in ordine di importanza.',
      'È pensata per la prima settimana: invece di girare fra dieci schede chiedendosi da dove cominciare, si parte da lì e si scende.',
    ],
  },
  {
    id: 'testi',
    titolo: 'I testi, sezione per sezione',
    img: 'testi',
    testo: [
      'Ogni campo ha il suo nome e un esempio in grigio, così si capisce cosa ci va senza dover indovinare.',
      'Chi ha il sito in più lingue trova le bandierine sopra ogni campo: quelle non ancora tradotte sono segnate, e finché sono vuote sul sito compare la lingua principale.',
    ],
  },
  {
    id: 'unita',
    titolo: 'Camere e appartamenti',
    img: 'unita',
    testo: [
      'Una scheda per ogni camera: nome, descrizione, foto, dotazioni, prezzo indicativo.',
      'I campi cambiano con la tipologia di struttura. In un appartamento c’è la cucina e le notti minime, in un B&B no: non compaiono nemmeno, invece di restare lì vuoti a far pensare che manchi qualcosa.',
    ],
  },
  {
    id: 'foto',
    titolo: 'Le foto si trascinano dentro',
    img: 'foto',
    testo: [
      'Si caricano trascinandole nella pagina. Vengono ridimensionate da sole, così il sito resta veloce anche con le foto fatte col telefono.',
      'Si riordinano con le frecce e si cancellano con il cestino. Lo spazio occupato è sempre visibile.',
    ],
  },
  {
    id: 'prenotazioni',
    titolo: 'Come si prenota',
    img: 'prenotazioni',
    testo: [
      'Qui si decide cosa succede quando un ospite sceglie le date: si apre il motore del gestionale, si va sul portale con le date già impostate, oppure la richiesta arriva per email.',
      'Si cambia idea quando si vuole, senza rifare il sito.',
    ],
  },
  {
    id: 'richieste',
    titolo: 'Le richieste ricevute',
    img: 'richieste',
    testo: [
      'Ogni richiesta arrivata dal sito, con date, numero di ospiti e recapito. Si clicca l’email per rispondere.',
      'Ognuna ha uno stato — nuova, contattato, prenotato, chiusa — così non si ricontattano due volte le stesse persone.',
    ],
  },
]

export default function ComeFunziona() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          {/* Nessun ritorno all'elenco: questa pagina la apre il cliente
              dalla sua demo, e da lì non deve poter arrivare a quelle
              degli altri. */}
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Il pannello di gestione
          </p>
          <h1 className="mt-4 font-display text-[clamp(1.9rem,5vw,2.7rem)] font-bold leading-tight tracking-tight text-slate-900">
            Il sito lo aggiorni tu,
            <br />
            senza chiamare nessuno
          </h1>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-slate-600">
            Insieme al sito c’è un pannello di gestione. Serve a cambiare testi, foto, camere, prezzi e
            periodi senza sapere niente di programmazione, e senza dover passare da noi ogni volta.
          </p>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-500">
            Quello che segue è il pannello, schermata per schermata. Non è visibile ai tuoi ospiti: loro
            vedono soltanto il sito.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <div className="space-y-16 sm:space-y-24">
          {SCHERMATE.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-8">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-slate-400">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900">
                {s.titolo}
              </h2>
              {s.testo.map((t, k) => (
                <p key={k} className="mt-3 text-[0.98rem] leading-[1.7] text-slate-600">
                  {t}
                </p>
              ))}
              <Schermata file={s.img} alt={s.titolo} />
            </section>
          ))}
        </div>

        <section className="mt-20 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-slate-900">Le domande che ci fanno sempre</h2>
          <dl className="mt-5 space-y-5">
            {[
              [
                'Posso rompere qualcosa?',
                'No. Dal pannello si cambiano contenuti, non il sito. La cosa peggiore che può succedere è un testo scritto male, e si riscrive.',
              ],
              [
                'Devo installare qualcosa?',
                'Niente. Si apre dal browser, dal computer o dal telefono.',
              ],
              [
                'Quanto ci metto a imparare?',
                'Il primo giro richiede mezz’ora, guidati dalla panoramica. Dopo, cambiare un prezzo o aggiungere una foto è questione di un minuto.',
              ],
              [
                'Se cambio idea sulla grafica?',
                'Lo stile del sito si cambia senza toccare i contenuti: testi e foto restano dove sono.',
              ],
              [
                'E se mi blocco?',
                'Ci scrivi. Ma la maggior parte delle cose ha una spiegazione scritta accanto al campo, dentro il pannello stesso.',
              ],
            ].map(([d, r]) => (
              <div key={d}>
                <dt className="text-[0.95rem] font-semibold text-slate-900">{d}</dt>
                <dd className="mt-1 text-[0.92rem] leading-relaxed text-slate-600">{r}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-14 border-t border-slate-200 pt-6 text-[0.8rem] leading-relaxed text-slate-400">
          Pagina informativa, fuori dal sito. Gli schemi mostrano come è organizzato il pannello; i colori e
          i dettagli dell’interfaccia possono cambiare con gli aggiornamenti.
        </p>
      </main>
    </div>
  )
}

/**
 * Una schermata, con segnaposto se il file non c'è ancora.
 *
 * Il segnaposto non è pigrizia: permette di pubblicare la pagina prima
 * di aver fatto le catture, e dice a te quale file manca invece di
 * lasciare un buco muto.
 */
function Schermata({ file, alt }) {
  // Prima .webp (quello che produce `npm run foto`), poi .png per chi ha
  // appena buttato dentro la cattura senza ottimizzarla, poi il disegno.
  //
  // Il disegno non è un ripiego triste: uno schema della disposizione
  // spiega quasi quanto uno screenshot e non invecchia a ogni ritocco
  // dell'interfaccia. La pagina si può mostrare a un cliente anche
  // prima di aver fatto una sola cattura.
  const [tentativo, setTentativo] = useState(0)
  const estensioni = ['webp', 'png', 'jpg']

  if (tentativo >= estensioni.length) {
    return (
      <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
        <SchermataPannello tipo={file} />
      </figure>
    )
  }

  return (
    <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
      <img
        src={`/pannello/${file}.${estensioni[tentativo]}`}
        alt={alt}
        loading="lazy"
        onError={() => setTentativo((n) => n + 1)}
        className="w-full"
      />
    </figure>
  )
}
