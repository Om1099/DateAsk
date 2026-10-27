import { HEART_PATH_24 } from '../lib/utils'

export function HeartIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}>
      <path d={HEART_PATH_24} fill="currentColor" />
    </svg>
  )
}
