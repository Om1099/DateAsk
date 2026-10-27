import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Mail, MailOpen, X } from 'lucide-react'
import { config, fill, names } from '../data'
import { Button, IconButton } from '../components/Button'
import { ParallaxWord } from '../components/ParallaxWord'
import { Eyebrow } from '../components/SectionHeading'
import { SectionReveal } from '../components/SectionReveal'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { scrollToSection } from '../lib/scroll'
import { EASE_SILK, cn } from '../lib/utils'

/*
 * Phases: 0 sealed → 1 seal pops & flap swings open → 2 letter lifts out → 3 the letter is shown.
 * Closing returns to a sealed envelope, so it can be opened again as often as she likes.
 */

function WaxSeal({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('drop-shadow-[0_4px_6px_rgba(80,30,45,0.35)]', className)} aria-hidden>
      <defs>
        <radialGradient id="wax" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#a8566b" />
          <stop offset="0.6" stopColor="#703d4b" />
          <stop offset="1" stopColor="#4f2632" />
        </radialGradient>
      </defs>
      <path
        d="M32 3c5 0 7 4 11 5s9-1 11 3 0 8 2 11 6 6 5 10-5 6-5 10 2 8-1 11-8 1-11 3-6 6-11 6-7-4-11-6-9 0-11-3 0-8-2-11-6-6-5-10 5-6 5-10-2-8 1-11 8-1 11-3S27 3 32 3z"
        fill="url(#wax)"
      />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#e8b4c0" strokeOpacity=".35" strokeWidth="1.2" />
      <path
        d="M32 42.5l-1.3-1.2C25.9 37 23 34.3 23 31c0-2.7 2.1-4.8 4.8-4.8 1.5 0 3 .7 4.2 1.8 1.2-1.1 2.7-1.8 4.2-1.8 2.7 0 4.8 2.1 4.8 4.8 0 3.3-2.9 6-7.7 10.3L32 42.5z"
        fill="#f6dce2"
        fillOpacity=".85"
      />
    </svg>
  )
}

