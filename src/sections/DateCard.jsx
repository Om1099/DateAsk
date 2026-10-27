import { motion } from 'framer-motion'
import { content } from '../content'
import { HeartIcon } from '../components/HeartIcon'
import { downloadCalendarInvite } from '../lib/calendar'
import { EASE_SILK } from '../lib/utils'

const ICONS = {
  calendar: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
}

const list = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SILK } },
}

/** The big reveal after "Yes": the details of the date, plus an add-to-calendar button. */
export function DateCard({ onCelebrate }) {
  const { date } = content

  return (
    <motion.div
      id="date-card"
      className="paper relative mx-auto mt-16 max-w-xl overflow-hidden rounded-[32px] px-6 py-12 text-center shadow-letter sm:px-12 sm:py-14"
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.3 }}
    >
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(244 184 197 / .55), transparent)' }}
      />

      <motion.div
        className="relative mx-auto grid h-16 w-16 place-items-center"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: [0, 1.25, 1], rotate: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: EASE_SILK }}
      >
        <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
          <HeartIcon className="h-14 w-14 text-rose-gold drop-shadow-[0_6px_14px_rgba(183,110,121,0.5)]" />
        </motion.span>
      </motion.div>

      <h3 className="relative mt-5 font-display text-5xl font-light text-ink sm:text-6xl">
        It&rsquo;s a <em className="italic text-rose-gold">date</em>
      </h3>
      <p className="relative mt-2 font-hand text-2xl text-ink-soft">{date.subtitle}</p>

      <motion.dl className="relative mt-9 grid gap-3 text-left sm:grid-cols-2" variants={list} initial="hidden" animate="show">
        {date.details.map((d) => (
          <motion.div key={d.label} variants={item} className="flex gap-3 rounded-2xl bg-blush-50 p-4">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-rose-gold" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d={ICONS[d.icon] ?? ICONS.sparkle} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <dt className="text-[10px] font-medium uppercase tracking-[0.3em] text-rose-gold">{d.label}</dt>
              <dd className="mt-1 font-display text-lg leading-snug text-ink">{d.value}</dd>
            </div>
          </motion.div>
        ))}
      </motion.dl>

      <motion.p
        className="relative mt-8 text-balance font-display text-xl italic text-ink-soft"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        {date.note}
      </motion.p>

      <motion.div
        className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: EASE_SILK }}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => downloadCalendarInvite(date.calendar)}
          className="rounded-full bg-rose-gold px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white shadow-glow"
        >
          Add to calendar
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onCelebrate}
          className="rounded-full border border-rose-gold/40 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-rose-gold-dark transition-colors hover:bg-blush-50"
        >
          Celebrate again ✦
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
