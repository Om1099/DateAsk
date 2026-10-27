import { Reveal } from './Reveal'
import { cn } from '../lib/utils'

/** Renders `*words*` as an italic rose-gold accent. */
export function RichText({ text }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') ? (
      <em key={i} className="font-normal italic text-rose-gold">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  )
}

export function Eyebrow({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-rose-gold',
        className,
      )}
    >
      <span className="h-px w-8 bg-rose-gold/50" />
      {children}
      <span className="h-px w-8 bg-rose-gold/50" />
    </span>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, className }) {
  return (
    <div className={cn('flex flex-col items-center gap-5 text-center', className)}>
      <Reveal y={20}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="max-w-3xl text-balance font-display text-[clamp(2.4rem,6vw,4.25rem)] font-light leading-[1.05] text-ink">
          <RichText text={title} />
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className="max-w-xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}
