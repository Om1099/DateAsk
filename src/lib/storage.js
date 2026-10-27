const PREFIX = 'little-date:'

/**
 * Tiny localStorage wrapper. Everything stays in this browser on this device —
 * nothing is ever sent anywhere. Failures (private mode, blocked storage) are silent.
 */
export const storage = {
  get(key) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key)
      return raw == null ? null : JSON.parse(raw)
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* storage unavailable — the page still works, it just won't remember */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(PREFIX + key)
    } catch {
      /* ignore */
    }
  },
}
