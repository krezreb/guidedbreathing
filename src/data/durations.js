/**
 * Session duration presets in minutes (SPECS §3).
 *
 * Deliberately non-linear: fine-grained at the short end, coarser as sessions
 * get longer. Defined in one place so presets can change without touching UI.
 */
export const DURATION_PRESETS_MINUTES = [1, 2, 3, 5, 8, 10, 15, 20]

export const DEFAULT_DURATION_MINUTES = 5

/**
 * True under `vite dev` and in tests, false in a production build.
 *
 * Vite replaces `import.meta.env.DEV` with a literal at build time, so this is
 * a compile-time constant: every guard below it collapses to `false` in a
 * production bundle. The dev duration is therefore unreachable in production —
 * not merely hidden by CSS or by a runtime flag someone could flip.
 */
export const IS_DEV = import.meta.env.DEV

/**
 * A development-only duration that runs exactly one breath: one inhale, one
 * exhale, then the session completes.
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

/** Never true in a production build, so a dev duration cannot leak into one. */
export function isDevDuration(minutes) {
  return IS_DEV && minutes === DEV_DURATION_MINUTES
}

export function isValidDuration(minutes) {
  return DURATION_PRESETS_MINUTES.includes(minutes) || isDevDuration(minutes)
}

export function durationOrDefault(minutes) {
  return isValidDuration(minutes) ? minutes : DEFAULT_DURATION_MINUTES
}
