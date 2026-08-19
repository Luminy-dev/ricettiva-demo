import { useState } from 'react'
import { cn, safeMediaUrl } from '@/lib/utils'
import Icon from '@/components/Icon'

// ─────────────────────────────────────────────────────────────
//  StayKit — Immagine con rete di sicurezza
//
//  Le foto le carica il cliente: può mancarne una, può essere un
//  link rotto, può arrivare tardi. Qui gestiamo lazy loading,
//  transizione in ingresso e un segnaposto decoroso: il layout
//  non deve mai collassare per una foto che non c'è.
// ─────────────────────────────────────────────────────────────

export default function SmartImage({
  src: rawSrc,
  alt = '',
  className = '',
  imgClassName = '',
  ratio = '4/3',
  priority = false,
  sizes,
  children,
}) {
  // Unico punto in cui passano tutte le immagini del sito: qui si scarta
  // qualunque indirizzo che non sia http(s) o un percorso interno.
  const src = safeMediaUrl(rawSrc)
  const [state, setState] = useState(src ? 'loading' : 'empty')

  return (
    <div className={cn('relative overflow-hidden bg-bg-alt', className)} style={{ aspectRatio: ratio }}>
      {src && state !== 'error' && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            state === 'ready' ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
        />
      )}

      {(state === 'empty' || state === 'error') && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-alt to-bg-deep text-ink-muted">
          <Icon name="image" size={26} />
        </div>
      )}

      {state === 'loading' && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,.35)_50%,transparent_80%)] bg-[length:200%_100%]" />
      )}

      {children}
    </div>
  )
}
