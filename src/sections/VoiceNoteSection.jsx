import { config, fill } from '../data'
import { Eyebrow } from '../components/SectionHeading'
import { SectionReveal } from '../components/SectionReveal'
import { VoiceNotePlayer } from '../components/VoiceNotePlayer'
import { withBase } from '../lib/utils'

/** F · A little voice note — sits right under the letter. */
export function VoiceNoteSection() {
  const { voiceNote } = config

  return (
    <section id="voice-note" aria-labelledby="voice-title" className="relative px-5 pb-28 pt-6 sm:px-8 sm:pb-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgb(243 230 213 / .45), transparent 85%)' }}
      />
      <div className="relative mx-auto max-w-xl text-center">
        <SectionReveal y={16}>
          <Eyebrow>{fill(voiceNote.eyebrow)}</Eyebrow>
        </SectionReveal>
        <SectionReveal delay={0.06}>
          <h2 id="voice-title" className="mt-4 font-display text-[clamp(1.9rem,4.6vw,2.8rem)] font-light italic leading-tight text-burgundy">
            {fill(voiceNote.caption)}
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.12} className="mt-8 text-left">
          <VoiceNotePlayer src={withBase(config.audioPath)} title={fill(voiceNote.title)} missingMessage={fill(voiceNote.missingMessage)} />
        </SectionReveal>
      </div>
    </section>
  )
}
