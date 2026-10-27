import { useEffect, useState } from 'react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import { SmoothScroll } from './components/SmoothScroll'
import { ScrollProgress } from './components/ScrollProgress'
import { AmbientBackground } from './components/AmbientBackground'
import { MagicCursor } from './components/MagicCursor'
import { EffectsToggle } from './components/EffectsToggle'
import { Divider } from './components/Divider'
import { Hero } from './sections/Hero'
import { ScrollQuote } from './sections/ScrollQuote'
import { BloomingTree } from './sections/BloomingTree'
import { PolaroidGrid } from './sections/PolaroidGrid'
import { LoveLetter } from './sections/LoveLetter'
import { Promises } from './sections/Promises'
import { Footer } from './sections/Footer'

const SPARKLES_KEY = 'just-for-you:sparkles'

function useSparklesPreference() {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(SPARKLES_KEY) !== '0'
    } catch {
      return true
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(SPARKLES_KEY, on ? '1' : '0')
    } catch {
      /* storage unavailable — preference just won't persist */
    }
  }, [on])
  return [on, setOn]
}

export default function App() {
  const reduceMotion = useReducedMotion()
  const [sparkles, setSparkles] = useSparklesPreference()

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ScrollProgress />
        <AmbientBackground />
        <div aria-hidden className="grain" />
        <MagicCursor enabled={sparkles && !reduceMotion} />
        <EffectsToggle on={sparkles} onToggle={() => setSparkles((v) => !v)} />

        {/* Sections are independent — reorder, remove or add freely. */}
        <main className="relative z-10">
          <Hero />
          <ScrollQuote />
          <BloomingTree />
          <Divider />
          <PolaroidGrid />
          <Divider />
          <LoveLetter />
          <Divider />
          <Promises />
        </main>
        <Footer />
      </SmoothScroll>
    </MotionConfig>
  )
}
