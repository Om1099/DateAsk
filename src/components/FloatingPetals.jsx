import { useEffect, useMemo, useRef } from 'react'
import { motion, useScroll, useTime, useTransform } from 'motion/react'
import { useIsSmallScreen } from '../hooks/useMediaQuery'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { HEART_PATH_24, cn, lerp, mulberry32, wrap } from '../lib/utils'

/*
 * Page-wide ambient layer: soft bokeh and a few drifting petals, used with restraint.
 * Each element's y = (its own slow fall over time) − (scrollY × its depth speed),
 * wrapped around the viewport so the layer is endless. Different speeds = parallax depth.
 * Only transforms/opacity change, so everything stays on the compositor.
 */

function makeLayer(count, seed, o) {
  const r = mulberry32(seed)
  return Array.from({ length: count }, (_, i) => ({
    x: ((i + 0.15 + r() * 0.7) / count) * 100,
    y: r(),
    size: lerp(o.size[0], o.size[1], r()),
    speed: lerp(o.speed[0], o.speed[1], r()),
    fall: lerp(o.fall[0], o.fall[1], r()),
    opacity: lerp(o.opacity[0], o.opacity[1], r()),
    sway: 4 + r() * 5,
    tumble: 7 + r() * 9,
    delay: r() * 10,
    heart: r() < o.hearts,
    tone: r() < 0.5 ? 'a' : 'b',
  }))
}

const BOKEH = makeLayer(5, 11, { size: [180, 380], speed: [0.03, 0.1], fall: [-4, 4], opacity: [0.35, 0.65], hearts: 0 })
const PETALS = makeLayer(11, 3, { size: [10, 20], speed: [0.12, 0.4], fall: [12, 24], opacity: [0.35, 0.7], hearts: 0.2 })
const BOKEH_COLORS = ['#f6dce2', '#f3e6d5', '#efc6d0', '#fbe9ee', '#f3e6d5']

/** Shared gradients for every petal on the page. */
function PetalDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <linearGradient id="petal-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdeef1" />
          <stop offset="1" stopColor="#d99baa" />
        </linearGradient>
        <linearGradient id="petal-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8ece0" />
          <stop offset="1" stopColor="#c99282" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PetalShape({ size, heart, tone }) {
  return heart ? (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d={HEART_PATH_24} fill={`url(#petal-${tone})`} />
    </svg>
  ) : (
    <svg viewBox="0 0 20 28" width={size} height={size * 1.4} aria-hidden>
      <path d="M10 1C4 3 0 10 2 18c2 6 6 9 8 9s6-3 8-9c2-8-2-15-8-17z" fill={`url(#petal-${tone})`} />
      <path d="M10 5c-.6 6-.4 13 0 19" stroke="rgb(255 255 255 / .5)" strokeWidth=".7" fill="none" />
    </svg>
  )
}

function Drifter({ item, scrollY, time, vhRef, still, children }) {
  const y = useTransform([scrollY, time], ([s, t]) => {
    const vh = vhRef.current
    if (still) return item.y * vh
    const pad = item.size * 1.5
    return wrap(-pad, vh + pad, item.y * vh + (t / 1000) * item.fall - s * item.speed)
  })

  return (
    <motion.div className="absolute top-0 will-change-transform" style={{ y, left: `${item.x}%` }}>
      {children}
    </motion.div>
  )
}

function DriftingPetal({ item, still }) {
  return (
    <div
      className={still ? undefined : 'petal-sway'}
      style={{ animationDuration: `${item.sway}s`, animationDelay: `-${item.delay}s`, opacity: item.opacity }}
    >
      <div
        className={still ? undefined : 'petal-tumble'}
        style={{ animationDuration: `${item.tumble}s`, animationDelay: `-${item.delay}s` }}
      >
        <PetalShape size={item.size} heart={item.heart} tone={item.tone} />
      </div>
    </div>
  )
}

export function FloatingPetals() {
  const reduce = useReducedMotionPreference()
  const small = useIsSmallScreen()
  const { scrollY } = useScroll()
  const time = useTime()
  const vhRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 800)

  useEffect(() => {
    const onResize = () => (vhRef.current = window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // fewer elements on phones keeps scrolling silky
  const bokeh = small ? BOKEH.slice(0, 3) : BOKEH
  const petals = useMemo(() => (small ? PETALS.filter((_, i) => i % 2 === 0) : PETALS), [small])
  const common = { scrollY, time, vhRef, still: reduce }

  return (
    <>
      <PetalDefs />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 12% 8%, rgb(246 220 226 / .75), transparent 70%), radial-gradient(50% 45% at 92% 88%, rgb(243 230 213 / .8), transparent 70%)',
          }}
        />
        {bokeh.map((item, i) => (
          <Drifter key={`k${i}`} item={item} {...common}>
            <div
              className="-translate-x-1/2 rounded-full"
              style={{
                width: item.size,
                height: item.size,
                opacity: item.opacity,
                background: `radial-gradient(closest-side, ${BOKEH_COLORS[i % BOKEH_COLORS.length]}, transparent)`,
              }}
            />
          </Drifter>
        ))}
        {petals.map((item, i) => (
          <Drifter key={`p${i}`} item={item} {...common}>
            <DriftingPetal item={item} still={reduce} />
          </Drifter>
        ))}
      </div>
    </>
  )
}

/** Section-local falling petals — pure CSS, no JavaScript per frame. */
export function LocalPetals({ count = 6, seed = 1, className }) {
  const reduce = useReducedMotionPreference()
  const petals = useMemo(() => {
    const r = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => ({
      x: ((i + 0.2 + r() * 0.6) / count) * 100,
      size: 9 + r() * 10,
      duration: 12 + r() * 9,
      delay: r() * 18,
      drift: Math.round((r() - 0.5) * 140),
      spin: Math.round(160 + r() * 260),
      opacity: (0.45 + r() * 0.35).toFixed(2),
      heart: r() < 0.3,
      tone: r() < 0.5 ? 'a' : 'b',
    }))
  }, [count, seed])

  if (reduce || count === 0) return null

  return (
    <div aria-hidden className={cn('petal-field pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {petals.map((p, i) => (
        <span
          key={i}
          className="local-petal"
          style={{
            left: `${p.x}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
            '--o': p.opacity,
          }}
        >
          <PetalShape size={p.size} heart={p.heart} tone={p.tone} />
        </span>
      ))}
    </div>
  )
}
