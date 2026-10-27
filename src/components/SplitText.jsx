import { motion } from 'motion/react'
import { EASE_SILK, cn, splitGraphemes } from '../lib/utils'
import { HEART_GLYPHS, HeartGlyph, HeartText } from './HeartText'

// Heart emoji are drawn as an on-palette SVG heart (system emoji can look loud next to the serif type).
// Screen readers still get the original character from the sr-only copy.

const container = {
  hidden: {},
  show: ({ delay, stagger }) => ({ transition: { delayChildren: delay, staggerChildren: stagger } }),
}

const VARIANTS = {
  rise: {
    hidden: { opacity: 0, y: '0.45em', filter: 'blur(8px)' },
    show: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE_SILK } },
  },
  pop: {
    hidden: { opacity: 0, y: '0.3em', scale: 0.4 },
    show: { opacity: 1, y: '0em', scale: 1, transition: { type: 'spring', stiffness: 380, damping: 14 } },
  },
}

// A lone symbol ("♡", "❤️") sticks to the word before it, so it never wraps onto a line by itself.
const SYMBOL_ONLY = /^[^\p{L}\p{N}]+$/u
const joinTrailingSymbols = (words) =>
  words.reduce((out, word) => {
    if (out.length && SYMBOL_ONLY.test(word)) out[out.length - 1] += ` ${word}`
    else out.push(word)
    return out
  }, [])

/**
 * Staggered text reveal, character by character (emoji-safe) or word by word.
 * Words never break mid-word. Screen readers get the plain sentence.
 * `play` lets a parent hold the reveal until the right moment.
 */
export function SplitText({ text, className, by = 'chars', variant = 'rise', delay = 0, stagger = 0.035, play = true, colorAt }) {
  const item = VARIANTS[variant] ?? VARIANTS.rise
  const words = joinTrailingSymbols(text.split(' ').filter(Boolean))
  const total = by === 'chars' ? splitGraphemes(text.replace(/ /g, '')).length : words.length
  let index = 0

  return (
    <motion.span
      className={cn('block', className)}
      initial="hidden"
      animate={play ? 'show' : 'hidden'}
      variants={container}
      custom={{ delay, stagger }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
          {by === 'words' ? (
            <motion.span variants={item} className="inline-block">
              <HeartText text={word} />
            </motion.span>
          ) : (
            splitGraphemes(word).map((ch, ci) => {
              const i = index++
              return (
                <motion.span
                  key={ci}
                  variants={item}
                  className="inline-block"
                  style={colorAt ? { color: colorAt(i / Math.max(1, total - 1)) } : undefined}
                >
                  {HEART_GLYPHS.has(ch) ? <HeartGlyph /> : ch}
                </motion.span>
              )
            })
          )}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}
