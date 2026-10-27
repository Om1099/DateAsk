import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useFinePointer } from '../hooks/useMediaQuery'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { gradientAt } from '../lib/utils'
import { HeartBurst } from './HeartBurst'

const HEART = 'M100 170C40 125 8 92 8 55 8 25 32 6 58 6c20 0 34 12 42 26 8-14 22-26 42-26 26 0 50 19 50 49 0 37-32 70-92 115z'
const DEPTH = 10

/** Darker copies stacked behind the face along Z give the heart real thickness when it tilts. */
function DepthLayer({ index }) {
  return (
    <svg
      viewBox="0 0 200 180"
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ transform: `translateZ(${-index * 1.6}px)` }}
    >
      <path d={HEART} fill={gradientAt(['#c4788c', '#6f3a49'], index / DEPTH)} />
    </svg>
  )
}

function HeartFace() {
  return (
    <svg viewBox="0 0 200 180" aria-hidden className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="h3d-base" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fde8ed" />
          <stop offset="0.45" stopColor="#e7a2b2" />
          <stop offset="1" stopColor="#b25d76" />
        </linearGradient>
        <radialGradient id="h3d-shade" cx="0.72" cy="0.85" r="0.75">
          <stop offset="0.35" stopColor="#5a2433" stopOpacity="0" />
          <stop offset="1" stopColor="#5a2433" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id="h3d-shine" cx="0.3" cy="0.25" r="0.45">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h3d-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6ec" />
          <stop offset="0.5" stopColor="#f3e6d5" />
          <stop offset="1" stopColor="#b88670" />
        </linearGradient>
      </defs>
      <path d={HEART} fill="url(#h3d-base)" />
      <path d={HEART} fill="url(#h3d-shade)" />
      <path d={HEART} fill="url(#h3d-shine)" />
      <ellipse cx="58" cy="44" rx="24" ry="11" transform="rotate(-32 58 44)" fill="#fff" opacity="0.55" />
      <ellipse cx="84" cy="30" rx="5" ry="3" transform="rotate(-20 84 30)" fill="#fff" opacity="0.7" />
      <path d={HEART} fill="none" stroke="url(#h3d-rim)" strokeWidth="2.5" opacity="0.75" />
    </svg>
  )
}

/**
 * The floating, breathing 3D heart. It leans toward the mouse (or toward a touch for a moment)
 * and bursts into tiny hearts when tapped. It never blocks scrolling on touch screens.
 */
export function Heart3D() {
  const fine = useFinePointer()
  const reduce = useReducedMotionPreference()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-1, 1], [-20, 20]), { stiffness: 90, damping: 15 })
  const rotateX = useSpring(useTransform(my, [-1, 1], [15, -15]), { stiffness: 90, damping: 15 })
  const [hovered, setHovered] = useState(false)
  const [bursts, setBursts] = useState([])
  const settleTimer = useRef()

  useEffect(() => {
    if (!fine || reduce) return
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, reduce, mx, my])

  useEffect(() => () => clearTimeout(settleTimer.current), [])

  const onPointerDown = (e) => {
    if (reduce || e.pointerType === 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      mx.set(0)
      my.set(0)
    }, 700)
  }

  const burst = () => {
    const id = Date.now()
    setBursts((b) => [...b, id])
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1300)
  }

  return (
    <div className="relative grid h-28 w-32 place-items-center sm:h-40 sm:w-44">
      {/* soft halo (brightens on hover) + expanding rings */}
      <motion.span
        aria-hidden
        className="absolute -inset-14"
        animate={{ opacity: hovered ? 1 : 0.75, scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="glow-orb block h-full w-full rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgb(217 155 170 / .45), rgb(246 220 226 / .35) 50%, transparent)' }}
        />
      </motion.span>
      <span aria-hidden className="heart-ring absolute inset-[6%] rounded-full" />
      <span aria-hidden className="heart-ring heart-ring--late absolute inset-[6%] rounded-full" />

      {/* floor shadow breathes opposite to the float */}
      <motion.span
        aria-hidden
        className="absolute -bottom-7 left-1/2 h-5 w-28 -translate-x-1/2 rounded-[50%]"
        style={{ background: 'radial-gradient(closest-side, rgb(112 61 75 / .32), transparent)' }}
        animate={reduce ? undefined : { scaleX: [1, 0.78, 1], opacity: [0.75, 0.45, 0.75] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative h-full w-full"
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.button
          type="button"
          aria-label="Send a little love"
          onClick={burst}
          onPointerDown={onPointerDown}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative block h-full w-full cursor-pointer touch-manipulation rounded-full"
          style={{ rotateX, rotateY, transformPerspective: 700, transformStyle: 'preserve-3d' }}
          animate={reduce ? undefined : { scale: hovered ? 1.07 : [1, 1.06, 1] }}
          transition={
            hovered ? { type: 'spring', stiffness: 260, damping: 16 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
          whileTap={{ scale: 0.9 }}
        >
          {Array.from({ length: DEPTH }, (_, i) => (
            <DepthLayer key={i} index={DEPTH - i} />
          ))}
          <HeartFace />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {bursts.map((id) => (
          <HeartBurst key={id} count={14} distance={140} size={18} />
        ))}
      </AnimatePresence>
    </div>
  )
}
