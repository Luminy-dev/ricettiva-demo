import { useEffect } from 'react'
import { useI18n } from '@/i18n'
import { useSite } from '@/lib/site'

// ─────────────────────────────────────────────────────────────
//  SEO
//
//  Il sito è una SPA: title, description, Open Graph, hreflang e i
//  dati strutturati vengono scritti a runtime dai contenuti del
//  tenant. Per i motori è sufficiente nella maggior parte dei casi;
//  se serve il pre-render, si aggiunge in fase di build (vedi README).
// ─────────────────────────────────────────────────────────────

export default function Seo({ noindex = false }) {
  const { t, lang, available } = useI18n()
  const { site, features } = useSite()

  // ── Pagine che non devono finire su Google ──
  //
  //  La vetrina mostra una struttura che non è quella del dominio su
  //  cui gira. Indicizzata, farebbe comparire «Palazzo Fiorillo» nei
  //  risultati per il nome del cliente — e continuerebbe a comparirci
  //  per settimane dopo averla spenta. Il meta non basta da solo (i
  //  crawler vedono l'HTML prima che React parta): c'è anche un
  //  X-Robots-Tag su /demo in vercel.json.
  useEffect(() => {
    if (!noindex) {
      document.querySelector('meta[name="robots"][data-staykit]')?.remove()
      return undefined
    }
    setMeta('name', 'robots', 'noindex, nofollow')
    return () => document.querySelector('meta[name="robots"][data-staykit]')?.remove()
  }, [noindex])

  useEffect(() => {
    const seo = site.seo || {}
    const brand = site.brand?.name || 'StayKit'
    const title = t(seo.title) || `${brand} · ${t(site.brand?.tagline)}`
    const description = t(seo.description) || t(site.hero?.subtitle) || ''
    const image = absolute(seo.ogImage || site.hero?.image)
    const url = window.location.origin + window.location.pathname

    document.title = title
    setMeta('name', 'description', description)

    if (!features.seo_advanced) return

    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:site_name', brand)
    setMeta('property', 'og:locale', localeOf(lang))
    if (image) setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')

    // Una pagina esclusa dall'indice non dichiara un canonical: sarebbe
    // un invito a indicizzarla proprio mentre le si dice di non farlo.
    if (!noindex) setLink('canonical', url)
    // hreflang: stesse URL con ?lang=xx
    document.querySelectorAll('link[data-staykit-alt]').forEach((n) => n.remove())
    for (const code of available) {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = code
      link.href = `${url}?lang=${code}`
      link.dataset.staykitAlt = 'true'
      document.head.appendChild(link)
    }

    setJsonLd(buildJsonLd({ site, t, title, description, image, url }))
  }, [site, t, lang, available, features.seo_advanced])

  return null
}

function buildJsonLd({ site, t, title, description, image, url }) {
  const addr = site.contact?.address || {}
  const typeByPreset = {
    bnb: 'BedAndBreakfast',
    affittacamere: 'LodgingBusiness',
    case_vacanza: 'VacationRental',
    agriturismo: 'LodgingBusiness',
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': typeByPreset[site.preset] || 'LodgingBusiness',
    name: site.brand?.name,
    description,
    url,
    image: image ? [image] : undefined,
    telephone: site.contact?.phone || undefined,
    email: site.contact?.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: addr.street,
      postalCode: addr.zip,
      addressLocality: addr.city,
      addressRegion: addr.province,
      addressCountry: addr.country === 'Italia' ? 'IT' : addr.country,
    },
    numberOfRooms: (site.units || []).length || undefined,
    amenityFeature: (site.amenities || []).slice(0, 20).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
  }

  if (site.contact?.coords?.lat) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: site.contact.coords.lat,
      longitude: site.contact.coords.lng,
    }
  }
  if (site.reviews?.rating && site.reviews?.count) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: site.reviews.rating,
      bestRating: 10,
      reviewCount: site.reviews.count,
    }
  }
  return data
}

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    // Marcato, così chi l'ha messo sa anche toglierlo: il meta robots
    // va rimosso quando si esce dalla vetrina.
    el.dataset.staykit = 'true'
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data) {
  let el = document.getElementById('staykit-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'staykit-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data, null, 0)
}

function absolute(src) {
  if (!src) return ''
  if (/^https?:/i.test(src)) return src
  return window.location.origin + (src.startsWith('/') ? src : `/${src}`)
}

function localeOf(lang) {
  return { it: 'it_IT', en: 'en_GB', de: 'de_DE', fr: 'fr_FR' }[lang] || 'it_IT'
}
