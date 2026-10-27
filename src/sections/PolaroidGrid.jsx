import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { content } from '../content'
import { SectionHeading } from '../components/SectionHeading'
import { ParallaxWord } from '../components/ParallaxWord'
import { Photo } from '../components/Photo'
import { TiltCard } from '../components/TiltCard'
import { useScrollLock } from '../components/SmoothScroll'
import { cn } from '../lib/utils'

const ROTATIONS = [-6, 4, -3, 5, -4, 3, -5, 2]
const TAPE_TINTS = ['bg-blush-200/80', 'bg-rose-gold-light/80', 'bg-blush-300/60']
const STACKING = ['z-10', 'z-[13]', 'z-[11]', 'z-[14]', 'z-[12]', 'z-[15]']

function Polaroid({ photo, index, onOpen }) {
  const rotate = ROTATIONS[index % ROTATIONS.length]
  return (
    <motion.figure
      className={cn(
        'relative -mx-2 w-[calc(50%+16px)] hover:z-30 sm:-mx-3 sm:w-[calc(33.333%+24px)]',
        STACKING[index % STACKING.length],
        // stagger rows so the collage feels scattered rather than gridded
        index % 2 === 1 && 'translate-y-8 sm:translate-y-0',
        index % 3 === 1 && 'sm:translate-y-12',
      )}
      initial={{ opacity: 0, y: 90, rotate: rotate * 2.5, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 60, damping: 15, delay: (index % 3) * 0.12 }}
    >
      <TiltCard>
        <button
          type="button"
          onClick={() => onOpen(index)}
          aria-label={`Open photo: ${photo.caption}`}
          className="block w-full cursor-pointer rounded-[3px] bg-paper p-2.5 pb-11 text-left shadow-polaroid transition-shadow duration-500 hover:shadow-letter sm:p-3.5 sm:pb-16"
        >
          <Photo src={photo.src} alt={photo.alt ?? photo.caption} className="aspect-[4/5] w-full" />
          <figcaption className="absolute inset-x-3 bottom-3 truncate text-center font-hand text-lg text-ink sm:bottom-4 sm:text-2xl">
            {photo.caption}
          </figcaption>
        </button>
        {/* washi tape */}
        <span
          aria-hidden
          className={cn(
            'absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 shadow-sm sm:w-24',
            TAPE_TINTS[index % TAPE_TINTS.length],
          )}
          style={{ rotate: `${-rotate * 1.5}deg` }}
        />
      </TiltCard>
    </motion.figure>
  )
}

function Lightbox({ photos, index, onClose, onStep }) {
  const open = index !== null
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onStep])

  const photo = open ? photos[index] : null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={photo.caption}
          className="fixed inset-0 z-[75] grid place-items-center bg-ink/55 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              className="relative w-full max-w-[min(90vw,26rem)] rounded-[4px] bg-paper p-4 pb-20 shadow-letter"
              initial={{ opacity: 0, scale: 0.86, rotate: -5, y: 40 }}
              animate={{ opacity: 1, scale: 1, rotate: -1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, rotate: 3, y: 20 }}
              transition={{ type: 'spring', stiffness: 170, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Photo src={photo.src} alt={photo.alt ?? photo.caption} className="aspect-[4/5] w-full" eager />
              <figcaption className="absolute inset-x-4 bottom-4 text-center">
                <p className="font-hand text-3xl text-ink">{photo.caption}</p>
                {photo.date && <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{photo.date}</p>}
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center gap-3">
            {[
              ['Previous photo', -1, 'M15 6l-6 6 6 6'],
              ['Next photo', 1, 'M9 6l6 6-6 6'],
            ].map(([label, dir, d]) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                onClick={(e) => {
                  e.stopPropagation()
                  onStep(dir)
                }}
                className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/90 text-rose-gold-dark shadow-soft transition-transform hover:scale-110"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={d} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="fixed right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-rose-gold-dark shadow-soft transition-transform hover:rotate-90"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function PolaroidGrid() {
  const ref = useRef(null)
  const { photos } = content
  const [openIndex, setOpenIndex] = useState(null)
  const count = photos.items.length

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback((dir) => setOpenIndex((i) => (i === null ? i : (i + dir + count) % count)), [count])

  return (
    <section id="moments" ref={ref} className="relative overflow-hidden px-5 py-28 sm:px-6 sm:py-40">
      <ParallaxWord targetRef={ref} className="top-24 left-0">
        {photos.backgroundWord}
      </ParallaxWord>

      <SectionHeading eyebrow={photos.eyebrow} title={photos.title} subtitle={photos.subtitle} className="relative" />

      <div className="relative mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-y-6 px-2 sm:mt-24 sm:gap-y-14 sm:px-6">
        {photos.items.map((photo, i) => (
          <Polaroid key={i} photo={photo} index={i} onOpen={setOpenIndex} />
        ))}
      </div>

      <p className="relative mt-20 text-center text-[10px] uppercase tracking-[0.35em] text-ink-soft/80 sm:mt-24">
        {photos.hint}
      </p>

      <Lightbox photos={photos.items} index={openIndex} onClose={close} onStep={step} />
    </section>
  )
}
