/**
 * Preference persistence (TECH_SPECS §7).
 *
 * localStorage may be unavailable or throw — private browsing, disabled site
 * data, quota. Every access is guarded and falls back to in-memory state, so
 * the application keeps working and only loses persistence (TECH_SPECS §22).
 */

const STORAGE_KEY = 'guided-breathing.preferences'

let memoryFallback = null

function readStore() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStore(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
    return true
  } catch {
    return false
  }
}

/** @returns {{profileId?: string, durationMinutes?: number}} */
export function loadPreferences() {
  const raw = readStore() ?? memoryFallback
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function savePreferences(preferences) {
  const raw = JSON.stringify(preferences)
  // Kept regardless, so preferences at least survive within the session even
  // when localStorage refuses the write.
  memoryFallback = raw
  return writeStore(raw)
}
