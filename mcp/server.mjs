#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
//  StayKit — Server MCP per creare le demo
//
//  Gira in locale, sul tuo computer, e si collega a Claude Desktop.
//  Serve a una cosa sola: prendere i dati veri di una struttura e
//  trasformarli in una demo, senza compilare quaranta campi a mano.
//
//  Il flusso tipico, parlando:
//
//    «Crea una demo per questa struttura: <link Booking>»
//     → l'assistente legge la pagina, poi:
//       1. crea_demo        con i dati raccolti
//       2. scarica_foto     con gli indirizzi delle immagini
//       3. leggi_demo       per rileggere e correggere
//
//  ── Perché scrive file e non un database ──
//
//  Una demo si crea, si guarda, e o va o si rifà. Non ha bisogno di un
//  pannello né di un'autenticazione. Scrivendo file:
//   · non ci sono credenziali sul portale
//   · non c'è modo di arrivare per sbaglio ai dati di un cliente vero
//   · le demo finiscono in git, quindi sai sempre cosa hai mostrato
//
//  ── Il paletto ──
//
//  Il server scrive SOLO dentro demo/ e public/demo/ di questo
//  progetto. Qualunque percorso che tenti di uscire da lì viene
//  rifiutato: un modello che sbaglia un nome non deve poter scrivere
//  altrove sul tuo disco.
// ─────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join, dirname, resolve as resolvePath } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline'
import {
  scaricaPagina, datiStrutturati, metaTag, scheda, coordinate, immagini, geocodifica,
  pulisciLinkPortale, tipoLinkPortale,
} from './estrai.mjs'

const PROGETTO = resolvePath(dirname(fileURLToPath(import.meta.url)), '..')
const CARTELLA_DEMO = join(PROGETTO, 'demo')
const CARTELLA_FOTO = join(PROGETTO, 'public', 'demo')

// ── Confini ───────────────────────────────────────────────────

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function slugValido(slug) {
  if (typeof slug !== 'string' || !SLUG.test(slug) || slug.length > 60) {
    throw new Error(
      `Nome non valido: "${slug}". Usa lettere minuscole, numeri e trattini — per esempio "villa-serena".`
    )
  }
  // Sono indirizzi del portale: se una demo si chiamasse così,
  // coprirebbe una pagina vera.
  if (['come-funziona', 'assets', 'pannello', 'privacy'].includes(slug)) {
    throw new Error(`"${slug}" è riservato: è già un indirizzo del portale. Scegline un altro.`)
  }
  return slug
}

/** Non si esce dalle due cartelle consentite. Mai. */
function dentro(base, ...pezzi) {
  const p = resolvePath(join(base, ...pezzi))
  if (p !== base && !p.startsWith(base + (process.platform === 'win32' ? '\\' : '/'))) {
    throw new Error('Percorso fuori dal progetto: rifiutato.')
  }
  return p
}

// ── Lettura e scrittura delle demo ────────────────────────────

function elencoDemo() {
  if (!existsSync(CARTELLA_DEMO)) return []
  return readdirSync(CARTELLA_DEMO).filter((n) =>
    existsSync(join(CARTELLA_DEMO, n, 'sito.json'))
  )
}

function leggiSito(slug) {
  const file = dentro(CARTELLA_DEMO, slugValido(slug), 'sito.json')
  if (!existsSync(file)) throw new Error(`La demo "${slug}" non esiste.`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

function scriviSito(slug, sito) {
  const cartella = dentro(CARTELLA_DEMO, slugValido(slug))
  mkdirSync(cartella, { recursive: true })
  writeFileSync(join(cartella, 'sito.json'), JSON.stringify(sito, null, 2) + '\n')
}

/** Fonde due oggetti in profondità; gli array vengono sostituiti. */
function fondi(base, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return patch ?? base
  const out = { ...(base || {}) }
  for (const [k, v] of Object.entries(patch)) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? fondi(out[k], v) : v
  }
  return out
}

// ── Foto ──────────────────────────────────────────────────────

/**
 * Scarica un'immagine dentro public/demo/<slug>/.
 *
 * Scarichiamo invece di linkare per tre motivi, tutti concreti:
 *  · i portali cambiano gli indirizzi delle immagini e le demo
 *    diventerebbero pagine bianche nel momento peggiore
 *  · molti bloccano il collegamento da domini esterni
 *  · linkando, ogni visita alla demo dice a quel portale che qualcuno
 *    sta guardando quella struttura
 */
async function scarica(slug, url, nome) {
  slugValido(slug)
  if (!/^https:\/\//i.test(url)) throw new Error(`Indirizzo non valido (serve https): ${url}`)

  const risposta = await fetch(url, {
    headers: { 'User-Agent': 'StayKit-Demo/1.0 (+preparazione anteprima)' },
    redirect: 'follow',
  })
  if (!risposta.ok) throw new Error(`${risposta.status} scaricando ${url}`)

  const tipo = risposta.headers.get('content-type') || ''
  if (!tipo.startsWith('image/')) throw new Error(`Non è un'immagine (${tipo || 'tipo ignoto'}): ${url}`)

  const estensione = tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp' : 'jpg'
  const pulito = String(nome || 'foto').toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40)
  const file = dentro(CARTELLA_FOTO, slug, `${pulito}.${estensione}`)

  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, Buffer.from(await risposta.arrayBuffer()))

  return { percorso: `/demo/${slug}/${pulito}.${estensione}`, peso: statSync(file).size }
}

