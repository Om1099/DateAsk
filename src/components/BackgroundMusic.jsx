import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Music, Play, Volume2, VolumeX } from 'lucide-react'
import { config, fill } from '../data'
import { useIsSmallScreen } from '../hooks/useMediaQuery'
import { EASE_SILK, clamp, cn, formatTime, withBase } from '../lib/utils'

/*
 * Background music for the whole page (config.music).
 *  · Never plays before she interacts: it starts from the opening button or the little ♫ control.
 *  · Fades in and out where the browser allows it. iPhones ignore volume changes, so there it simply starts/stops.
 *  · Steps aside while the voice note plays or the tab is hidden, and comes back if it was playing.
 *  · Story cues glide the track to a chosen moment (the big question, her yes).
 * What she wants (on/off) and the temporary holds are kept apart, and one sync() drives the <audio> toward them.
 */

const music = config.music ?? {}
const SRC = music.src ? withBase(music.src) : ''
const TARGET = clamp(Number(music.volume ?? 0.45) || 0, 0, 1)
const cueAt = (name) => {
  const v = music.cues?.[name]
  return v === null || v === undefined || v === '' ? NaN : Number(v)
}

// iOS treats audio.volume as read-only: fades are skipped there and changes are instant.
const CAN_FADE = (() => {
  try {
    const a = document.createElement('audio')
    a.volume = 0.5
    return Math.abs(a.volume - 0.5) < 0.01
  } catch {
    return false
  }
})()

const NOOP = () => {}
// Two contexts: the actions never change, so sections that only call them (the opening, the big question,
// the voice note) don't re-render while the playback time ticks; only the little player reads the state.
const ActionsContext = createContext({ enabled: false, start: NOOP, toggle: NOOP, toggleMute: NOOP, cue: NOOP, hold: NOOP, release: NOOP })
const StateContext = createContext({ status: 'off', started: false, muted: false, time: 0, duration: 0 })

/** The page's music: `start` (from a click), `toggle`, `toggleMute`, `cue(name)`, `hold(reason)` / `release(reason)`. */
export const useMusic = () => useContext(ActionsContext)
const useMusicState = () => useContext(StateContext)

