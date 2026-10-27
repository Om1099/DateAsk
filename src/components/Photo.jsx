import { useMemo, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '../lib/utils'

/** Builds a responsive srcset for Unsplash URLs (phones download smaller files). */
function unsplashSrcSet(src) {
  if (!src || !src.includes('images.unsplash.com')) return undefined
  try {
    return [480, 800, 1200]
      .map((w) => {
        const url = new URL(src)
        url.searchParams.set('w', String(w))
        return `${url.toString()} ${w}w`
      })
      .join(', ')
  } catch {
    return undefined
  }
}

/** Lazy photo with a soft shimmer while loading and a gentle placeholder if the image can't load. */
export function Photo({ src, alt, className, sizes, eager = false }) {
  const [state, setState] = useState(src ? 'loading' : 'error')
  const srcSet = useMemo(() => unsplashSrcSet(src), [src])

  return (
    <div className={cn('relative overflow-hidden bg-blush', className)}>
      {state === 'loading' && <span aria-hidden className="skeleton" />}
      {state === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[linear-gradient(135deg,var(--blush),var(--champagne))] text-burgundy/70">
          <ImageOff aria-hidden className="h-7 w-7" strokeWidth={1.5} />
          <span className="font-hand text-lg">photo coming soon ♡</span>
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          ref={(el) => {
            if (el?.complete && el.naturalWidth) setState('loaded')
          }}
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? sizes : undefined}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-1000 ease-silk',
            state === 'loaded' ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
          )}
        />
      )}
    </div>
  )
}