// ── Struttura di partenza di una demo ─────────────────────────

function nuovaDemo(dati) {
  const oggi = new Date().toISOString().slice(0, 10)
  return {
    slug: dati.slug,
    preset: dati.preset || 'bnb',
    theme: dati.theme || 'glass',
    themeOverrides: {},
    languages: dati.languages || ['it', 'en'],
    defaultLang: 'it',

    brand: { name: dati.nome, logoText: dati.nome, logo: '', tagline: {} },
    contact: { address: {}, coords: {} },
    legal: { company: '', vat: '', cin: '', cir: '', credits: { label: 'Luminy.dev', url: 'https://www.luminy.dev' }, privacy: {} },
    social: {},

    hero: { eyebrow: {}, title: {}, subtitle: {}, image: '', video: '', badges: [] },
    story: { title: {}, paragraphs: {}, image: '', highlights: [] },
    units: [],
    amenities: [],
    amenitiesCustom: [],
    breakfast: { title: {}, text: {}, hours: '', image: '', items: [] },
    checkin: { title: {}, text: {}, steps: [], image: '' },
    gallery: [],
    reviews: { rating: null, count: null, source: '', items: [] },
    offers: [],
    location: { intro: {}, pois: [] },
    // ── Prenotazioni ──
    //
    //  Con il link di Booking la barra delle date apre la pagina della
    //  struttura con arrivo, partenza e ospiti già impostati: chi
    //  guarda la demo vede il percorso completo, fino a un risultato
    //  vero. Senza, resta il modulo di richiesta — che in una demo non
    //  manda niente a nessuno e fa un effetto peggiore.
    booking: dati.bookingUrl
      ? {
          mode: 'link',
          provider: null,
          embed: { type: 'html', html: '', url: '', scriptSrc: '', mountId: 'booking-widget', height: 640, headExtra: '' },
          link: { url: pulisciLinkPortale(dati.bookingUrl), channel: 'booking', label: '' },
          fallback: 'internal',
          showDirectHint: true,
        }
      : {
          mode: 'internal',
          provider: null,
          embed: { type: 'html', html: '', url: '', scriptSrc: '', mountId: 'booking-widget', height: 640, headExtra: '' },
          link: { url: '', channel: 'booking', label: '' },
          fallback: 'internal',
          showDirectHint: true,
        },
    seo: { title: {}, description: {}, ogImage: '' },

    // Nella demo è acceso tutto: serve a far vedere cosa può avere,
    // non cosa ha comprato.
    plan: {
      booking_engine: true, direct_requests: true, multilanguage: true, media_upload: true,
      theme_switching: true, color_customization: true, gallery: true, reviews: true,
      map: true, offers: true, blog: true, seo_advanced: true, analytics: false,
      whatsapp: true, demo_showcase: false, extra_pages: false, guest_area: false,
    },
    settings: {
      'section.rooms': true, 'section.amenities': true, 'section.story': true,
      'section.gallery': true, 'section.reviews': true, 'section.map': true,
      'section.offers': true, 'section.breakfast': true, 'section.checkin': true,
      'booking.hero_bar': true, 'booking.sticky_bar': true, 'booking.show_prices': true,
      'section.blog': true, 'nav.blog': true,
      // La galleria resta nella pagina ma non nella barra in alto: con
      // otto voci il menu diventa illeggibile, e la galleria si trova
      // benissimo scorrendo.
      'nav.gallery': false,
      'hero.video': false, 'contact.whatsapp_button': true,
    },

    // Note di servizio: compaiono nell'indice, non sul sito.
    vetrina: { luogo: dati.luogo || '', nota: dati.nota || '', creata: oggi, fonte: dati.fonte || '' },
  }
}

// ── Strumenti esposti a Claude ────────────────────────────────

