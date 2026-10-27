import { useEffect, useMemo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTime, useTransform } from 'framer-motion'
import { useIsSmallScreen } from '../hooks/useMediaQuery'
import { HEART_PATH_24, lerp, mulberry32, wrap } from '../lib/utils'

/*
 * Page-wide ambient layer: soft bokeh + drifting rose petals.
 * Every element's y = (its own slow fall over time) − (scrollY × its depth speed), wrapped
 * around the viewport so the layer is endless. Different speeds create real parallax depth.
 * Only transforms/opacity are animated, so it all stays on the compositor.
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

const BOKEH = makeLayer(7, 11, { size: [140, 360], speed: [0.03, 0.12], fall: [-4, 4], opacity: [0.35, 0.7], hearts: 0 })
const BACK = makeLayer(16, 3, { size: [10, 20], speed: [0.12, 0.38], fall: [14, 26], opacity: [0.35, 0.75], hearts: 0.2 })
const FRONT = makeLayer(5, 9, { size: [24, 34], speed: [0.7, 1.05], fall: [30, 46], opacity: [0.3, 0.5], hearts: 0.25 })

const BOKEH_COLORS = ['#f9d3db', '#fde8ec', '#f6d9cf', '#f4b8c5']

function Drifter({ item, scrollY, time, vhRef, still, children }) {
  const y = useTransform([scrollY, time], ([s, t]) => {
    const vh = vhRef.current
    const pad = item.size * 1.5
    const fall = still ? 0 : (t / 1000) * item.fall
    return wrap(-pad, vh + pad, item.y * vh + fall - s * item.speed)
  })

  return (
    <motion.div className="absolute top-0 will-change-transform" style={{ y, left: `${item.x}%` }}>
      {children}
    </motion.div>
  )
}

function Petal({ item }) {
  const w = item.size
  return (
    <div
      className="petal-sway"
      style={{ animationDuration: `${item.sway}s`, animationDelay: `-${item.delay}s`, opacity: item.opacity }}
    >
      <div className="petal-tumble" style={{ animationDuration: `${item.tumble}s`, animationDelay: `-${item.delay}s` }}>
        {item.heart ? (
          <svg viewBox="0 0 24 24" width={w} height={w}>
            <path d={HEART_PATH_24} fill={`url(#petal-${item.tone})`} />
          </svg>
        ) : (
          <svg viewBox="0 0 20 28" width={w} height={w * 1.4}>
            <path
              d="M10 1C4 3 0 10 2 18c2 6 6 9 8 9s6-3 8-9c2-8-2-15-8-17z"
              fill={`url(#petal-${item.tone})`}
            />
            <path d="M10 5c-.6 6-.4 13 0 19" stroke="rgb(255 255 255 / .45)" strokeWidth=".7" fill="none" />
          </svg>
        )}
      </div>
    </div>
  )
}

export function AmbientBackground() {
  const reduceMotion = useReducedMotion()
  const small = useIsSmallScreen()
  const { scrollY } = useScroll()
  const time = useTime()
  const vhRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 800)

  useEffect(() => {
    const onResize = () => (vhRef.current = window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // fewer petals on phones keeps things silky at 60fps
  const back = useMemo(() => (small ? BACK.filter((_, i) => i % 2 === 0) : BACK), [small])
  const front = useMemo(() => (small ? FRONT.slice(0, 2) : FRONT), [small])
  const common = { scrollY, time, vhRef, still: reduceMotion }

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="petal-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde8ec" />
            <stop offset="1" stopColor="#ec98ab" />
          </linearGradient>
          <linearGradient id="petal-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbe0d6" />
            <stop offset="1" stopColor="#d98c9a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Back layer: wash, bokeh and small petals */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 15% 10%, rgb(253 232 236 / .9), transparent 70%), radial-gradient(50% 45% at 90% 85%, rgb(246 217 207 / .7), transparent 70%), radial-gradient(40% 40% at 80% 20%, rgb(249 211 219 / .45), transparent 70%)',
          }}
        />
        {BOKEH.map((item, i) => (
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
        {back.map((item, i) => (
          <Drifter key={`b${i}`} item={item} {...common}>
            <Petal item={item} />
          </Drifter>
        ))}
      </div>

      {/* Foreground layer: a few larger, faster petals drifting over the content */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {front.map((item, i) => (
          <Drifter key={`f${i}`} item={item} {...common}>
            <Petal item={item} />
          </Drifter>
        ))}
      </div>
    </>
  )
}
