import { defaults } from './defaults'
import { romanticConfig } from './romanticConfig'

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

export const names = {
  her: (romanticConfig.herName ?? '').trim(),
  me: (romanticConfig.myName ?? '').trim(),
}

const curlyApostrophes = (s) => s.replace(/(\w)'(\w)/g, '$1’$2')

/** Swaps {her}/{me} for the configured names — or “you”/“me” when they're empty. */
export function fill(text = '') {
  return curlyApostrophes(
    String(text)
      .replace(/\{her\}/g, names.her || 'you')
      .replace(/\{me\}/g, names.me || 'me'),
  )
}
