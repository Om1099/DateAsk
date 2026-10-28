import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { CalendarHeart, Heart, RotateCcw } from 'lucide-react'
import { config, fill, proposal } from '../data'
import { Button } from '../components/Button'
import { DatePreferencePanel } from '../components/DatePreferencePanel'
import { FloatingHearts } from '../components/FloatingHearts'
import { LocalPetals } from '../components/FloatingPetals'
import { HeartGlyph, HeartText } from '../components/HeartText'
import { Magnetic } from '../components/Magnetic'
import { Photo } from '../components/Photo'
import { SplitText } from '../components/SplitText'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { celebrate } from '../lib/confetti'
import { describePlan } from '../lib/plan'
import { EASE_SILK, cn, withBase } from '../lib/utils'

const stage = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_SILK, delay } }),
}

const firstDate = config.invitation.firstDate?.photo ? config.invitation.firstDate : null

const FRAME = 'w-[42%] max-w-[11.5rem] shrink-0 rounded-[14px] bg-paper p-2 pb-3 shadow-card sm:p-2.5 sm:pb-3.5'
const FRAME_LABEL = 'block text-[9px] font-medium uppercase tracking-[0.3em] text-burgundy/85'
const FRAME_CAPTION = 'mt-0.5 block text-balance font-hand text-[1.15rem] leading-[1.1] text-ink sm:text-[1.35rem]'

/**
 * "then → next": the first-date photo, a dotted arrow, and an empty frame saved for the new date.
 * With `stamped` (after her yes) an "approved" stamp lands on the empty frame.
 */
function FirstDatePair({ play, delay = 0, stamped = false, className }) {
  const reduce = useReducedMotionPreference()
  if (!firstDate) return null
  const fd = firstDate
  const parts = proposal.upcoming ? proposal.parts : null

  // each frame is "placed" on the table: it drops in tilted a little too far, then settles
  const placed = (at, rotate) => {
    const away = { opacity: 0, y: 26, rotate: reduce ? rotate : rotate * 3 }
    return {
      initial: away,
      animate: play ? { opacity: 1, y: 0, rotate } : away,
      transition: { type: 'spring', stiffness: 80, damping: 15, delay: at },
    }
  }
  const stampAt = delay + (reduce ? 0.2 : 1.15)

  return (
    <div className={cn('relative mx-auto flex max-w-[26rem] items-center justify-center gap-1.5 sm:gap-4', className)}>
      <motion.figure {...placed(delay, -4)} className={FRAME}>
        <Photo src={withBase(fd.photo)} alt={fill(fd.alt)} position={fd.focus} className="aspect-[4/5] w-full rounded-[9px]" />
        <figcaption className="mt-2 text-center">
          <span className={FRAME_LABEL}>{fill(fd.label)}</span>
          <span className={FRAME_CAPTION}>{fill(fd.caption)}</span>
        </figcaption>
      </motion.figure>

      <motion.svg
        viewBox="0 0 48 26"
        fill="none"
        aria-hidden
        className="w-9 shrink-0 text-rose-gold sm:w-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
      >
        <path d="M4 17c9-9 24-11 37-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2.5 4" />
        <path d="M41 12l-6.5-1.6M41 12l-3.4 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </motion.svg>

      <motion.figure {...placed(delay + 0.45, 3)} className={FRAME}>
        <div className="relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-[9px] border border-dashed border-rose-gold/60 bg-[linear-gradient(160deg,var(--blush),var(--champagne))] px-2 text-center">
          <p>
            <span className={FRAME_LABEL}>{fill(fd.reservedLabel)}</span>
            {parts ? (
              <>
                <span className="mt-1.5 block font-display text-[clamp(2.6rem,10vw,3.4rem)] font-light leading-[0.9] text-burgundy">{parts.day}</span>
                <span className="mt-0.5 block font-display text-lg italic leading-tight text-ink sm:text-xl">{parts.month}</span>
              </>
            ) : (
              <span className="mt-1.5 block text-balance font-display text-lg italic leading-tight text-ink sm:text-xl">{fill(fd.reservedNoDate)}</span>
            )}
            {/* the stamp lands where the little heart sits, so the date itself stays readable */}
            <span aria-hidden className={cn('mt-2 block text-lg', stamped && 'invisible')}>
              <HeartGlyph />
            </span>
          </p>
          {stamped && (
            <motion.span
              className="absolute inset-x-0 bottom-[9%] mx-auto h-fit w-fit whitespace-nowrap rounded-md border-[3px] border-double border-burgundy/80 bg-paper/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-burgundy shadow-sm sm:text-xs"
              initial={reduce ? { opacity: 0, rotate: -10 } : { opacity: 0, scale: 1.9, rotate: -18 }}
              animate={play ? { opacity: 1, scale: 1, rotate: -10 } : undefined}
              transition={reduce ? { duration: 0.2, delay: stampAt } : { type: 'spring', stiffness: 420, damping: 22, delay: stampAt }}
            >
              <HeartText text={fill(fd.stamp)} current />
            </motion.span>
          )}
        </div>
        <figcaption className="mt-2 text-center">
          <span className={FRAME_LABEL}>{fill(fd.nextLabel)}</span>
          <span className={FRAME_CAPTION}>{fill(stamped ? fd.nextCaptionYes : fd.nextCaption)}</span>
        </figcaption>
      </motion.figure>
    </div>
  )
}

