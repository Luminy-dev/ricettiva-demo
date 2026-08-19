import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/i18n'
import { useSite, useStyles } from '@/lib/site'
import { useNavLinks, scrollToSection } from '@/lib/nav'
import { cn, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'
import LanguageSwitcher from '@/components/LanguageSwitcher'

// ─────────────────────────────────────────────────────────────
//  StayKit — Intestazione
//
//  Una sola implementazione, tre vestiti:
//   · glass    → dock flottante in vetro che si stacca dal bordo
//   · heritage → barra classica, marchio centrato, filetto sotto
//   · noir     → barra sottile, maiuscoletto spaziato, quasi invisibile
// ─────────────────────────────────────────────────────────────

export default function Header() {
  const { ui } = useI18n()
  const s = useStyles()
  const { site, themeId } = useSite()
  const links = useNavLinks()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // ── Quanto spazio serve alle voci, e quanto ce n'è ──
  //
  //  Su desktop la barra resta sempre visibile: il menu a scomparsa è
  //  roba da mobile. Quando lo spazio si stringe non si nasconde niente,
  //  si riducono corpo del testo e spaziature.
  //
  //  Non basterebbe un punto di rottura fisso: il numero di voci cambia
  //  con la tipologia di struttura e con i moduli attivi, e la lunghezza
  //  delle parole cambia con la lingua (in tedesco «Ausstattung» è il
  //  doppio di «Servizi»). Quindi si misura.
  //
  //  Tre livelli: normale, compatto, stretto. Ogni cambio di livello fa
  //  rimisurare, e in un paio di passaggi si assesta.
  const barraRef = useRef(null)
  const navRef = useRef(null)
  const azioniRef = useRef(null)
  const [densita, setDensita] = useState(0)

  useLayoutEffect(() => {
    const misura = () => {
      const barra = barraRef.current
      const nav = navRef.current
      const azioni = azioniRef.current
      if (!barra || !nav || !azioni || nav.scrollWidth === 0) return

      const marchio = barra.firstElementChild?.getBoundingClientRect().width || 0
      const disponibile = barra.clientWidth - marchio - azioni.getBoundingClientRect().width - 32
      const serve = nav.scrollWidth

      setDensita((livello) => {
        if (serve > disponibile && livello < 2) return livello + 1
        // Per tornare più larghi serve un margine, altrimenti alle
        // larghezze di confine la barra oscillerebbe fra due livelli.
        if (serve < disponibile - 56 && livello > 0) return livello - 1
        return livello
      })
    }

    misura()
    const osservatore = new ResizeObserver(misura)
    if (barraRef.current) osservatore.observe(barraRef.current)
    return () => osservatore.disconnect()
  }, [links, themeId, densita])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Evidenzia la voce della sezione visibile
  useEffect(() => {
    if (!links.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0.1, 0.5] }
    )
    links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [links])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    scrollToSection(id)
  }

  const centered = themeId === 'heritage'

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          themeId === 'glass' ? (scrolled ? 'py-2.5' : 'py-4') : 'py-0'
        )}
      >
        <div className={cn(themeId === 'glass' ? s.container : 'w-full')}>
          <div
            ref={barraRef}
            className={cn(
              'flex items-center gap-4 transition-all duration-500',
              themeId === 'glass' && cn(s.glassBar, 'px-3 py-2', !scrolled && 'border-transparent bg-transparent shadow-none backdrop-blur-0'),
              themeId === 'heritage' &&
                cn('border-b px-5 sm:px-8', scrolled ? 'border-line bg-surface/95 backdrop-blur-theme py-3' : 'border-transparent py-5'),
              themeId === 'noir' &&
                cn('px-5 sm:px-8', scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-theme py-3' : 'py-6'),
              centered && 'flex-col gap-3 lg:flex-row'
            )}
          >
            {/* Marchio */}
            <a
              href="#home"
              onClick={go('home')}
              className={cn('flex shrink-0 items-center gap-2.5', centered && 'lg:flex-1')}
            >
              {site.brand?.logo ? (
                <img src={safeMediaUrl(site.brand.logo)} alt={site.brand.name} className="h-9 w-auto object-contain" />
              ) : (
                <span
                  className={cn(
                    'font-display leading-none text-ink',
                    themeId === 'noir' ? 'text-lg tracking-[0.14em] uppercase' : 'text-xl font-bold tracking-tight'
                  )}
                >
                  {site.brand?.logoText || site.brand?.name}
                </span>
              )}
            </a>

            {/* Navigazione desktop */}
            <nav ref={navRef} className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className={cn(s.navLink, s.navSize[densita], active === l.id && s.navLinkActive)}
                >
                  {l.label}
                </a>
              ))}
            </nav>

            {/* Azioni */}
            <div
              ref={azioniRef}
              className={cn('ml-auto flex shrink-0 items-center gap-2', centered && 'lg:flex-1 lg:justify-end')}
            >
              <LanguageSwitcher />
              {site.contact?.phone && (
                <a
                  href={`tel:${site.contact.phoneRaw || site.contact.phone}`}
                  className={cn(s.btnIcon, densita > 0 ? 'hidden' : 'hidden sm:inline-flex')}
                  aria-label={ui('cta.call')}
                >
                  <Icon name="phone" size={17} />
                </a>
              )}
              <a href="#home" onClick={go('home')} className={cn(s.btnPrimary, 'hidden sm:inline-flex')}>
                {ui('cta.book')}
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(s.btnIcon, 'lg:hidden')}
                aria-label={ui('nav.menu')}
              >
                <Icon name="menu" size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile a tutto schermo */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-theme lg:hidden"
          >
            <div className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-ink">{site.brand?.name}</span>
                <button type="button" onClick={() => setOpen(false)} className={s.btnIcon} aria-label={ui('nav.close')}>
                  <Icon name="close" size={20} />
                </button>
              </div>

              <nav className="mt-10 flex flex-1 flex-col gap-1 overflow-y-auto">
                {links.map((l, i) => (
                  <motion.a
                    key={l.key}
                    href={`#${l.id}`}
                    onClick={go(l.id)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className={cn(s.h3, 'border-b border-line py-4')}
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-3">
                <a href="#home" onClick={go('home')} className={s.btnPrimary}>
                  {ui('cta.book')}
                </a>
                {site.contact?.phone && (
                  <a href={`tel:${site.contact.phoneRaw || site.contact.phone}`} className={s.btnSecondary}>
                    <Icon name="phone" size={16} /> {site.contact.phone}
                  </a>
                )}
                <div className="pt-1">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
