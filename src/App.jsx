import { useCallback, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { CursorGlow } from './components/CursorGlow'
import { Divider } from './components/Divider'
import { FloatingPetals } from './components/FloatingPetals'
import { ScrollProgress } from './components/ScrollProgress'
import { usePersistentState } from './hooks/usePersistentState'
import { scrollToSection, waitForScroll } from './lib/scroll'
import { BloomingTree } from './sections/BloomingTree'
import { DateInvitation } from './sections/DateInvitation'
import { Footer } from './sections/Footer'
import { HeroSection } from './sections/HeroSection'
import { IntroSection } from './sections/IntroSection'
import { LoveLetter } from './sections/LoveLetter'
import { MemoryGallery } from './sections/MemoryGallery'
import { VoiceNoteSection } from './sections/VoiceNoteSection'

export default function App() {
  // Her answer and date picks are remembered in this browser only (see README → Privacy).
  const [answer, setAnswer] = usePersistentState('answer', null)
  const [plan, setPlan] = usePersistentState('plan', null)
  const [storyKey, setStoryKey] = useState(0)

  /** Glide back to the top, then replay every section from the beginning. */
  const replay = useCallback(async () => {
    scrollToSection(0)
    await waitForScroll(0)
    setAnswer(null)
    setStoryKey((k) => k + 1)
  }, [setAnswer])

  const clearSaved = useCallback(() => {
    setAnswer(null)
    setPlan(null)
  }, [setAnswer, setPlan])

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <FloatingPetals />
      <CursorGlow />
      <div aria-hidden className="grain" />

      {/* Sections are independent — reorder, remove or add freely. */}
      <main key={storyKey} className="relative z-10">
        <HeroSection focusOnMount={storyKey > 0} />
        <IntroSection />
        <MemoryGallery />
        <BloomingTree />
        <Divider />
        <LoveLetter />
        <VoiceNoteSection />
        <DateInvitation answer={answer} onAnswer={setAnswer} plan={plan} onPlanChange={setPlan} onReplay={replay} />
      </main>

      <Footer onReplay={replay} onClear={clearSaved} hasSaved={Boolean(answer || plan)} />
    </MotionConfig>
  )
}
