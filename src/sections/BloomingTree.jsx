import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { config, fill } from '../data'
import { Eyebrow, RichText } from '../components/SectionHeading'
import { SectionReveal } from '../components/SectionReveal'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { HEART_PATH_24, mulberry32 } from '../lib/utils'

/*
 * An original SVG heart-tree. When it scrolls into view:
 *   1. the trunk draws itself (stroke animation)   2. branches and twigs follow
 *   3. heart leaves bloom outward from the middle   4. a few of them keep swaying
 *   5. now and then a petal drifts down.
 * The canopy is itself one big heart, filled in by the little heart leaves.
 */

// [path, stroke width, start time (s), draw duration (s)] — trunk (thick → thin), roots, branches, twigs
const STROKES = [
  ['M300 585C297 555 289 522 292 490', 14.5, 0, 0.6],
  ['M292 492C295 458 312 430 309 396', 12.5, 0.45, 0.5],
  ['M309 398C307 370 297 352 299 326', 10, 0.82, 0.42],
  ['M299 328C300 290 303 240 300 176', 7, 1.1, 0.6],
  ['M296 584C287 587 276 590 262 593', 3.5, 0.15, 0.5],
  ['M304 584C313 587 324 590 338 593', 3.5, 0.2, 0.5],
  ['M308 398C340 372 388 318 420 250', 6.5, 0.85, 0.75],
  ['M302 361C272 340 222 300 182 246', 6.5, 0.95, 0.75],
  ['M300 306C278 270 240 206 214 150', 5, 1.2, 0.7],
  ['M300 286C324 252 360 196 388 146', 5, 1.25, 0.7],
  ['M233 304C210 296 184 286 160 268', 2.6, 1.45, 0.45],
  ['M194 262C178 240 166 222 152 200', 2.6, 1.6, 0.45],
  ['M376 324C400 318 424 308 446 292', 2.6, 1.45, 0.45],
  ['M410 270C424 252 438 234 452 214', 2.6, 1.58, 0.45],
  ['M249 219C226 206 200 194 176 178', 2.4, 1.62, 0.45],
  ['M224 170C220 150 218 130 216 108', 2.4, 1.72, 0.45],
  ['M352 207C376 196 400 184 424 168', 2.4, 1.66, 0.45],
  ['M377 164C381 144 385 124 388 104', 2.4, 1.76, 0.45],
  ['M301 230C288 212 274 194 262 172', 2.2, 1.6, 0.4],
  ['M301 198C314 180 326 162 338 140', 2.2, 1.7, 0.4],
]

const CANOPY = { cx: 300, cy: 232, s: 160 }
const LEAF_COLORS = ['#f6dce2', '#efc6d0', '#d99baa', '#e9b5c1', '#b88670', '#f3e6d5', '#c98a9a', '#e6c9b8']
const LEAF_START = 1.9
const LEAF_STAGGER = 0.024

/** Is (x, y) inside the big heart-shaped canopy? (classic implicit heart curve) */
function insideCanopy(x, y, k = 1) {
  const nx = (x - CANOPY.cx) / (CANOPY.s * k)
  const ny = -(y - CANOPY.cy) / (CANOPY.s * k)
  const a = nx * nx + ny * ny - 1
  return a * a * a - nx * nx * ny * ny * ny <= 0
}

const LEAVES = (() => {
  const rand = mulberry32(14)
  const out = []
  for (let guard = 0; out.length < 92 && guard < 9000; guard++) {
    const x = 120 + rand() * 360
    const y = 28 + rand() * 372
    if (!insideCanopy(x, y, 0.97)) continue
    if (out.some((l) => (l.x - x) ** 2 + (l.y - y) ** 2 < 18 * 18)) continue
    out.push({
      x,
      y,
      size: 15 + rand() * 12,
      rotate: -30 + rand() * 60,
      color: LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)],
      sway: rand() < 0.28,
      swayDuration: 3.2 + rand() * 2.4,
      order: Math.hypot(x - 300, (y - 300) * 1.2) + rand() * 60, // bloom from the middle outward
    })
  }
  return out.sort((a, b) => a.order - b.order).map((leaf, i) => ({ ...leaf, delay: LEAF_START + i * LEAF_STAGGER }))
})()

const BLOOM_DONE = LEAF_START + LEAVES.length * LEAF_STAGGER + 0.5

// [x, y, horizontal drift, spin] for the occasional falling petal
const FALLING = [
  [232, 330, '26px', '210deg'],
  [370, 318, '-28px', '-190deg'],
  [300, 372, '18px', '240deg'],
  [196, 272, '-20px', '-220deg'],
  [424, 262, '30px', '170deg'],
  [262, 246, '-16px', '200deg'],
]

function Stroke({ d, width, at, duration, grown, reduce }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#bark)"
      strokeWidth={width}
      strokeLinecap="round"
      initial={false}
      animate={grown ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { pathLength: { duration, delay: at, ease: 'easeInOut' }, opacity: { duration: 0.01, delay: at } }
      }
    />
  )
}

