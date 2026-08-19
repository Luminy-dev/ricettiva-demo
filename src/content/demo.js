import { EMPTY_SITE } from './empty'

// ─────────────────────────────────────────────────────────────
//  Nessun contenuto di riserva, sul portale
//
//  Nel progetto principale questo file contiene Palazzo Fiorillo, che
//  serve quando si lavora in locale senza database. Qui non serve: le
//  demo stanno in demo/<slug>/sito.json e il provider le riceve già
//  pronte, senza mai passare dal ripiego.
//
//  Il file esiste perché src/lib/site.jsx lo importa, e src/lib/ arriva
//  dal template così com'è. Meglio un rimando esplicito a «vuoto» che
//  una copia della struttura inventata: se un giorno il ripiego
//  scattasse davvero, comparirebbe una pagina vuota — che è il segnale
//  giusto — e non un B&B di Salerno al posto del cliente.
// ─────────────────────────────────────────────────────────────

export const DEMO_SITE = EMPTY_SITE
export default DEMO_SITE
