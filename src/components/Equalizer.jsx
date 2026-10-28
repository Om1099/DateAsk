import { cn } from '../lib/utils'

/** Four little bars that dance while music plays (they hold still under reduced motion). */
export function Equalizer({ className }) {
  return (
    <span aria-hidden className={cn('flex h-4 items-end gap-[3px]', className)}>
      {[0.9, 0.55, 1, 0.7].map((h, i) => (
        <span key={i} className="eq-bar block w-[3px] rounded-full bg-current" style={{ height: `${h * 100}%`, animationDelay: `${i * -0.27}s` }} />
      ))}
    </span>
  )
}