const STRUMENTI = [
  {
    name: 'leggi_struttura',
    description:
      'PRIMO PASSO. Legge una pagina (Booking, sito ufficiale, Google Maps, Airbnb…) e ne estrae quello che la ricerca web non ti fa vedere: le FOTO in alta risoluzione, le coordinate GPS, il voto e il numero di recensioni, indirizzo e recapiti dai dati strutturati. ' +
      'Usalo su ogni fonte che trovi — la pagina Booking dà le foto e il voto, il sito ufficiale dà email, telefono e partita IVA. Poi passa gli indirizzi delle foto a scarica_foto.',
    inputSchema: {
      type: 'object',
      required: ['url'],
      properties: {
        url: { type: 'string', description: 'Indirizzo della pagina da leggere.' },
        verifica_foto: {
          type: 'boolean',
          description:
            'Predefinito true: controlla peso e formato di ogni immagine e scarta quelle troppo piccole per un sito. Più lento ma molto più pulito.',
        },
      },
    },
    esegui: async (a) => {
      const { html, url } = await scaricaPagina(a.url)
      const strutturati = datiStrutturati(html)
      const meta = metaTag(html)
      const dati = scheda(html, strutturati, meta)
      const geo = coordinate(html, strutturati)

      let foto = immagini(html, url)
      const trovate = foto.length
      if (a.verifica_foto !== false) foto = await verificaImmagini(foto.slice(0, 60))

      return {
        pagina: url,
        struttura: dati,
        coordinate: geo || 'non presenti nella pagina — prova geocodifica_indirizzo',
        foto: foto.map((f) => ({ url: f.url, dove: f.dove, ...(f.peso ? { kb: Math.round(f.peso / 1024) } : {}) })),
        foto_trovate: trovate,
        foto_utilizzabili: foto.length,
        nota:
          foto.length === 0
            ? 'Nessuna foto utilizzabile: la pagina probabilmente carica la galleria con JavaScript. Prova il sito ufficiale della struttura, la sua pagina Facebook, o un altro portale.'
            : 'Passa questi indirizzi a scarica_foto. Metti per prima quella che vuoi come apertura.',
      }
    },
  },

  {
    name: 'geocodifica_indirizzo',
    description:
      'Indirizzo → coordinate GPS, con OpenStreetMap. Serve quando la pagina non le espone: senza coordinate la mappa del sito non si posiziona. Scrivi l’indirizzo completo, con città e provincia.',
    inputSchema: {
      type: 'object',
      required: ['indirizzo'],
      properties: {
        indirizzo: { type: 'string', description: 'Es. «Piazza Cerenza 14, Salerno, SA, Italia»' },
      },
    },
    esegui: (a) => geocodifica(a.indirizzo),
  },

  {
    name: 'elenca_demo',
    description:
      'Elenca le demo già presenti nel portale, con nome, indirizzo e note. Usalo prima di crearne una per non sovrascrivere.',
    inputSchema: { type: 'object', properties: {} },
    esegui: () => {
      const demo = elencoDemo().map((slug) => {
        const s = leggiSito(slug)
        return {
          slug,
          indirizzo: `/${slug}`,
          nome: s.brand?.name || slug,
          tipologia: s.preset,
          unita: (s.units || []).length,
          foto: contaFoto(slug),
          creata: s.vetrina?.creata || '',
          nota: s.vetrina?.nota || '',
        }
      })
      return demo.length ? demo : 'Nessuna demo presente.'
    },
  },

  {
    name: 'crea_demo',
    description:
      'Crea una nuova demo vuota, pronta da riempire. Restituisce la struttura completa del file con tutti i campi disponibili: leggila per sapere cosa puoi compilare, poi usa aggiorna_demo. Non sovrascrive una demo esistente.',
    inputSchema: {
      type: 'object',
      required: ['slug', 'nome'],
      properties: {
        slug: { type: 'string', description: 'Indirizzo della demo, es. "villa-serena". Minuscole e trattini.' },
        nome: { type: 'string', description: 'Nome della struttura, come si chiama davvero.' },
        preset: { type: 'string', enum: ['bnb', 'affittacamere', 'case_vacanza', 'agriturismo'] },
        theme: { type: 'string', enum: ['glass', 'heritage', 'noir'] },
        languages: { type: 'array', items: { type: 'string' }, description: 'Lingue del sito, es. ["it","en"].' },
        bookingUrl: {
          type: 'string',
          description:
            'Indirizzo della SCHEDA su Booking (…/hotel/it/nome.it.html), non una pagina di ricerca. ' +
            'Impostalo SEMPRE se ce l’hai: la barra «verifica disponibilità» aprirà Booking con le date e gli ' +
            'ospiti già filtrati, invece di raccogliere una richiesta che in una demo non arriva a nessuno. ' +
            'Incollalo com’è dal browser: i parametri di sessione vengono tolti.',
        },
        luogo: { type: 'string', description: 'Città e provincia, per il tuo elenco.' },
        nota: { type: 'string', description: 'Promemoria per te: chi è questo cliente, com’è andata.' },
        fonte: { type: 'string', description: 'Da dove hai preso i dati (link Booking, sito, ecc.).' },
      },
    },
    esegui: (a) => {
      const slug = slugValido(a.slug)
      if (existsSync(join(CARTELLA_DEMO, slug, 'sito.json'))) {
        throw new Error(`La demo "${slug}" esiste già. Usa aggiorna_demo, o scegli un altro nome.`)
      }
      if (!a.nome?.trim()) throw new Error('Serve il nome della struttura.')
      const sito = nuovaDemo({ ...a, slug })
      scriviSito(slug, sito)
      return {
        creata: `/${slug}`,
        prossimo_passo:
          'Compila i contenuti con aggiorna_demo. I campi di testo sono oggetti per lingua: { "it": "…", "en": "…" }.',
        struttura: sito,
      }
    },
  },

  {
    name: 'leggi_demo',
    description: 'Legge il file completo di una demo, per vedere cosa c’è già e cosa manca.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: { slug: { type: 'string' } },
    },
    esegui: (a) => leggiSito(a.slug),
  },

  {
    name: 'aggiorna_demo',
    description:
      'Aggiorna una demo esistente. La patch si fonde con quello che c’è già: passa solo i campi da cambiare. Gli array (units, gallery, offers…) vengono sostituiti per intero, non uniti.',
    inputSchema: {
      type: 'object',
      required: ['slug', 'patch'],
      properties: {
        slug: { type: 'string' },
        patch: { type: 'object', description: 'I campi da cambiare, nella stessa forma del file.' },
      },
    },
    esegui: (a) => {
      const sito = leggiSito(a.slug)
      const nuovo = fondi(sito, a.patch)
      nuovo.slug = a.slug // lo slug non si cambia da qui: lo decide la cartella
      scriviSito(a.slug, nuovo)
      return { aggiornata: `/${a.slug}`, campi: Object.keys(a.patch), mancanze: cosaManca(nuovo) }
    },
  },

  {
    name: 'scarica_foto',
    description:
      'Scarica immagini dentro la demo e restituisce i percorsi da usare nei campi (hero.image, gallery, units[].cover…). Gli indirizzi te li dà leggi_struttura. In alternativa passa `da_pagina` e le prende tutte da lì.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string' },
        foto: {
          type: 'array',
          description: 'Le immagini da scaricare, con il nome che vuoi dare al file.',
          items: {
            type: 'object',
            required: ['url', 'nome'],
            properties: {
              url: { type: 'string', description: 'Indirizzo https diretto dell’immagine.' },
              nome: { type: 'string', description: 'Nome del file senza estensione, es. "hero" o "camera-1".' },
            },
          },
        },
        da_pagina: {
          type: 'string',
          description:
            'Scorciatoia: indirizzo di una pagina da cui prendere tutte le foto utilizzabili, numerate. Comodo per riempire in fretta la galleria.',
        },
        massimo: { type: 'number', description: 'Quante al massimo con da_pagina. Predefinito 12.' },
      },
    },
    esegui: async (a) => {
      let elenco = a.foto || []

      if (a.da_pagina) {
        const { html, url } = await scaricaPagina(a.da_pagina)
        const utili = await verificaImmagini(immagini(html, url).slice(0, 60))
        elenco = utili.slice(0, a.massimo || 12).map((f, i) => ({
          url: f.url,
          nome: i === 0 ? 'hero' : `foto-${String(i).padStart(2, '0')}`,
        }))
      }

      if (!elenco.length) throw new Error('Nessuna immagine da scaricare: passa `foto` oppure `da_pagina`.')

      const fatte = []
      const fallite = []
      for (const f of elenco) {
        try {
          fatte.push({ nome: f.nome, ...(await scarica(a.slug, f.url, f.nome)) })
        } catch (err) {
          fallite.push({ nome: f.nome, url: f.url, motivo: err.message })
        }
      }
      return {
        scaricate: fatte,
        fallite,
        promemoria:
          'Ora metti questi percorsi nei campi con aggiorna_demo. Poi lancia `npm run foto` per ridurne il peso.',
      }
    },
  },

  {
    name: 'collega_booking',
    description:
      'Collega la barra «verifica disponibilità» alla pagina Booking della struttura. Da quel momento, chi sceglie 14–16 agosto per 2 persone finisce su Booking con quelle date e quegli ospiti già filtrati, invece di compilare un modulo che in una demo non manda niente a nessuno. Usalo SEMPRE su una demo di una struttura presente su Booking.',
    inputSchema: {
      type: 'object',
      required: ['slug', 'url'],
      properties: {
        slug: { type: 'string' },
        url: {
          type: 'string',
          description:
            'Indirizzo della SCHEDA della struttura, per esempio https://www.booking.com/hotel/it/nome.it.html. ' +
            'Incollalo pure com’è dal browser: i parametri di sessione (aid, label, sid, srepoch…) vengono tolti. ' +
            'Una pagina di ricerca non va bene: Booking non le applica i filtri.',
        },
        canale: {
          type: 'string',
          enum: ['booking', 'airbnb', 'vrbo', 'expedia'],
          description: 'Predefinito booking. Gli altri portali ricevono le date con i loro parametri.',
        },
      },
    },
    esegui: (a) => {
      const sito = leggiSito(a.slug)
      const canale = a.canale || 'booking'
      const grezzo = (a.url || '').trim()

      if (!grezzo) {
        throw new Error(
          'Serve l’indirizzo della SCHEDA della struttura sul portale, per esempio ' +
            'https://www.booking.com/hotel/it/nome-struttura.it.html — cercalo su Booking, apri la struttura ' +
            'e copia l’indirizzo dalla barra del browser. La pagina di ricerca col solo nome non basta: ' +
            'Booking la ignora e riporta alla home con i filtri vuoti.'
        )
      }
      if (!/^https:\/\//i.test(grezzo)) throw new Error('L’indirizzo deve cominciare con https://')

      const url = pulisciLinkPortale(grezzo)
      const tipo = tipoLinkPortale(url)

      if (tipo === 'ricerca') {
        throw new Error(
          'Questo è un indirizzo di RICERCA, non la scheda della struttura. Booking non applica i filtri a ' +
            'una ricerca per nome: apri la struttura e copia l’indirizzo che comincia con /hotel/.'
        )
      }

      sito.booking = {
        ...sito.booking,
        mode: 'link',
        link: { ...(sito.booking?.link || {}), url, channel: canale },
      }
      scriviSito(a.slug, sito)

      const tolti = grezzo.length - url.length

      return {
        demo: `/${a.slug}`,
        collegato_a: url,
        ...(tolti > 0
          ? {
              ripulito: `Tolti ${tolti} caratteri di parametri di sessione (aid, label, sid, srepoch…): sono la ` +
                'tua sessione e la ricerca da cui arrivavi, scadono e farebbero comportare male il link.',
            }
          : {}),
        come_si_comporta:
          'Chi sceglie 22–29 agosto per 2 persone apre la scheda della struttura con quelle date e quegli ospiti già impostati.',
        esempio: `${url}?checkin=2026-08-22&checkout=2026-08-29&group_adults=2&no_rooms=1`,
      }
    },
  },

  {
    name: 'controlla_demo',
    description:
      'Dice cosa manca a una demo per essere presentabile: campi vuoti, foto assenti, sezioni senza contenuto.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: { slug: { type: 'string' } },
    },
    esegui: (a) => {
      const sito = leggiSito(a.slug)
      return { demo: `/${a.slug}`, foto_presenti: contaFoto(a.slug), mancanze: cosaManca(sito) }
    },
  },

  {
    name: 'esporta_demo',
    description:
      'Prepara il file da caricare nel pannello del sito vero per mettere live la demo. Serve l’indirizzo pubblico del portale, perché le foto diventino scaricabili.',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string' },
        base: {
          type: 'string',
          description: 'Indirizzo del portale, es. https://demo.tuodominio.it. Se manca si usa DEMO_BASE_URL.',
        },
      },
    },
    esegui: (a) => {
      const base = (a.base || process.env.DEMO_BASE_URL || '').replace(/\/+$/, '')
      if (!/^https?:\/\//i.test(base)) {
        throw new Error(
          'Serve l’indirizzo pubblico del portale (base), per esempio https://demo.tuodominio.it: ' +
            'è da lì che il sito del cliente scaricherà le foto durante l’importazione.'
        )
      }
      return esportaPerLive(slugValido(a.slug), base)
    },
  },

  {
    name: 'elimina_demo',
    description:
      'Cancella una demo e le sue foto. Serve conferma esplicita perché non si torna indietro.',
    inputSchema: {
      type: 'object',
      required: ['slug', 'conferma'],
      properties: {
        slug: { type: 'string' },
        conferma: { type: 'boolean', description: 'Deve valere true.' },
      },
    },
    esegui: (a) => {
      if (a.conferma !== true) throw new Error('Serve conferma esplicita: passa conferma: true.')
      const slug = slugValido(a.slug)
      rmSync(dentro(CARTELLA_DEMO, slug), { recursive: true, force: true })
      rmSync(dentro(CARTELLA_FOTO, slug), { recursive: true, force: true })
      return `Demo "${slug}" eliminata, foto comprese.`
    },
  },
]

