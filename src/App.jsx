import { useCallback, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { remember } from './data'
import { MusicControl, MusicProvider } from './components/BackgroundMusic'
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
import { SongMoments } from './sections/SongMoments'
import { WardrobeInvestigation } from './sections/WardrobeInvestigation'

export default function App() {
  // Her choices live in component state; with `rememberChoices: true` they're also kept
  // in her browser's localStorage (never sent anywhere — see README → Privacy).
  const [answer, setAnswer] = usePersistentState('answer', null, remember)
  const [outfit, setOutfit] = usePersistentState('outfit', null, remember)
  const [plan, setPlan] = usePersistentState('plan', null, remember)
  const [storyKey, setStoryKey] = useState(0)

  /** Glide back to the top, then replay the story from the beginning (her date plan is kept). */
  const replay = useCallback(async () => {
    scrollToSection(0)
    await waitForScroll(0)
    setAnswer(null)
    setOutfit(null)
    setStoryKey((k) => k + 1)
  }, [setAnswer, setOutfit])

  const clearSaved = useCallback(() => {
    setAnswer(null)
    setOutfit(null)
    setPlan(null)
  }, [setAnswer, setOutfit, setPlan])

  return (
    <MotionConfig reducedMotion="user">
      {/* the music lives outside <main>, so replaying the story doesn't restart the song */}
      <MusicProvider>
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
          <SongMoments />
          <WardrobeInvestigation outfit={outfit} onOutfitChange={setOutfit} />
          <DateInvitation answer={answer} onAnswer={setAnswer} plan={plan} onPlanChange={setPlan} onReplay={replay} />
        </main>

        <Footer onReplay={replay} onClear={clearSaved} hasSaved={Boolean(answer || outfit || plan)} />
        <MusicControl />
      </MusicProvider>
    </MotionConfig>
  )
}
