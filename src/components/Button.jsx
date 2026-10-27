import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/utils'

const VARIANTS = {
  primary:
    'bg-[linear-gradient(135deg,#8a4d5e,#703d4b_55%,#5d3140)] text-ivory shadow-glow hover:shadow-[0_18px_40px_-10px_rgb(112_61_75/0.7)]',
  secondary: 'border border-burgundy/25 bg-paper/90 text-burgundy shadow-soft hover:border-burgundy/45 hover:bg-white',
  quiet: 'text-burgundy hover:bg-blush/60',
}

const SIZES = {
  sm: 'min-h-10 px-4 py-2 text-sm',
  md: 'min-h-12 px-6 py-3 text-[15px]',
  lg: 'min-h-14 px-8 py-4 text-base',
}

/** Rounded pill button with hover lift and tap feedback. Touch targets are ≥ 40px tall. */
export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', icon, shimmer = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className={cn(
        'relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-[0.01em] transition-[box-shadow,background-color,border-color,color,opacity] duration-300 disabled:cursor-not-allowed disabled:opacity-55',
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {shimmer && !disabled && (
        <span
          aria-hidden
          className="shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-transparent via-white/30 to-transparent"
        />
      )}
      {icon && (
        <span aria-hidden className="relative flex shrink-0">
          {icon}
        </span>
      )}
      <span className="relative">{children}</span>
    </motion.button>
  )
})

export function IconButton({ label, children, className, ...props }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      title={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-full bg-paper text-burgundy shadow-soft transition-colors hover:bg-white',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
