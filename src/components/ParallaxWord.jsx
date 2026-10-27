import { motion, useScroll, useTransform } from 'motion/react'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { cn } from '../lib/utils'

/** Oversized background script word that drifts sideways as its section scrolls past. */
export function ParallaxWord({ children, targetRef, from = '12%', to = '-28%', className }) {
  const reduce = useReducedMotionPreference()
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [from, to])

  return (
    <motion.span
      aria-hidden
      style={reduce ? undefined : { x }}
      className={cn(
        'pointer-events-none absolute select-none whitespace-nowrap font-display text-[clamp(6.5rem,22vw,20rem)] font-light italic leading-none text-blush-deep/40',
        className,
      )}
    >
      {children}
    </motion.span>
  )
}
