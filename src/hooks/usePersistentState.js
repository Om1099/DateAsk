import { useEffect, useState } from 'react'
import { storage } from '../lib/storage'

/**
 * useState that can remember its value in localStorage.
 * With `enabled` false it's plain component state — and anything stored earlier is forgotten.
 */
export function usePersistentState(key, initialValue = null, enabled = true) {
  const [value, setValue] = useState(() => (enabled ? (storage.get(key) ?? initialValue) : initialValue))

  useEffect(() => {
    if (!enabled || value == null) storage.remove(key)
    else storage.set(key, value)
  }, [key, value, enabled])

  return [value, setValue]
}
