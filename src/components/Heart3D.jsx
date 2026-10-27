import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useFinePointer } from '../hooks/useMediaQuery'
import { HeartBurst } from './HeartBurst'

const HEART = 'M100 170C40 125 8 92 8 55 8 25 32 6 58 6c20 0 34 12 42 26 8-14 22-26 42-26 26 0 50 19 50 49 0 37-32 70-92 115z'
const DEPTH_LAYERS = 10

/** Darker copies stacked behind the face along Z give the heart real thickness when it tilts. */
function DepthLayer({ index }) {
  const t = index / DEPTH_LAYERS
  const shade = `rgb(${Math.round(196 - 50 * t)} ${Math.round(88 - 30 * t)} ${Math.round(116 - 30 * t)})`
  return (
    <svg
      viewBox="0 0 200 180"
      className="absolute inset-0 h-full w-full"
      style={{ transform: `translateZ(${-index * 1.7}px)` }}
      aria-hidden
    >
      <path d={HEART} fill={shade} />
    </svg>
  )
}

function HeartFace() {
  return (
    <svg viewBox="0 0 200 180" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="h3d-base" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffd0db" />
          <stop offset="0.45" stopColor="#f293ab" />
          <stop offset="1" stopColor="#c5577a" />
        </linearGradient>
        <radialGradient id="h3d-shade" cx="0.72" cy="0.85" r="0.75">
          <stop offset="0.35" stopColor="#7a2343" stopOpacity="0" />
          <stop offset="1" stopColor="#7a2343" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id="h3d-shine" cx="0.3" cy="0.25" r="0.45">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h3d-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3e8" />
          <stop offset="0.5" stopColor="#e0bfb8" />
          <stop offset="1" stopColor="#b76e79" />
        </linearGradient>
      </defs>
      <path d={HEART} fill="url(#h3d-base)" />
      <path d={HEART} fill="url(#h3d-shade)" />
      <path d={HEART} fill="url(#h3d-shine)" />
      <ellipse cx="58" cy="44" rx="24" ry="11" transform="rotate(-32 58 44)" fill="#fff" opacity="0.55" />
      <ellipse cx="84" cy="30" rx="5" ry="3" transform="rotate(-20 84 30)" fill="#fff" opacity="0.7" />
      <path d={HEART} fill="none" stroke="url(#h3d-rim)" strokeWidth="2.5" opacity="0.7" />
    </svg>
  )
}

/** The floating, breathing, cursor-tilting 3D heart. Click it for a burst of love. */
export function Heart3D() {
  const fine = useFinePointer()
  const reduceMotion = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-24, 24]), { stiffness: 80, damping: 14 })
  const rotateX = useSpring(useTransform(my, [-1, 1], [18, -18]), { stiffness: 80, damping: 14 })
  const [bursts, setBursts] = useState([])

  // mouse users steer the tilt; touch users get a slow idle sway instead
  useEffect(() => {
    if (fine) {
      const onMove = (e) => {
        mx.set((e.clientX / window.innerWidth) * 2 - 1)
        my.set((e.clientY / window.innerHeight) * 2 - 1)
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => window.removeEventListener('pointermove', onMove)
    }
    if (reduceMotion) return
    const controls = animate(mx, [-0.6, 0.6], { duration: 4.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' })
    return () => controls.stop()
  }, [fine, reduceMotion, mx, my])

  const burst = () => {
    const id = Date.now()
    setBursts((b) => [...b, id])
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1300)
  }

  return (
    <div className="relative grid h-36 w-40 place-items-center sm:h-44 sm:w-48">
      {/* soft halo + expanding rings */}
      <span
        aria-hidden
        className="glow-orb absolute -inset-16 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(244 184 197 / .55), transparent)' }}
      />
      <span aria-hidden className="heart-ring absolute inset-[8%] rounded-full" />
      <span aria-hidden className="heart-ring heart-ring--late absolute inset-[8%] rounded-full" />

      {/* floor shadow breathes opposite to the float */}
      <motion.span
        aria-hidden
        className="absolute -bottom-7 left-1/2 h-5 w-28 -translate-x-1/2 rounded-[50%]"
        style={{ background: 'radial-gradient(closest-side, rgb(143 79 90 / .35), transparent)' }}
        animate={{ scaleX: [1, 0.78, 1], opacity: [0.7, 0.4, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.button
          type="button"
          aria-label="Send a little love"
          onClick={burst}
          className="relative block h-full w-full cursor-pointer rounded-full"
          style={{ rotateX, rotateY, transformPerspective: 700, transformStyle: 'preserve-3d' }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          whileTap={{ scale: 0.9 }}
        >
          {Array.from({ length: DEPTH_LAYERS }, (_, i) => (
            <DepthLayer key={i} index={DEPTH_LAYERS - i} />
          ))}
          <HeartFace />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {bursts.map((id) => (
          <HeartBurst key={id} count={14} distance={150} size={20} />
        ))}
      </AnimatePresence>
    </div>
  )
}
