import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { CalendarHeart, Heart, RotateCcw } from 'lucide-react'
import { config, fill, proposal } from '../data'
import { Button } from '../components/Button'
import { DatePreferencePanel } from '../components/DatePreferencePanel'
import { FloatingHearts } from '../components/FloatingHearts'
import { LocalPetals } from '../components/FloatingPetals'
import { Magnetic } from '../components/Magnetic'
import { SplitText } from '../components/SplitText'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { celebrate } from '../lib/confetti'
import { describePlan } from '../lib/plan'
import { EASE_SILK } from '../lib/utils'

const stage = {
  hidden: { opacity: 0, y: 22 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_SILK, delay } }),
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

/** The question, revealed in paced stages: lead → teases → the question → message → card → choices. */
function TheQuestion({ play, reduce, planFirst, onYes, onPlanFirst, onPlan }) {
  const inv = config.invitation
  const teases = (inv.teases ?? []).filter(Boolean)
  const planMessages = (inv.planFirstMessages ?? []).filter(Boolean)

  // timeline (seconds after the section comes into view)
  const step = reduce ? 0.12 : 1.1
  const leadAt = reduce ? 0 : 0.15
  const teaseAt = teases.map((_, i) => leadAt + step * (i + 1))
  const questionAt = leadAt + step * (teases.length + 1)
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

/** After “yes”: the headline turns celebratory, then the next steps appear. */
function Celebration({ play, fresh, onPickDate, onReplay }) {
  const s = config.invitation.success
  const t = fresh ? [0.2, 1.05, 1.5, 1.9] : [0.1, 0.45, 0.75, 1.0]
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
      <motion.p {...reveal(2)} className="mx-auto mt-10 max-w-2xl text-balance font-hand text-[clamp(1.9rem,4.6vw,2.6rem)] leading-tight text-burgundy">
        {fill(proposal.upcoming ? s.kicker : s.kickerNoDate)}
      </motion.p>
      <motion.div {...reveal(3)} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
