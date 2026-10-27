import { motion } from 'framer-motion'
import { EASE_SILK, cn } from '../lib/utils'

const container = {
  hidden: {},
  show: ({ delay, stagger }) => ({ transition: { delayChildren: delay, staggerChildren: stagger } }),
}

const char = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(10px)' },
  show: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE_SILK } },
}

/**
 * Staggered per-character reveal. Words never break mid-word.
 * Pass `colorAt(t)` to tint characters along a gradient (t = 0..1 across the line).
 */
export function SplitText({ text, className, delay = 0, stagger = 0.035, colorAt }) {
  const words = text.split(' ')
  const total = text.replace(/ /g, '').length
  let index = 0

  return (
    <motion.span
      className={cn('block', className)}
      initial="hidden"
      animate="show"
      variants={container}
      custom={{ delay, stagger }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => {
            const i = index++
            return (
              <motion.span
                key={ci}
                variants={char}
                className="inline-block"
                style={colorAt ? { color: colorAt(i / Math.max(1, total - 1)) } : undefined}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}
