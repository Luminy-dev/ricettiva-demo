import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { I18nProvider } from '@/i18n'
import { SiteProvider, useSite, useStyles } from '@/lib/site'
import { useSections, SECTION_META, scrollToSection } from '@/lib/nav'
import { DEMO, esisteDemo } from '@/portale/demo'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/hero'
import Seo from '@/components/Seo'
import WhatsAppButton from '@/components/WhatsAppButton'
import StickyBookingBar from '@/components/booking/StickyBookingBar'

import Story from '@/sections/Story'
import Units from '@/sections/Units'
import Amenities from '@/sections/Amenities'
import Breakfast from '@/sections/Breakfast'
import CheckIn from '@/sections/CheckIn'
import Gallery from '@/sections/Gallery'
import Reviews from '@/sections/Reviews'
import Offers from '@/sections/Offers'
import Blog from '@/sections/Blog'
import Location from '@/sections/Location'
import Contact from '@/sections/Contact'

import BarraRegia from '@/portale/BarraRegia'

const Riservata = lazy(() => import('@/pages/Riservata'))
const ComeFunziona = lazy(() => import('@/pages/ComeFunziona'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Articolo = lazy(() => import('@/pages/Articolo'))
const Consigli = lazy(() => import('@/pages/Consigli'))

const SECTIONS = {
  hero: Hero,
  story: Story,
  rooms: Units,
  breakfast: Breakfast,
  checkin: CheckIn,
  amenities: Amenities,
  gallery: Gallery,
  offers: Offers,
  reviews: Reviews,
  blog: Blog,
  map: Location,
  contact: Contact,
}

// ─────────────────────────────────────────────────────────────
//  StayKit — Portale delle demo
//
//  Un indirizzo per struttura:
//
//    /                          pagina neutra: nessun elenco
//    /come-funziona             cos'è il pannello, con le schermate
//    /nomecliente               il sito dimostrativo di quel cliente
//    /nomecliente/blog          l'elenco dei consigli
//    /nomecliente/blog/<id>     un consiglio, alla sua pagina
//    /nomecliente/privacy       la sua informativa
//
//  La radice non elenca niente, di proposito: era l'unico punto da cui
//  un cliente poteva arrivare alle anteprime degli altri.
//
//  Ogni demo gira sui dati reali della struttura, presi dai suoi
//  canali. La barra in basso permette di cambiare stile, tipologia e
//  lingua davanti al cliente.
//
//  Tutto il portale è escluso dai motori di ricerca: le demo mostrano
//  contenuti di strutture vere su un dominio che non è il loro, e non
//  devono comparire cercando il nome del cliente.
// ─────────────────────────────────────────────────────────────

function leggiRotta() {
  const pezzi = window.location.pathname.split('/').filter(Boolean)
  if (pezzi[0] === 'come-funziona') return { tipo: 'pannello' }

  if (pezzi.length && esisteDemo(pezzi[0])) {
    const slug = pezzi[0]
    if (pezzi[1] === 'privacy') return { tipo: 'privacy', slug }
    if (pezzi[1] === 'blog') {
      return pezzi[2]
        ? { tipo: 'articolo', slug, articolo: decodeURIComponent(pezzi[2]) }
        : { tipo: 'consigli', slug }
    }
    return { tipo: 'demo', slug }
  }

  // Radice, o indirizzo inventato: la stessa pagina muta. Distinguerli
  // direbbe a chi prova indirizzi a caso quando ha indovinato.
  return { tipo: 'riservata' }
}

export default function App() {
  const [rotta, setRotta] = useState(leggiRotta)

  useEffect(() => {
    const onPop = () => setRotta(leggiRotta())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (rotta.tipo === 'riservata') {
    return (
      <Suspense fallback={<Attesa />}>
        <Riservata />
      </Suspense>
    )
  }

  if (rotta.tipo === 'pannello') {
    return (
      <Suspense fallback={<Attesa />}>
        <ComeFunziona />
      </Suspense>
    )
  }

  return <Demo rotta={rotta} />
}

function Demo({ rotta }) {
  const { slug } = rotta
  // La tipologia è locale alla dimostrazione: cambiarla non modifica il
  // file della demo, serve a far vedere come si adatta il template.
  const [preset, setPreset] = useState(DEMO[slug].preset)

  // `basePath` dice al template dove vive questa struttura: i
  // collegamenti agli articoli diventano /nomecliente/blog/<id> invece
  // di /blog/<id>, e restano dentro la demo giusta.
  const sito = useMemo(
    () => ({ ...DEMO[slug], preset, basePath: `/${slug}` }),
    [slug, preset]
  )

  return (
    <SiteProvider initial={sito} offline>
      <Guscio rotta={rotta} preset={preset} onPreset={setPreset} />
    </SiteProvider>
  )
}

function Guscio({ rotta, preset, onPreset }) {
  const { site, features } = useSite()
  const base = `/${rotta.slug}`

  return (
    <I18nProvider
      languages={features.multilanguage ? site.languages : [site.defaultLang || 'it']}
      defaultLang={site.defaultLang || 'it'}
      enabled={features.multilanguage}
    >
      {rotta.tipo === 'privacy' ? (
        <Suspense fallback={<Attesa />}>
          <Privacy base={base} />
        </Suspense>
      ) : rotta.tipo === 'consigli' ? (
        <Suspense fallback={<Attesa />}>
          <Consigli base={base} />
        </Suspense>
      ) : rotta.tipo === 'articolo' ? (
        <Suspense fallback={<Attesa />}>
          <Articolo id={rotta.articolo} base={base} />
        </Suspense>
      ) : (
        <Pagina />
      )}
      <BarraRegia slug={rotta.slug} preset={preset} onPreset={onPreset} />
    </I18nProvider>
  )
}

function Pagina() {
  const s = useStyles()
  const sections = useSections()

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const timer = setTimeout(() => scrollToSection(hash), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={s.page}>
      {/* noindex sempre: è il sito di un cliente su un dominio che non
          è il suo. Indicizzato, farebbe concorrenza al cliente stesso. */}
      <Seo noindex />
      <Header />
      <main>
        {sections.map((key) => {
          const Comp = SECTIONS[key]
          if (!Comp) return null
          return <Comp key={key} id={SECTION_META[key]?.anchor} />
        })}
      </main>
      <Footer />
      <StickyBookingBar />
      <WhatsAppButton />
    </div>
  )
}

function Attesa() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />
    </div>
  )
}
