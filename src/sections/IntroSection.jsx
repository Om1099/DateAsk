import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { config, fill } from '../data'
import { LocalPetals } from '../components/FloatingPetals'
import { Eyebrow } from '../components/SectionHeading'
import { SectionReveal } from '../components/SectionReveal'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { EASE_SILK } from '../lib/utils'

function LitWord({ word, progress, range, still }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return <motion.span style={still ? undefined : { opacity }}>{word} </motion.span>
}

/** The note "reads itself": each word brightens in turn as she scrolls (no React re-renders). */
function ScrollLitText({ paragraphs }) {
  const ref = useRef(null)
  const reduce = useReducedMotionPreference()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const split = paragraphs.map((p) => p.split(/\s+/).filter(Boolean))
  const total = split.reduce((n, words) => n + words.length, 0)
  let index = 0

  return (
    <div ref={ref} className="mt-8 space-y-6">
      {split.map((words, pi) => (
        <p key={pi} className="text-pretty font-display text-[clamp(1.35rem,2.7vw,1.8rem)] font-light leading-[1.55] text-ink">
          {words.map((word, wi) => {
            const i = index++
            return <LitWord key={wi} word={word} progress={scrollYProgress} range={[i / total, (i + 1) / total]} still={reduce} />
          })}
        </p>
      ))}
    </div>
  )
}

function Annotation({ text }) {
  return (
    <motion.p
      className="absolute -bottom-10 right-3 flex rotate-[-4deg] items-center gap-2 font-hand text-[1.6rem] text-rose-gold-deep sm:-bottom-12 sm:right-10 sm:text-[1.9rem]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ delay: 0.5, duration: 0.9, ease: EASE_SILK }}
    >
      <svg viewBox="0 0 40 30" className="h-6 w-8 shrink-0" fill="none" aria-hidden>
        <motion.path
          d="M4 24c8-2 16-8 20-15M24 9l-6 1M24 9l-1 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.9 }}
        />
      </svg>
      {text}
    </motion.p>
  )
}

/** B · A little note before we begin. */
export function IntroSection() {
  const { intro } = config
  const paragraphs = intro.paragraphs.map(fill)

  return (
    <section id="intro" aria-labelledby="intro-title" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <LocalPetals count={5} seed={7} />
      <div className="relative mx-auto max-w-3xl">
        <SectionReveal y={60} amount={0.15}>
          <article className="paper-texture relative rotate-[-0.6deg] rounded-[6px] px-7 pb-16 pt-14 shadow-lifted sm:px-16 sm:pb-20 sm:pt-16">
            <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[3px] border border-rose-gold/20 sm:inset-4" />
            <span aria-hidden className="absolute -top-3.5 left-1/2 h-7 w-28 -translate-x-1/2 rotate-[-3deg] bg-blush-deep/70 shadow-sm" />
            <Eyebrow className="[&>span:first-child]:hidden">{fill(intro.eyebrow)}</Eyebrow>
            <h2
              id="intro-title"
              className="mt-5 text-balance font-display text-[clamp(2.2rem,5.4vw,3.6rem)] font-light leading-[1.05] text-burgundy"
            >
              {fill(intro.headline)}
            </h2>
            <ScrollLitText paragraphs={paragraphs} />
          </article>
        </SectionReveal>
        <Annotation text={fill(intro.annotation)} />
      </div>
    </section>
  )
}
