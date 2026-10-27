import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../lib/utils'

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 }

/** Perspective tilt that follows the mouse, with a moving glare highlight. Touch input is ignored. */
export function TiltCard({ children, max = 12, className }) {
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)
  const scale = useSpring(1, SPRING)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useSpring(0, SPRING)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / .55), transparent 55%)`

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max * 2)
    rotateX.set((0.5 - py) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  const onPointerEnter = (e) => {
    if (e.pointerType !== 'mouse') return
    scale.set(1.05)
    glareOpacity.set(1)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
    glareOpacity.set(0)
  }

  return (
    <motion.div
      className={cn('relative', className)}
      style={{ rotateX, rotateY, scale, transformPerspective: 900 }}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ background: glare, opacity: glareOpacity }}
      />
    </motion.div>
  )
}
