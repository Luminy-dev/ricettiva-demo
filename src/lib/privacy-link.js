// ─────────────────────────────────────────────────────────────
//  Dove porta il collegamento «Privacy» — versione portale
//
//  Nel progetto principale ogni deploy serve una struttura sola, e
//  l'informativa sta su /privacy. Qui le strutture sono tante sullo
//  stesso dominio, quindi ognuna ha la sua sotto il proprio indirizzo.
//
//  ⚠ Questo file NON viene sovrascritto da `npm run allinea`: è nella
//  lista delle esclusioni, perché è una differenza voluta fra i due
//  progetti e non una copia rimasta indietro.
// ─────────────────────────────────────────────────────────────

/**
 * Se la struttura ha già un'informativa sua, si usa quella. Solo
 * http(s): un `javascript:` nel campo diventerebbe codice eseguibile.
 */
export function linkPrivacy(site) {
  const esterno = (site?.legal?.privacy?.externalUrl || site?.legal?.privacyUrl || '').trim()
  if (esterno && /^https?:\/\//i.test(esterno)) return esterno
  return site?.slug ? `/${site.slug}/privacy` : '/privacy'
}
