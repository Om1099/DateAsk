import { motion } from 'motion/react'
import { config, fill, names, nicknames } from '../data'
import { LocalPetals } from '../components/FloatingPetals'
import { SectionReveal } from '../components/SectionReveal'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { EASE_SILK } from '../lib/utils'

const listOf = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} & ${items.at(-1)}`)

/** "To / From / Re" — a nod to the formal-but-playful invitation email. */
function Memo() {
  const { memo } = config.intro
  const to = names.herName && (nicknames.length ? `${names.herName} — ${fill(memo.akaPrefix)} ${listOf(nicknames)}` : names.herName)
  const from = names.myName ? fill(memo.from) : fill(memo.from).replace(/^,\s*/, '')
  const rows = [
    [fill(memo.toLabel), to],
    [fill(memo.fromLabel), from],
    [fill(memo.reLabel), fill(memo.re)],
  ].filter(([, value]) => value)

  return (
    <dl className="mb-8 space-y-1.5 border-b border-dashed border-rose-gold/30 pb-6">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-baseline gap-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.28em] text-burgundy">{label}</dt>
          <dd className="font-display text-[1.05rem] italic leading-snug text-ink sm:text-lg">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A little clothes tag hanging off the note, swaying gently. */
function OutfitTag({ text, reduce }) {
  return (
    <div aria-hidden className="absolute -top-5 right-5 z-10 sm:right-10">
      <div className={reduce ? undefined : 'tag-swing'}>
        <span className="mx-auto block h-5 w-px bg-rose-gold/70" />
        <div className="relative rotate-[4deg] rounded-[10px] border border-rose-gold/40 bg-champagne px-3.5 pb-1.5 pt-3.5 shadow-card">
          <span className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-rose-gold/60 bg-paper" />
          <span className="block whitespace-nowrap font-hand text-lg leading-none text-burgundy">{text}</span>
        </div>
      </div>
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

/** B · A note from your overthinking boyfriend. */
export function IntroSection() {
  const reduce = useReducedMotionPreference()
  const { intro } = config

  return (
    <section id="intro" aria-labelledby="intro-title" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <LocalPetals count={5} seed={7} />
      <div className="relative mx-auto max-w-3xl">
        <SectionReveal y={60} amount={0.12}>
          <article className="paper-texture relative rotate-[-0.6deg] rounded-[6px] px-7 pb-16 pt-14 shadow-lifted sm:px-16 sm:pb-20 sm:pt-16">
            <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[3px] border border-rose-gold/20 sm:inset-4" />
            <span aria-hidden className="absolute -top-3.5 left-8 h-7 w-24 rotate-[-4deg] bg-blush-deep/70 shadow-sm sm:left-14" />
            <OutfitTag text={fill(intro.tag)} reduce={reduce} />

            <Memo />
            <h2
              id="intro-title"
              className="text-balance font-display text-[clamp(2.1rem,5.2vw,3.5rem)] font-light leading-[1.06] text-burgundy"
            >
              {fill(intro.headline)}
            </h2>
            <div className="mt-8 space-y-6">
              {intro.paragraphs.map((paragraph, i) => (
                <SectionReveal
                  key={i}
                  as="p"
                  y={22}
                  scale={1}
                  amount={0.5}
                  delay={i * 0.08}
                  className="text-pretty font-display text-[clamp(1.3rem,2.6vw,1.7rem)] font-light leading-[1.6] text-ink"
                >
                  {fill(paragraph)}
                </SectionReveal>
              ))}
            </div>
          </article>
        </SectionReveal>
        <Annotation text={fill(intro.annotation)} />
      </div>
    </section>
  )
}
