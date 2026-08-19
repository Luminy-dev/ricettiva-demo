// ─────────────────────────────────────────────────────────────
//  StayKit — "Recipes": le classi che cambiano da tema a tema
//
//  I componenti NON scrivono classi estetiche a mano: chiedono una
//  ricetta (`s.card`, `s.btnPrimary`, …) e il tema attivo decide
//  come si vede. È il meccanismo che permette a un solo set di
//  componenti di rendere tre siti visivamente diversi.
//
//  Uso:  const s = useStyles();  <div className={s.card}> … </div>
// ─────────────────────────────────────────────────────────────

const BASE = {
  container: 'mx-auto w-full max-w-content px-5 sm:px-8',
  section: 'relative py-20 sm:py-28',
  sectionTight: 'relative py-14 sm:py-20',
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  srOnly: 'sr-only',
}

// ───────────────────────── GLASS ─────────────────────────
const glass = {
  ...BASE,
  page: 'bg-bg text-ink font-sans antialiased',

  eyebrow: 'inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-label text-brand',
  h1: 'font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink',
  h2: 'font-display text-[clamp(1.9rem,4.2vw,3.1rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-ink',
  h3: 'font-display text-xl font-bold tracking-[-0.02em] text-ink',
  lead: 'text-[1.0625rem] sm:text-lg leading-relaxed text-ink-soft max-w-prose2',
  body: 'text-[0.975rem] leading-relaxed text-ink-soft',
  small: 'text-sm text-ink-muted',

  surfaceAlt: 'bg-bg-alt/70',
  card:
    'rounded-theme-lg border border-white/70 bg-surface/70 backdrop-blur-theme shadow-theme ' +
    'transition-all duration-500 ease-out',
  cardHover: 'hover:-translate-y-1.5 hover:shadow-theme-lg hover:bg-surface/85',
  panel:
    'rounded-theme-xl border border-white/70 bg-surface/60 backdrop-blur-theme shadow-theme-lg',
  glassBar:
    'rounded-full border border-white/70 bg-surface/70 backdrop-blur-theme shadow-theme',

  btnPrimary:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold ' +
    'text-brand-ink shadow-glow transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 ' +
    'active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 ' + BASE.focus,
  btnSecondary:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-surface/70 ' +
    'px-6 py-3 text-sm font-semibold text-ink backdrop-blur-theme shadow-theme transition-all duration-300 ' +
    'hover:bg-surface hover:-translate-y-0.5 ' + BASE.focus,
  btnGhost:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-soft ' +
    'transition hover:bg-ink/[0.05] hover:text-ink ' + BASE.focus,
  btnIcon:
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-surface/70 ' +
    'text-ink backdrop-blur-theme transition hover:bg-surface ' + BASE.focus,

  input:
    'w-full rounded-theme border border-line bg-surface/80 px-4 py-3 text-[0.95rem] text-ink ' +
    'placeholder:text-ink-muted backdrop-blur-sm transition focus:border-brand ' + BASE.focus,
  label: 'mb-1.5 block text-[0.8rem] font-semibold text-ink-soft',

  chip:
    'whitespace-nowrap inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-surface/70 px-3 py-1.5 ' +
    'text-[0.78rem] font-medium text-ink-soft backdrop-blur-sm',
  badge: 'whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-brand/12 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-wider2 text-brand-deep',
  divider: 'h-px w-full bg-gradient-to-r from-transparent via-line to-transparent',

  imageWrap: 'overflow-hidden rounded-theme-lg',
  imageOverlay: 'bg-gradient-to-t from-ink/55 via-ink/5 to-transparent',
  navLink:
    'whitespace-nowrap rounded-full py-2 font-medium text-ink-soft transition hover:bg-ink/[0.06] hover:text-ink',
  navSize: ['px-4 text-sm', 'px-2.5 text-[0.8rem]', 'px-1.5 text-[0.72rem]'],
  navLinkActive: 'bg-ink/[0.07] text-ink',
}

