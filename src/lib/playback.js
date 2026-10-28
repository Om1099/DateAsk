/*
 * Only one song plays at a time. A clip claims playback when it starts, which pauses whichever clip was
 * playing before; the background music calls stopClips() before it comes back on.
 */
let current = null

/** A clip just started: pause any other clip that's playing. */
export function claimPlayback(el) {
  if (current && current !== el && !current.paused) current.pause()
  current = el
}

/** A clip paused, ended or went away. */
export function releasePlayback(el) {
  if (current === el) current = null
}

/** Pause the clip that's playing, if any. */
export function stopClips() {
  if (current && !current.paused) current.pause()
}
