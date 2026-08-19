/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────
//  StayKit — Tailwind
//
//  I colori NON sono fissi: puntano a variabili CSS impostate dal
//  tema attivo (src/themes/tokens.js) e sovrascrivibili dal cliente
//  dal pannello admin. Così `bg-brand` significa "il colore primario
//  del tema corrente", qualunque esso sia.
// ─────────────────────────────────────────────────────────────
const v = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="noir"]'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: v('--c-bg'), alt: v('--c-bg-alt'), deep: v('--c-bg-deep') },
        surface: { DEFAULT: v('--c-surface'), raised: v('--c-surface-raised') },
        ink: { DEFAULT: v('--c-ink'), soft: v('--c-ink-soft'), muted: v('--c-ink-muted') },
        line: { DEFAULT: v('--c-line'), strong: v('--c-line-strong') },
        brand: { DEFAULT: v('--c-brand'), soft: v('--c-brand-soft'), deep: v('--c-brand-deep'), ink: v('--c-brand-ink') },
        accent: { DEFAULT: v('--c-accent'), soft: v('--c-accent-soft') },
        ok: v('--c-ok'),
        warn: v('--c-warn'),
        danger: v('--c-danger'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        theme: 'var(--radius)',
        'theme-lg': 'var(--radius-lg)',
        'theme-xl': 'var(--radius-xl)',
      },
      boxShadow: {
        theme: 'var(--shadow-card)',
        'theme-lg': 'var(--shadow-float)',
        glow: 'var(--shadow-glow)',
      },
      backdropBlur: {
        theme: 'var(--blur)',
      },
      letterSpacing: {
        label: '0.24em',
        wider2: '0.14em',
      },
      maxWidth: {
        content: '1220px',
        prose2: '68ch',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pan-slow': {
          '0%,100%': { transform: 'scale(1.06) translate3d(0,0,0)' },
          '50%': { transform: 'scale(1.12) translate3d(-1.5%,-1%,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.22,1,.36,1) both',
        float: 'float 7s ease-in-out infinite',
        'pan-slow': 'pan-slow 26s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'pulse-ring': 'pulse-ring 2.6s ease-out infinite',
      },
    },
  },
  plugins: [],
}
