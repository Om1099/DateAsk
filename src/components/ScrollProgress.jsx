import { motion, useScroll, useSpring } from 'motion/react'

/** A hairline at the very top that fills as she scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-linear-to-r from-dusty-rose via-burgundy to-rose-gold"
    />
  )
}
