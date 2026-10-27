import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True for mouse / trackpad users — gates hover-only effects like tilt and the custom cursor. */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useIsSmallScreen = () => useMediaQuery('(max-width: 639px)')
