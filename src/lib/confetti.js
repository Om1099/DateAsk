import confetti from 'canvas-confetti'

const COLORS = ['#f9d3db', '#f4b8c5', '#ec98ab', '#e0bfb8', '#b76e79', '#f6c6b8', '#d4a373', '#ffffff']

let heartShape
const getHeart = () =>
  (heartShape ??= confetti.shapeFromPath({
    path: 'M16 29C6 21 1 15 1 9.5 1 5 4.5 2 8.5 2c3 0 6 2 7.5 5 1.5-3 4.5-5 7.5-5 4 0 7.5 3 7.5 7.5C31 15 26 21 16 29z',
  }))

const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 120 }

/** A layered celebration: a centre bloom, a shower of hearts, then side cannons. */
export function celebrate() {
  const heart = getHeart()

  confetti({ ...base, particleCount: 140, spread: 100, startVelocity: 48, origin: { y: 0.62 } })
  confetti({
    ...base,
    particleCount: 40,
    spread: 130,
    startVelocity: 36,
    origin: { y: 0.58 },
    shapes: [heart],
    scalar: 2.4,
    ticks: 280,
    gravity: 0.7,
  })

  const end = Date.now() + 2400
  const frame = () => {
    const opts = { ...base, particleCount: 3, spread: 65, startVelocity: 55, shapes: [heart, 'circle'], scalar: 1.4 }
    confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.8 } })
    confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.8 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
