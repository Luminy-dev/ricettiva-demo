// ─────────────────────────────────────────────────────────────
//  Disegni al posto delle immagini che non ci sono
//
//  Due usi, con lo stesso motivo dietro: un rettangolo grigio vuoto
//  fa sembrare la pagina rotta, e chi la guarda smette di leggere.
//  Un disegno dice «qui ci va una cosa e ha questa forma», e la
//  lettura continua.
//
//   · SchermataPannello — schemi del pannello di gestione, per la
//     pagina «come funziona» finché non ci sono le catture vere
//   · FotoMancante — segnaposto dentro una demo, nei colori del tema
//
//  Sono SVG scritti a mano, senza dipendenze. Usano `currentColor`
//  dove possono, così si adattano al contesto invece di portarsi
//  dietro una tavolozza propria.
// ─────────────────────────────────────────────────────────────

/**
 * Schema di una schermata del pannello.
 *
 * Non prova a somigliare a uno screenshot: prova a far capire la
 * DISPOSIZIONE — barra laterale a sinistra, contenuto a destra, i
 * campi in colonna. È quello che serve a chi non l'ha mai visto, e ha
 * il vantaggio di non invecchiare a ogni ritocco dell'interfaccia.
 */
export function SchermataPannello({ tipo }) {
  return (
    <svg viewBox="0 0 640 400" className="w-full" role="img" aria-label={`Schema: ${tipo}`}>
      <defs>
        <linearGradient id="sfondoPannello" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      <rect width="640" height="400" rx="10" fill="url(#sfondoPannello)" />
      <rect x="0.5" y="0.5" width="639" height="399" rx="10" fill="none" stroke="#e2e8f0" />

      {tipo === 'accesso' ? <Accesso /> : <ConBarraLaterale tipo={tipo} />}
    </svg>
  )
}

function Accesso() {
  return (
    <g>
      <rect x="200" y="90" width="240" height="220" rx="12" fill="#fff" stroke="#e2e8f0" />
      <rect x="280" y="118" width="80" height="10" rx="5" fill="#0f172a" />
      <Campo x={224} y={158} w={192} etichetta={44} />
      <Campo x={224} y={208} w={192} etichetta={60} />
      <rect x="224" y="258" width="192" height="32" rx="8" fill="#0f172a" />
      <rect x="288" y="270" width="64" height="8" rx="4" fill="#fff" opacity="0.9" />
    </g>
  )
}

function ConBarraLaterale({ tipo }) {
  const voci = ['Panoramica', 'Testi', 'Unità', 'Servizi', 'Foto', 'Prenotazioni', 'Richieste']
  const attiva = { panoramica: 0, testi: 1, unita: 2, foto: 4, prenotazioni: 5, richieste: 6 }[tipo] ?? 0

  return (
    <g>
      {/* Barra laterale */}
      <rect x="0" y="0" width="150" height="400" rx="10" fill="#0f172a" />
      <rect x="140" y="0" width="10" height="400" fill="#0f172a" />
      <rect x="24" y="26" width="72" height="9" rx="4.5" fill="#fff" opacity="0.85" />
      {voci.map((v, i) => (
        <g key={v}>
          {i === attiva && <rect x="14" y={60 + i * 34} width="122" height="26" rx="7" fill="#fff" opacity="0.14" />}
          <circle cx="30" cy={73 + i * 34} r="4" fill="#fff" opacity={i === attiva ? 0.9 : 0.35} />
          <rect
            x="44"
            y={69 + i * 34}
            width={38 + ((i * 17) % 46)}
            height="8"
            rx="4"
            fill="#fff"
            opacity={i === attiva ? 0.9 : 0.35}
          />
        </g>
      ))}

      {/* Intestazione del contenuto */}
      <rect x="178" y="28" width="130" height="12" rx="6" fill="#0f172a" opacity="0.85" />
      <rect x="178" y="50" width="250" height="8" rx="4" fill="#94a3b8" />

      {tipo === 'panoramica' && <Panoramica />}
      {tipo === 'testi' && <Testi />}
      {tipo === 'unita' && <Unita />}
      {tipo === 'foto' && <Foto />}
      {tipo === 'prenotazioni' && <Prenotazioni />}
      {tipo === 'richieste' && <Richieste />}
    </g>
  )
}

