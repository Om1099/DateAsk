import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon } from './HeartIcon'
import { PASTELS } from '../lib/utils'

/** A radial pop of tiny hearts. Mount it (with a fresh key) to play it once. */
export function HeartBurst({ count = 12, distance = 120, size = 18 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const d = distance * (0.65 + Math.random() * 0.6)
        return {
          x: Math.cos(angle) * d,
          y: Math.sin(angle) * d - distance * 0.25,
          scale: 0.55 + Math.random() * 0.7,
          rotate: Math.random() * 80 - 40,
          color: PASTELS[i % PASTELS.length],
        }
      }),
    [count, distance],
  )

  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: p.scale, opacity: 0, rotate: p.rotate }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.15, 0.85, 0.3, 1] }}
        >
          <HeartIcon style={{ width: size, height: size, color: p.color }} />
        </motion.span>
      ))}
    </span>
  )
}
