import { motion } from 'framer-motion'
import { EASE_SILK } from '../lib/utils'

/** Fades + lifts + gently scales its children into view the first time they enter the viewport. */
export function Reveal({ children, as = 'div', delay = 0, y = 48, scale = 0.97, amount = 0.3, className, ...rest }) {
  const Component = motion[as] ?? motion.div
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, ease: EASE_SILK, delay }}
      {...rest}
    >
      {children}
    </Component>
  )
}
