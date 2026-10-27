import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '../lib/utils'

/** Oversized background script word that drifts sideways as its section scrolls past. */
export function ParallaxWord({ children, targetRef, from = '12%', to = '-28%', className }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [from, to])

  return (
    <motion.span
      aria-hidden
      style={{ x }}
      className={cn(
        'pointer-events-none absolute select-none whitespace-nowrap font-display text-[clamp(7rem,24vw,22rem)] font-light italic leading-none text-blush-200/50',
        className,
      )}
    >
      {children}
    </motion.span>
  )
}
