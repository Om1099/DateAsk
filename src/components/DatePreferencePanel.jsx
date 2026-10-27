import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CalendarDays, Check, Coffee, Copy, Gift, Heart, Lock, Pencil, Sparkles, Sunset, UtensilsCrossed, X } from 'lucide-react'
import { config, fill, names } from '../data'
import { copyText, describePlan, planToText, todayISO } from '../lib/plan'
import { cn } from '../lib/utils'
import { Button, IconButton } from './Button'
import { Modal } from './Modal'

const ICONS = { coffee: Coffee, dinner: UtensilsCrossed, sunset: Sunset, gift: Gift, sparkles: Sparkles, heart: Heart }

const legend = 'text-[11px] font-medium uppercase tracking-[0.28em] text-burgundy'
const focusRing = 'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-burgundy'

/**
 * Optional, playful date planner. Her picks are saved only in this browser (localStorage) —
 * nothing is submitted anywhere. She can copy the plan and send it herself if she likes.
 */
export function DatePreferencePanel({ open, onClose, plan, onSave }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="planner-title"
      layout="sheet"
      className="max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-paper shadow-lifted sm:max-w-xl sm:rounded-[28px]"
    >
      <Planner plan={plan} onSave={onSave} onClose={onClose} />
    </Modal>
  )
}