function Envelope({ phase, onOpen, hasRead, autoFocus, greeting }) {
  const { letter } = config
  const buttonRef = useRef(null)
  const sealed = phase === 0

  useEffect(() => {
    if (autoFocus) buttonRef.current?.focus({ preventScroll: true })
  }, [autoFocus])

  return (
    <motion.div
      // the top padding is headroom for the flap and the letter as they rise out of the envelope
      className="mx-auto flex w-[min(88vw,440px)] flex-col items-center pt-[min(36vw,170px)]"
      initial={{ opacity: 0, y: 50, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      viewport={{ once: true, amount: 0.35 }}
      exit={{ opacity: 0, y: 60, scale: 0.92, transition: { duration: 0.5, ease: EASE_SILK } }}
      transition={{ duration: 1, ease: EASE_SILK }}
    >
      {/* the envelope itself is a big, friendly tap target; the real button sits below it */}
      <motion.div
        aria-hidden
        onClick={sealed ? onOpen : undefined}
        className={cn('relative aspect-[1.55] w-full', sealed && 'cursor-pointer')}
        style={{ perspective: 1400 }}
        whileHover={sealed ? { y: -6, rotate: 1.5 } : undefined}
        whileTap={sealed ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <div className="absolute inset-0 rounded-lg bg-[linear-gradient(160deg,#efc9d1,#e2adb9)] shadow-[0_40px_70px_-28px_rgba(112,61,75,0.55)]" />

        {/* the letter tucked inside */}
        <motion.div
          className="paper-texture absolute inset-x-[5%] bottom-[5%] top-[6%] rounded-md shadow-[0_2px_10px_rgba(71,54,58,0.12)]"
          style={{ zIndex: 10 }}
          initial={false}
          animate={{ y: phase >= 2 ? '-52%' : '0%' }}
          transition={{ duration: 1.1, ease: EASE_SILK }}
        >
          <div className="flex h-full flex-col items-center px-6 pt-4 sm:pt-6">
            <span className="max-w-full truncate font-hand text-2xl text-burgundy sm:text-3xl">{greeting}</span>
            <div className="mt-3 w-full space-y-2.5">
              {[88, 72, 84, 58].map((w, i) => (
                <div key={i} className="mx-auto h-[3px] rounded-full bg-blush-deep" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* front pocket */}
        <svg viewBox="0 0 155 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ zIndex: 20 }} aria-hidden>
          <defs>
            <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fae6ea" />
              <stop offset="1" stopColor="#f0cdd5" />
            </linearGradient>
          </defs>
          <path d="M0 5Q0 0 4 2.5L77.5 55 151 2.5Q155 0 155 5v90q0 5-5 5H5q-5 0-5-5z" fill="url(#env-pocket)" />
          <path d="M2 98 77.5 53 153 98" fill="none" stroke="#e2b1bc" strokeWidth=".6" />
        </svg>

        {/* handwritten address */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[9%] flex flex-col items-center" style={{ zIndex: 25 }}>
          <span className="font-hand text-[clamp(1.5rem,5vw,2rem)] leading-none text-burgundy">{fill(letter.envelopeTo)}</span>
          {names.me && (
            <span className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em] text-burgundy/70 sm:text-[10px]">
              {fill(letter.envelopeFrom)}
            </span>
          )}
        </div>

        {/* flap — a real 3D hinge with a lined inside */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[60%] origin-top"
          style={{ zIndex: phase >= 2 ? 5 : 30, transformStyle: 'preserve-3d' }}
          initial={false}
          animate={{ rotateX: phase >= 1 ? 180 : 0 }}
          transition={{ duration: 0.85, ease: [0.6, 0.05, 0.3, 1], delay: phase === 1 ? 0.25 : 0 }}
        >
          <svg viewBox="0 0 155 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }} aria-hidden>
            <defs>
              <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ecbcc7" />
                <stop offset="1" stopColor="#f6d8de" />
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
            <path d="M0 4Q0 0 5 0h145q5 0 5 4L81 57q-3.5 2.5-7 0z" fill="#f5e8da" />
            <path d="M12 6h131L79 52q-1.5 1-3 0z" fill="none" stroke="#d3ad98" strokeWidth=".6" strokeDasharray="2 2" />
          </svg>
        </motion.div>

        {/* wax seal */}
        <motion.span
          className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 40 }}
          initial={false}
          animate={sealed ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: 60, opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_SILK }}
        >
          <WaxSeal className="h-14 w-14 sm:h-16 sm:w-16" />
        </motion.span>
      </motion.div>

      <div className="mt-10">
        <Button ref={buttonRef} size="lg" onClick={onOpen} disabled={!sealed} icon={<MailOpen className="h-5 w-5" />}>
          {hasRead ? fill(letter.reopenLabel) : fill(letter.openLabel)}
        </Button>
      </div>
    </motion.div>
  )
}

// "With love," · "With a smile," · "Forever yours," … — where the sign-off starts
const VALEDICTION = /^(with (all my |lots of )?love|with a smile|lots of love|love|yours( always| truly)?|forever( yours)?|always( yours)?|xoxo|warmly)\s*,$/i

/**
 * Splits the single letter string into greeting · paragraphs · sign-off · signature.
 * The greeting is a short first line; the sign-off starts at the last valediction ("With love,");
 * its final short line is shown as the handwritten signature.
 */
function parseLetter(text) {
  const blocks = text
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
  let greeting = null
  if (blocks.length > 1 && blocks[0].length <= 48 && !blocks[0].includes('\n')) greeting = blocks.shift()

  let start = -1
  for (let i = blocks.length - 1; i >= Math.max(1, blocks.length - 4); i--) {
    if (VALEDICTION.test(blocks[i].split('\n')[0].trim())) {
      start = i
      break
    }
  }

  const signoff = start > 0 ? blocks.splice(start) : []
  let signature = null
  if (signoff.length) {
    const lines = signoff.at(-1).split('\n')
    const tail = lines.at(-1).trim()
    if (tail.length <= 40 && !VALEDICTION.test(tail)) {
      signature = tail
      lines.pop()
      if (lines.length) signoff[signoff.length - 1] = lines.join('\n')
      else signoff.pop()
    }
  }
  return { greeting, body: blocks, signoff, signature }
}

const letterLine = {
  hidden: { opacity: 0, y: 18, filter: 'blur(5px)' },
  show: (delay = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE_SILK, delay } }),
}

// Each line fades in as she reaches it; the first few cascade in as the letter opens.
const lineReveal = (i) => ({
  variants: letterLine,
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.3 },
  custom: i < 4 ? 0.3 + i * 0.15 : 0.1,
})

