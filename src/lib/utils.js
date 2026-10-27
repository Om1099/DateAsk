export const cn = (...classes) => classes.filter(Boolean).join(' ')

/** Signature "silk" easing used for most reveals. */
export const EASE_SILK = [0.22, 1, 0.36, 1]

/** A 24×24 heart path (centred roughly on 12,12). */
export const HEART_PATH_24 =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'

/** Heart & petal tints drawn from the palette. */
export const PASTELS = ['#f6dce2', '#d99baa', '#b88670', '#f3e6d5', '#e9b5c1', '#c98a9a', '#efc6d0']

/** Lets '/audio/…' and '/photos/…' paths from the config work even when the site lives in a sub-folder. */
export function withBase(path) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path
  return import.meta.env.BASE_URL + path.slice(1)
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
export const lerp = (a, b, t) => a + (b - a) * t

/** Wraps v into [min, max) — used for endlessly looping parallax layers. */
export const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/** Small deterministic PRNG so generated layouts are identical on every render. */
export function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Samples a multi-stop colour gradient at t (0..1). */
export function gradientAt(stops, t) {
  const scaled = clamp(t, 0, 1) * (stops.length - 1)
  const i = Math.min(Math.floor(scaled), stops.length - 2)
  const [r1, g1, b1] = hexToRgb(stops[i])
  const [r2, g2, b2] = hexToRgb(stops[i + 1])
  const f = scaled - i
  return `rgb(${Math.round(lerp(r1, r2, f))} ${Math.round(lerp(g1, g2, f))} ${Math.round(lerp(b1, b2, f))})`
}

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null

/** Splits text into user-perceived characters, so emoji like ❤️ stay in one piece. */
export const splitGraphemes = (text) =>
  segmenter ? Array.from(segmenter.segment(text), (s) => s.segment) : (text.match(/\P{M}\p{M}*/gu) ?? [])
