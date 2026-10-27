import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { content } from '../content'
import { Reveal } from '../components/Reveal'
import { cn } from '../lib/utils'

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const accent = word.includes('*')
  return (
    <motion.span style={{ opacity }} className={cn(accent && 'italic text-rose-gold')}>
      {word.replace(/\*/g, '')}{' '}
    </motion.span>
  )
}

/** Each word lights up in turn as you scroll — the paragraph is "read" by scrolling. */
export function ScrollQuote() {
  const ref = useRef(null)
  const { quote } = content
  const words = quote.text.split(' ')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })

  return (
    <section id="quote" className="relative px-6 py-32 sm:py-48">
      <div ref={ref} className="mx-auto max-w-4xl">
        <Reveal y={30}>
          <span aria-hidden className="block h-16 font-display text-[7rem] leading-none text-rose-gold/35 sm:h-20 sm:text-[9rem]">
            “
          </span>
        </Reveal>
        <p className="font-display text-[clamp(1.75rem,4.4vw,3.2rem)] font-light leading-[1.3] text-ink">
          {words.map((word, i) => (
            <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>
        <Reveal delay={0.1} className="mt-10 font-hand text-3xl text-rose-gold">
          — {quote.signature}
        </Reveal>
      </div>
    </section>
  )
}
