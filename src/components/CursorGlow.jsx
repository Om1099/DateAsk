import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useFinePointer } from '../hooks/useMediaQuery'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'

const SPRING = { stiffness: 110, damping: 22, mass: 0.6 }

/** A soft blush glow that trails the mouse on desktop. One element, no particles. */
export function CursorGlow() {
  const fine = useFinePointer()
  const reduce = useReducedMotionPreference()
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)
  const seen = useRef(false)
  const [visible, setVisible] = useState(false)
  const enabled = fine && !reduce

  useEffect(() => {
    if (!enabled) return
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      if (!seen.current) {
        // first sighting: appear under the cursor instead of sweeping in from off-screen
        sx.jump(e.clientX)
        sy.jump(e.clientY)
        seen.current = true
      }
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y, sx, sy])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] -ml-[18rem] -mt-[18rem] h-[36rem] w-[36rem] rounded-full"
      style={{
        x: sx,
        y: sy,
        background: 'radial-gradient(closest-side, rgb(246 220 226 / .6), rgb(243 230 213 / .3) 45%, transparent 72%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    />
  )
}