function Leaf({ leaf, grown, reduce }) {
  const swaying = leaf.sway && grown && !reduce
  return (
    <g transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rotate.toFixed(1)})`}>
      <motion.g
        initial={false}
        animate={grown ? { scale: leaf.size / 24, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 13, delay: reduce ? 0 : leaf.delay }}
      >
        <g
          className={swaying ? 'leaf-sway' : undefined}
          style={swaying ? { animationDuration: `${leaf.swayDuration}s`, animationDelay: `${leaf.delay + 0.6}s` } : undefined}
        >
          <path d={HEART_PATH_24} transform="translate(-12 -12)" fill={leaf.color} stroke="rgb(112 61 75 / 0.16)" strokeWidth="1.2" />
          <ellipse cx="-4.5" cy="-5" rx="3.2" ry="1.8" transform="rotate(-30 -4.5 -5)" fill="#fff" opacity="0.5" />
        </g>
      </motion.g>
    </g>
  )
}

function TreeIllustration({ grown, reduce }) {
  return (
    <svg
      viewBox="70 0 460 612"
      className="relative h-auto w-full overflow-visible"
      role="img"
      aria-label="An illustrated tree whose leaves bloom into little hearts"
    >
      <defs>
        <linearGradient id="bark" gradientUnits="userSpaceOnUse" x1="0" y1="595" x2="0" y2="100">
          <stop offset="0" stopColor="#6e3f49" />
          <stop offset="0.55" stopColor="#8f5c58" />
          <stop offset="1" stopColor="#b88670" />
        </linearGradient>
        <radialGradient id="tree-ground" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#d99baa" stopOpacity=".45" />
          <stop offset="1" stopColor="#d99baa" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.ellipse
        cx="300"
        cy="596"
        rx="150"
        ry="12"
        fill="url(#tree-ground)"
        initial={false}
        animate={{ opacity: grown ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      {STROKES.map(([d, width, at, duration], i) => (
        <Stroke key={i} d={d} width={width} at={at} duration={duration} grown={grown} reduce={reduce} />
      ))}

      {LEAVES.map((leaf, i) => (
        <Leaf key={i} leaf={leaf} grown={grown} reduce={reduce} />
      ))}

      {grown &&
        !reduce &&
        FALLING.map(([x, y, dx, spin], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g
              className="tree-fall"
              style={{ '--dx': dx, '--r': spin, animationDelay: `${BLOOM_DONE + i * 1.4}s`, animationDuration: `${7 + (i % 3)}s` }}
            >
              <path d={HEART_PATH_24} transform="scale(.55) translate(-12 -12)" fill={LEAF_COLORS[(i * 3) % LEAF_COLORS.length]} />
            </g>
          </g>
        ))}
    </svg>
  )
}

/** D · The blooming heart tree. */
export function BloomingTree() {
  const sectionRef = useRef(null)
  const treeRef = useRef(null)
  const reduce = useReducedMotionPreference()
  const grown = useInView(treeRef, { once: true, amount: 0.35 })
  const { tree } = config

  // gentle parallax: the halo and the tree drift at different speeds
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const haloY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const treeY = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section id="tree" ref={sectionRef} aria-labelledby="tree-title" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent, rgb(243 230 213 / .45) 18%, rgb(243 230 213 / .45) 82%, transparent)' }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <SectionReveal y={16}>
            <Eyebrow className="lg:[&>span:first-child]:hidden">{fill(tree.eyebrow)}</Eyebrow>
          </SectionReveal>
          <SectionReveal delay={0.08}>
            <h2
              id="tree-title"
              className="mt-5 text-balance font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-light leading-[1.04] text-burgundy"
            >
              <RichText text={fill(tree.headline)} />
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-md text-pretty text-lg leading-relaxed text-ink-soft lg:mx-0">{fill(tree.supporting)}</p>
          </SectionReveal>
        </div>

        <div ref={treeRef} className="relative mx-auto w-full max-w-[30rem] lg:max-w-[34rem]">
          <motion.div
            aria-hidden
            style={reduce ? undefined : { y: haloY }}
            className="pointer-events-none absolute left-1/2 top-[34%] aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="glow-orb h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(closest-side, rgb(255 249 243 / .95), rgb(246 220 226 / .6) 45%, rgb(243 230 213 / .25) 70%, transparent)',
              }}
            />
          </motion.div>

          <motion.div style={reduce ? undefined : { y: treeY }} className="relative">
            <TreeIllustration grown={grown} reduce={reduce} />
          </motion.div>

          <motion.p
            className="mt-2 text-center font-hand text-2xl text-rose-gold-deep"
            initial={{ opacity: 0 }}
            animate={{ opacity: grown ? 1 : 0 }}
            transition={{ delay: reduce ? 0 : BLOOM_DONE - 0.4, duration: 1 }}
          >
            {fill(tree.caption)}
          </motion.p>
        </div>
      </div>
    </section>
  )
}
