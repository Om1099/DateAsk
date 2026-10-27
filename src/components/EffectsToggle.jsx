import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export function EffectsToggle({ on, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3, duration: 0.8 }}
      className="fixed bottom-4 right-4 z-[65] flex items-center gap-2.5 rounded-full border border-rose-gold/20 bg-white/90 py-2 pl-3.5 pr-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-soft shadow-soft sm:bottom-6 sm:right-6"
    >
      <span>✦ Sparkles</span>
      <span className={cn('relative h-5 w-9 rounded-full transition-colors duration-300', on ? 'bg-rose-gold' : 'bg-blush-200')}>
        <motion.span
          className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow"
          animate={{ x: on ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </span>
    </motion.button>
  )
}
