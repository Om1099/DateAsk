import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { Mic, Pause, Play } from 'lucide-react'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import { clamp, cn, formatTime, mulberry32 } from '../lib/utils'

const BAR_COUNT = 46

function makeBars(n) {
  const rand = mulberry32(21)
  return Array.from({ length: n }, (_, i) => {
    const envelope = Math.sin((i / (n - 1)) * Math.PI) * 0.5 + 0.4
    return clamp(envelope * (0.5 + rand() * 0.75), 0.16, 1)
  })
}

function Bars({ bars, active, className }) {
  return (
    <div className={cn('absolute inset-0 flex items-center justify-between', className)}>
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn('wave-bar block w-[2px] rounded-full bg-current sm:w-[3px]', active && 'is-playing')}
          style={{ height: `${h * 100}%`, animationDelay: `${((i * 7) % 11) * -0.09}s` }}
        />
      ))}
    </div>
  )
}

/**
 * Custom voice-note player wrapped around a native <audio> element.
 * If the audio file hasn't been added yet, it says so kindly and stays disabled —
 * it never pretends to play. Nothing ever autoplays.
 */
export function VoiceNotePlayer({ src, title, missingMessage }) {
  const audioRef = useRef(null)
  const draggingRef = useRef(false)
  const reduce = useReducedMotionPreference()
  const [status, setStatus] = useState(src ? 'checking' : 'missing') // checking · ready · missing
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const progress = useMotionValue(0)
  const bars = useMemo(() => makeBars(BAR_COUNT), [])
  const clipPath = useTransform(progress, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`)
  const knobLeft = useTransform(progress, (p) => `${p * 100}%`)
  const ready = status === 'ready'

  // Is the file really there? Hosts with SPA fallbacks answer missing files with HTML, not audio.
  useEffect(() => {
    if (!src) return
    let cancelled = false
    fetch(src, { method: 'HEAD', cache: 'no-store' })
      .then((res) => {
        if (cancelled || res.status === 405 || res.status === 501) return
        const type = res.headers.get('content-type') ?? ''
        if (!res.ok || type.includes('text/html')) setStatus('missing')
        else setStatus((s) => (s === 'checking' ? 'ready' : s))
      })
      .catch(() => {
        /* offline or cross-origin: the <audio> element's own events decide */
      })
    return () => {
      cancelled = true
    }
  }, [src])

  // Smooth progress while playing — a motion value, so no per-frame React renders.
  useEffect(() => {
    if (!playing) return
    let id
    const tick = () => {
      const a = audioRef.current
      if (a && !draggingRef.current && Number.isFinite(a.duration) && a.duration > 0) {
        progress.set(a.currentTime / a.duration)
      }
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [playing, progress])

  const toggle = async () => {
    const a = audioRef.current
    if (!a || !ready) return
    if (!a.paused) {
      a.pause()
      return
    }
    try {
      await a.play()
    } catch (err) {
      if (err?.name === 'NotSupportedError') setStatus('missing')
    }
  }

  const seekToRatio = (ratio) => {
    const a = audioRef.current
    if (!a || !ready || !Number.isFinite(a.duration) || a.duration <= 0) return
    const t = clamp(ratio, 0, 1) * a.duration
    a.currentTime = t
    progress.set(t / a.duration)
    setElapsed(Math.floor(t))
  }

  const ratioFromEvent = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    return (e.clientX - r.left) / r.width
  }

  const onPointerDown = (e) => {
    if (!ready) return
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    seekToRatio(ratioFromEvent(e))
  }
  const onPointerMove = (e) => {
    if (draggingRef.current) seekToRatio(ratioFromEvent(e))
  }
  const onPointerUp = () => {
    draggingRef.current = false
  }
  const onKeyDown = (e) => {
    const a = audioRef.current
    if (!a || !ready || !Number.isFinite(a.duration)) return
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[e.key]
    if (step) {
      e.preventDefault()
      seekToRatio((a.currentTime + step) / a.duration)
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      seekToRatio(e.key === 'Home' ? 0 : 1)
    }
  }

  const buttonLabel = !ready
    ? status === 'checking'
      ? 'Voice note loading'
      : 'Voice note not added yet'
    : playing
      ? 'Pause voice note'
      : 'Play voice note'

  return (
    <div className="rounded-[26px] border border-white/80 bg-paper/90 p-4 shadow-soft sm:p-5">
      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration
            if (Number.isFinite(d)) setDuration(d)
            setStatus('ready')
          }}
          onDurationChange={(e) => {
            const d = e.currentTarget.duration
            if (Number.isFinite(d)) setDuration(d)
          }}
          onTimeUpdate={(e) => setElapsed(Math.floor(e.currentTarget.currentTime))}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={(e) => {
            setPlaying(false)
            e.currentTarget.currentTime = 0
            progress.set(0)
            setElapsed(0)
          }}
          onError={() => {
            setPlaying(false)
            setStatus('missing')
          }}
        />
      )}

      <div className="flex items-center gap-4 sm:gap-5">
        <motion.button
          type="button"
          onClick={toggle}
          disabled={!ready}
          aria-label={buttonLabel}
          whileHover={ready ? { scale: 1.06 } : undefined}
          whileTap={ready ? { scale: 0.92 } : undefined}
          className={cn(
            'relative grid h-14 w-14 shrink-0 place-items-center rounded-full transition-[background-color,box-shadow,color] duration-500',
            ready
              ? 'bg-[linear-gradient(135deg,#8a4d5e,#703d4b_60%,#5d3140)] text-ivory shadow-glow'
              : 'cursor-not-allowed bg-blush text-burgundy/40',
          )}
        >
          {playing && <span aria-hidden className="ping-soft absolute inset-0 rounded-full bg-dusty-rose/60" />}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={playing ? 'pause' : 'play'}
              className="relative"
              initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: 40 }}
              transition={{ duration: 0.18 }}
            >
              {playing ? (
                <Pause aria-hidden className="h-6 w-6" fill="currentColor" strokeWidth={0} />
              ) : (
                <Play aria-hidden className="ml-0.5 h-6 w-6" fill="currentColor" strokeWidth={0} />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 font-display text-lg italic text-ink">
              {playing && (
                <span aria-hidden className="relative flex h-2 w-2 shrink-0">
                  <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-burgundy/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-burgundy" />
                </span>
              )}
              <span className="truncate">{title}</span>
            </p>
            <span className="shrink-0 text-xs tabular-nums text-ink-soft">
              {ready ? `${formatTime(elapsed)} / ${formatTime(duration)}` : '--:--'}
            </span>
          </div>

          <div
            role="slider"
            tabIndex={ready ? 0 : -1}
            aria-label="Voice note position"
            aria-disabled={!ready}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={elapsed}
            aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className={cn('relative mt-2 h-10 select-none', ready ? 'cursor-pointer touch-none' : 'cursor-default')}
          >
            <Bars bars={bars} active={playing && !reduce} className="text-blush-deep" />
            <motion.div className="absolute inset-0" style={{ clipPath }}>
              <Bars bars={bars} active={playing && !reduce} className="text-burgundy" />
            </motion.div>
            {ready && (
              <motion.span
                aria-hidden
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-burgundy shadow"
                style={{ left: knobLeft }}
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {status === 'missing' && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-start gap-2.5 rounded-2xl bg-blush/60 px-4 py-3 text-sm leading-relaxed text-ink"
          >
            <Mic aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
            {missingMessage}
          </motion.p>
        )}
      </AnimatePresence>
      {status === 'checking' && <p className="mt-3 text-xs text-ink-soft">Loading the voice note…</p>}
    </div>
  )
}
