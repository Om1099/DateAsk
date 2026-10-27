import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowDown, Check, Heart, Lock, Plane, Search } from 'lucide-react'
import { config, fill, proposal } from '../data'
import { Button } from '../components/Button'
import { HeartText } from '../components/HeartText'
import { OutfitArt } from '../components/OutfitArt'
import { ParallaxWord } from '../components/ParallaxWord'
import { SectionReveal } from '../components/SectionReveal'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { scrollToSection } from '../lib/scroll'
import { EASE_SILK, cn } from '../lib/utils'

/*
 * G · The official date investigation, round two.
 * A very serious case file reviews itself row by row; an optional mood board lets her
 * pick an outfit mood. Picking one concludes the *wardrobe* investigation only —
 * the date itself keeps waiting on her real answer to the final question.
 */

const ROW_STEP = 0.7 // seconds between rows being "reviewed"

function ReviewingDots() {
  return (
    <span className="inline-flex pl-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="dot-blink" style={{ animationDelay: `${i * 0.18}s` }}>
          .
        </span>
      ))}
    </span>
  )
}

function PendingPill({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-burgundy/25 bg-paper px-3.5 py-1 font-display text-lg leading-tight text-burgundy">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-dusty-rose" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-dusty-rose" />
      </span>
      {children}
    </span>
  )
}

function ValueBadge({ kind, value, note, concluded }) {
  switch (kind) {
    case 'cancelled':
      return (
        <span className="relative inline-block font-display text-xl text-ink-soft">
          {value}
          <motion.span
            aria-hidden
            className="absolute -left-1 -right-1 top-[55%] block h-[1.5px] origin-left bg-burgundy/70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.3, ease: EASE_SILK }}
          />
        </span>
      )
    case 'proposal':
      return (
        <span className="inline-flex flex-wrap items-center gap-2.5 sm:justify-end">
          <span className="font-display text-xl text-ink">{value}</span>
          {note && <PendingPill>{note}</PendingPill>}
        </span>
      )
    case 'progress':
      return (
        <span className="inline-flex items-center gap-2.5 font-display text-xl text-ink">
          {concluded ? (
            <Check aria-hidden className="h-4 w-4 text-burgundy" strokeWidth={2.5} />
          ) : (
            <span className="progress-indeterminate relative block h-1 w-14 shrink-0 overflow-hidden rounded-full bg-blush" />
          )}
          {value}
        </span>
      )
    case 'meter':
      // the fill is wider than its track on purpose: the overthinking is off the charts
      return (
        <span className="inline-flex items-center gap-6 font-display text-xl text-ink">
          <span className="relative block h-1.5 w-16 shrink-0 rounded-full bg-blush">
            <motion.span
              className="absolute inset-y-0 left-0 block w-[120%] origin-left rounded-full bg-[linear-gradient(90deg,#d99baa,#703d4b)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE_SILK, delay: 0.1 }}
            />
          </span>
          {value}
        </span>
      )
    case 'classified':
      return (
        <span className="inline-flex items-center gap-2 font-display text-xl text-ink">
          <Lock aria-hidden className="h-4 w-4 shrink-0 text-burgundy" />
          {value}
        </span>
      )
    case 'awaiting':
      return (
        <span className="inline-flex items-center gap-2 font-display text-xl text-burgundy">
          <Heart aria-hidden className="heart-soft h-4 w-4" fill="currentColor" strokeWidth={0} />
          {value}
        </span>
      )
    case 'pending':
      return <PendingPill>{value}</PendingPill>
    default:
      return <span className="font-display text-xl text-ink">{value}</span>
  }
}

// kinds that show the note inside the value itself
const NOTE_INSIDE = new Set(['proposal'])

