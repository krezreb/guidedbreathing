/**
 * Session duration presets in minutes (SPECS §3).
 *
 * Deliberately non-linear: fine-grained at the short end, coarser as sessions
 * get longer. Defined in one place so presets can change without touching UI.
 */
import { isDevDurationEnabled } from '../services/featureFlags.js'

export const DURATION_PRESETS_MINUTES = [1, 2, 3, 5, 8, 10, 15, 20]

export const DEFAULT_DURATION_MINUTES = 5

/**
 * A development duration that runs exactly one breath: one inhale, one exhale,
 * then the session completes. Offered only behind the `?devduration=1` flag.
 *
 * It works by leaning on the completion rule rather than special-casing it: a
 * session always runs to the first cycle boundary at or after its configured
 * duration (TECH_SPECS §5.2), so *any* duration shorter than one cycle ends
 * after a single complete inhale/exhale — whichever profile is selected. One
 * second is comfortably under the shortest cycle (8s, Beginner); the exact
 * value is irrelevant as long as it stays there.
 *
 * It exists so the end-of-session behaviour — the completion animation, sound
 * and message — can be checked in seconds instead of a full minute.
 */
export const DEV_DURATION_MINUTES = 1 / 60

/** Whether `minutes` *is* the dev duration — a question about the number only. */
export function isDevDuration(minutes) {
  return minutes === DEV_DURATION_MINUTES
}

/**
 * Whether `minutes` may be selected right now.
 *
 * The dev duration counts only while its flag is on, so a value persisted
 * during a flagged visit falls back to the default on an ordinary one rather
 * than silently handing someone a one-breath session.
 */
export function isValidDuration(minutes) {
  if (DURATION_PRESETS_MINUTES.includes(minutes)) return true
  return isDevDuration(minutes) && isDevDurationEnabled()
}

export function durationOrDefault(minutes) {
  return isValidDuration(minutes) ? minutes : DEFAULT_DURATION_MINUTES
}
