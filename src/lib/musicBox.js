/**
 * A tiny Web Audio "music box" used as a fallback when no voice-note file is present,
 * so the player always does something lovely out of the box.
 */
const midiToHz = (m) => 440 * 2 ** ((m - 69) / 12)
const STEP = 0.3 // seconds per eighth note

// [arpeggio notes, melody on beat 1, melody on beat 3]
const PROGRESSION = [
  [[60, 67, 72, 76], 79, 76], // C
  [[57, 64, 69, 72], 76, 72], // Am
  [[53, 60, 65, 69], 77, 81], // F
  [[55, 62, 67, 71], 79, 74], // G
  [[60, 67, 72, 76], 84, 79], // C
  [[52, 59, 64, 67], 83, 79], // Em
  [[53, 60, 65, 69], 81, 77], // F
  [[55, 62, 67, 71], 79, 74], // G
]
const ARP_ORDER = [0, 1, 2, 3, 2, 1, 2, 3]

function buildMelody() {
  const notes = []
  PROGRESSION.forEach(([arp, m1, m2], bar) => {
    const t0 = bar * ARP_ORDER.length * STEP
    ARP_ORDER.forEach((idx, i) => notes.push({ t: t0 + i * STEP, f: midiToHz(arp[idx]), v: idx === 0 ? 0.5 : 0.32 }))
    notes.push({ t: t0, f: midiToHz(m1), v: 0.75 })
    notes.push({ t: t0 + 4 * STEP, f: midiToHz(m2), v: 0.65 })
  })
  // final rolled C chord
  const end = PROGRESSION.length * ARP_ORDER.length * STEP
  ;[60, 67, 72, 76, 79, 84].forEach((m, i) => notes.push({ t: end + i * 0.09, f: midiToHz(m), v: 0.55 }))
  return notes
}

export const MELODY = buildMelody()
export const MELODY_DURATION = Math.max(...MELODY.map((n) => n.t)) + 2.4

function pluck(ctx, out, freq, when, velocity) {
  const env = ctx.createGain()
  env.gain.setValueAtTime(0.0001, when)
  env.gain.exponentialRampToValueAtTime(velocity, when + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, when + 1.9)
  env.connect(out)
  // fundamental + soft overtones give a bell-like music-box timbre
  ;[
    [1, 'sine', 1],
    [2, 'sine', 0.25],
    [3.01, 'triangle', 0.06],
  ].forEach(([mult, type, amp]) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq * mult
    gain.gain.value = amp
    osc.connect(gain).connect(env)
    osc.start(when)
    osc.stop(when + 2)
  })
}

/** Starts playback from `offset` seconds. Returns a handle with `elapsed()` and `stop()`. */
export function playMusicBox(offset = 0) {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  const ctx = new Ctx()
  const master = ctx.createGain()
  const warmth = ctx.createBiquadFilter()
  master.gain.value = 0.2
  warmth.type = 'lowpass'
  warmth.frequency.value = 3400
  master.connect(warmth).connect(ctx.destination)

  const startAt = ctx.currentTime + 0.05
  MELODY.forEach((n) => {
    if (n.t >= offset - 0.01) pluck(ctx, master, n.f, startAt + (n.t - offset), n.v)
  })

  return {
    elapsed: () => offset + Math.max(0, ctx.currentTime - startAt),
    stop: () => ctx.close(),
  }
}
