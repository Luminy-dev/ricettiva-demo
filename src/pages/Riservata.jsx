// ─────────────────────────────────────────────────────────────
//  Quello che si vede a un indirizzo che non è una demo
//
//  Prima qui c'era l'elenco delle demo. Non c'è più, e non è una
//  semplificazione: era l'unico punto da cui un cliente, cancellando
//  il proprio nome dall'indirizzo, poteva arrivare alle anteprime
//  degli altri — cioè, spesso, dei suoi concorrenti.
//
//  Ora la radice non dice niente. Nemmeno che le demo esistono, né
//  quante sono: una pagina che dicesse «demo non trovata» sarebbe già
//  un invito a provarne altre.
//
//  Per sapere cosa hai in casa: `npm run demo` da terminale, oppure
//  lo strumento `elenca_demo` parlando con l'assistente.
// ─────────────────────────────────────────────────────────────

export default function Riservata() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm text-center">
        <p className="font-display text-xl font-bold text-slate-800">Pagina riservata</p>
        <p className="mt-2.5 text-[0.92rem] leading-relaxed text-slate-500">
          Se stai cercando l’anteprima del tuo sito, apri il link che ti è stato mandato.
        </p>
      </div>
    </div>
  )
}
