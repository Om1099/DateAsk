import confetti from 'canvas-confetti'

const COLORS = ['#f6dce2', '#efc6d0', '#d99baa', '#b88670', '#f3e6d5', '#703d4b', '#ffffff']

let heartShape
const getHeart = () =>
  (heartShape ??= confetti.shapeFromPath({
    path: 'M16 29C6 21 1 15 1 9.5 1 5 4.5 2 8.5 2c3 0 6 2 7.5 5 1.5-3 4.5-5 7.5-5 4 0 7.5 3 7.5 7.5C31 15 26 21 16 29z',
  }))

// disableForReducedMotion: no confetti at all for visitors who asked for less motion
const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 120 }

/** A subtle celebration: one soft bloom, a handful of hearts and two brief side flourishes. */
export function celebrate() {
  const heart = getHeart()

  confetti({ ...base, particleCount: 70, spread: 88, startVelocity: 36, origin: { y: 0.62 }, scalar: 0.9 })
  confetti({
    ...base,
    particleCount: 18,
    spread: 110,
    startVelocity: 28,
    origin: { y: 0.6 },
    shapes: [heart],
    scalar: 2.1,
    ticks: 240,
    gravity: 0.7,
  })

  const end = Date.now() + 800
  const frame = () => {
    const side = { ...base, particleCount: 2, spread: 58, startVelocity: 52, shapes: [heart, 'circle'], scalar: 1.25 }
    confetti({ ...side, angle: 60, origin: { x: 0, y: 0.78 } })
    confetti({ ...side, angle: 120, origin: { x: 1, y: 0.78 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
