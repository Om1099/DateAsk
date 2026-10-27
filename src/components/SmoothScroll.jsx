import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'

const LenisContext = createContext(null)

/** Inertia ("buttery") wheel scrolling on desktop; native scrolling stays on touch devices. */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const instance = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 })
    let rafId = requestAnimationFrame(function raf(time) {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    })
    setLenis(instance)
    return () => {
      cancelAnimationFrame(rafId)
      instance.destroy()
      setLenis(null)
    }
  }, [reduceMotion])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

/** Smoothly scrolls to a selector, element or pixel offset. */
export function useScrollTo() {
  const lenis = useLenis()
  return useCallback(
    (target, { offset = 0 } = {}) => {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (lenis) {
        lenis.scrollTo(el ?? target, { offset, duration: 1.6 })
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' })
      } else if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
      }
    },
    [lenis],
  )
}

/** Locks page scroll (both Lenis and native) while `locked` is true, e.g. for modals. */
export function useScrollLock(locked) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = prev
    }
  }, [locked, lenis])
}
