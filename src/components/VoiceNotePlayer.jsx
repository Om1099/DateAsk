import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { MELODY_DURATION, playMusicBox } from '../lib/musicBox'
import { clamp, cn, formatTime, mulberry32 } from '../lib/utils'

const BAR_COUNT = 44

function makeBars(n) {
  const rand = mulberry32(21)
  return Array.from({ length: n }, (_, i) => {
    const envelope = Math.sin((i / (n - 1)) * Math.PI) * 0.5 + 0.4
    return clamp(envelope * (0.5 + rand() * 0.75), 0.16, 1)
  })
}

function Bars({ bars, playing, className }) {
  return (
    <div className={cn('absolute inset-0 flex items-center justify-between', className)}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn('wave-bar block w-[2px] rounded-full bg-current sm:w-[3px]', playing && 'is-playing')}
          style={{ height: `${h * 100}%`, animationDelay: `${((i * 7) % 11) * -0.09}s` }}
        />
      ))}
    </div>
  )
}

/**
 * Voice-note player with an animated, seekable waveform.
 * Plays `src` if it exists; otherwise falls back to a synthesised music-box melody.
 */
export function VoiceNotePlayer({ src, title, fallbackTitle }) {
  const audioRef = useRef(null)
  const synthRef = useRef(null)
  const positionRef = useRef(0)
  const draggingRef = useRef(false)
  const [mode, setMode] = useState(src ? 'audio' : 'synth')
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(src ? 0 : MELODY_DURATION)
  const [elapsed, setElapsed] = useState(0)
  const progress = useMotionValue(0)
  const bars = useMemo(() => makeBars(BAR_COUNT), [])

  const clipPath = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`)
  const knobLeft = useTransform(progress, (p) => `${p * 100}%`)

  const setPosition = useCallback(
    (sec, total) => {
      positionRef.current = sec
      progress.set(total ? clamp(sec / total, 0, 1) : 0)
      setElapsed(Math.floor(sec))
    },
    [progress],
  )

  const stopSynth = () => {
    synthRef.current?.stop()
    synthRef.current = null
  }

  const fallBackToSynth = useCallback(() => {
    setMode('synth')
    setDuration(MELODY_DURATION)
  }, [])

  // smooth progress while playing (timeupdate alone is too choppy)
  useEffect(() => {
    if (!playing) return
    let id
    const tick = () => {
      if (!draggingRef.current) {
        if (mode === 'audio') {
          const a = audioRef.current
          setPosition(a.currentTime, a.duration)
        } else if (synthRef.current) {
          const t = synthRef.current.elapsed()
          if (t >= MELODY_DURATION) {
            stopSynth()
            setPlaying(false)
            setPosition(0, MELODY_DURATION)
            return
          }
          setPosition(t, MELODY_DURATION)
        }
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [playing, mode, setPosition])

  useEffect(() => () => stopSynth(), [])

  const play = async () => {
    if (mode === 'audio') {
      try {
        await audioRef.current.play()
        setPlaying(true)
        return
      } catch {
        fallBackToSynth()
        positionRef.current = 0
      }
    }
    const from = positionRef.current >= MELODY_DURATION - 0.1 ? 0 : positionRef.current
    synthRef.current = playMusicBox(from)
    if (synthRef.current) setPlaying(true)
  }

  const pause = () => {
    if (mode === 'audio') audioRef.current.pause()
    else stopSynth()
    setPlaying(false)
  }

  const total = mode === 'audio' ? duration : MELODY_DURATION

  const seek = (sec, commit) => {
    const t = clamp(sec, 0, total || 0)
    setPosition(t, total)
    if (mode === 'audio') {
      if (audioRef.current) audioRef.current.currentTime = t
    } else if (commit && playing) {
      stopSynth()
      synthRef.current = playMusicBox(t)
    }
  }

  const ratioFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return clamp((e.clientX - rect.left) / rect.width, 0, 1)
  }

  const onPointerDown = (e) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    seek(ratioFromEvent(e) * total, false)
  }
  const onPointerMove = (e) => {
    if (draggingRef.current) seek(ratioFromEvent(e) * total, false)
  }
  const onPointerUp = (e) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    seek(ratioFromEvent(e) * total, true)
  }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      seek(positionRef.current + (e.key === 'ArrowRight' ? 5 : -5), true)
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-rose-gold/15 bg-white/80 p-3 pr-4 shadow-soft sm:gap-5 sm:p-4 sm:pr-6">
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onEnded={() => {
            setPlaying(false)
            setPosition(0, duration)
          }}
          onError={() => mode === 'audio' && fallBackToSynth()}
        />
      )}

      <motion.button
        type="button"
        onClick={playing ? pause : play}
        aria-label={playing ? 'Pause voice note' : 'Play voice note'}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.9 }}
        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full text-white shadow-glow"
        style={{ background: 'linear-gradient(135deg, #eaa9b5, #b76e79 60%, #9c5662)' }}
      >
        {playing && <span aria-hidden className="ping-soft absolute inset-0 rounded-full bg-rose-gold/50" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.svg
            key={playing ? 'pause' : 'play'}
            viewBox="0 0 24 24"
            className="relative h-6 w-6"
            fill="currentColor"
            initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.2 }}
          >
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            ) : (
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.2-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
            )}
          </motion.svg>
        </AnimatePresence>
      </motion.button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-display text-lg italic text-ink">{mode === 'audio' ? title : fallbackTitle}</p>
          <span className="shrink-0 text-xs tabular-nums text-ink-soft">
            {formatTime(elapsed)} / {formatTime(total)}
          </span>
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={elapsed}
          aria-valuetext={`${formatTime(elapsed)} of ${formatTime(total)}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="relative mt-2 h-10 cursor-pointer touch-none select-none"
        >
          <Bars bars={bars} playing={playing} className="text-blush-200" />
          <motion.div className="absolute inset-0" style={{ clipPath }}>
            <Bars bars={bars} playing={playing} className="text-rose-gold" />
          </motion.div>
          <motion.span
            aria-hidden
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rose-gold-dark shadow"
            style={{ left: knobLeft }}
          />
        </div>
      </div>
    </div>
  )
}
