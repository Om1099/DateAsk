import { content } from '../content'
import { Divider } from '../components/Divider'
import { Reveal } from '../components/Reveal'
import { useScrollTo } from '../components/SmoothScroll'

export function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="relative px-6 pb-20 pt-10 text-center">
      <Divider />
      <Reveal y={20}>
        <p className="mt-4 font-hand text-3xl text-rose-gold">{content.footer.line}</p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.35em] text-ink-soft">{content.footer.small}</p>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="mt-10 text-[10px] font-medium uppercase tracking-[0.3em] text-ink-soft underline-offset-4 transition-colors hover:text-rose-gold hover:underline"
        >
          ↑ Back to the beginning
        </button>
      </Reveal>
    </footer>
  )
}