export function MusicProvider({ children }) {
  const audioRef = useRef(null)
  const [status, setStatus] = useState(SRC ? 'idle' : 'off') // off · idle · loading · playing · paused · error
  const statusRef = useRef(status)
  statusRef.current = status
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const wantsMusic = useRef(false) // her choice: music on or off
  const holds = useRef(new Set()) // why the music is stepping aside right now ('voice', 'hidden')
  const token = useRef(0) // the newest transition wins; older ones stop where they are
  const fadeId = useRef(0)

  const fadeTo = useCallback(
    (to, ms) =>
      new Promise((resolve) => {
        const a = audioRef.current
        const id = ++fadeId.current
        if (!a) return resolve()
        if (!CAN_FADE || ms <= 0 || document.hidden) {
          if (CAN_FADE) a.volume = to
          return resolve()
        }
        const from = a.volume
        const t0 = performance.now()
        const step = (now) => {
          if (id !== fadeId.current) return resolve() // a newer fade took over
          const k = Math.min(1, (now - t0) / ms)
          a.volume = clamp(from + (to - from) * k * k * (3 - 2 * k), 0, 1)
          if (k < 1) requestAnimationFrame(step)
          else resolve()
        }
        requestAnimationFrame(step)
      }),
    [],
  )

  /** Moves the <audio> toward what she wants, minus any holds. play() runs synchronously, so a click still counts. */
  const sync = useCallback(
    (ms) => {
      const a = audioRef.current
      if (!a || !SRC) return
      const t = ++token.current
      if (wantsMusic.current && holds.current.size === 0) {
        if (a.paused) {
          if (CAN_FADE) a.volume = 0
          a.preload = 'auto'
          a.play().then(
            () => t === token.current && fadeTo(TARGET, ms),
            (err) => {
              if (err?.name === 'AbortError') return // paused again before it began — fine
              setStatus(err?.name === 'NotAllowedError' ? 'paused' : 'error')
            },
          )
        } else fadeTo(TARGET, ms)
      } else if (!a.paused) {
        fadeTo(0, ms).then(() => t === token.current && a.pause())
      }
    },
    [fadeTo],
  )

  const start = useCallback(() => {
    if (!SRC || statusRef.current === 'error') return
    setStarted(true)
    if (wantsMusic.current && !audioRef.current?.paused) return
    wantsMusic.current = true
    sync(2400)
  }, [sync])

  const toggle = useCallback(() => {
    if (!SRC) return
    setStarted(true)
    wantsMusic.current = !wantsMusic.current
    // tapping play is her choice, so it also overrides a hold (e.g. she wants music over the voice note)
    if (wantsMusic.current) holds.current.clear()
    sync(wantsMusic.current ? 900 : 350)
  }, [sync])

  const toggleMute = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.muted = !a.muted
    setMuted(a.muted)
  }, [])

  const hold = useCallback(
    (reason) => {
      holds.current.add(reason)
      sync(reason === 'hidden' ? 0 : 450)
    },
    [sync],
  )

  const release = useCallback(
    (reason) => {
      if (!holds.current.delete(reason)) return
      sync(1400)
    },
    [sync],
  )

  /** Glides to a story moment — only while the music is playing, and only if it isn't already in that part. */
  const cue = useCallback(
    (name) => {
      const a = audioRef.current
      const at = cueAt(name)
      if (!a || !Number.isFinite(at) || a.paused || !wantsMusic.current || holds.current.size) return
      if (Number.isFinite(a.duration) && at >= a.duration) return
      const yes = cueAt('yes')
      const partEnd = name !== 'yes' && Number.isFinite(yes) && yes > at ? yes : Infinity
      if (a.currentTime >= at - 4 && a.currentTime < partEnd) return
      const t = ++token.current
      fadeTo(0, 800).then(() => {
        if (t !== token.current) return
        a.currentTime = at
        fadeTo(TARGET, 1800)
      })
    },
    [fadeTo],
  )

  // step aside while the tab is hidden; come back when she returns
  useEffect(() => {
    const onVisibility = () => (document.hidden ? hold('hidden') : release('hidden'))
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [hold, release])

  const actions = useMemo(
    () => ({ enabled: Boolean(SRC), start, toggle, toggleMute, cue, hold, release }),
    [start, toggle, toggleMute, cue, hold, release],
  )
  const state = useMemo(() => ({ status, started, muted, time, duration }), [status, started, muted, time, duration])

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
      {SRC && (
        <audio
          ref={audioRef}
          src={SRC}
          preload="none"
          loop
          onPlay={() => setStatus('loading')}
          onPlaying={() => setStatus('playing')}
          onWaiting={() => setStatus((s) => (s === 'playing' ? 'loading' : s))}
          onPause={() => setStatus((s) => (s === 'error' ? s : 'paused'))}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
          onError={() => {
            wantsMusic.current = false
            setStatus('error')
          }}
        />
      )}
    </ActionsContext.Provider>
  )
}

/** Four little bars that dance while the music plays (still under reduced motion). */
function Equalizer() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0.9, 0.55, 1, 0.7].map((h, i) => (
        <span key={i} className="eq-bar block w-[3px] rounded-full bg-current" style={{ height: `${h * 100}%`, animationDelay: `${i * -0.27}s` }} />
      ))}
    </span>
  )
}

const RING = 2 * Math.PI * 23

/**
 * The little player, bottom-right. Before the music has started it waits until she scrolls past the opening
 * (where the main button already starts it), then offers "Play our song". Once started: play/pause with a
 * progress ring, the title and time on wider screens, and mute.
 */