function LetterPaper({ onClose }) {
  const { letter } = config
  const focusRef = useRef(null)
  const { greeting, body, signoff, signature } = useMemo(() => parseLetter(fill(letter.text)), [letter.text])

  // move focus into the letter so keyboard & screen-reader users land on it
  useEffect(() => {
    focusRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <motion.article
      ref={greeting ? undefined : focusRef}
      tabIndex={greeting ? undefined : -1}
      aria-labelledby={greeting ? 'letter-greeting' : undefined}
      aria-label={greeting ? undefined : 'Letter'}
      className="paper-texture relative mx-auto w-full max-w-2xl rounded-[6px] px-6 pb-12 pt-14 shadow-lifted outline-none sm:px-14 sm:pb-14 sm:pt-16"
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.4 } }}
      transition={{ duration: 1, ease: EASE_SILK }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[3px] border border-rose-gold/20 sm:inset-4" />
      <span aria-hidden className="absolute -top-5 left-1/2 -translate-x-1/2">
        <WaxSeal className="h-10 w-10" />
      </span>
      <IconButton label={fill(letter.closeLabel)} onClick={onClose} className="absolute right-4 top-4 h-10 w-10 sm:right-6 sm:top-6">
        <X aria-hidden className="h-4 w-4" />
      </IconButton>

      <div>
        {greeting && (
          <motion.p
            ref={focusRef}
            id="letter-greeting"
            tabIndex={-1}
            {...lineReveal(0)}
            className="pr-12 font-hand text-[2.5rem] leading-tight text-burgundy outline-none sm:text-5xl"
          >
            {greeting}
          </motion.p>
        )}
        {body.map((paragraph, i) => (
          <motion.p
            key={i}
            {...lineReveal(i + 1)}
            className="mt-5 whitespace-pre-line text-pretty font-display text-[1.25rem] leading-[1.7] text-ink sm:text-[1.4rem]"
          >
            {paragraph}
          </motion.p>
        ))}
        {signoff.length > 0 && (
          <motion.div {...lineReveal(99)} className="mt-10 space-y-1 text-right font-display text-xl italic leading-relaxed text-ink-soft">
            {signoff.map((block, i) => (
              <p key={i} className="whitespace-pre-line">
                {block}
              </p>
            ))}
          </motion.div>
        )}
        {signature && (
          <motion.p {...lineReveal(99)} className="mt-2 text-right font-hand text-[2.6rem] leading-none text-burgundy">
            {signature}
          </motion.p>
        )}
        <motion.div {...lineReveal(99)} className="mt-12 flex justify-center">
          <Button variant="secondary" onClick={onClose} icon={<Mail className="h-4 w-4" />}>
            {fill(letter.closeLabel)}
          </Button>
        </motion.div>
      </div>
    </motion.article>
  )
}

/** E · A letter, just for you. */
export function LoveLetter() {
  const ref = useRef(null)
  const timers = useRef([])
  const reduce = useReducedMotionPreference()
  const [phase, setPhase] = useState(0)
  const [hasRead, setHasRead] = useState(false)
  const [closedOnce, setClosedOnce] = useState(false)
  const { letter } = config
  const greeting = fill(letter.text).trim().split('\n')[0]

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const open = () => {
    if (phase !== 0) return
    clearTimers()
    setPhase(1)
    timers.current = [
      setTimeout(() => setPhase(2), reduce ? 120 : 950),
      setTimeout(
        () => {
          setPhase(3)
          setHasRead(true)
        },
        reduce ? 260 : 2250,
      ),
    ]
  }

  const close = () => {
    clearTimers()
    setPhase(0)
    setClosedOnce(true)
    scrollToSection('#letter')
  }

  return (
    <section id="letter" ref={ref} aria-labelledby="letter-title" className="relative overflow-hidden px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent, rgb(243 230 213 / .45) 16%)' }}
      />
      <ParallaxWord targetRef={ref} from="-25%" to="10%" className="right-0 top-[38%]">
        {fill(letter.backgroundWord)}
      </ParallaxWord>

      <div className="relative text-center">
        <SectionReveal y={16}>
          <Eyebrow>{fill(letter.eyebrow)}</Eyebrow>
        </SectionReveal>
        <SectionReveal delay={0.08}>
          <h2
            id="letter-title"
            className="mx-auto mt-5 max-w-3xl text-balance font-display text-[clamp(2.2rem,5.4vw,3.9rem)] font-light italic leading-[1.08] text-burgundy"
          >
            {fill(letter.label)}
          </h2>
        </SectionReveal>
      </div>

      <div className="relative mt-2 sm:mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {phase < 3 ? (
            <Envelope key="envelope" phase={phase} onOpen={open} hasRead={hasRead} autoFocus={closedOnce} greeting={greeting} />
          ) : (
            <LetterPaper key="letter" onClose={close} />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
