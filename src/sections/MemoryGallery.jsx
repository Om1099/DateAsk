import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { config, fill } from '../data'
import { IconButton } from '../components/Button'
import { Modal } from '../components/Modal'
import { ParallaxWord } from '../components/ParallaxWord'
import { Photo } from '../components/Photo'
import { SectionHeading } from '../components/SectionHeading'
import { TiltCard } from '../components/TiltCard'
import { useFinePointer } from '../hooks/useMediaQuery'
import { EASE_SILK, cn, withBase } from '../lib/utils'

// neighbours always lean opposite ways — in one column, in rows of two and in rows of three.
// The 5th card is the centre of the 3×3 grid: it sits almost straight and on top of its neighbours.
const ROTATIONS = [-5, 3.5, -2.5, 4.5, -1.5, 2.5, -4, 3, -2]
const STACKING = ['z-10', 'z-[13]', 'z-[11]', 'z-[14]', 'z-20', 'z-[15]', 'z-[16]', 'z-[18]', 'z-[17]']
const TAPES = ['bg-blush-deep/75', 'bg-champagne/95', 'bg-dusty-rose/40']

function PolaroidCard({ photo, index, onOpen }) {
  const rotate = ROTATIONS[index % ROTATIONS.length]
  return (
    <motion.li
      className={cn(
        // one scattered column on phones, an overlapping 2- / 3-column collage on larger screens
        'relative w-[82%] max-w-[21rem] hover:z-30 sm:-mx-1.5 sm:w-[calc(50%+12px)] sm:max-w-none lg:-mx-2 lg:w-[calc(33.333%+16px)]',
        STACKING[index % STACKING.length],
        index > 0 && 'mt-6 sm:mt-0',
        index % 2 === 0 ? '-translate-x-[6%] sm:translate-x-0' : 'translate-x-[6%] sm:translate-x-0',
        index % 2 === 1 ? 'sm:translate-y-10' : 'sm:translate-y-0',
        index % 3 === 1 ? 'lg:translate-y-14' : 'lg:translate-y-0',
      )}
      initial={{ opacity: 0, y: 70, rotate: rotate * 2.2 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: (index % 3) * 0.1 }}
    >
      <TiltCard>
        <motion.button
          type="button"
          onClick={() => onOpen(index)}
          whileTap={{ scale: 0.98 }}
          aria-label={`${photo.caption} — open a larger view`}
          className="block w-full cursor-pointer rounded-[16px] bg-paper p-3 pb-4 text-center shadow-card transition-shadow duration-500 hover:shadow-lifted sm:p-3.5 sm:pb-5"
        >
          <Photo
            src={photo.src}
            alt={photo.alt}
            position={photo.focus}
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 48vw, 82vw"
            className="aspect-square w-full rounded-[11px] sm:aspect-[4/5]"
          />
          {photo.mood && (
            <span className="mt-3 block text-[10px] font-medium uppercase tracking-[0.28em] text-burgundy/85">{photo.mood}</span>
          )}
          <span className="mx-auto mt-1 block max-w-[80%] text-balance font-hand text-[1.4rem] leading-[1.15] text-ink sm:text-[1.45rem]">
            {photo.caption}
          </span>
        </motion.button>
        <span
          aria-hidden
          className={cn('absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 shadow-sm', TAPES[index % TAPES.length])}
          style={{ rotate: `${-rotate * 1.4}deg` }}
        />
      </TiltCard>
    </motion.li>
  )
}

function Lightbox({ photos, index, onClose, onStep }) {
  const open = index !== null
  const photo = open ? photos[index] : null

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onStep])

  return (
    // the frame shrinks on short screens so the whole photo, its caption and the arrows always fit
    <Modal
      open={open}
      onClose={onClose}
      label={photo?.caption ?? 'Photo'}
      layout="center"
      className="w-full max-w-[min(92vw,28rem,calc((100svh_-_16rem)*0.75))]"
    >
      {photo && (
        <>
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={index}
              className="rounded-[20px] bg-paper p-3.5 pb-5 shadow-lifted"
              initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
              animate={{ opacity: 1, rotate: -1, scale: 1 }}
              exit={{ opacity: 0, rotate: 2, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE_SILK }}
            >
              {/* the whole photo, uncropped — a soft blur of it fills the rest of the frame */}
              <Photo src={photo.src} alt={photo.alt} sizes="92vw" eager fit="contain" className="aspect-[3/4] w-full rounded-[13px]" />
              <figcaption className="mt-4 text-center">
                {photo.mood && <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-burgundy">{photo.mood}</p>}
                <p className="mt-1 font-hand text-[1.75rem] leading-tight text-ink">{photo.caption}</p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-center gap-4">
            <IconButton label="Previous photo" onClick={() => onStep(-1)}>
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </IconButton>
            <span className="min-w-12 text-center text-xs tabular-nums text-ivory">
              {index + 1} / {photos.length}
            </span>
            <IconButton label="Next photo" onClick={() => onStep(1)}>
              <ChevronRight aria-hidden className="h-5 w-5" />
            </IconButton>
          </div>

          <IconButton label="Close photo" onClick={onClose} className="absolute -right-2 -top-3 sm:-right-5 sm:-top-5">
            <X aria-hidden className="h-5 w-5" />
          </IconButton>
        </>
      )}
    </Modal>
  )
}

/** C · Our little world — the two of you, as a scatter of overlapping polaroids. */
export function MemoryGallery() {
  const ref = useRef(null)
  const fine = useFinePointer()
  const { gallery } = config
  const photos = gallery.photos.map((p) => ({
    ...p,
    src: withBase(p.src),
    caption: fill(p.caption),
    alt: fill(p.alt || p.caption),
    mood: p.mood ? fill(p.mood) : '',
  }))
  const [openIndex, setOpenIndex] = useState(null)
  const count = photos.length

  const close = useCallback(() => setOpenIndex(null), [])
  const step = useCallback((dir) => setOpenIndex((i) => (i === null ? i : (i + dir + count) % count)), [count])

  return (
    <section id="gallery" ref={ref} aria-labelledby="gallery-title" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <ParallaxWord targetRef={ref} className="left-0 top-20">
        {fill(gallery.backgroundWord)}
      </ParallaxWord>

      <SectionHeading
        id="gallery-title"
        eyebrow={fill(gallery.eyebrow)}
        title={fill(gallery.title)}
        subtitle={fill(gallery.subtitle)}
        className="relative"
      />

      <ul className="relative mx-auto mt-14 flex max-w-5xl list-none flex-col items-center sm:mt-20 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-y-14 sm:px-4">
        {photos.map((photo, i) => (
          <PolaroidCard key={i} photo={photo} index={i} onOpen={setOpenIndex} />
        ))}
      </ul>

      <p className="relative mt-16 text-center text-[11px] uppercase tracking-[0.3em] text-ink-soft sm:mt-24">
        {fill(fine ? gallery.hintPointer : gallery.hintTouch)}
      </p>

      <Lightbox photos={photos} index={openIndex} onClose={close} onStep={step} />
    </section>
  )
}
