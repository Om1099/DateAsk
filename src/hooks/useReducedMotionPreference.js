import { useReducedMotion } from 'motion/react'

/** `true` when the visitor's device asks for reduced motion. Always a boolean. */
export function useReducedMotionPreference() {
  return Boolean(useReducedMotion())
}
