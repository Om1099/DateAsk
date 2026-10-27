import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { content } from '../content'
import { Heart3D } from '../components/Heart3D'
import { SplitText } from '../components/SplitText'
import { useScrollTo } from '../components/SmoothScroll'
import { EASE_SILK, HEART_PATH_24, gradientAt } from '../lib/utils'

const HEADLINE_GRADIENT = ['#c98b8b', '#b76e79', '#8f4f5a', '#b76e79', '#d4919a']
const colorAt = (t) => gradientAt(HEADLINE_GRADIENT, t)

function HeroGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="glow-orb absolute left-1/2 top-1/2 h-[130vmax] w-[130vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(249 211 219 / .75), rgb(253 232 236 / .35) 45%, transparent 72%)' }}
      />
      <div
        className="glow-orb glow-orb--slow absolute -left-[20vmax] -top-[20vmax] h-[70vmax] w-[70vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(246 210 196 / .7), transparent)' }}
      />
      <div
        className="glow-orb glow-orb--slow absolute -bottom-[25vmax] -right-[20vmax] h-[75vmax] w-[75vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(244 184 197 / .5), transparent)' }}
      />
    </div>
  )
}

function Flourish({ delay }) {
  return (
    <svg viewBox="0 0 240 24" className="mt-4 w-48 text-rose-gold sm:w-64" fill="none" aria-hidden>
      <motion.path
        d="M4 12C40 2 70 22 104 12M136 12c34-10 64 10 100 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay, duration: 1.6, ease: EASE_SILK }}
      />
      <g transform="translate(112 3) scale(.68)">
        <motion.path
          d={HEART_PATH_24}
          fill="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.5, type: 'spring', stiffness: 260, damping: 12 }}
        />
      </g>
    </svg>
  )
}

function ScrollIndicator({ label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 p-2 text-ink-soft transition-colors hover:text-rose-gold sm:bottom-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 1, ease: EASE_SILK }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.4em]">{label}</span>
      <motion.svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-rose-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M12 4v15M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.button>
  )
}

export function Hero() {
  const ref = useRef(null)
  const scrollTo = useScrollTo()
  const { hero } = content

  // content drifts up, shrinks and fades as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 180])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-32 pt-20"
    >
      <HeroGlow />

      <motion.div style={{ y, scale, opacity }} className="relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE_SILK }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-rose-gold/25 bg-white/60 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.35em] text-rose-gold sm:text-[11px]"
        >
          ✦ {hero.eyebrow} ✦
        </motion.span>

        <Heart3D />

        <h1 className="mt-10 font-display leading-[0.95] text-ink">
          <SplitText
            text={hero.headline[0]}
            delay={0.7}
            className="text-[clamp(2.1rem,6vw,3.75rem)] font-light italic text-ink-soft"
          />
          <SplitText
            text={hero.headline[1]}
            delay={1.25}
            stagger={0.05}
            colorAt={colorAt}
            className="mt-1 text-[clamp(3.2rem,10vw,6.5rem)] font-medium"
          />
        </h1>

        <Flourish delay={2} />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 1.1, ease: EASE_SILK }}
          className="mt-5 max-w-md text-balance text-base leading-relaxed text-ink-soft sm:text-lg"
        >
          {hero.subtitle}
        </motion.p>
      </motion.div>

      <ScrollIndicator label={hero.scrollLabel} onClick={() => scrollTo('#quote')} />
    </section>
  )
}
