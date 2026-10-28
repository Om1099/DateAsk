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

/**
 * Lazy photo with a soft shimmer while loading and a gentle placeholder if the image can't load.
 * `position` is the crop's focal point (CSS object-position, e.g. '50% 20%' keeps faces in frame).
 * `fit="contain"` shows the whole picture, with a blurred copy of it filling the rest of the frame.
 */
export function Photo({ src, alt, className, sizes, eager = false, position, fit = 'cover' }) {
  const [state, setState] = useState(src ? 'loading' : 'error')
  const srcSet = useMemo(() => unsplashSrcSet(src), [src])
  const contain = fit === 'contain'
  const shown = state === 'loaded' ? 'opacity-100' : 'opacity-0'

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
        <>
          {contain && (
            <img
              src={src}
              alt=""
              aria-hidden
              draggable={false}
              className={cn('absolute inset-0 h-full w-full scale-125 object-cover blur-2xl transition-opacity duration-1000', shown)}
            />
          )}
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
            style={position ? { objectPosition: position } : undefined}
            className={cn(
              'absolute inset-0 h-full w-full transition-[opacity,transform] duration-1000 ease-silk',
              contain ? 'object-contain drop-shadow-[0_6px_18px_rgb(71_54_58/0.25)]' : 'object-cover',
              state === 'loaded' ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0',
            )}
          />
        </>
      )}
    </div>
  )
}
