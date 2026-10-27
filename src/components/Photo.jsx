import { useState } from 'react'
import { HeartIcon } from './HeartIcon'
import { cn } from '../lib/utils'

/** Lazy image that fades in on load and falls back to a soft placeholder if the URL breaks. */
export function Photo({ src, alt, className, eager = false }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-linear-to-br from-blush-100 to-blush-200', className)}>
      {failed ? (
        <div className="absolute inset-0 grid place-items-center">
          <HeartIcon className="h-10 w-10 text-blush-300" />
        </div>
      ) : (
        <img
          ref={(el) => {
            if (el?.complete && el.naturalWidth) setLoaded(true)
          }}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-1000 ease-silk',
            loaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
          )}
        />
      )}
    </div>
  )
}