function Panoramica() {
  return (
    <g>
      <rect x="178" y="80" width="434" height="70" rx="10" fill="#fff" stroke="#e2e8f0" />
      <rect x="198" y="100" width="70" height="9" rx="4.5" fill="#0f172a" opacity="0.8" />
      <rect x="198" y="122" width="330" height="10" rx="5" fill="#e2e8f0" />
      <rect x="198" y="122" width="215" height="10" rx="5" fill="#16a34a" />
      <text x="546" y="132" fontSize="15" fontWeight="700" fill="#16a34a" fontFamily="system-ui">
        65%
      </text>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="178" y={168 + i * 46} width="434" height="38" rx="9" fill="#fff" stroke="#e2e8f0" />
          <circle cx="200" cy={187 + i * 46} r="6" fill={i === 0 ? '#f59e0b' : '#cbd5e1'} />
          <rect x="216" y={183 + i * 46} width={180 - i * 34} height="8" rx="4" fill="#64748b" />
        </g>
      ))}
    </g>
  )
}

function Testi() {
  return (
    <g>
      <rect x="178" y="80" width="434" height="290" rx="10" fill="#fff" stroke="#e2e8f0" />
      {/* Bandierine delle lingue */}
      <g>
        <rect x="198" y="100" width="26" height="16" rx="4" fill="#0f172a" />
        <rect x="230" y="100" width="26" height="16" rx="4" fill="#e2e8f0" />
        <rect x="262" y="100" width="26" height="16" rx="4" fill="#e2e8f0" />
        <circle cx="252" cy="99" r="3" fill="#f59e0b" />
      </g>
      <Campo x={198} y={128} w={394} etichetta={54} />
      <Campo x={198} y={186} w={394} etichetta={72} alto />
      <Campo x={198} y={282} w={394} etichetta={46} />
    </g>
  )
}

function Unita() {
  return (
    <g>
      <rect x="178" y="80" width="434" height="290" rx="10" fill="#fff" stroke="#e2e8f0" />
      <rect x="198" y="100" width="150" height="100" rx="8" fill="#e2e8f0" />
      <circle cx="238" cy="134" r="11" fill="#cbd5e1" />
      <path d="M198 176 l38-30 30 24 26-20 56 42 H198Z" fill="#cbd5e1" />
      <Campo x={364} y={100} w={228} etichetta={40} />
      <Campo x={364} y={152} w={228} etichetta={62} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={198 + i * 100} y="220" width="88" height="44" rx="8" fill="#f8fafc" stroke="#e2e8f0" />
          <rect x={210 + i * 100} y="232" width="40" height="7" rx="3.5" fill="#94a3b8" />
          <rect x={210 + i * 100} y="246" width="22" height="9" rx="4.5" fill="#0f172a" opacity="0.75" />
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={198 + i * 80} y="288" width="70" height="24" rx="12" fill="#f1f5f9" stroke="#e2e8f0" />
          <circle cx={212 + i * 80} cy="300" r="4" fill="#16a34a" />
          <rect x={222 + i * 80} y="296" width="34" height="7" rx="3.5" fill="#94a3b8" />
        </g>
      ))}
    </g>
  )
}

function Foto() {
  return (
    <g>
      <rect x="178" y="80" width="434" height="60" rx="10" fill="#fff" stroke="#e2e8f0" strokeDasharray="6 5" />
      <path d="M382 100 v22 M371 111 h22" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 178 + (i % 3) * 148
        const y = 156 + Math.floor(i / 3) * 112
        return (
          <g key={i}>
            <rect x={x} y={y} width="138" height="100" rx="8" fill="#e2e8f0" />
            <circle cx={x + 34} cy={y + 32} r="9" fill="#cbd5e1" />
            <path d={`M${x} ${y + 82} l32-26 26 20 22-17 58 39 H${x}Z`} fill="#cbd5e1" />
            {i === 0 && <rect x={x + 8} y={y + 8} width="52" height="16" rx="8" fill="#0f172a" opacity="0.8" />}
          </g>
        )
      })}
    </g>
  )
}

