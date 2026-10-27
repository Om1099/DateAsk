import { useEffect, useState } from 'react'
import { storage } from '../lib/storage'

/** useState that remembers its value in localStorage. Setting null/undefined forgets it. */
export function usePersistentState(key, initialValue = null) {
  const [value, setValue] = useState(() => storage.get(key) ?? initialValue)

  useEffect(() => {
    if (value == null) storage.remove(key)
    else storage.set(key, value)
  }, [key, value])

  return [value, setValue]
}
