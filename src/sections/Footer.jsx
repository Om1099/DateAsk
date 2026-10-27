import { useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { config, fill, remember } from '../data'
import { Button } from '../components/Button'
import { Divider } from '../components/Divider'

export function Footer({ onReplay, onClear, hasSaved }) {
  const { footer } = config
  const [cleared, setCleared] = useState(false)

  return (
    <footer
      className="relative z-10 px-6 pb-14 pt-12 text-center"
      style={{ background: 'linear-gradient(180deg, #f0cbd4, #f6dce2 45%, #fff9f3)' }}
    >
      <Divider />
      <p className="mt-2 font-hand text-[2rem] leading-tight text-burgundy">{fill(footer.line)}</p>
      {config.signatureLine && (
        <p className="mx-auto mt-3 max-w-md text-balance font-display text-xl italic leading-snug text-ink">
          “{fill(config.signatureLine)}”
        </p>
      )}
      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.3em] text-ink-soft">{fill(footer.credit)}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Button variant="quiet" size="sm" onClick={onReplay} icon={<RotateCcw className="h-4 w-4" />}>
          {fill(footer.replayLabel)}
        </Button>
        {remember && hasSaved && (
          <Button
            variant="quiet"
            size="sm"
            onClick={() => {
              onClear()
              setCleared(true)
            }}
            icon={<Trash2 className="h-4 w-4" />}
          >
            {fill(footer.clearLabel)}
          </Button>
        )}
        {cleared && !hasSaved && (
          <span role="status" className="text-sm text-ink-soft">
            {fill(footer.clearedLabel)}
          </span>
        )}
      </div>
    </footer>
  )
}
