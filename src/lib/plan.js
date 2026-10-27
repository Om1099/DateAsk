import { config, fill, names, proposal } from '../data'
import { formatLongDate, parseISODate } from './dates'

/**
 * Day choices for the planner. The proposed date comes first — but only while it's still upcoming,
 * so the page never offers a day that has already gone by.
 */
export function getDayOptions() {
  const { datePlanner: planner, dateMode } = config
  const proposed = proposal.upcoming
    ? [{ value: proposal.iso, label: formatLongDate(proposal.iso), note: names.myName ? fill(planner.proposedNote) : '♡' }]
    : []
  if (dateMode === 'fixed') return proposed.length ? proposed : [{ value: 'together', label: fill(planner.undecidedLabel) }]
  return [...proposed, ...planner.days]
}

/** Turns a saved plan into readable labels. */
export function describePlan(plan, days = getDayOptions()) {
  if (!plan) return null
  const option = config.datePlanner.options.find((o) => o.id === plan.optionId)
  const day = days.find((d) => d.value === plan.day)
  let when = ''
  if (plan.day === 'custom' && plan.customDate) when = formatLongDate(plan.customDate)
  else if (day) when = fill(day.label)
  else if (parseISODate(plan.day)) when = formatLongDate(plan.day)
  return { what: option ? fill(option.label) : '', when, note: plan.note ?? '' }
}

export function planToText(plan) {
  const d = describePlan(plan)
  if (!d) return ''
  const lines = ['Our little date ♡']
  if (d.what) lines.push(`What: ${d.what}`)
  if (d.when) lines.push(`When: ${d.when}`)
  if (d.note) lines.push(`Note: ${d.note}`)
  if (names.her) lines.push(`— planned by ${names.her}`)
  return lines.join('\n')
}

/** Copies text to the clipboard, with a fallback for older or non-secure contexts. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const active = document.activeElement
    try {
      const area = Object.assign(document.createElement('textarea'), { value: text, readOnly: true })
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
    } catch {
      return false
    } finally {
      if (active instanceof HTMLElement) active.focus({ preventScroll: true })
    }
  }
}
