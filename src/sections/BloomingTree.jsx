import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { content } from '../content'
import { Eyebrow, RichText } from '../components/SectionHeading'
import { EASE_SILK, HEART_PATH_24, cn, mulberry32 } from '../lib/utils'

/*
 * A sticky scroll-scene. The section is ~2.6 screens tall; while it is pinned,
 * scroll progress (0 → 1) grows the trunk & branches (scrubbed pathLength),
 * then pops heart blossoms open one by one with springy overshoot.
 */

// [path, stroke width, progress range in which it draws]
const BRANCHES = [
  ['M300 572C297 500 306 440 300 362', 20, [0, 0.14]],
  ['M301 410C262 380 220 345 168 302', 11, [0.08, 0.24]],
  ['M300 392C345 365 392 336 442 300', 11, [0.1, 0.26]],
  ['M300 366C272 322 252 272 240 212', 9, [0.12, 0.28]],
  ['M300 366C330 320 350 268 360 206', 9, [0.13, 0.29]],
  ['M300 366C302 302 298 240 300 168', 9, [0.14, 0.3]],
  ['M222 347C204 305 192 272 178 232', 6, [0.2, 0.33]],
  ['M388 338C410 302 420 272 426 232', 6, [0.21, 0.34]],
  ['M168 302C144 292 124 272 108 246', 4, [0.23, 0.36]],
  ['M442 300C466 290 486 270 496 246', 4, [0.24, 0.37]],
  ['M240 212C230 186 216 170 198 156', 4, [0.25, 0.38]],
  ['M360 206C372 184 388 168 406 156', 4, [0.26, 0.39]],
  ['M300 168C290 150 284 134 278 114', 3, [0.27, 0.4]],
  ['M300 168C312 150 320 136 330 118', 3, [0.28, 0.41]],
  ['M178 232C166 214 160 200 150 186', 3, [0.29, 0.42]],
  ['M426 232C438 214 444 200 452 186', 3, [0.3, 0.43]],
  ['M292 568C276 571 262 574 246 578', 4, [0.02, 0.1]],
  ['M308 568C324 571 340 574 356 578', 4, [0.02, 0.1]],
]

const BLOSSOM_COLORS = ['#f9d3db', '#f4b8c5', '#ec98ab', '#e0bfb8', '#d98c9a', '#f6c6b8', '#b76e79']
const BLOOM_START = 0.32
const BLOOM_END = 0.9

const BLOSSOMS = (() => {
  const rand = mulberry32(7)
  const out = []
  for (let guard = 0; out.length < 72 && guard < 4000; guard++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand())
    const x = 300 + Math.cos(a) * r * 220
    const y = 205 + Math.sin(a) * r * 132
    if (y > 322) continue
    if (out.some((b) => (b.x - x) ** 2 + (b.y - y) ** 2 < 17 * 17)) continue
    out.push({
      x,
      y,
      size: 13 + rand() * 15,
      rotate: -32 + rand() * 64,
      color: BLOSSOM_COLORS[Math.floor(rand() * BLOSSOM_COLORS.length)],
      opacity: 0.82 + rand() * 0.18,
      order: Math.hypot(x - 300, (y - 270) * 1.3) + rand() * 70, // bloom from the heart of the tree outwards
    })
  }
  return out.sort((a, b) => a.order - b.order)
})()

const FALLING = [
  [210, 250, '24px', '200deg', 0],
  [330, 230, '-30px', '-180deg', 1.6],
  [420, 270, '18px', '240deg', 3.1],
  [160, 280, '-22px', '-220deg', 4.4],
  [280, 300, '34px', '160deg', 5.6],
  [380, 180, '-16px', '200deg', 2.3],
]

function Branch({ d, width, range, progress }) {
  const pathLength = useTransform(progress, range, [0, 1])
  const opacity = useTransform(progress, [range[0], range[0] + 0.005], [0, 1])
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#bark)"
      strokeWidth={width}
      strokeLinecap="round"
      style={{ pathLength, opacity }}
    />
  )
}

