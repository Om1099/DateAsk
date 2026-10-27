import { SectionReveal } from './SectionReveal'
import { cn } from '../lib/utils'

/** Renders `*words*` as an italic rose-gold accent. */
export function RichText({ text }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
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
    <p
      className={cn(
        'inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-burgundy',
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-rose-gold/60" />
      {children}
      <span aria-hidden className="h-px w-8 bg-rose-gold/60" />
    </p>
  )
}

export function SectionHeading({ id, eyebrow, title, subtitle, className }) {
  return (
    <div className={cn('flex flex-col items-center gap-5 text-center', className)}>
      <SectionReveal y={16}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </SectionReveal>
      <SectionReveal delay={0.08}>
        <h2
          id={id}
          className="max-w-3xl text-balance font-display text-[clamp(2.4rem,6vw,4.25rem)] font-light leading-[1.04] text-burgundy"
        >
          <RichText text={title} />
        </h2>
      </SectionReveal>
      {subtitle && (
        <SectionReveal delay={0.16}>
          <p className="max-w-xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg">{subtitle}</p>
        </SectionReveal>
      )}
    </div>
  )
}
