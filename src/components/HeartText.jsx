import { HEART_PATH_24, cn, splitGraphemes } from '../lib/utils'

export const HEART_GLYPHS = new Set(['❤️', '❤', '♥️', '♥'])

/**
 * A heart emoji drawn as an on-palette SVG heart — system emoji can look loud next to the serif type.
 * `current` paints it in the surrounding text colour (e.g. inside the rubber stamp).
 */
export function HeartGlyph({ current = false, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('inline-block h-[0.72em] w-[0.78em] align-[-0.02em]', !current && 'glyph-beat', className)}
    >
      {!current && (
        <defs>
          <linearGradient id="heart-glyph-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e3a7b5" />
            <stop offset="1" stopColor="#8a4d5e" />
          </linearGradient>
        </defs>
      )}
      <path d={HEART_PATH_24} fill={current ? 'currentColor' : 'url(#heart-glyph-gradient)'} />
    </svg>
  )
}

/** Text with any heart emoji swapped for <HeartGlyph>. Use where the text is also available to screen readers. */
export function HeartText({ text, current = false }) {
  const parts = splitGraphemes(text)
  if (!parts.some((g) => HEART_GLYPHS.has(g))) return text
  return parts.map((g, i) => (HEART_GLYPHS.has(g) ? <HeartGlyph key={i} current={current} /> : g))
}
