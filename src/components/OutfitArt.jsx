import { HEART_PATH_24, cn } from '../lib/utils'

/*
 * Minimal line illustrations for the outfit mood board — one ink colour,
 * soft palette fills, drawn to feel like a designer's sketchbook rather than clip-art.
 */

const ink = { stroke: '#703d4b', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }

function Sparkle({ x, y, r = 6, ...props }) {
  return <path d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}z`} fill="#b88670" {...props} />
}

const ART = {
  // cute & comfy — a long-sleeved, slightly oversized knit with a little heart
  sweater: (
    <>
      <circle cx="60" cy="62" r="50" fill="#f6dce2" opacity="0.65" />
      <path
        d="M45 27c5 6 25 6 30 0l15 6c6 3 9 8 10 15l3 37-12 2-5-31v43c-16 4-32 4-48 0V56l-5 31-12-2 3-37c1-7 4-12 10-15z"
        {...ink}
        fill="#fffaf3"
      />
      <path d="M45 27c5 6 25 6 30 0" {...ink} />
      <path d="M48 28.5c4 5 20 5 24 0" {...ink} strokeWidth="1" />
      <path d="M20 81l11-2M89 79l11 2" {...ink} strokeWidth="1.1" />
      <path d="M41 93v5M47 94v5M53 94.5v5M59 95v4.5M65 94.5v5M71 94v5M77 93v5" {...ink} strokeWidth="1.1" />
      <path d={HEART_PATH_24} transform="translate(52 52) scale(.66)" fill="#d99baa" />
    </>
  ),
  // elegant & dressed up — a slip dress and a sparkle
  dress: (
    <>
      <circle cx="60" cy="62" r="50" fill="#f3e6d5" opacity="0.8" />
      <path d="M50 22l3 19M70 22l-3 19" {...ink} />
      <path d="M53 41c4 3 10 3 14 0l3 19c-6 3-14 3-20 0z" {...ink} fill="#fffaf3" />
      <path d="M50 60c6 3 14 3 20 0l19 40c-19 7-39 7-58 0z" {...ink} fill="#e9b5c1" />
      <path d="M60 64v37M50 70l-6 30M70 70l6 30" {...ink} strokeWidth="0.9" opacity="0.45" />
      <Sparkle x={90} y={34} r={7} />
      <Sparkle x={30} y={44} r={4} />
    </>
  ),
  // casual & effortless — a soft tee
  tee: (
    <>
      <circle cx="60" cy="62" r="50" fill="#e8eef2" opacity="0.9" />
      <path d="M42 30l12-5c2 6 10 6 12 0l12 5 16 14-9 11-7-5v44H42V50l-7 5-9-11z" {...ink} fill="#fffaf3" />
      <path d="M54 25c2 6 10 6 12 0" {...ink} />
      <rect x="64" y="58" width="9" height="10" rx="1.5" {...ink} />
      <path d="M42 90h36" {...ink} strokeWidth="1" opacity="0.5" />
    </>
  ),
  // something unexpected — an empty hanger, full of possibilities
  hanger: (
    <>
      <circle cx="60" cy="62" r="50" fill="#f6dce2" opacity="0.55" />
      <path d="M52 30c0-5 4-8 8-8s8 3 8 7c0 5-8 6-8 12" {...ink} />
      <path d="M60 41 24 64c-3 2-2 5 2 5h68c4 0 5-3 2-5z" {...ink} fill="#fffaf3" />
      <Sparkle x={36} y={88} r={6} />
      <Sparkle x={60} y={97} r={8} />
      <Sparkle x={85} y={86} r={5} />
    </>
  ),
  // whatever I feel like — a mirror that reflects a heart
  mirror: (
    <>
      <circle cx="60" cy="62" r="50" fill="#f3e6d5" opacity="0.8" />
      <ellipse cx="60" cy="52" rx="24" ry="32" {...ink} fill="#fffaf3" />
      <ellipse cx="60" cy="52" rx="18.5" ry="26.5" {...ink} strokeWidth="1" fill="#f6dce2" />
      <path d={HEART_PATH_24} transform="translate(50 42) scale(.85)" fill="#d99baa" />
      <path d="M49 36c2-4 5-7 9-8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 84v13M47 99h26" {...ink} />
    </>
  ),
}

export function OutfitArt({ art, className }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={cn('shrink-0', className)}>
      {ART[art] ?? ART.hanger}
    </svg>
  )
}
