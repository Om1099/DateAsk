import { useState } from 'react'
import { motion } from 'motion/react'
import { Music2 } from 'lucide-react'
import { config, fill } from '../data'
import { ClipPlayer } from '../components/ClipPlayer'
import { Equalizer } from '../components/Equalizer'
import { SectionHeading } from '../components/SectionHeading'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { cn, withBase } from '../lib/utils'

// the cards lean a little, like notes pinned to a board; their tags lean the other way
const TILTS = [-1.1, 0.9, -0.7]
const TAG_TILTS = [-2.2, 1.8, -1.6]
const TAPES = ['bg-blush-deep/75', 'bg-champagne/95', 'bg-dusty-rose/40']

/** A personal dedication, written like a little love-letter label tied on with string. */
function DedicationTag({ text, tilt }) {
  return (
    <div className="relative mt-6" style={{ rotate: `${tilt}deg` }}>
      <span aria-hidden className="absolute -top-4 left-[1.6rem] h-5 w-px bg-rose-gold/60" />
      <div className="relative rounded-[14px] border border-rose-gold/35 bg-[linear-gradient(160deg,rgb(246_220_226/0.9),rgb(243_230_213/0.95))] px-5 pb-4 pt-6 shadow-[0_10px_22px_-14px_rgb(112_61_75/0.55)]">
        <span aria-hidden className="absolute left-[1.35rem] top-2.5 h-2 w-2 rounded-full border border-rose-gold/60 bg-paper" />
        <p className="text-pretty font-hand text-[1.6rem] leading-[1.18] text-burgundy">{text}</p>
      </div>
    </div>
  )
}

function SongCard({ clip, index, numberLabel, missingMessage }) {
  const reduce = useReducedMotionPreference()
  const [playing, setPlaying] = useState(false)
  const tilt = TILTS[index % TILTS.length]
  const number = String(index + 1).padStart(2, '0')
  const titleId = `song-${clip.id ?? index}-title`
  const title = fill(clip.title)

  return (
    <motion.li
      className="relative"
      initial={{ opacity: 0, y: 46, rotate: reduce ? tilt : tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: (index % 3) * 0.12 }}
    >
      <article
        aria-labelledby={titleId}
        className={cn(
          'paper-texture relative flex h-full flex-col rounded-[22px] px-6 pb-6 pt-8 transition-[box-shadow,translate] duration-500 sm:px-7',
          playing ? '-translate-y-1 shadow-lifted ring-1 ring-dusty-rose/50' : 'shadow-card',
        )}
      >
        <span aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[16px] border border-rose-gold/15" />
        <span
          aria-hidden
          className={cn('absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 shadow-sm', TAPES[index % TAPES.length])}
          style={{ rotate: `${-tilt * 2.4}deg` }}
        />

        <p className="relative flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.3em] text-burgundy">
          <span>
            {numberLabel} {number}
          </span>
          {playing ? <Equalizer className="h-3.5 text-burgundy" /> : <Music2 aria-hidden className="h-4 w-4 text-rose-gold" />}
        </p>
        <h3 id={titleId} className="relative mt-1.5 font-display text-[2rem] font-normal leading-tight text-ink">
          {title}
        </h3>

        <DedicationTag text={fill(clip.tag)} tilt={TAG_TILTS[index % TAG_TILTS.length]} />

        {clip.caption && (
          <p className="relative mt-5 text-pretty font-display text-lg italic leading-snug text-ink-soft">{fill(clip.caption)}</p>
        )}

        <div className="relative mt-auto pt-6">
          <ClipPlayer
            id={clip.id ?? String(index)}
            bare
            src={withBase(clip.src)}
            label={title}
            gain={clip.gain}
            seed={21 + index * 17}
            missingMessage={missingMessage}
            onPlayingChange={setPlaying}
          />
        </div>
      </article>
    </motion.li>
  )
}

/** F · Three little songs — a song clip on each card, with a dedication for her. Replaces the voice note. */
export function SongMoments() {
  const { songs } = config
  const clips = (songs?.clips ?? []).filter((c) => c && c.src)
  if (!clips.length) return null

  return (
    <section id="songs" aria-labelledby="songs-title" className="relative px-5 pb-28 pt-10 sm:px-8 sm:pb-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgb(243 230 213 / .45), transparent 85%)' }}
      />
      <SectionHeading id="songs-title" eyebrow={fill(songs.eyebrow)} title={fill(songs.title)} subtitle={fill(songs.intro)} className="relative" />

      <ol role="list" className="relative mx-auto mt-16 grid max-w-xl list-none gap-12 sm:mt-20 lg:max-w-6xl lg:grid-cols-3 lg:gap-8">
        {clips.map((clip, i) => (
          <SongCard key={clip.id ?? i} clip={clip} index={i} numberLabel={fill(songs.numberLabel)} missingMessage={fill(songs.missingMessage)} />
        ))}
      </ol>
    </section>
  )
}
