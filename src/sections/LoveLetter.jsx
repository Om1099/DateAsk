import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content } from '../content'
import { SectionHeading } from '../components/SectionHeading'
import { ParallaxWord } from '../components/ParallaxWord'
import { HeartIcon } from '../components/HeartIcon'
import { VoiceNotePlayer } from '../components/VoiceNotePlayer'
import { useScrollTo } from '../components/SmoothScroll'
import { EASE_SILK } from '../lib/utils'

/*
 * Phases: 0 sealed → 1 seal pops & flap swings open → 2 letter slides out → 3 full letter is shown.
 */

function WaxSeal() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 drop-shadow-[0_4px_6px_rgba(110,40,60,0.35)] sm:h-16 sm:w-16" aria-hidden>
      <defs>
        <radialGradient id="wax" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#d9768d" />
          <stop offset="0.6" stopColor="#a8435c" />
          <stop offset="1" stopColor="#7d2c43" />
        </radialGradient>
      </defs>
      <path
        d="M32 3c5 0 7 4 11 5s9-1 11 3 0 8 2 11 6 6 5 10-5 6-5 10 2 8-1 11-8 1-11 3-6 6-11 6-7-4-11-6-9 0-11-3 0-8-2-11-6-6-5-10 5-6 5-10-2-8 1-11 8-1 11-3S27 3 32 3z"
        fill="url(#wax)"
      />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#f2b6c3" strokeOpacity=".35" strokeWidth="1.2" />
      <path
        d="M32 42.5l-1.3-1.2C25.9 37 23 34.3 23 31c0-2.7 2.1-4.8 4.8-4.8 1.5 0 3 .7 4.2 1.8 1.2-1.1 2.7-1.8 4.2-1.8 2.7 0 4.8 2.1 4.8 4.8 0 3.3-2.9 6-7.7 10.3L32 42.5z"
        fill="#f6c3cf"
        fillOpacity=".85"
      />
    </svg>
  )
}

function Envelope({ phase, onOpen, greeting, hint }) {
  return (
    <motion.div
      className="mx-auto w-[min(86vw,440px)]"
      initial={{ opacity: 0, y: 60, rotate: -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: -2 }}
      viewport={{ once: true, amount: 0.4 }}
      exit={{ opacity: 0, y: 70, scale: 0.9, transition: { duration: 0.6, ease: EASE_SILK } }}
      transition={{ duration: 1.1, ease: EASE_SILK }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        disabled={phase > 0}
        aria-label="Open the envelope"
        className="group relative block aspect-[1.55] w-full cursor-pointer disabled:cursor-default"
        style={{ perspective: 1400 }}
        whileHover={phase === 0 ? { y: -8, rotate: 1.5 } : undefined}
        whileTap={phase === 0 ? { scale: 0.97 } : undefined}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {/* back */}
        <div className="absolute inset-0 rounded-lg bg-[linear-gradient(160deg,#f1c3cc,#e5a9b6)] shadow-[0_40px_70px_-25px_rgba(143,79,90,0.55)]" />

        {/* the letter tucked inside */}
        <motion.div
          className="paper absolute inset-x-[5%] bottom-[5%] top-[6%] rounded-md shadow-[0_2px_10px_rgba(91,58,66,0.12)]"
          style={{ zIndex: 10 }}
          animate={{ y: phase >= 2 ? '-50%' : '0%' }}
          transition={{ duration: 1.1, ease: EASE_SILK }}
        >
          <div className="flex h-full flex-col items-center px-6 pt-4 sm:pt-6">
            <span className="font-hand text-2xl text-rose-gold sm:text-3xl">{greeting}</span>
            <div className="mt-3 w-full space-y-2.5">
              {[88, 72, 84, 58].map((w, i) => (
                <div key={i} className="mx-auto h-[3px] rounded-full bg-blush-200" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* front pocket */}
        <svg viewBox="0 0 155 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ zIndex: 20 }} aria-hidden>
          <defs>
            <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f9d7dd" />
              <stop offset="1" stopColor="#f0bcc7" />
            </linearGradient>
          </defs>
          <path d="M0 5Q0 0 4 2.5L77.5 55 151 2.5Q155 0 155 5v90q0 5-5 5H5q-5 0-5-5z" fill="url(#env-pocket)" />
          <path d="M2 98 77.5 53 153 98" fill="none" stroke="#e4a7b4" strokeWidth=".6" />
        </svg>

        {/* flap — a real 3D hinge with a lined inside face */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[60%] origin-top"
          style={{ zIndex: phase >= 2 ? 5 : 30, transformStyle: 'preserve-3d' }}
          animate={{ rotateX: phase >= 1 ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.6, 0.05, 0.3, 1], delay: phase >= 1 ? 0.25 : 0 }}
        >
          <svg viewBox="0 0 155 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }} aria-hidden>
            <defs>
              <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#efb7c3" />
                <stop offset="1" stopColor="#f6cfd7" />
              </linearGradient>
            </defs>
            <path d="M0 4Q0 0 5 0h145q5 0 5 4L81 57q-3.5 2.5-7 0z" fill="url(#env-flap)" />
          </svg>
          <svg
            viewBox="0 0 155 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            aria-hidden
          >
            <path d="M0 4Q0 0 5 0h145q5 0 5 4L81 57q-3.5 2.5-7 0z" fill="#f6d2da" />
            <path d="M12 6h131L79 52q-1.5 1-3 0z" fill="none" stroke="#e8aebb" strokeWidth=".6" strokeDasharray="2 2" />
          </svg>
        </motion.div>

        {/* wax seal */}
        <motion.span
          className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 40 }}
          animate={phase >= 1 ? { scale: 0, rotate: 60, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_SILK }}
        >
          <span className="block transition-transform duration-500 group-hover:scale-110">
            <WaxSeal />
          </span>
        </motion.span>
      </motion.button>

      <motion.p
        className="mt-10 text-center text-[10px] font-medium uppercase tracking-[0.35em] text-ink-soft"
        animate={phase === 0 ? { opacity: [0.45, 1, 0.45] } : { opacity: 0 }}
        transition={phase === 0 ? { duration: 2.4, repeat: Infinity } : { duration: 0.3 }}
      >
        {hint}
      </motion.p>
    </motion.div>
  )
}

const letterBody = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.35 } },
}
const line = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_SILK } },
}