// ──────────────────────── HERITAGE ───────────────────────
const heritage = {
  ...BASE,
  page: 'bg-bg text-ink font-sans antialiased',

  eyebrow:
    'inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-accent ' +
    'before:h-px before:w-8 before:bg-accent/60',
  h1: 'font-display text-[clamp(2.5rem,6.4vw,4.6rem)] font-normal leading-[1.04] tracking-[-0.012em] text-ink',
  h2: 'font-display text-[clamp(1.85rem,4vw,2.9rem)] font-normal leading-[1.1] tracking-[-0.008em] text-ink',
  h3: 'font-display text-xl font-medium text-ink',
  lead: 'text-[1.0625rem] sm:text-lg leading-[1.75] text-ink-soft max-w-prose2',
  body: 'text-[0.975rem] leading-[1.75] text-ink-soft',
  small: 'text-sm text-ink-muted',

  surfaceAlt: 'bg-bg-alt',
  card: 'rounded-theme border border-line bg-surface shadow-theme transition-all duration-400 ease-out',
  cardHover: 'hover:border-line-strong hover:shadow-theme-lg',
  panel: 'rounded-theme border border-line bg-surface shadow-theme',
  glassBar: 'rounded-theme border border-line bg-surface/95 backdrop-blur-theme shadow-theme',

  btnPrimary:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-theme bg-brand px-7 py-3.5 text-[0.8rem] ' +
    'font-semibold uppercase tracking-wider2 text-brand-ink transition-all duration-300 ' +
    'hover:bg-brand-deep disabled:opacity-50 ' + BASE.focus,
  btnSecondary:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-theme border border-ink/25 bg-transparent px-7 py-3.5 ' +
    'text-[0.8rem] font-semibold uppercase tracking-wider2 text-ink transition-all duration-300 ' +
    'hover:border-ink hover:bg-ink hover:text-bg ' + BASE.focus,
  btnGhost:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-ink-soft ' +
    'underline-offset-4 transition hover:text-ink hover:underline ' + BASE.focus,
  btnIcon:
    'inline-flex h-10 w-10 items-center justify-center rounded-theme border border-line bg-surface ' +
    'text-ink transition hover:border-line-strong ' + BASE.focus,

  input:
    'w-full rounded-theme border border-line bg-surface px-4 py-3 text-[0.95rem] text-ink ' +
    'placeholder:text-ink-muted transition focus:border-brand ' + BASE.focus,
  label: 'mb-1.5 block text-[0.75rem] font-semibold uppercase tracking-wider2 text-ink-muted',

  chip: 'whitespace-nowrap inline-flex items-center gap-1.5 rounded-theme border border-line bg-bg-alt px-3 py-1.5 text-[0.78rem] font-medium text-ink-soft',
  badge:
    'whitespace-nowrap inline-flex items-center gap-1.5 rounded-theme border border-accent/40 bg-accent/10 px-2.5 py-1 ' +
    'text-[0.7rem] font-bold uppercase tracking-wider2 text-accent',
  divider: 'h-px w-full bg-line',

  imageWrap: 'overflow-hidden rounded-theme',
  imageOverlay: 'bg-gradient-to-t from-ink/60 via-ink/10 to-transparent',
  navLink:
    'whitespace-nowrap py-2 font-medium uppercase tracking-wider2 text-ink-soft transition hover:text-ink ' +
    'relative after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:scale-x-0 ' +
    'after:bg-brand after:transition-transform hover:after:scale-x-100',
  navSize: ['px-3 text-[0.82rem]', 'px-2 text-[0.75rem]', 'px-1.5 text-[0.68rem] tracking-wider'],
  navLinkActive: 'text-ink after:scale-x-100',
}

// ────────────────────────── NOIR ─────────────────────────
const noir = {
  ...BASE,
  page: 'bg-bg text-ink font-sans antialiased',
  section: 'relative py-24 sm:py-36',

  eyebrow:
    'inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.36em] text-brand ' +
    'before:h-px before:w-10 before:bg-brand/50',
  h1: 'font-display text-[clamp(2.7rem,7.6vw,5.6rem)] font-light leading-[0.98] tracking-[-0.02em] text-ink',
  h2: 'font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-light leading-[1.06] tracking-[-0.015em] text-ink',
  h3: 'font-display text-xl font-normal text-ink',
  lead: 'text-[1.05rem] sm:text-lg leading-[1.85] text-ink-soft max-w-prose2',
  body: 'text-[0.95rem] leading-[1.85] text-ink-soft',
  small: 'text-sm text-ink-muted',

  surfaceAlt: 'bg-bg-alt',
  card: 'rounded-theme border border-line bg-surface shadow-theme transition-all duration-700 ease-out',
  cardHover: 'hover:border-brand/45 hover:shadow-theme-lg',
  panel: 'rounded-theme border border-line bg-surface/85 backdrop-blur-theme shadow-theme-lg',
  glassBar: 'rounded-theme border border-line bg-bg/80 backdrop-blur-theme',

  btnPrimary:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-theme bg-brand px-8 py-3.5 text-[0.75rem] ' +
    'font-bold uppercase tracking-[0.2em] text-brand-ink transition-all duration-500 ' +
    'hover:bg-brand-soft disabled:opacity-50 ' + BASE.focus,
  btnSecondary:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-theme border border-brand/50 bg-transparent px-8 py-3.5 ' +
    'text-[0.75rem] font-bold uppercase tracking-[0.2em] text-brand transition-all duration-500 ' +
    'hover:border-brand hover:bg-brand/10 ' + BASE.focus,
  btnGhost:
    'whitespace-nowrap inline-flex items-center justify-center gap-2 px-3 py-2 text-[0.78rem] font-medium uppercase ' +
    'tracking-wider2 text-ink-muted transition hover:text-brand ' + BASE.focus,
  btnIcon:
    'inline-flex h-10 w-10 items-center justify-center rounded-theme border border-line bg-surface ' +
    'text-ink transition hover:border-brand/50 hover:text-brand ' + BASE.focus,

  input:
    'w-full rounded-theme border border-line bg-bg-alt px-4 py-3 text-[0.95rem] text-ink ' +
    'placeholder:text-ink-muted transition focus:border-brand ' + BASE.focus,
  label: 'mb-1.5 block text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink-muted',

  chip: 'whitespace-nowrap inline-flex items-center gap-1.5 rounded-theme border border-line bg-surface px-3 py-1.5 text-[0.76rem] text-ink-soft',
  badge:
    'whitespace-nowrap inline-flex items-center gap-1.5 rounded-theme border border-brand/40 bg-brand/10 px-2.5 py-1 ' +
    'text-[0.68rem] font-bold uppercase tracking-[0.2em] text-brand',
  divider: 'h-px w-full bg-gradient-to-r from-transparent via-brand/35 to-transparent',

  imageWrap: 'overflow-hidden rounded-theme',
  imageOverlay: 'bg-gradient-to-t from-bg via-bg/45 to-transparent',
  navLink:
    'whitespace-nowrap py-2 font-medium uppercase tracking-wider2 text-ink-muted transition hover:text-brand',
  navSize: ['px-3 text-[0.78rem]', 'px-2 text-[0.72rem]', 'px-1.5 text-[0.66rem] tracking-wider'],
  navLinkActive: 'text-brand',
}

export const RECIPES = { glass, heritage, noir }

export function recipesFor(themeId) {
  return RECIPES[themeId] || RECIPES.glass
}
