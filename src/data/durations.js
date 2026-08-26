/**
 * Session duration presets in minutes (SPECS §3).
 *
 * Deliberately non-linear: fine-grained at the short end, coarser as sessions
 * get longer. Defined in one place so presets can change without touching UI.
 */
export const DURATION_PRESETS_MINUTES = [1, 2, 3, 5, 8, 10, 15, 20]

export const DEFAULT_DURATION_MINUTES = 5

export function isValidDuration(minutes) {
  return DURATION_PRESETS_MINUTES.includes(minutes)
}

export function durationOrDefault(minutes) {
  return isValidDuration(minutes) ? minutes : DEFAULT_DURATION_MINUTES
}