function StatusRow({ row, index, started, reduce, concluded, outfitLabel }) {
  const [resolved, setResolved] = useState(reduce)

  useEffect(() => {
    if (!started || resolved) return
    const id = setTimeout(() => setResolved(true), (index * ROW_STEP + 0.8) * 1000)
    return () => clearTimeout(id)
  }, [started, resolved, index])

  let raw = row.value
  if (concluded && row.concludedValue) raw = row.concludedValue
  else if (row.kind === 'proposal' && !proposal.upcoming && row.valueNoDate) raw = row.valueNoDate
  const value = fill(raw)
  const rawNote = concluded && row.concludedNote ? row.concludedNote.replace('{outfit}', outfitLabel) : row.note
  const note = rawNote ? fill(rawNote) : ''
  if (!value.trim()) return null // e.g. no original date configured

  return (
    <motion.div
      className="grid grid-cols-1 gap-1.5 border-b border-dashed border-rose-gold/25 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.6, ease: EASE_SILK, delay: reduce ? 0 : index * ROW_STEP }}
    >
      <dt className="text-[11px] font-medium uppercase tracking-[0.24em] text-ink-soft">{fill(row.label)}</dt>
      <dd className="sm:text-right">
        <span className="sr-only">
          {value}
          {note ? ` — ${note}` : ''}
        </span>
        <span aria-hidden className="block">
          <AnimatePresence mode="wait" initial={false}>
            {resolved ? (
              <motion.span
                key={value}
                className="inline-flex flex-col items-start gap-1 sm:items-end"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
              >
                <ValueBadge kind={row.kind} value={value} note={note} concluded={concluded} />
                {note && !NOTE_INSIDE.has(row.kind) && (
                  <span className="inline-flex items-center gap-1.5 font-hand text-base leading-none text-rose-gold-deep">
                    {row.kind === 'cancelled' && <Plane aria-hidden className="h-3.5 w-3.5" />}
                    {row.kind === 'cancelled' ? note : `(${note})`}
                  </span>
                )}
              </motion.span>
            ) : (
              <motion.span key="reviewing" className="font-display text-lg italic text-ink-soft" exit={{ opacity: 0 }}>
                {fill(config.wardrobe.reviewingLabel)}
                <ReviewingDots />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </dd>
    </motion.div>
  )
}

/** "SECOND ATTEMPT. / EXTRA EFFORT. / SAME GIRL. ♡" — lands like a rubber stamp once the review is done. */
function Stamp({ lines, delay, reduce }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -bottom-9 right-3 flex select-none flex-col items-center gap-0.5 rounded-md border-[3px] border-double border-burgundy/80 bg-paper/80 px-3.5 py-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.2em] text-burgundy/90 sm:right-7 sm:text-[11px]"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.9, rotate: -14 }}
      animate={{ opacity: 1, scale: 1, rotate: -7 }}
      transition={reduce ? { duration: 0.2, delay } : { type: 'spring', stiffness: 420, damping: 22, delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block whitespace-nowrap">
          <HeartText text={fill(line)} current />
        </span>
      ))}
    </motion.span>
  )
}

function CaseFile({ chosen }) {
  const ref = useRef(null)
  const reduce = useReducedMotionPreference()
  const started = useInView(ref, { once: true, amount: 0.4 })
  const w = config.wardrobe
  const concluded = Boolean(chosen)
  const outfitLabel = chosen ? fill(chosen.label).replace(/\.$/, '') : ''
  const stampLines = (Array.isArray(w.stamp) ? w.stamp : [w.stamp]).filter(Boolean)
  const rows = w.status.map((row) =>
    row.id === 'venue' && config.venueMode === 'revealed' && config.venue ? { ...row, kind: 'plain', value: config.venue } : row,
  )

  return (
    <motion.article
      ref={ref}
      aria-labelledby="case-file-title"
      className="paper-texture relative mx-auto w-full max-w-2xl rounded-[10px] px-6 pb-12 pt-7 shadow-lifted sm:px-10 sm:pt-9"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE_SILK }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[6px] border border-rose-gold/20" />
      <header className="relative border-b border-rose-gold/25 pb-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-burgundy">{fill(w.caseLabel)}</p>
        <p id="case-file-title" className="mt-1.5 font-display text-xl italic text-ink sm:text-2xl">
          {fill(w.caseFile)}
        </p>
      </header>
      <dl className="relative">
        {rows.map((row, i) => (
          <StatusRow
            key={row.id ?? i}
            row={row}
            index={i}
            started={started}
            reduce={reduce}
            concluded={concluded}
            outfitLabel={outfitLabel}
          />
        ))}
      </dl>
      {started && stampLines.length > 0 && (
        <Stamp lines={stampLines} delay={reduce ? 0 : rows.length * ROW_STEP + 1.1} reduce={reduce} />
      )}
    </motion.article>
  )
}

