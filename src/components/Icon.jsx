// ─────────────────────────────────────────────────────────────
//  StayKit — Set di icone
//
//  SVG inline a tratto (24×24, currentColor): niente librerie da
//  scaricare, pesano pochi KB e prendono il colore del tema.
//  Le chiavi coincidono con quelle usate in config/amenities.js.
// ─────────────────────────────────────────────────────────────

const PATHS = {
  // ── Dotazioni ──
  wifi: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0M12 19.5h.01M2 9a15 15 0 0 1 20 0',
  ac: 'M4 6h16v7H4zM7 16v2M12 16v3M17 16v2M7 9.5h10',
  heat: 'M12 3c2 3-1 4 0 6.5M8 21a4 4 0 0 1 0-8c0-2 1-3 2-4 .5 2 2 2.5 3 4 1.5 1 3 2.5 3 4a4 4 0 0 1-4 4z',
  bath: 'M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM7 12V6a2 2 0 0 1 4 0M6 19l-1 2M18 19l1 2',
  drop: 'M12 3s6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 6-10 6-10z',
  bed: 'M3 18v-9M3 13h18v5M21 18v-5a3 3 0 0 0-3-3H9v3M6.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  towel: 'M6 3h9a2 2 0 0 1 2 2v16H8a2 2 0 0 1-2-2zM17 7h2v14h-4M9 7h4',
  tv: 'M3 5h18v11H3zM8 20h8M12 16v4',
  lock: 'M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3M12 15v2',
  wind: 'M3 8h10a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h7',
  desk: 'M3 8h18M4 8v11M20 8v11M8 12h5M4 4h16v4H4z',
  wardrobe: 'M5 3h14v18H5zM12 3v18M10 11h.5M14 11h.5',
  sound: 'M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4',
  baby: 'M12 3a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4zM10 8h.01M14 8h.01M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2',
  sofa: 'M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 11h18v6H3zM6 17v2M18 17v2',
  coffee: 'M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 9h2a2.5 2.5 0 0 1 0 5h-2M6 3v2M10 3v2M14 3v2M4 21h14',
  kitchen: 'M4 3h16v18H4zM4 9h16M8 6h.01M12 6h.01M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0z',
  fridge: 'M6 3h12v18H6zM6 10h12M9 6.5v2M9 13v2.5',
  dish: 'M4 4h16v16H4zM8 8h8v8H8zM12 8v8M8 12h8',
  leaf: 'M4 20c0-8 5-14 16-15 0 10-5 15-12 15H4zM8 16c2-3 5-5 8-6',
  terrace: 'M3 21V9l9-5 9 5v12M3 13h18M9 21v-5h6v5',
  tree: 'M12 21v-5M7 16h10l-2.5-3H16l-2.5-3H15L12 6 9 10h1.5L8 13h1.5z',
  pool: 'M3 15c1.5 0 1.5 1.5 3 1.5S7.5 15 9 15s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5M3 19c1.5 0 1.5 1.5 3 1.5S7.5 19 9 19s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5M8 15V6a2 2 0 1 1 4 0M16 15V6a2 2 0 0 0-4 0',
  wave: 'M2 9c2.5 0 2.5 2.5 5 2.5S9.5 9 12 9s2.5 2.5 5 2.5S19.5 9 22 9M2 15c2.5 0 2.5 2.5 5 2.5s2.5-2.5 5-2.5 2.5 2.5 5 2.5 2.5-2.5 5-2.5',
  fire: 'M12 3c1 3-2 4.5-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5C17 9 19 11.5 19 14a7 7 0 0 1-14 0c0-4 4-6 7-11z',
  chair: 'M6 4h12v8H6zM6 12l-1 8M18 12l1 8M5 16h14',
  parking: 'M4 3h16v18H4zM9.5 17V8h3a3 3 0 0 1 0 6h-3',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  washer: 'M5 3h14v18H5zM8 6.5h.01M11 6.5h.01M12 17.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM10 13.5c1-1 3-1 4 0',
  luggage: 'M6 7h12v14H6zM9 7V4h6v3M9 21v1M15 21v1M10 11v6M14 11v6',
  bike: 'M6 19a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18 19a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM6 15.5l4.5-7H15l3 7M9 8.5h4M14.5 8.5L16 5h2',
  car: 'M4 16v-3.5L6 8h12l2 4.5V16M4 16h16M4 16v2h2v-2M18 16v2h2v-2M7 12.5h10M7.5 16h.01M16.5 16h.01',
  map: 'M9 4L3 6.5v14L9 18l6 2.5 6-2.5v-14L15 6.5zM9 4v14M15 6.5v14',
  key: 'M15 8a4 4 0 1 1-3.4 6.1L4 21H3v-3l7.9-7.6A4 4 0 0 1 15 8zM16 11h.01',
  lift: 'M5 3h14v18H5zM12 3v18M8.5 9l1-1.5 1 1.5M13.5 15l1 1.5 1-1.5',
  stairs: 'M3 20h4v-4h4v-4h4V8h4V4M3 20v-1',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2',
  paw: 'M7 13a2.5 2.5 0 0 0-2 4c1 1.5 3 2 5 2s4-.5 5-2a2.5 2.5 0 0 0-2-4c-1-1-2-1.5-3-1.5S8 12 7 13zM6.5 9a1.5 2 0 1 0 0-4 1.5 2 0 0 0 0 4zM17.5 9a1.5 2 0 1 0 0-4 1.5 2 0 0 0 0 4zM10.5 6.5a1.3 1.8 0 1 0 0-3.5 1.3 1.8 0 0 0 0 3.5zM13.5 6.5a1.3 1.8 0 1 0 0-3.5 1.3 1.8 0 0 0 0 3.5z',
  nosmoke: 'M4 15h11v3H4zM17 15h3v3h-3M4 4l16 16M15 6c2 0 3 1 3 2.5V11',
  family: 'M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3 20v-3a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v3M14 20v-2.5a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3V20',

  // ── Interfaccia ──
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  arrowUpRight: 'M7 17L17 7M8 7h9v9',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M6 15l6-6 6 6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 6l-6 6 6 6',
  close: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  check: 'M4 12.5l5 5L20 6.5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z',
  phone: 'M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2C10.7 20 4 13.3 4 5a2 2 0 0 1 2-2z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  whatsapp:
    'M3.5 20.5l1.3-4.6A8 8 0 1 1 8 19.2zM9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1.2-.6 1.2-1.2l-1.6-.8-.9 1a5 5 0 0 1-2.6-2.6l1-.9L11 9c-.6 0-1.2.5-2 .5z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.7 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.7-3.5-9s1-6.5 3.5-9z',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4M8.5 14h.01M12 14h.01M15.5 14h.01',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20v-1.5A4.5 4.5 0 0 1 6.5 14h5a4.5 4.5 0 0 1 4.5 4.5V20M17 11a3 3 0 1 0 0-6M18 14h.5a3.5 3.5 0 0 1 3.5 3.5V19',
  ruler: 'M3 15L15 3l6 6L9 21zM7 11l2 2M10 8l2 2M13 5l2 2',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  image: 'M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M8.5 9.5h.01',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6',
  drag: 'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
  save: 'M5 3h11l3 3v15H5zM8 3v6h7V3M8 14h8v7H8z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  spinner: 'M12 3a9 9 0 0 1 9 9',
  warning: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  home: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12c0-.6-.1-1.1-.2-1.6l2-1.5-2-3.4-2.3 1a7 7 0 0 0-2.8-1.6L13.4 2h-3.9l-.3 2.9c-1 .3-2 .9-2.8 1.6l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 3.2l-2 1.5 2 3.4 2.3-1c.8.7 1.8 1.3 2.8 1.6l.3 2.9h3.9l.3-2.9c1-.3 2-.9 2.8-1.6l2.3 1 2-3.4-2-1.5c.1-.5.2-1 .2-1.6z',
  palette: 'M12 21a9 9 0 1 1 0-18c5 0 9 3.6 9 8 0 2.2-1.8 4-4 4h-1.5a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 21zM7.5 12h.01M9.5 8h.01M14 7.5h.01M17 10.5h.01',
  layout: 'M3 4h18v16H3zM3 9h18M9 9v11',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h11',
  upload: 'M12 16V4M8 8l4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  download: 'M12 4v12M8 12l4 4 4-4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  lockOpen: 'M5 11h14v9H5zM8 11V8a4 4 0 0 1 7.5-2',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z',
  sparkles: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7zM5.5 15.5l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5L3.4 18l1.5-.6z',
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.6, ...rest }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}

export function hasIcon(name) {
  return Boolean(PATHS[name])
}

export const ICON_NAMES = Object.keys(PATHS)
