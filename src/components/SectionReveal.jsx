import { motion } from 'motion/react'
import { EASE_SILK } from '../lib/utils'

/**
 * Fades, lifts and gently scales its children in the first time they enter the viewport.
 * `amount` is kept low so even very tall blocks always finish revealing.
 */
export function SectionReveal({ children, as = 'div', delay = 0, y = 40, scale = 0.98, amount = 0.2, className, ...rest }) {
  const Component = motion[as] ?? motion.div
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, ease: EASE_SILK, delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}
