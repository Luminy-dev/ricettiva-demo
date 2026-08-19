// ─────────────────────────────────────────────────────────────
//  StayKit — Preset di animazione per tema
//
//  Ogni tema ha un suo "carattere" di movimento:
//   · glass    → molla morbida, elementi che salgono e si mettono a fuoco
//   · heritage → dissolvenze sobrie, poco movimento, niente scale
//   · noir     → lento e cinematografico, lunghe entrate con blur
// ─────────────────────────────────────────────────────────────

const glass = {
  reveal: {
    hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
    },
  },
  stagger: 0.08,
  hoverCard: { y: -6, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  tap: { scale: 0.97 },
  heroDuration: 1.1,
}

const heritage = {
  reveal: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  },
  stagger: 0.1,
  hoverCard: { y: -3, transition: { duration: 0.35, ease: 'easeOut' } },
  tap: { scale: 0.99 },
  heroDuration: 1.3,
}

const noir = {
  reveal: {
    hidden: { opacity: 0, y: 34, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.15, ease: [0.16, 1, 0.3, 1] },
    },
  },
  stagger: 0.14,
  hoverCard: { y: -4, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  tap: { scale: 0.985 },
  heroDuration: 1.8,
}

export const MOTION = { glass, heritage, noir }

export function motionFor(themeId) {
  return MOTION[themeId] || MOTION.glass
}

/** Variants per il contenitore di una lista con entrata scaglionata. */
export function staggerContainer(themeId, delay = 0) {
  const m = motionFor(themeId)
  return {
    hidden: {},
    show: { transition: { staggerChildren: m.stagger, delayChildren: delay } },
  }
}