/** Warm rose-pink gradient with slow glowing highlights. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgb(255 249 243 / 0) 0%, #f6dce2 12%, #efc6d0 52%, #e9b9c5 84%, #f0cbd4 100%)' }}
      />
      <div
        className="glow-orb absolute left-1/2 top-[40%] h-[85vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(255 249 243 / .85), rgb(243 230 213 / .35) 50%, transparent)' }}
      />
      <div
        className="glow-orb glow-orb--slow absolute -left-[15vmax] top-[58%] h-[50vmax] w-[50vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(217 155 170 / .35), transparent)' }}
      />
      <div
        className="glow-orb glow-orb--slow absolute -right-[12vmax] top-[8%] h-[45vmax] w-[45vmax] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(243 230 213 / .7), transparent)' }}
      />
    </div>
  )
}

/** The date, written out like a printed invitation card — plus venue, time and dress code. */
function InvitationCard({ reveal }) {
  const inv = config.invitation
  const details = inv.details.map((d) => {
    if (d.id === 'venue' && config.venueMode === 'revealed' && config.venue) return { ...d, value: config.venue }
    if (d.id === 'time' && config.timeMode === 'set' && config.time) return { ...d, value: config.time }
    return d
  })

  return (
    <motion.div {...reveal} className="relative mx-auto mt-9 max-w-xl rounded-[18px] bg-paper/90 px-6 pb-7 pt-6 text-left shadow-soft sm:px-9 sm:pb-8">
      <span aria-hidden className="pointer-events-none absolute inset-2 rounded-[12px] border border-rose-gold/30" />
      <p className="relative text-center text-[10px] font-medium uppercase tracking-[0.32em] text-burgundy">{fill(inv.cardLabel)}</p>
      <p className="relative mt-2 text-balance text-center font-display text-[clamp(1.6rem,4.2vw,2.3rem)] leading-tight text-ink">
        {fill(proposal.upcoming ? inv.dateLine : inv.dateLineNoDate)}
      </p>
      <span aria-hidden className="relative mx-auto mt-4 block h-px w-16 bg-rose-gold/40" />
      <dl className="relative mt-5 space-y-3.5">
        {details.map((d) => (
          <div key={d.id ?? d.label} className="grid gap-1 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
            <dt className="text-[10px] font-medium uppercase tracking-[0.26em] text-burgundy sm:pt-1.5">{fill(d.label)}</dt>
            <dd className="text-pretty font-display text-lg leading-snug text-ink">{fill(d.value)}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}

/** The question, revealed in paced stages: lead → teases → then & next → the question → message → card → choices. */
function TheQuestion({ play, reduce, planFirst, onYes, onPlanFirst, onPlan }) {
  const inv = config.invitation
  const teases = (inv.teases ?? []).filter(Boolean)
  const planMessages = (inv.planFirstMessages ?? []).filter(Boolean)

  // timeline (seconds after the section comes into view)
  const step = reduce ? 0.12 : 1.1
  const leadAt = reduce ? 0 : 0.15
  const teaseAt = teases.map((_, i) => leadAt + step * (i + 1))
  const pairAt = leadAt + step * (teases.length + 1)
  const questionAt = pairAt + (firstDate ? (reduce ? 0.12 : 1.5) : 0)
  const messageAt = questionAt + (reduce ? 0.12 : 1.0)
  const cardAt = messageAt + (reduce ? 0.12 : 0.5)
  const buttonsAt = cardAt + (reduce ? 0.12 : 0.6)
  const reveal = (delay) => ({ variants: stage, initial: 'hidden', animate: play ? 'show' : 'hidden', custom: delay })

  return (
    <motion.div layout="position" exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)', transition: { duration: 0.45 } }}>
      <motion.p {...reveal(leadAt)} className="font-display text-[clamp(1.35rem,3.2vw,1.9rem)] font-light italic text-ink">
        {fill(inv.lead)}
      </motion.p>
      {teases.map((line, i) => (
        <motion.p
          key={i}
          {...reveal(teaseAt[i])}
          className={
            i === teases.length - 1
              ? 'mt-1 font-hand text-[clamp(1.75rem,4.4vw,2.4rem)] text-burgundy'
              : 'mt-3 font-display text-[clamp(1.2rem,2.8vw,1.6rem)] italic text-ink-soft'
          }
        >
          {fill(line)}
        </motion.p>
      ))}

      <FirstDatePair play={play} delay={pairAt} className="mt-9" />

      <h2
        id="invitation-title"
        className="mt-9 text-balance font-display text-[clamp(2.4rem,6.4vw,4.75rem)] font-light leading-[1.06] text-burgundy sm:mt-11"
      >
        <SplitText text={fill(proposal.upcoming ? inv.question : inv.questionNoDate)} by="words" play={play} delay={questionAt} stagger={0.08} />
      </h2>

      <motion.p {...reveal(messageAt)} className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink">
        {fill(inv.message)}
      </motion.p>

      <InvitationCard reveal={reveal(cardAt)} />

      <motion.div {...reveal(buttonsAt)} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Magnetic>
          <Button size="lg" shimmer onClick={onYes} icon={<Heart className="h-5 w-5" fill="currentColor" />}>
            {fill(inv.yesLabel)}
          </Button>
        </Magnetic>
        <Button size="lg" variant="secondary" onClick={onPlanFirst}>
          {fill(inv.planFirstLabel)}
        </Button>
      </motion.div>

      <AnimatePresence initial={false}>
        {planFirst && (
          <motion.div
            key="plan-first"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: EASE_SILK }}
            className="mx-auto mt-8 max-w-lg rounded-[26px] border border-white/70 bg-paper/85 px-6 py-6 shadow-soft"
          >
            <div role="status" className="space-y-3">
              {planMessages.map((message, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'text-pretty font-display text-xl italic leading-relaxed text-ink'
                      : 'text-pretty font-hand text-[1.45rem] leading-snug text-burgundy'
                  }
                >
                  {fill(message)}
                </p>
              ))}
            </div>
            <div className="mt-5">
              <Button onClick={onPlan} icon={<CalendarHeart className="h-5 w-5" />}>
                {fill(inv.planTogetherLabel)}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/** After “yes”: the headline turns celebratory, the empty frame gets its stamp, then the next steps appear. */
function Celebration({ play, fresh, onPickDate, onReplay }) {
  const s = config.invitation.success
  // heart & headline · message · then-&-next pair · kicker · buttons
  const t = fresh
    ? firstDate
      ? [0.2, 1.05, 1.45, 2.85, 3.25]
      : [0.2, 1.05, 1.05, 1.5, 1.9]
    : firstDate
      ? [0.1, 0.45, 0.6, 1.2, 1.4]
      : [0.1, 0.45, 0.45, 0.75, 1.0]
  const reveal = (i) => ({ variants: stage, initial: 'hidden', animate: play ? 'show' : 'hidden', custom: t[i] })

  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE_SILK }}>
      <motion.div
        className="relative mx-auto grid h-20 w-20 place-items-center"
        initial={{ scale: 0, rotate: -25 }}
        animate={play ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -25 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12, delay: t[0] }}
      >
        <span aria-hidden className="heart-ring absolute inset-0 rounded-full" />
        <span aria-hidden className="heart-ring heart-ring--late absolute inset-0 rounded-full" />
        <motion.span animate={{ scale: [1, 1.15, 1, 1.08, 1] }} transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.14, 0.28, 0.42, 1] }}>
          <Heart aria-hidden className="h-12 w-12 text-burgundy" fill="currentColor" strokeWidth={1} />
        </motion.span>
      </motion.div>

      <h2
        id="invitation-title"
        className="mt-7 font-display text-[clamp(2.3rem,7vw,4.6rem)] font-medium leading-[1.06] tracking-[0.05em] text-burgundy"
      >
        <SplitText text={fill(s.headline)} variant="pop" play={play} delay={t[0] + 0.2} stagger={0.035} />
      </h2>
      <motion.p {...reveal(1)} className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink">
        {fill(s.message)}
      </motion.p>
      <FirstDatePair play={play} delay={t[2]} stamped className="mt-9" />
      <motion.p {...reveal(3)} className="mx-auto mt-10 max-w-2xl text-balance font-hand text-[clamp(1.9rem,4.6vw,2.6rem)] leading-tight text-burgundy">
        {fill(proposal.upcoming ? s.kicker : s.kickerNoDate)}
      </motion.p>
      <motion.div {...reveal(4)} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={onPickDate} icon={<CalendarHeart className="h-5 w-5" />}>
          {fill(s.pickDateLabel)}
        </Button>
        <Button size="lg" variant="secondary" onClick={onReplay} icon={<RotateCcw className="h-5 w-5" />}>
          {fill(s.replayLabel)}
        </Button>
      </motion.div>
    </motion.div>
  )
}

