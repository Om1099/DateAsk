import { defaults } from './defaults'
import { romanticConfig } from './romanticConfig'
import { formatDayMonth, formatFullDate, formatOrdinalDayMonth, isUpcoming, parseISODate } from '../lib/dates'

const isBlank = (v) =>
  v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0)
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/** Deep-merges the personal config over the defaults, ignoring empty values. */
function mergeConfig(base, override) {
  if (isBlank(override)) return base
  if (isPlainObject(base) && isPlainObject(override)) {
    const merged = { ...base }
    for (const key of Object.keys(override)) merged[key] = mergeConfig(base[key], override[key])
    return merged
  }
  return override
}

export const config = mergeConfig(defaults, romanticConfig)

const firstFilled = (...values) => values.map((v) => (typeof v === 'string' ? v.trim() : '')).find(Boolean) ?? ''

export const names = {
  her: firstFilled(config.herNickname, config.herName), // "Jinudi"
  herName: firstFilled(config.herName, config.herNickname), // "Janvi"
  me: firstFilled(config.myNickname, config.myName), // "Mari Bakudi"
  myName: firstFilled(config.myName, config.myNickname), // "Om"
}

/** Her nicknames for the "a.k.a." line: main nickname first, no repeats, never her actual name. */
export const nicknames = [
  ...new Set(
    [config.herNickname, ...(config.alternateNicknames ?? config.herNicknames ?? [])]
      .map((n) => String(n ?? '').trim())
      .filter(Boolean),
  ),
].filter((n) => n !== names.herName)

/** Whether her answers are remembered in her browser (see `rememberChoices`). */
export const remember = config.rememberChoices === true

const joinWithAnd = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`)
const cityList = (config.workTravelContext ?? []).map((c) => String(c).trim()).filter(Boolean)

/** The first (cancelled) date — only ever mentioned in the past tense. */
export const original = {
  iso: parseISODate(config.originalDate) ? config.originalDate : null,
  date: formatDayMonth(config.originalDate), // "9 October"
  day: formatOrdinalDayMonth(config.originalDate), // "9th October"
  status: config.originalDateStatusLabels?.[config.originalDateStatus] ?? '',
}

/** The new date being proposed. `upcoming` is false once it has passed (or if it isn't set). */
const proposedUpcoming = isUpcoming(config.proposedDate)
export const proposal = {
  iso: proposedUpcoming ? config.proposedDate : null,
  upcoming: proposedUpcoming,
  date: proposedUpcoming ? formatDayMonth(config.proposedDate) : '', // "5 November"
  day: proposedUpcoming ? formatOrdinalDayMonth(config.proposedDate) : '', // "5th November"
  full: proposedUpcoming ? formatFullDate(config.proposedDate) : '', // "Thursday, 5 November 2026"
  label: proposedUpcoming
    ? firstFilled(config.proposedDateLabel) || `${formatOrdinalDayMonth(config.proposedDate)} ${config.proposedDate.slice(0, 4)}`
    : '',
}

const curlyApostrophes = (s) => s.replace(/(\w)'(\w)/g, '$1’$2')

const TOKENS = {
  herName: () => names.herName || 'you',
  myName: () => names.myName,
  me: () => names.me,
  originalDate: () => original.date,
  originalDay: () => original.day,
  originalStatus: () => original.status,
  proposedDate: () => proposal.date,
  proposedDay: () => proposal.day,
  proposedFullDate: () => proposal.full,
  proposedDateLabel: () => proposal.label,
  cities: () => joinWithAnd(cityList),
  cityList: () => cityList.join(', '),
}

/**
 * Fills placeholders from the config:
 *   {her} {herName} {me} {myName} · {originalDate} {originalDay} {originalStatus}
 *   {proposedDate} {proposedDay} {proposedFullDate} {proposedDateLabel} · {cities} {cityList}
 * When her nickname is missing, sentences are tidied so they still read naturally.
 */
export function fill(text = '') {
  let s = String(text)
  if (!names.her) {
    s = s
      .replace(/\b(Hey|Hi|Hello), \{her\}/g, '$1, you')
      .replace(/,?\s*my \{her\}/g, '')
      .replace(/^\{her\},\s*(\S)/, (_, c) => c.toUpperCase())
      .replace(/,\s*\{her\}(?=[,.…!?])/g, '')
  }
  s = s.replace(/\{her\}/g, names.her || 'you').replace(/\{(\w+)\}/g, (match, key) => (TOKENS[key] ? TOKENS[key]() : match))
  return curlyApostrophes(s)
}
