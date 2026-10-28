import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { cn } from '../lib/utils'

const PANEL_MOTION = {
  // slides up as a bottom sheet on phones, settles in the middle on larger screens
  sheet: {
    initial: { opacity: 0, y: 70 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 230, damping: 28 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.25 } },
  },
  center: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  },
}

const BACKDROP = {
  sheet: 'items-end bg-ink/45 sm:items-center sm:p-6',
  // the panel centres itself (my-auto) when it fits; when it doesn't, the backdrop scrolls instead of clipping it
  center: 'items-start overflow-y-auto overscroll-contain bg-ink/70 p-5',
}

/** Accessible dialog: rendered in a portal, traps focus, closes on Escape or backdrop click, locks scroll. */
export function Modal({ open, ...props }) {
  return createPortal(<AnimatePresence>{open && <ModalPanel key="modal" {...props} />}</AnimatePresence>, document.body)
}

function ModalPanel({ onClose, labelledBy, label, describedBy, layout = 'sheet', className, children }) {
  const panelRef = useRef(null)
  useScrollLock(true)
  useFocusTrap(panelRef)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className={cn('fixed inset-0 z-[80] flex justify-center', BACKDROP[layout])}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : label}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cn('relative outline-none', className)}
        onClick={(e) => e.stopPropagation()}
        {...PANEL_MOTION[layout]}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
