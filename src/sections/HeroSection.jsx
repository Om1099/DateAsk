import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Gift, Music, Sparkles } from 'lucide-react'
import { config, fill } from '../data'
import { useMusic } from '../components/BackgroundMusic'
import { Button } from '../components/Button'
import { Heart3D } from '../components/Heart3D'
import { Magnetic } from '../components/Magnetic'
import { SplitText } from '../components/SplitText'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { scrollToSection } from '../lib/scroll'
import { EASE_SILK, gradientAt } from '../lib/utils'

const HEADLINE_TONES = ['#8a4d5e', '#703d4b', '#a26a5c', '#703d4b', '#8a4d5e']
const headlineColor = (t) => gradientAt(HEADLINE_TONES, t)

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: EASE_SILK },
})

/** Softly pulsing radial gradients in blush, ivory and champagne. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="glow-orb absolute left-1/2 top-1/2 h-[125vmax] w-[125vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(246 220 226 / .85), rgb(255 249 243 / .5) 45%, transparent 72%)' }}
      />
      <div
        className="glow-orb glow-orb--slow absolute -left-[22vmax] -top-[22vmax] h-[70vmax] w-[70vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(243 230 213 / .9), transparent)' }}
      />
      <div
        className="glow-orb glow-orb--slow absolute -bottom-[26vmax] -right-[20vmax] h-[75vmax] w-[75vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(217 155 170 / .38), transparent)' }}
      />
    </div>
  )
}

function ScrollCue({ label, onClick, reduce }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scroll to the next part"
      className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full p-2 text-ink-soft transition-colors hover:text-burgundy sm:bottom-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduce ? 0.6 : 4.4, duration: 1 }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.4em]">{label}</span>
      <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-rose-gold/25">
        <motion.span
          className="absolute left-0 top-0 block h-4 w-px bg-burgundy"
          animate={reduce ? undefined : { y: [-16, 40] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </motion.button>
  )
}

/** A · The opening: a cancelled plan, a playful comeback. */
export function HeroSection({ focusOnMount = false }) {
  const ref = useRef(null)
  const headingRef = useRef(null)
  const reduce = useReducedMotionPreference()
  const { hero } = config
  // reduced motion: the same staged order, just much quicker
  const at = (seconds) => (reduce ? Math.min(seconds, 0.6) : seconds)

  // the opening drifts up, shrinks a touch and fades as she scrolls away
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const goNext = () => scrollToSection('#intro')

  // the opening button is her first tap — the music begins with it, never before
  const { start: startMusic, enabled: hasMusic } = useMusic()
  const soundHint = hasMusic ? fill(config.music?.soundHint ?? '') : ''
  const openSurprise = () => {
    startMusic()
    goNext()
  }

  // after "Replay my little surprise", bring keyboard focus back to the top
  useEffect(() => {
    if (focusOnMount) headingRef.current?.focus({ preventScroll: true })
  }, [focusOnMount])

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-12 sm:pb-36 sm:pt-16"
    >
      <HeroBackdrop />

      <motion.div style={reduce ? undefined : { y, scale, opacity }} className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <motion.p
          {...fadeUp(at(0.2))}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-gold/30 bg-paper/70 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-burgundy sm:mb-7 sm:text-[11px] sm:tracking-[0.3em]"
        >
          <Sparkles aria-hidden className="h-3 w-3" />
          {fill(hero.eyebrow)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: at(0.35), ease: EASE_SILK }}
        >
          <Heart3D />
        </motion.div>

        <h1
          id="hero-title"
          ref={headingRef}
          tabIndex={-1}
          className="mt-7 max-w-4xl text-balance font-display text-[clamp(2.5rem,8vw,5.25rem)] font-normal leading-[1.02] text-burgundy outline-none sm:mt-9"
        >
          <SplitText text={fill(hero.headline)} delay={at(0.6)} stagger={reduce ? 0 : 0.035} colorAt={headlineColor} />
        </h1>

        <motion.p {...fadeUp(at(1.9))} className="mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-ink-soft sm:text-lg">
          {fill(hero.supporting)}
        </motion.p>

        <p className="mt-6 font-display text-[clamp(1.5rem,3.6vw,2.3rem)] font-light italic leading-snug text-ink">
          <SplitText text={fill(hero.reveal)} by="words" delay={at(2.6)} stagger={reduce ? 0 : 0.075} />
        </p>

        <motion.p
          {...fadeUp(at(3.3))}
          className="mt-2 max-w-2xl text-balance font-display text-[clamp(1.1rem,2.3vw,1.4rem)] italic leading-snug text-ink-soft"
        >
          {fill(hero.revealFollowUp)}
        </motion.p>

        <motion.div {...fadeUp(at(3.8))} className="mt-8 flex flex-col items-center sm:mt-10">
          <Magnetic>
            <Button size="lg" shimmer icon={<Gift className="h-5 w-5" />} onClick={openSurprise}>
              {fill(hero.cta)}
            </Button>
          </Magnetic>
          {soundHint && (
            <p className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft">
              <Music aria-hidden className="h-3 w-3" />
              {soundHint}
            </p>
          )}
        </motion.div>
      </motion.div>

      <ScrollCue label={fill(hero.scrollHint)} reduce={reduce} onClick={goNext} />
    </section>
  )
}