function Planner({ plan, onSave, onClose }) {
  const p = config.datePlanner
  const [draft, setDraft] = useState(() => ({
    optionId: plan?.optionId ?? '',
    day: plan?.day ?? '',
    customDate: plan?.customDate ?? '',
    note: plan?.note ?? '',
  }))
  const [saved, setSaved] = useState(null)
  const canSave = Boolean(draft.optionId || draft.day || draft.note.trim())
  const update = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const submit = (e) => {
    e.preventDefault()
    if (!canSave) return
    const next = { ...draft, note: draft.note.trim(), savedAt: Date.now() }
    onSave(next)
    setSaved(next)
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {saved ? (
        <SavedView key="saved" plan={saved} onEdit={() => setSaved(null)} onDone={onClose} />
      ) : (
        <motion.form
          key="form"
          onSubmit={submit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="px-5 pb-7 pt-5 sm:px-8 sm:pb-8 sm:pt-8"
        >
          <span aria-hidden className="mx-auto mb-5 block h-1.5 w-12 rounded-full bg-rose-gold/25 sm:hidden" />
          <IconButton label="Close" onClick={onClose} className="absolute right-4 top-4 h-10 w-10 sm:right-5 sm:top-5">
            <X aria-hidden className="h-4 w-4" />
          </IconButton>

          <h2 id="planner-title" className="pr-12 font-display text-[2rem] leading-tight text-burgundy">
            {fill(p.title)}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{fill(p.subtitle)}</p>

          <fieldset className="mt-7">
            <legend className={legend}>{fill(p.whatLabel)}</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {p.options.map((o, i) => {
                const Icon = ICONS[o.icon] ?? Heart
                const selected = draft.optionId === o.id
                const fullWidth = p.options.length % 2 === 1 && i === p.options.length - 1
                return (
                  <label
                    key={o.id}
                    className={cn(
                      'relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 pr-9 transition-colors duration-300',
                      focusRing,
                      selected ? 'border-burgundy/45 bg-blush/70' : 'border-rose-gold/20 bg-ivory hover:border-rose-gold/50',
                      fullWidth && 'sm:col-span-2',
                    )}
                  >
                    <input
                      type="radio"
                      name="date-option"
                      value={o.id}
                      checked={selected}
                      onChange={() => update({ optionId: o.id })}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors',
                        selected ? 'bg-burgundy text-ivory' : 'bg-paper text-burgundy shadow-sm',
                      )}
                    >
                      <Icon aria-hidden className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-[1.15rem] leading-tight text-ink">{fill(o.label)}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{fill(o.description)}</span>
                    </span>
                    <AnimatePresence>
                      {selected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-burgundy text-ivory"
                        >
                          <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className={legend}>{fill(p.whenLabel)}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.days.map((d) => {
                const selected = draft.day === d.value
                return (
                  <label
                    key={d.value}
                    className={cn(
                      'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300',
                      focusRing,
                      selected ? 'border-burgundy bg-burgundy text-ivory' : 'border-rose-gold/30 bg-ivory text-ink hover:border-rose-gold/60',
                    )}
                  >
                    <input
                      type="radio"
                      name="date-day"
                      value={d.value}
                      checked={selected}
                      onChange={() => update({ day: d.value, customDate: '' })}
                      className="sr-only"
                    />
                    {fill(d.label)}
                    {d.note && (
                      <span className={cn('font-hand text-base leading-none', selected ? 'text-blush' : 'text-burgundy')}>
                        {fill(d.note)}
                      </span>
                    )}
                  </label>
                )
              })}
            </div>
            {p.allowCustomDate && (
              <label className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
                <CalendarDays aria-hidden className="h-4 w-4 text-burgundy" />
                <span>{fill(p.customDateLabel)}</span>
                <input
                  type="date"
                  min={todayISO()}
                  value={draft.customDate}
                  onChange={(e) => update({ customDate: e.target.value, day: e.target.value ? 'custom' : '' })}
                  className={cn(
                    'min-h-11 rounded-xl border bg-ivory px-3 py-2 text-base text-ink',
                    draft.day === 'custom' ? 'border-burgundy/60' : 'border-rose-gold/30',
                  )}
                />
              </label>
            )}
          </fieldset>

          <div className="mt-7">
            <label htmlFor="planner-note" className={legend}>
              {fill(p.noteLabel)}
            </label>
            <textarea
              id="planner-note"
              rows={3}
              maxLength={280}
              value={draft.note}
              onChange={(e) => update({ note: e.target.value })}
              placeholder={fill(p.notePlaceholder)}
              className="mt-3 w-full resize-none rounded-2xl border border-rose-gold/25 bg-ivory px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-soft/70"
            />
            <p className="mt-1 text-right text-xs tabular-nums text-ink-soft">{draft.note.length}/280</p>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
            <Lock aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {fill(p.privacyNote)}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              {fill(p.cancelLabel)}
            </Button>
            <Button type="submit" disabled={!canSave} icon={<Heart className="h-4 w-4" fill="currentColor" />}>
              {fill(p.saveLabel)}
            </Button>
          </div>
          {!canSave && <p className="mt-3 text-center text-xs text-ink-soft sm:text-right">{fill(p.emptyHint)}</p>}
        </motion.form>
      )}
    </AnimatePresence>
  )
}

function SavedView({ plan, onEdit, onDone }) {
  const p = config.datePlanner
  const headingRef = useRef(null)
  const [copyState, setCopyState] = useState('idle')
  const details = describePlan(plan, p)

  // the form (and the focused button) just disappeared — bring focus to the new content
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const copy = async () => {
    const ok = await copyText(planToText(plan, p, names.her))
    setCopyState(ok ? 'copied' : 'failed')
  }

  const rows = [
    ['What', details.what],
    ['When', details.when],
    ['Note', details.note],
  ].filter(([, value]) => value)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-5 pb-8 pt-9 text-center sm:px-9"
    >
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush text-burgundy"
      >
        <Heart aria-hidden className="h-6 w-6" fill="currentColor" />
      </motion.span>
      <h2 id="planner-title" ref={headingRef} tabIndex={-1} className="mt-4 font-display text-3xl text-burgundy outline-none">
        {fill(p.savedTitle)}
      </h2>
      <p className="mt-1 text-sm text-ink-soft">{fill(p.savedMessage)}</p>

      <dl className="mt-6 space-y-3 rounded-2xl border border-rose-gold/15 bg-ivory p-4 text-left">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <dt className="w-14 shrink-0 pt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-burgundy">{label}</dt>
            <dd className="min-w-0 break-words font-display text-lg leading-snug text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={copy} icon={copyState === 'copied' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}>
          {copyState === 'copied' ? fill(p.copiedLabel) : fill(p.copyLabel)}
        </Button>
        <Button variant="secondary" onClick={onEdit} icon={<Pencil className="h-4 w-4" />}>
          {fill(p.editLabel)}
        </Button>
      </div>
      <p role="status" className="mt-4 font-hand text-xl text-burgundy">
        {copyState === 'failed' ? fill(p.copyFailedLabel) : fill(p.copyHint)}
      </p>
      <button
        type="button"
        onClick={onDone}
        className="mt-4 rounded-full px-3 py-1 text-sm text-ink-soft underline-offset-4 transition-colors hover:text-burgundy hover:underline"
      >
        {fill(p.doneLabel)}
      </button>
    </motion.div>
  )
}
