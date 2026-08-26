/**
 * Screen Wake Lock (TECH_SPECS §9).
 *
 * The session auto-pauses whenever the document is hidden, so there is never a
 * RUNNING session without a lock and nothing needs to be reacquired from a
 * hidden document. Acquire on start and on resume; release on pause, exit and
 * completion.
 *
 * Entirely best-effort: unsupported APIs and rejected requests are swallowed.
 * The session must never fail or warn because wake lock is unavailable.
 */

let sentinel = null

export function isSupported() {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator
}

export async function acquire() {
  if (!isSupported() || sentinel) return false
  try {
    sentinel = await navigator.wakeLock.request('screen')
    sentinel.addEventListener('release', () => {
      sentinel = null
    })
    return true
  } catch {
    // Not supported, not permitted, or the document is hidden. Carry on.
    sentinel = null
    return false
  }
}

export async function release() {
  if (!sentinel) return
  const current = sentinel
  sentinel = null
  try {
    await current.release()
  } catch {
    // Already released by the browser or the OS.
  }
}

export function isHeld() {
  return sentinel !== null
}
