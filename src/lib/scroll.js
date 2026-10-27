export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Smoothly scrolls to a selector, element or pixel offset (instantly when reduced motion is on). */
export function scrollToSection(target, { offset = 0 } = {}) {
  let top
  if (typeof target === 'number') {
    top = target
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    top = el.getBoundingClientRect().top + window.scrollY + offset
  }
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
}

/** Resolves once the page has (nearly) reached `top`, or after `timeout` ms. */
export function waitForScroll(top = 0, timeout = 3500) {
  return new Promise((resolve) => {
    const start = performance.now()
    const check = () => {
      if (Math.abs(window.scrollY - top) < 2 || performance.now() - start > timeout) resolve()
      else requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  })
}

let lockCount = 0
let previousOverflow = ''

/** Locks page scrolling (used by dialogs). Returns the matching unlock function. */
export function lockScroll() {
  const root = document.documentElement
  if (lockCount++ === 0) {
    previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
  }
  return () => {
    if (--lockCount === 0) root.style.overflow = previousOverflow
  }
}
