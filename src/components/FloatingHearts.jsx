import { useMemo } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HeartIcon } from './HeartIcon'

const TONES = ['#703d4b', '#8a4d5e', '#d99baa', '#b88670', '#ffffff', '#efc6d0']

/** A few seconds of hearts rising through the section after “yes”. */
export function FloatingHearts({ show, count = 18 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: 4 + Math.random() * 92,
        size: 14 + Math.random() * 22,
        rise: 420 + Math.random() * 380,
        drift: (Math.random() - 0.5) * 100,
        duration: 3.2 + Math.random() * 1.6,
        delay: Math.random() * 1.2,
        rotate: Math.random() * 50 - 25,
        color: TONES[i % TONES.length],
      })),
    // `show` is a dependency on purpose: a fresh scatter every time the celebration starts
    [count, show],
  )

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="hearts"
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          {hearts.map((h, i) => {
            const timing = { duration: h.duration, delay: h.delay, times: [0, 0.15, 0.75, 1] }
            return (
              <motion.span
                key={i}
                className="absolute bottom-0"
                style={{ left: `${h.x}%` }}
                initial={{ y: 40, x: 0, opacity: 0, scale: 0.5, rotate: 0 }}
                animate={{ y: -h.rise, x: h.drift, opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.9], rotate: h.rotate }}
                transition={{ duration: h.duration, delay: h.delay, ease: 'easeOut', opacity: timing, scale: timing }}
              >
                <HeartIcon style={{ width: h.size, height: h.size, color: h.color }} />
              </motion.span>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
