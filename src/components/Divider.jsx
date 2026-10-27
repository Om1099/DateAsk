import { motion } from 'motion/react'
import { HeartIcon } from './HeartIcon'
import { EASE_SILK, cn } from '../lib/utils'

/** A thin ornament — two hairlines drawing outwards from a little heart. */
export function Divider({ className }) {
  return (
    <div aria-hidden className={cn('mx-auto flex w-full max-w-xs items-center gap-4 px-6 py-4', className)}>
      <motion.span
        className="h-px flex-1 origin-right bg-linear-to-l from-rose-gold/60 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE_SILK }}
      />
      <motion.span
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.3 }}
      >
        <HeartIcon className="h-3.5 w-3.5 text-dusty-rose" />
      </motion.span>
      <motion.span
        className="h-px flex-1 origin-left bg-linear-to-r from-rose-gold/60 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE_SILK }}
      />
    </div>
  )
}