export function MusicControl() {
  const m = { ...useMusic(), ...useMusicState() }
  const small = useIsSmallScreen()
  const [pastHero, setPastHero] = useState(false)
  const [showError, setShowError] = useState(false)
  const [folded, setFolded] = useState(false)
  const inviting = m.enabled && !m.started && m.status !== 'error' && pastHero

  // on phones the "Play our song" invite folds down to its ♫ after a few seconds, so it doesn't sit on her reading
  useEffect(() => {
    if (!inviting || !small) return
    const id = setTimeout(() => setFolded(true), 6000)
    return () => clearTimeout(id)
  }, [inviting, small])

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // a failed load says so briefly, then the control steps out of the way
  useEffect(() => {
    if (m.status !== 'error') return
    setShowError(true)
    const id = setTimeout(() => setShowError(false), 6500)
    return () => clearTimeout(id)
  }, [m.status])

  if (!m.enabled) return null
  const errored = m.status === 'error'
  const visible = errored ? showError : m.started || pastHero
  const playing = m.status === 'playing'
  const loading = m.status === 'loading'
  const progress = m.duration > 0 ? clamp(m.time / m.duration, 0, 1) : 0
  const label = loading ? fill(music.loadingLabel) : playing ? fill(music.pauseLabel) : fill(m.started ? music.playLabel : music.inviteLabel)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="music"
          role="group"
          aria-label={`Background music: ${fill(music.title)}`}
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-[60] sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.5, ease: EASE_SILK }}
        >
          {errored ? (
            <p role="status" className="max-w-[17rem] rounded-2xl border border-white/70 bg-paper/95 px-4 py-3 text-sm leading-snug text-ink shadow-soft backdrop-blur-md">
              {fill(music.errorMessage)}
            </p>
          ) : !m.started ? (
            <button
              type="button"
              onClick={m.start}
              aria-label={label}
              className="group flex min-h-11 min-w-11 items-center justify-center rounded-full border border-burgundy/20 bg-paper/90 p-2 text-sm font-medium text-burgundy shadow-soft backdrop-blur-md transition-colors hover:border-burgundy/40 hover:bg-white"
            >
              <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush">
                <span aria-hidden className="ping-soft absolute inset-0 rounded-full bg-dusty-rose/40" />
                <Music aria-hidden className="relative h-3.5 w-3.5" />
              </span>
              <span
                aria-hidden
                className={cn(
                  'overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-500 ease-silk',
                  folded ? 'm-0 max-w-0 opacity-0' : 'ml-2.5 mr-2 max-w-[10rem] opacity-100',
                )}
              >
                {label}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-white/70 bg-paper/85 p-1 pr-1.5 shadow-soft backdrop-blur-md">
              <button
                type="button"
                onClick={m.toggle}
                aria-label={label}
                title={label}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#8a4d5e,#703d4b_60%,#5d3140)] text-ivory shadow-glow"
              >
                <svg aria-hidden viewBox="0 0 50 50" className="pointer-events-none absolute -inset-[3px] h-[calc(100%+6px)] w-[calc(100%+6px)] -rotate-90">
                  <circle cx="25" cy="25" r="23" fill="none" stroke="rgb(184 134 112 / .25)" strokeWidth="1.5" />
                  <circle
                    cx="25"
                    cy="25"
                    r="23"
                    fill="none"
                    stroke="#b88670"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={RING}
                    strokeDashoffset={RING * (1 - progress)}
                  />
                </svg>
                {loading ? (
                  <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                ) : playing ? (
                  <Equalizer />
                ) : (
                  <Play aria-hidden className="ml-0.5 h-4 w-4" fill="currentColor" strokeWidth={0} />
                )}
              </button>
              <span aria-hidden className="hidden min-w-0 flex-col px-2 leading-tight sm:flex">
                <span className="truncate font-display text-[15px] italic text-ink">{fill(music.title)}</span>
                <span className="text-[11px] tabular-nums text-ink-soft">
                  {m.duration > 0 ? `${formatTime(m.time)} / ${formatTime(m.duration)}` : '♫'}
                </span>
              </span>
              <button
                type="button"
                onClick={m.toggleMute}
                aria-label={fill(music.muteLabel)}
                aria-pressed={m.muted}
                title={fill(music.muteLabel)}
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-blush/70',
                  m.muted ? 'text-ink-soft' : 'text-burgundy',
                )}
              >
                {m.muted ? <VolumeX aria-hidden className="h-[18px] w-[18px]" /> : <Volume2 aria-hidden className="h-[18px] w-[18px]" />}
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

