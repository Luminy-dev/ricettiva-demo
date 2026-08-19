import { motion } from 'framer-motion'
import { useMotionPreset } from '@/lib/site'
import { prefersReducedMotion } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
//  StayKit — Entrata allo scroll
//
//  Usa il preset di movimento del tema attivo (glass = molla,
//  heritage = dissolvenza sobria, noir = lento e cinematografico)
//  e rispetta "riduci animazioni" del sistema operativo.
// ─────────────────────────────────────────────────────────────

export default function Reveal({ children, delay = 0, className = '', as = 'div', once = true, amount = 0.25 }) {
  const m = useMotionPreset()
  const Comp = motion[as] || motion.div

  if (prefersReducedMotion()) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: m.reveal.hidden,
        show: {
          ...m.reveal.show,
          transition: { ...m.reveal.show.transition, delay },
        },
      }}
    >
      {children}
    </Comp>
  )
}

/** Contenitore per liste con entrata scaglionata. */
export function RevealGroup({ children, className = '', delay = 0, amount = 0.2 }) {
  const m = useMotionPreset()
  if (prefersReducedMotion()) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: m.stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

/** Figlio di RevealGroup. */
export function RevealItem({ children, className = '', as = 'div' }) {
  const m = useMotionPreset()
  const Comp = motion[as] || motion.div
  if (prefersReducedMotion()) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <Comp className={className} variants={m.reveal}>
      {children}
    </Comp>
  )
}
