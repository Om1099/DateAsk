import { useEffect } from 'react'
import { lockScroll } from '../lib/scroll'

/** Prevents the page behind a dialog from scrolling while `active` is true. */
export function useScrollLock(active) {
  useEffect(() => (active ? lockScroll() : undefined), [active])
}