function PlanSummary({ plan, onEdit }) {
  const planner = config.datePlanner
  const d = describePlan(plan)
  if (!d || (!d.what && !d.when && !d.note)) return null
  const text = [d.what, d.when].filter(Boolean).join(' · ') || d.note

  return (
    <motion.p
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mt-10 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-white/70 bg-paper/80 px-5 py-2.5 text-sm text-ink shadow-soft"
    >
      <CalendarHeart aria-hidden className="h-4 w-4 shrink-0 text-burgundy" />
      <span className="font-medium text-burgundy">{fill(planner.summaryLabel)}</span>
      <span>{text}</span>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-full px-1 text-burgundy underline decoration-burgundy/40 underline-offset-4 hover:decoration-burgundy"
      >
        {fill(planner.editLabel)}
      </button>
    </motion.p>
  )
}

/** H · The big question. Nothing is preselected; both answers are genuinely welcome. */
export function DateInvitation({ answer, onAnswer, plan, onPlanChange, onReplay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotionPreference()
  const [plannerOpen, setPlannerOpen] = useState(false)
  const [hearts, setHearts] = useState(false)
  const [fresh, setFresh] = useState(false)
  const heartsTimer = useRef()

  useEffect(() => () => clearTimeout(heartsTimer.current), [])

  const sayYes = () => {
    onAnswer('yes')
    setFresh(true)
    celebrate()
    setHearts(true)
    clearTimeout(heartsTimer.current)
    heartsTimer.current = setTimeout(() => setHearts(false), 4800)
  }

  const openPlanner = useCallback(() => setPlannerOpen(true), [])
  const closePlanner = useCallback(() => setPlannerOpen(false), [])

  return (
    <section
      id="invitation"
      ref={ref}
      aria-labelledby="invitation-title"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-28 text-center sm:px-8 sm:py-32"
    >
      <Backdrop />
      <LocalPetals count={9} seed={23} className="-z-10" />
      {!reduce && <FloatingHearts show={hearts} />}

      <div className="relative w-full max-w-3xl">
        <AnimatePresence mode="wait" initial={false}>
          {answer === 'yes' ? (
            <Celebration key="yes" play={inView || fresh} fresh={fresh} onPickDate={openPlanner} onReplay={onReplay} />
          ) : (
            <TheQuestion
              key="ask"
              play={inView}
              reduce={reduce}
              planFirst={answer === 'plan-first'}
              onYes={sayYes}
              onPlanFirst={() => onAnswer('plan-first')}
              onPlan={openPlanner}
            />
          )}
        </AnimatePresence>
        {plan && <PlanSummary plan={plan} onEdit={openPlanner} />}
      </div>

      <DatePreferencePanel open={plannerOpen} onClose={closePlanner} plan={plan} onSave={onPlanChange} />
    </section>
  )
}