function Prenotazioni() {
  return (
    <g>
      <rect x="178" y="80" width="434" height="290" rx="10" fill="#fff" stroke="#e2e8f0" />
      {['Widget del gestionale', 'Link al portale', 'Richiesta via email', 'Solo telefono'].map((_, i) => (
        <g key={i}>
          <rect
            x="198"
            y={100 + i * 52}
            width="394"
            height="42"
            rx="9"
            fill={i === 1 ? '#eff6ff' : '#f8fafc'}
            stroke={i === 1 ? '#3b82f6' : '#e2e8f0'}
          />
          <circle cx="220" cy={121 + i * 52} r="7" fill="none" stroke={i === 1 ? '#3b82f6' : '#cbd5e1'} strokeWidth="2" />
          {i === 1 && <circle cx="220" cy={121 + i * 52} r="3.5" fill="#3b82f6" />}
          <rect x="240" y={110 + i * 52} width={120 + ((i * 29) % 70)} height="8" rx="4" fill="#334155" />
          <rect x="240" y={126 + i * 52} width={200 + ((i * 41) % 110)} height="6" rx="3" fill="#94a3b8" />
        </g>
      ))}
      <Campo x={198} y={312} w={394} etichetta={58} />
    </g>
  )
}

function Richieste() {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="178" y={80 + i * 74} width="434" height="62" rx="10" fill="#fff" stroke="#e2e8f0" />
          <circle cx="206" cy={111 + i * 74} r="12" fill="#f1f5f9" />
          <rect x="228" y={98 + i * 74} width={96 - i * 8} height="9" rx="4.5" fill="#0f172a" opacity="0.8" />
          <rect x="228" y={116 + i * 74} width={168 + ((i * 37) % 60)} height="7" rx="3.5" fill="#94a3b8" />
          <rect
            x="500"
            y={102 + i * 74}
            width="86"
            height="22"
            rx="11"
            fill={['#dcfce7', '#fef9c3', '#e0e7ff', '#f1f5f9'][i]}
          />
          <rect x="516" y={109 + i * 74} width={54 - i * 6} height="7" rx="3.5" fill="#475569" opacity="0.75" />
        </g>
      ))}
    </g>
  )
}

function Campo({ x, y, w, etichetta, alto }) {
  return (
    <g>
      <rect x={x} y={y} width={etichetta} height="7" rx="3.5" fill="#94a3b8" />
      <rect x={x} y={y + 14} width={w} height={alto ? 72 : 30} rx="7" fill="#f8fafc" stroke="#e2e8f0" />
      <rect x={x + 12} y={y + (alto ? 30 : 27)} width={Math.min(w - 40, 150)} height="7" rx="3.5" fill="#cbd5e1" />
      {alto && <rect x={x + 12} y={y + 46} width={Math.min(w - 60, 210)} height="7" rx="3.5" fill="#cbd5e1" />}
    </g>
  )
}

/**
 * Segnaposto per una foto che manca dentro una demo.
 *
 * Prende i colori del tema attivo (`currentColor` e le variabili del
 * sito) invece di essere grigio: così non sembra un errore di
 * caricamento ma una parte della pagina in attesa di contenuto.
 */
export function FotoMancante({ etichetta = 'Foto della struttura', className = '' }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-bg-alt text-ink-muted ${className}`}
      role="img"
      aria-label={etichetta}
    >
      <svg viewBox="0 0 200 130" className="h-full max-h-[220px] w-auto opacity-45" aria-hidden>
        <rect x="14" y="14" width="172" height="102" rx="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="58" cy="48" r="11" fill="currentColor" opacity="0.5" />
        <path
          d="M14 96 l40-32 30 24 26-20 62 44 v4 H14Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
    </div>
  )
}