/**
 * Trasforma una demo in un file importabile dal sito vero.
 *
 * Le foto passano da percorsi locali (/demo/slug/hero.jpg) a indirizzi
 * completi: l'import del sito del cliente li scarica e se li rimette
 * nel proprio spazio. È l'unico momento in cui il portale deve essere
 * raggiungibile; dopo, il sito del cliente non dipende più da lui.
 */
function esportaPerLive(slug, base) {
  const sito = leggiSito(slug)
  const mancanti = []
  let assolute = 0

  const assoluto = (p) => {
    if (typeof p !== 'string' || !p.trim()) return p
    if (/^https?:\/\//i.test(p)) return p
    if (!p.startsWith('/')) return p
    if (!existsSync(join(PROGETTO, 'public', p.replace(/^\//, '')))) mancanti.push(p)
    assolute++
    return base + p
  }

  sito.hero = sito.hero || {}
  sito.hero.image = assoluto(sito.hero.image)
  sito.hero.video = assoluto(sito.hero.video)
  if (sito.story) sito.story.image = assoluto(sito.story.image)
  if (sito.breakfast) sito.breakfast.image = assoluto(sito.breakfast.image)
  if (sito.checkin) sito.checkin.image = assoluto(sito.checkin.image)
  if (sito.brand) sito.brand.logo = assoluto(sito.brand.logo)
  if (sito.seo) sito.seo.ogImage = assoluto(sito.seo.ogImage)
  for (const g of sito.gallery || []) if (g) g.src = assoluto(g.src)
  for (const u of sito.units || []) {
    if (!u) continue
    u.cover = assoluto(u.cover)
    if (Array.isArray(u.gallery)) u.gallery = u.gallery.map(assoluto)
  }

  delete sito.vetrina
  delete sito.slug

  const uscita = dentro(PROGETTO, 'export')
  mkdirSync(uscita, { recursive: true })
  const file = join(uscita, `${slug}.json`)
  writeFileSync(
    file,
    JSON.stringify(
      { _formato: 'staykit/sito', _versione: 1, _origine: `demo/${slug}`, _esportato: new Date().toISOString(), ...sito },
      null,
      2
    ) + '\n'
  )

  return {
    file: `export/${slug}.json`,
    foto_trasformate: assolute,
    foto_mancanti: mancanti,
    come_si_mette_live: [
      `Il portale dev'essere raggiungibile a ${base}: l'import scarica le foto da lì.`,
      'Nel pannello del sito vero: attiva il modo rivenditore.',
      'Vai su «Esporta e importa» → Importa un sito → scegli questo file.',
      'Lascia acceso «scarica le foto»: da quel momento il sito non dipende più dal portale.',
    ],
  }
}

/**
 * Controlla che ogni indirizzo sia davvero un'immagine, e utilizzabile.
 *
 * Serve perché l'estrattore lavora sul testo della pagina: riconosce
 * gli indirizzi, non sa cosa c'è dall'altra parte. Un link può essere
 * morto, o portare a un'icona da 3 KB che sul sito diventerebbe una
 * macchia sfocata a tutto schermo.
 *
 * Si usa HEAD, che scarica solo le intestazioni: sessanta controlli
 * costano quanto una foto.
 */
async function verificaImmagini(elenco) {
  const MINIMO = 25 * 1024 // sotto è un'icona, non una fotografia
  const buone = []

  await Promise.all(
    elenco.map(async (f) => {
      try {
        const r = await fetch(f.url, { method: 'HEAD', redirect: 'follow' })
        if (!r.ok) return
        const tipo = r.headers.get('content-type') || ''
        if (!tipo.startsWith('image/')) return
        const peso = Number(r.headers.get('content-length') || 0)
        // Senza content-length non si può giudicare: si tiene, e nel
        // dubbio è meglio una foto in più che una galleria vuota.
        if (peso && peso < MINIMO) return
        buone.push({ ...f, peso })
      } catch {
        /* irraggiungibile: si scarta in silenzio */
      }
    })
  )

  // L'ordine dell'estrattore ha un senso (og:image per prima): si
  // rimette quello, che Promise.all scompiglia.
  const posizione = new Map(elenco.map((f, i) => [f.url, i]))
  return buone.sort((a, b) => posizione.get(a.url) - posizione.get(b.url))
}

// ── Aiuti ─────────────────────────────────────────────────────

function contaFoto(slug) {
  const dir = join(CARTELLA_FOTO, slug)
  if (!existsSync(dir)) return 0
  return readdirSync(dir).filter((n) => /\.(png|jpe?g|webp|svg)$/i.test(n)).length
}

/**
 * Cosa manca, diviso in due.
 *
 * La distinzione è quella che conta davvero quando prepari una demo:
 * ci sono buchi che puoi ancora chiudere da solo cercando in rete, e
 * buchi per cui devi per forza chiamare il cliente. Metterli nello
 * stesso elenco fa perdere tempo su entrambi i fronti — cerchi cose
 * che non troverai, e non cerchi cose che erano lì.
 */
function cosaManca(s) {
  const vuoto = (v) => !v || (typeof v === 'object' && !Object.values(v).some((x) => String(x || '').trim()))

  const cercabili = []   // si trovano in rete
  const dalCliente = []  // solo lui li sa

  // ── Recuperabili ──
  if (!s.hero?.image) cercabili.push('Foto di apertura — leggi_struttura sulla pagina Booking o sul sito, poi scarica_foto')
  if (!(s.gallery || []).length) cercabili.push('Galleria vuota — scarica_foto con `da_pagina` la riempie in un colpo')
  if (!s.contact?.coords?.lat) cercabili.push('Coordinate della mappa — geocodifica_indirizzo con l’indirizzo completo')
  if (!s.contact?.address?.city) cercabili.push('Città — sta nei dati strutturati di quasi tutte le pagine')
  if (!s.reviews?.rating) cercabili.push('Voto medio — leggi_struttura lo prende dal portale')
  if (!(s.reviews?.items || []).length) cercabili.push('Testi delle recensioni — se il portale le pubblica, leggi_struttura le riporta con autore e data')
  if (!s.contact?.phone) cercabili.push('Telefono — di solito è sul sito ufficiale o su Google Maps')
  if (!(s.units || []).length) cercabili.push('Nessuna camera — i nomi e le descrizioni stanno nella pagina del portale')
  if (vuoto(s.seo?.title)) cercabili.push('Titolo per i motori di ricerca — si scrive da nome + tipologia + città')
  if ((s.posts || []).length < 2) {
    cercabili.push('Meno di due articoli nei «consigli» — «come arrivare» e «dove mangiare» funzionano quasi ovunque')
  }
  if (!(s.offers || []).length) {
    cercabili.push('Nessuna offerta — in una demo si inventano: servono a far vedere come si presentano')
  }
  if (s.booking?.mode !== 'link' || !s.booking?.link?.url) {
    cercabili.push('La barra delle date non porta da nessuna parte — metti il link Booking della struttura in booking.link.url')
  }

  const unitaSenzaFoto = (s.units || []).filter((u) => !u.cover).map((u) => u.name?.it || u.id)
  if (unitaSenzaFoto.length) {
    cercabili.push(`Copertina mancante per: ${unitaSenzaFoto.join(', ')} — di solito il portale ha una foto per camera`)
  }

  // ── Solo il cliente ──
  if (vuoto(s.story?.paragraphs)) {
    dalCliente.push('Racconto della struttura: chi accoglie, da quando, com’è l’edificio. Non inventarlo: è la sezione più letta e il cliente se ne accorge')
  }
  if (!s.contact?.email) dalCliente.push('Email a cui far arrivare le richieste')
  if (!s.contact?.whatsapp) dalCliente.push('Numero WhatsApp, se lo usa')
  if (!s.legal?.company || !s.legal?.vat) dalCliente.push('Ragione sociale e partita IVA, per il piè di pagina')
  if (!s.legal?.cin) dalCliente.push('CIN — obbligatorio per legge sugli annunci: spesso è già scritto sulla pagina del portale')
  if (s.settings?.['booking.show_prices'] && !(s.units || []).some((u) => u.priceFrom)) {
    dalCliente.push('Prezzi indicativi per unità. Se le fonti si contraddicono, meglio spegnere la voce che mostrarne uno sbagliato')
  }
  if (!s.breakfast?.hours && s.settings?.['section.breakfast']) {
    dalCliente.push('Orario della colazione e cosa viene servito')
  }

  return {
    posso_ancora_trovarli: cercabili.length ? cercabili : ['Niente.'],
    servono_dal_cliente: dalCliente.length ? dalCliente : ['Niente.'],
    presentabile: cercabili.length === 0,
  }
}

// ── Protocollo MCP, su stdin/stdout ───────────────────────────
//
//  Implementato a mano invece che con l'SDK: sono un centinaio di
//  righe, e così il progetto non si porta dietro una dipendenza in più
//  per una cosa che gira solo sul tuo computer.

const rl = createInterface({ input: process.stdin })

rl.on('line', async (riga) => {
  let messaggio
  try {
    messaggio = JSON.parse(riga)
  } catch {
    return
  }
  const { id, method, params } = messaggio

  // Le notifiche (senza id) non vogliono risposta.
  if (id === undefined || id === null) return

  try {
    rispondi(id, await gestisci(method, params))
  } catch (err) {
    rispondi(id, null, { code: -32000, message: err.message })
  }
})

async function gestisci(method, params = {}) {
  if (method === 'initialize') {
    return {
      protocolVersion: '2024-11-05',
      capabilities: { tools: {}, prompts: {} },
      serverInfo: { name: 'staykit-demo', version: '1.0.0' },
    }
  }

  if (method === 'prompts/list') {
    return {
      prompts: [
        {
          name: 'crea-demo-da-link',
          description: 'Costruisce una demo completa partendo dal link di una struttura (Booking, sito, Airbnb).',
          arguments: [
            { name: 'link', description: 'Indirizzo della struttura su Booking o sul suo sito', required: true },
            { name: 'nome_cartella', description: 'Come chiamare la demo, es. "le-terrazze"', required: false },
          ],
        },
      ],
    }
  }

  if (method === 'prompts/get') {
    if (params.name !== 'crea-demo-da-link') throw new Error(`Prompt sconosciuto: ${params.name}`)
    return {
      description: 'Procedura completa per costruire una demo dai dati reali di una struttura.',
      messages: [
        { role: 'user', content: { type: 'text', text: istruzioni(params.arguments || {}) } },
      ],
    }
  }

  if (method === 'tools/list') {
    return {
      tools: STRUMENTI.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
    }
  }

  if (method === 'tools/call') {
    const strumento = STRUMENTI.find((t) => t.name === params.name)
    if (!strumento) throw new Error(`Strumento sconosciuto: ${params.name}`)
    const esito = await strumento.esegui(params.arguments || {})
    return {
      content: [{ type: 'text', text: typeof esito === 'string' ? esito : JSON.stringify(esito, null, 2) }],
    }
  }

  if (method === 'ping') return {}

  throw new Error(`Metodo non gestito: ${method}`)
}

/**
 * Le istruzioni operative, in un posto solo.
 *
 * Sono scritte come le direi a voce, con l'ordine giusto e i motivi:
 * un elenco di passi senza il perché viene seguito male appena la
 * situazione si discosta un po' dal caso previsto.
 */
function istruzioni({ link = '', nome_cartella = '' }) {
  return `Costruisci una demo StayKit per questa struttura: ${link || '(indica il link)'}

Procedi così.

1. RACCOGLI, prima di scrivere qualsiasi cosa.
   · leggi_struttura sul link che ti ho dato. Ti restituisce le foto in
     alta risoluzione, le coordinate, il voto, l'indirizzo e i recapiti:
     sono cose che con la sola ricerca web non vedi.
   · Cerca poi il SITO UFFICIALE della struttura e passaci di nuovo
     leggi_struttura: è lì che di solito stanno email, telefono, partita
     IVA e il racconto vero della casa.
   · Se trovi altre pagine (Airbnb, Facebook, Google Maps) usale anche
     quelle: più fonti, meno buchi.

2. CREA la demo con crea_demo${nome_cartella ? ` (nome cartella: ${nome_cartella})` : ''}.
   Scegli la tipologia guardando cosa offre davvero: camere con
   colazione → bnb; camere senza colazione e con check-in autonomo →
   affittacamere; appartamenti con cucina → case_vacanza.
   Passa SEMPRE «bookingUrl» se la struttura è su Booking: la barra
   delle date aprirà la sua pagina con arrivo, partenza e ospiti già
   filtrati, e la dimostrazione arriva fino a un risultato vero.

3. FOTO, subito dopo. È il buco che si vede di più.
   · scarica_foto con gli indirizzi migliori restituiti al punto 1.
   · Metti per prima quella da usare in apertura: sceglila orizzontale e
     che si capisca cos'è il posto, non un dettaglio.
   · Almeno una copertina per camera, se il portale le ha.

4. SCRIVI i contenuti con aggiorna_demo. In italiano e in inglese.
   · Riscrivi con parole tue quello che hai letto, non copiare i testi
     del portale.
   · NON INVENTARE. Se non sai da quanto tempo la famiglia gestisce la
     casa, non scriverlo: lascia la sezione «storia» spenta
     (settings['section.story'] = false) e segnalamelo.
   · Le recensioni si riportano solo se le hai lette davvero, con nome e
     data veri e la fonte. Recensioni inventate a nome di una struttura
     esistente non sono un abbellimento: sono una pratica commerciale
     scorretta.
   · Prezzi: mettili solo se le fonti concordano. Se ballano troppo,
     spegni settings['booking.show_prices'] e dimmelo.

5. CONSIGLI (campo «posts»). ALMENO DUE, sempre. Ogni articolo avrà una
   pagina sua (/nomecliente/blog/<id>) ed è la sezione che fa capire al
   cliente che il sito può portargli visite da Google, non solo esistere.
   · I due che funzionano quasi ovunque: «come arrivare» (dalla
     stazione, dall'aeroporto, dove si parcheggia) e «cosa fare in
     zona» o «dove mangiare».
   · Scrivili sui luoghi veri intorno alla struttura, che conosci dalla
     ricerca: distanze, mezzi, orari indicativi, cosa evitare.
   · Consigli che restano validi per anni, non notizie.
   · «id» in minuscole con trattini: diventa l'indirizzo della pagina.
   · Titolo, etichetta, anteprima di due righe e testo a paragrafi.

6. OFFERTE (campo «offers»). DUE O TRE, inventate pure.
   Sono le promozioni che spingono a prenotare dal sito invece che dal
   portale: «7 notti, la settima gratis», «−15% prenotando 60 giorni
   prima», «seconda notte a metà a novembre».
   In una demo sono PROPOSTE, non impegni: servono a far vedere come si
   presentano. Scrivi sempre le condizioni (periodo, notti minime), e
   quando consegni la demo dì al cliente che sono esempi da confermare.

7. PRENOTAZIONI. Se la struttura è su Booking, usa collega_booking.
   La barra delle date smette di raccogliere una richiesta (che in una
   demo non arriva a nessuno) e apre la pagina del portale con arrivo,
   partenza e ospiti già filtrati: la dimostrazione arriva fino a un
   risultato vero, ed è il momento in cui il cliente capisce.
   Serve l'indirizzo della SCHEDA — quello che comincia con /hotel/ —
   non una pagina di ricerca: Booking non applica i filtri a una
   ricerca per nome e riporta alla home con i campi vuoti. Cercala,
   aprila, copia l'indirizzo dalla barra del browser: i parametri di
   sessione li tolgo io.
   Se non riesci a trovarla, dillo e chiedila: è meglio una barra che
   raccoglie una richiesta che una che porta in un posto sbagliato.

8. COORDINATE. Se leggi_struttura non le ha trovate, usa
   geocodifica_indirizzo con l'indirizzo completo. Controlla che il
   risultato sia nella città giusta prima di scriverlo.

9. CONTROLLA con controlla_demo e riportami due elenchi distinti:
   cosa hai lasciato indietro ma si può ancora trovare in rete, e cosa
   devo chiedere al cliente. Non mescolarli.`
}

function rispondi(id, result, error) {
  const messaggio = error ? { jsonrpc: '2.0', id, error } : { jsonrpc: '2.0', id, result }
  process.stdout.write(JSON.stringify(messaggio) + '\n')
}

// Tutto ciò che non è protocollo va su stderr: una riga di troppo su
// stdout e il canale JSON-RPC si rompe.
process.on('uncaughtException', (err) => {
  process.stderr.write(`[staykit-demo] ${err.stack || err.message}\n`)
})
