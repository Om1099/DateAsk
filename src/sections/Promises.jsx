import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { content } from '../content'
import { SectionHeading } from '../components/SectionHeading'
import { HeartBurst } from '../components/HeartBurst'
import { useScrollTo } from '../components/SmoothScroll'
import { useIsSmallScreen } from '../hooks/useMediaQuery'
import { celebrate } from '../lib/confetti'
import { EASE_SILK, HEART_PATH_24, cn } from '../lib/utils'
import { DateCard } from './DateCard'

const HEART_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='${HEART_PATH_24}'/%3E%3C/svg%3E") center / contain no-repeat`

function PromiseItem({ item, checked, onToggle, index }) {
  const [burstKey, setBurstKey] = useState(0)

  const handleClick = () => {
    if (!checked) setBurstKey((k) => k + 1)
    onToggle()
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: EASE_SILK, delay: index * 0.07 }}
    >
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition-colors duration-500 sm:gap-5 sm:px-5',
          checked ? 'bg-blush-100/90' : 'hover:bg-white',
        )}
      >
        <span className="relative grid h-9 w-9 shrink-0 place-items-center">
          <motion.span
            className="absolute inset-0 rounded-full border-[1.5px]"
            initial={false}
            animate={
              checked
                ? { scale: [1, 1.22, 1], backgroundColor: '#b76e79', borderColor: '#b76e79' }
                : { scale: 1, backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'rgba(183,110,121,0.45)' }
            }
            transition={{ duration: 0.45, ease: EASE_SILK }}
          />
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" aria-hidden>
            <motion.path
              d="M5.5 12.5 10 17l8.5-9.5"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ duration: 0.4, delay: checked ? 0.12 : 0, ease: EASE_SILK }}
            />
          </svg>
          <AnimatePresence>{checked && burstKey > 0 && <HeartBurst key={burstKey} count={9} distance={46} size={11} />}</AnimatePresence>
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl leading-snug text-ink sm:text-2xl">{item.title}</span>
          <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">{item.detail}</span>
        </span>

        <motion.span
          aria-hidden
          className="hidden shrink-0 font-hand text-xl text-rose-gold sm:block"
          initial={false}
          animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.6, rotate: checked ? -6 : -25 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          sealed ♡
        </motion.span>
      </motion.button>
    </motion.li>
  )
}