function MoodCard({ option, index, selected, onSelect, wide }) {
  return (
    <motion.label
      className={cn(
        'relative flex cursor-pointer flex-col items-center rounded-[20px] border bg-paper px-4 pb-5 pt-4 text-center transition-[border-color,background-color,box-shadow] duration-300',
        'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-burgundy',
        selected ? 'border-burgundy/50 bg-blush/60 shadow-card' : 'border-rose-gold/20 hover:border-rose-gold/50 hover:shadow-soft',
        wide ? 'w-full sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(20%-0.6rem)]' : 'w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(20%-0.6rem)]',
      )}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.6, ease: EASE_SILK }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <input type="radio" name="outfit-mood" value={option.id} checked={selected} onChange={onSelect} className="sr-only" />
      <OutfitArt art={option.art} className="h-20 w-20 sm:h-24 sm:w-24" />
      <span className="mt-3 text-balance font-display text-[1.15rem] leading-tight text-ink">{fill(option.label)}</span>
      <span className="mt-1 text-balance text-[13px] leading-snug text-ink-soft">{fill(option.caption)}</span>
      {option.swatches?.length > 0 && (
        <span aria-hidden className="mt-3 flex gap-1.5">
          {option.swatches.map((c) => (
            <span key={c} className="h-3 w-3 rounded-full ring-1 ring-ink/15" style={{ background: c }} />
          ))}
        </span>
      )}
      <AnimatePresence>
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-burgundy text-ivory"
          >
            <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.label>
  )
}

function MoodBoard({ value, onChange }) {
  const w = config.wardrobe
  return (
    <motion.fieldset
      className="relative mx-auto mt-12 max-w-5xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.6, ease: EASE_SILK }}
    >
      <legend className="w-full text-center">
        <span className="block font-display text-[1.75rem] italic leading-tight text-burgundy">{fill(w.boardTitle)}</span>
        <span className="mt-1 block text-sm text-ink-soft">{fill(w.boardNote)}</span>
      </legend>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {w.options.map((option, i) => (
          <MoodCard
            key={option.id}
            option={option}
            index={i}
            selected={value === option.id}
            onSelect={() => onChange(option.id)}
            wide={w.options.length % 2 === 1 && i === w.options.length - 1}
          />
        ))}
      </div>
    </motion.fieldset>
  )
}

export function WardrobeInvestigation({ outfit, onOutfitChange }) {
  const ref = useRef(null)
  const w = config.wardrobe
  const [open, setOpen] = useState(false)
  const chosen = w.options.find((o) => o.id === outfit) ?? null

  const toggleBoard = () => {
    const next = !open
    setOpen(next)
    if (next) {
      // if the board would open below the fold, glide down to it
      requestAnimationFrame(() => {
        const board = document.getElementById('outfit-board')
        if (board && board.getBoundingClientRect().top > window.innerHeight * 0.72) scrollToSection(board, { offset: -140 })
      })
    }
  }

  return (
    <section id="wardrobe" ref={ref} aria-labelledby="wardrobe-title" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent, rgb(243 230 213 / .5) 15%, rgb(246 220 226 / .35) 85%, transparent)' }}
      />
      <ParallaxWord targetRef={ref} className="left-0 top-20">
        {fill(w.backgroundWord)}
      </ParallaxWord>

      <div className="relative mx-auto max-w-3xl text-center">
        <SectionReveal>
          <h2
            id="wardrobe-title"
            className="text-balance font-display text-[clamp(2.1rem,5.2vw,3.75rem)] font-light italic leading-[1.08] text-burgundy"
          >
            {fill(w.headline)}
          </h2>
        </SectionReveal>
        {w.subheading && (
          <SectionReveal delay={0.08}>
            <p className="mt-6 inline-flex rounded-full border border-burgundy/20 bg-paper/70 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-burgundy">
              {fill(w.subheading)}
            </p>
          </SectionReveal>
        )}
        <SectionReveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">{fill(w.body)}</p>
        </SectionReveal>
      </div>

      <div className="relative mt-12">
        <CaseFile chosen={chosen} />
      </div>

      <div className="relative mt-20 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={toggleBoard} aria-expanded={open} aria-controls="outfit-board" icon={<Search className="h-5 w-5" />}>
          {fill(w.inspectLabel)}
        </Button>
        <Button size="lg" variant="secondary" onClick={() => scrollToSection('#invitation')} icon={<ArrowDown className="h-5 w-5" />}>
          {fill(w.continueLabel)}
        </Button>
      </div>

      <div id="outfit-board" className="relative">
        <AnimatePresence>{open && <MoodBoard key="board" value={outfit} onChange={onOutfitChange} />}</AnimatePresence>
      </div>

      <div aria-live="polite" className="relative mt-8 text-center">
        <AnimatePresence>
          {chosen && (
            <motion.p
              key="recorded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_SILK }}
              className="mx-auto inline-block rounded-full bg-paper/80 px-5 py-2.5 font-display text-xl italic text-burgundy shadow-soft"
            >
              {fill(w.recordedMessage)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
