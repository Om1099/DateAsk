const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/** Parses 'YYYY-MM-DD' as a local calendar date. Returns null for anything invalid (e.g. 2026-02-31). */
export function parseISODate(iso) {
  const m = ISO_DATE.exec(String(iso ?? '').trim())
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])]
  const date = new Date(y, mo, d)
  return date.getFullYear() === y && date.getMonth() === mo && date.getDate() === d ? date : null
}

/** True if the date is today or later, in the visitor's own time zone. Past or invalid dates → false. */
export function isUpcoming(iso, now = new Date()) {
  const date = parseISODate(iso)
  if (!date) return false
  return date >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

// Dates are always written the British/Indian way ("Thursday, 5 November 2026"),
// whatever language her phone is set to.
const MONTH = new Intl.DateTimeFormat('en-GB', { month: 'long' })
const WEEKDAY = new Intl.DateTimeFormat('en-GB', { weekday: 'long' })

/** 1 → "1st", 5 → "5th", 22 → "22nd" */
export function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`
}

const compose = (iso, build) => {
  const date = parseISODate(iso)
  return date ? build(date, MONTH.format(date), WEEKDAY.format(date)) : ''
}

/** "9 October" */
export const formatDayMonth = (iso) => compose(iso, (d, month) => `${d.getDate()} ${month}`)
/** "9th October" */
export const formatOrdinalDayMonth = (iso) => compose(iso, (d, month) => `${ordinal(d.getDate())} ${month}`)
/** "Thursday, 5 November" */
export const formatLongDate = (iso) => compose(iso, (d, month, weekday) => `${weekday}, ${d.getDate()} ${month}`)
/** "Thursday, 5 November 2026" */
export const formatFullDate = (iso) => compose(iso, (d, month, weekday) => `${weekday}, ${d.getDate()} ${month} ${d.getFullYear()}`)

/** Today's date as a local YYYY-MM-DD string (the date picker's minimum). */
export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}
