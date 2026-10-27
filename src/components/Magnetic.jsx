import { motion, useSpring } from 'motion/react'
import { useFinePointer } from '../hooks/useMediaQuery'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { cn } from '../lib/utils'

const SPRING = { stiffness: 220, damping: 15, mass: 0.5 }

/** Lets its child drift gently toward the cursor. Mouse users only; inert on touch & reduced motion. */
export function Magnetic({ children, strength = 0.25, className }) {
  const fine = useFinePointer()
  const reduce = useReducedMotionPreference()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)
  const enabled = fine && !reduce

  const onPointerMove = (e) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    // the padding / negative margin widens the "pull" zone without changing layout
    <motion.div
      className={cn('-m-3 inline-block p-3', className)}
      style={enabled ? { x, y } : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