function LetterCard({ letter, onFoldBack }) {
  return (
    <motion.article
      id="letter-card"
      className="paper relative mx-auto w-full max-w-2xl rounded-[6px] px-7 py-12 shadow-letter sm:px-14 sm:py-16"
      initial={{ opacity: 0, y: 70, scale: 0.94, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.5 } }}
      transition={{ duration: 1.1, ease: EASE_SILK }}
    >
      {/* postage stamp */}
      <div
        aria-hidden
        className="absolute right-5 top-5 rotate-6 border-2 border-dotted border-rose-gold/40 bg-white p-1 sm:right-8 sm:top-8"
      >
        <div className="grid h-14 w-12 place-items-center bg-linear-to-br from-blush-100 to-blush-300">
          <HeartIcon className="h-5 w-5 text-rose-gold" />
        </div>
      </div>

      <motion.div variants={letterBody} initial="hidden" animate="show">
        <motion.p variants={line} className="pr-16 font-hand text-4xl text-rose-gold sm:text-5xl">
          {letter.greeting}
        </motion.p>
        {letter.paragraphs.map((p, i) => (
          <motion.p
            key={i}
            variants={line}
            className="mt-6 font-display text-[1.3rem] leading-relaxed text-ink sm:text-[1.45rem]"
          >
            {p}
          </motion.p>
        ))}
        <motion.div variants={line} className="mt-10 text-right">
          <p className="font-display text-lg italic text-ink-soft">{letter.signoff}</p>
          <p className="font-hand text-5xl text-rose-gold-dark">{letter.signature}</p>
        </motion.div>

        <motion.div variants={line} className="mt-12 border-t border-dashed border-rose-gold/30 pt-8">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft">{letter.voiceNote.label}</p>
          <VoiceNotePlayer {...letter.voiceNote} />
        </motion.div>
      </motion.div>

      <button
        type="button"
        onClick={onFoldBack}
        className="mx-auto mt-10 block text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft underline-offset-4 transition-colors hover:text-rose-gold hover:underline"
      >
        ↺ {letter.foldBackLabel}
      </button>
    </motion.article>
  )
}

export function LoveLetter() {
  const ref = useRef(null)
  const timers = useRef([])
  const scrollTo = useScrollTo()
  const { letter } = content
  const [phase, setPhase] = useState(0)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const open = () => {
    if (phase) return
    setPhase(1)
    timers.current = [
      setTimeout(() => setPhase(2), 1050),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => scrollTo('#letter', { offset: -40 }), 2700),
    ]
  }

  const foldBack = () => {
    setPhase(0)
    scrollTo('#letter', { offset: -40 })
  }

  return (
    <section id="letter" ref={ref} className="relative overflow-hidden px-5 py-28 sm:px-6 sm:py-40">
      <ParallaxWord targetRef={ref} from="-30%" to="10%" className="top-1/3 right-0">
        {letter.backgroundWord}
      </ParallaxWord>

      <SectionHeading eyebrow={letter.eyebrow} title={letter.title} subtitle={letter.subtitle} className="relative" />

      <div className="relative mt-20 sm:mt-24">
        <AnimatePresence mode="wait">
          {phase < 3 ? (
            <Envelope key="envelope" phase={phase} onOpen={open} greeting={letter.greeting} hint={letter.hint} />
          ) : (
            <LetterCard key="letter" letter={letter} onFoldBack={foldBack} />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