function HeartMeter({ value }) {
  return (
    <div className="relative h-9 w-9" style={{ WebkitMask: HEART_MASK, mask: HEART_MASK }} aria-hidden>
      <div className="absolute inset-0 bg-blush-200" />
      <motion.div
        className="absolute inset-0 origin-bottom bg-linear-to-t from-rose-gold-dark via-rose-gold to-blush-400"
        initial={false}
        animate={{ scaleY: value }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      />
    </div>
  )
}

const DODGE_LABELS = ['let me think…', 'hmm, are you sure?', "can't catch me ♡", 'okay fine — yes!']

/** The playful "no" — it slips away until it gives up and turns into a yes. */
function RunawayButton({ onGiveUp }) {
  const small = useIsSmallScreen()
  const [n, setN] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const last = n === DODGE_LABELS.length - 1

  const dodge = () => {
    if (last) return onGiveUp()
    const range = small ? 80 : 160
    const side = Math.random() < 0.5 ? -1 : 1
    setPos({ x: side * (range * 0.5 + Math.random() * range * 0.5), y: 10 + Math.random() * 40 })
    setN((v) => v + 1)
  }

  return (
    <motion.button
      type="button"
      onPointerEnter={(e) => e.pointerType === 'mouse' && !last && dodge()}
      onClick={dodge}
      animate={{ x: pos.x, y: pos.y, rotate: pos.x / 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={cn(
        'rounded-full px-5 py-2 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors',
        last ? 'bg-blush-100 text-rose-gold-dark' : 'text-ink-soft hover:text-rose-gold',
      )}
    >
      {DODGE_LABELS[n]}
    </motion.button>
  )
}

export function Promises() {
  const { promises } = content
  const scrollTo = useScrollTo()
  const sectionRef = useRef(null)
  const [checked, setChecked] = useState(() => promises.items.map(() => false))
  const [said, setSaid] = useState(false)

  const done = checked.filter(Boolean).length
  const total = promises.items.length
  const unlocked = done === total

  const toggle = (i) => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))

  const sayYes = () => {
    celebrate()
    setSaid(true)
    setTimeout(() => scrollTo('#date-card', { offset: -60 }), 900)
  }

  return (
    <section id="promises" ref={sectionRef} className="relative px-5 py-28 sm:px-6 sm:py-40">
      <SectionHeading eyebrow={promises.eyebrow} title={promises.title} subtitle={promises.subtitle} />

      <div className="mx-auto mt-16 max-w-2xl">
        <motion.div
          className="rounded-[28px] border border-white bg-white/70 p-2 shadow-soft sm:p-3"
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: EASE_SILK }}
        >
          <ul className="space-y-1">
            {promises.items.map((item, i) => (
              <PromiseItem key={i} item={item} index={i} checked={checked[i]} onToggle={() => toggle(i)} />
            ))}
          </ul>

          <div className="mt-2 flex items-center gap-4 rounded-2xl bg-blush-50 px-4 py-3 sm:px-5">
            <HeartMeter value={done / total} />
            <div className="flex-1">
              <p className="text-sm text-ink">
                <span className="font-display text-xl tabular-nums">{done}</span>
                <span className="text-ink-soft"> / {total} {promises.progressLabel}</span>
              </p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-blush-200">
                <motion.div
                  className="h-full origin-left rounded-full bg-linear-to-r from-blush-400 to-rose-gold"
                  initial={false}
                  animate={{ scaleX: done / total }}
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative mt-16 flex min-h-[9rem] flex-col items-center gap-6">
          <motion.p
            className="text-balance text-center font-display text-[clamp(1.9rem,5vw,3rem)] font-light italic leading-tight"
            initial={false}
            animate={{ opacity: unlocked ? 1 : 0.35, y: unlocked ? 0 : 6, color: unlocked ? '#5b3a42' : '#8a6670' }}
            transition={{ duration: 0.9, ease: EASE_SILK }}
          >
            {promises.question}
          </motion.p>
          <motion.button
            type="button"
            onClick={sayYes}
            disabled={!unlocked || said}
            className={cn(
              'relative overflow-hidden rounded-full px-9 py-5 text-xs font-medium uppercase tracking-[0.28em] text-white sm:px-12 sm:text-sm',
              unlocked ? 'shadow-glow' : 'cursor-not-allowed',
            )}
            style={{ background: '#e3c7cd' }}
            animate={unlocked && !said ? { scale: [1, 1.045, 1] } : { scale: 1 }}
            transition={unlocked && !said ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            whileHover={unlocked && !said ? { scale: 1.07 } : undefined}
            whileTap={unlocked && !said ? { scale: 0.95 } : undefined}
          >
            <motion.span
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #eaa9b5, #b76e79 55%, #9c5662)' }}
              initial={false}
              animate={{ opacity: unlocked ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            />
            {unlocked && !said && (
              <span aria-hidden className="shimmer absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/45 to-transparent" />
            )}
            <span className="relative flex items-center gap-3">
              {unlocked ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d={HEART_PATH_24} />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              )}
              {said ? promises.saidLabel : promises.cta}
            </span>
          </motion.button>

          <AnimatePresence mode="wait">
            {!unlocked && (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center font-hand text-xl text-ink-soft"
              >
                {promises.lockedHint}
              </motion.p>
            )}
            {unlocked && !said && (
              <motion.div key="runaway" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <RunawayButton onGiveUp={sayYes} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>{said && <DateCard onCelebrate={celebrate} />}</AnimatePresence>
    </section>
  )
}