function Blossom({ b, open, index }) {
  return (
    <g transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)}) rotate(${b.rotate.toFixed(1)})`}>
      <motion.g
        initial={false}
        animate={{ scale: open ? b.size / 24 : 0, opacity: open ? b.opacity : 0 }}
        transition={
          open
            ? { type: 'spring', stiffness: 320, damping: 13, delay: (index % 4) * 0.03 }
            : { duration: 0.25, ease: 'easeIn' }
        }
      >
        <path d={HEART_PATH_24} transform="translate(-12 -12)" fill={b.color} />
        <ellipse cx="-4" cy="-5" rx="3" ry="1.8" transform="rotate(-30 -4 -5)" fill="#fff" opacity=".45" />
      </motion.g>
    </g>
  )
}

function Tree({ progress, bloomCount }) {
  const bloomed = bloomCount >= BLOSSOMS.length
  return (
    <svg viewBox="40 60 520 540" className="h-full w-full overflow-visible" role="img" aria-label="A tree blooming with hearts">
      <defs>
        <linearGradient id="bark" gradientUnits="userSpaceOnUse" x1="0" y1="580" x2="0" y2="110">
          <stop offset="0" stopColor="#8a5459" />
          <stop offset="1" stopColor="#c08c8e" />
        </linearGradient>
        <radialGradient id="ground" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4b8c5" stopOpacity=".55" />
          <stop offset="1" stopColor="#f4b8c5" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="300" cy="578" rx="190" ry="16" fill="url(#ground)" />

      {BRANCHES.map(([d, width, range], i) => (
        <Branch key={i} d={d} width={width} range={range} progress={progress} />
      ))}

      {BLOSSOMS.map((b, i) => (
        <Blossom key={i} b={b} index={i} open={i < bloomCount} />
      ))}

      {bloomed &&
        FALLING.map(([x, y, dx, r, delay], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g className="tree-fall" style={{ '--dx': dx, '--r': r, animationDelay: `${delay}s` }}>
              <path d={HEART_PATH_24} transform="translate(-12 -12) scale(.6)" fill={BLOSSOM_COLORS[i % 5]} />
            </g>
          </g>
        ))}
    </svg>
  )
}

function Milestones({ items, stage }) {
  return (
    <>
      {/* desktop: the full timeline with a scrubbed progress line */}
      <ol className="relative mt-10 hidden space-y-7 border-l border-rose-gold/20 pl-8 lg:block">
        {items.map((m, i) => {
          const active = i <= stage
          return (
            <motion.li
              key={i}
              className="relative"
              animate={{ opacity: active ? 1 : 0.32, x: active ? 0 : -8 }}
              transition={{ duration: 0.7, ease: EASE_SILK }}
            >
              <motion.span
                className="absolute -left-[38.5px] top-1.5 h-3 w-3 rounded-full border border-rose-gold"
                animate={{ backgroundColor: active ? '#b76e79' : '#fff8f3', scale: i === stage ? 1.3 : 1 }}
              />
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-rose-gold">{m.label}</p>
              <p className="mt-1 font-display text-2xl text-ink">{m.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{m.text}</p>
            </motion.li>
          )
        })}
      </ol>

      {/* mobile: one milestone at a time, cross-fading */}
      <div className="relative mt-5 h-[5.5rem] lg:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: EASE_SILK }}
            className="text-center"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-rose-gold">{items[stage].label}</p>
            <p className="mt-1 font-display text-xl text-ink">{items[stage].title}</p>
            <p className="mt-0.5 text-sm text-ink-soft">{items[stage].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

export function BloomingTree() {
  const ref = useRef(null)
  const { story } = content
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [bloomCount, setBloomCount] = useState(0)
  const [stage, setStage] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const t = Math.min(1, Math.max(0, (v - BLOOM_START) / (BLOOM_END - BLOOM_START)))
    setBloomCount(Math.round(t * BLOSSOMS.length))
    setStage(v < 0.36 ? 0 : v < 0.7 ? 1 : 2)
  })

  return (
    <section id="story" ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 mx-auto flex h-svh max-w-7xl flex-col items-center justify-center gap-4 overflow-hidden px-6 py-8 lg:flex-row lg:gap-16 lg:px-12 lg:py-0">
        <div className="w-full max-w-md shrink-0 text-center lg:w-[40%] lg:text-left">
          <Eyebrow className="lg:[&>span:first-child]:hidden">{story.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-light leading-[1.05] text-ink">
            <RichText text={story.title} />
          </h2>
          <p className="mt-4 hidden text-base leading-relaxed text-ink-soft sm:block lg:text-lg">{story.body}</p>
          <Milestones items={story.milestones} stage={stage} />
        </div>

        {/* phones: an aspect box capped by viewport height so text + tree always fit one screen */}
        <div className="relative aspect-[52/58] w-full max-w-[min(100%,44svh)] pb-9 lg:aspect-auto lg:h-[82vh] lg:max-w-none lg:flex-1 lg:pb-12">
          <Tree progress={scrollYProgress} bloomCount={bloomCount} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center lg:bottom-2">
            <p className={cn('text-[10px] uppercase tracking-[0.2em] text-ink-soft transition-opacity duration-700 sm:text-xs sm:tracking-[0.3em]', bloomCount ? 'opacity-100' : 'opacity-0')}>
              <span className="font-hand text-2xl normal-case tracking-normal text-rose-gold">{bloomCount}</span>{' '}
              {story.counterLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
