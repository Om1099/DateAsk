import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer } from '../hooks/useMediaQuery'
import { HEART_PATH_24, PASTELS } from '../lib/utils'

const INTERACTIVE = 'a, button, [role="button"], [role="checkbox"], [role="slider"], [data-cursor="hover"]'
const MAX_PARTICLES = 160

/**
 * Custom cursor (dot + springy ring) plus a canvas particle trail of tiny hearts & sparkles.
 * On touch screens there is no cursor; tapping releases a little burst instead.
 * One canvas + one rAF loop that sleeps when no particles are alive.
 */
export function MagicCursor({ enabled }) {
  const fine = useFinePointer()
  const canvasRef = useRef(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const showCursor = enabled && fine

  useEffect(() => {
    document.documentElement.classList.toggle('magic-cursor', showCursor)
    return () => document.documentElement.classList.remove('magic-cursor')
  }, [showCursor])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const heart = new Path2D(HEART_PATH_24)
    const particles = []
    let raf = 0
    let last = { x: -999, y: -999 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= p.decay
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.97
        p.vy = p.vy * 0.97 - 0.03 // hearts float gently upwards
        p.rot += p.vr

        ctx.save()
        ctx.globalAlpha = p.life
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        const s = p.size * (0.35 + p.life * 0.65)
        if (p.heart) {
          ctx.scale(s / 24, s / 24)
          ctx.translate(-12, -12)
          ctx.fillStyle = p.color
          ctx.fill(heart)
        } else {
          // four-point sparkle
          ctx.fillStyle = p.color
          ctx.beginPath()
          const r = s / 2
          ctx.moveTo(0, -r)
          ctx.quadraticCurveTo(0, 0, r, 0)
          ctx.quadraticCurveTo(0, 0, 0, r)
          ctx.quadraticCurveTo(0, 0, -r, 0)
          ctx.quadraticCurveTo(0, 0, 0, -r)
          ctx.fill()
        }
        ctx.restore()
      }
      raf = particles.length ? requestAnimationFrame(loop) : 0
    }

    const spawn = (px, py, n, burst) => {
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = burst ? 1.5 + Math.random() * 3.5 : Math.random() * 0.8
        particles.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 1 : 0.3),
          life: 1,
          decay: burst ? 0.012 + Math.random() * 0.012 : 0.018 + Math.random() * 0.02,
          size: burst ? 10 + Math.random() * 10 : 6 + Math.random() * 8,
          rot: Math.random() * 0.8 - 0.4,
          vr: (Math.random() - 0.5) * 0.06,
          heart: Math.random() < 0.6,
          color: Math.random() < 0.15 ? '#ffffff' : PASTELS[(Math.random() * PASTELS.length) | 0],
        })
      }
      if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES)
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y)
      if (dist > 16) {
        spawn(e.clientX, e.clientY, Math.min(3, Math.ceil(dist / 40)), false)
        last = { x: e.clientX, y: e.clientY }
      }
    }
    const onDown = (e) => spawn(e.clientX, e.clientY, e.pointerType === 'mouse' ? 10 : 14, true)
    const onOver = (e) => setHovering(Boolean(e.target.closest?.(INTERACTIVE)))
    const onLeave = () => setVisible(false)

    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[70]" />
      {fine && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[80] -ml-1 -mt-1 h-2 w-2 rounded-full bg-rose-gold"
            style={{ x, y }}
            animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.5 : 1 }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[80] -ml-5 -mt-5 h-10 w-10 rounded-full border border-rose-gold/60"
            style={{ x: ringX, y: ringY }}
            animate={{
              opacity: visible ? 1 : 0,
              scale: hovering ? 1.6 : 1,
              backgroundColor: hovering ? 'rgba(244, 184, 197, 0.22)' : 'rgba(244, 184, 197, 0)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          />
        </>
      )}
    </>
  )
}
