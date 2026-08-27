/**
 * Runtime feature flags, read from the URL query string (TECH_SPECS §15.1).
 *
 * A flag is off unless the URL asks for it: `?devduration=1`. Being runtime
 * rather than build-time is the point — one bundle behaves both ways, so a
 * flagged feature can be exercised against the real production build instead of
 * only under `vite dev`.
 *
 * The trade is that a flag is reachable by anyone who edits the URL. Only put
 * things behind one that are harmless in a stranger's hands.
 *
 * Flags are read on each check rather than cached at import. A cache would have
 * to be primed before any other module's top-level code ran — `useSession.js`
 * sanitises the stored duration as it loads — and priming it would need a
 * test-only seam. Parsing a short query string is cheaper than either.
 */

/** Flag names, exactly as they appear in the query string. */
export const FLAG_DEV_DURATION = 'devduration'

/**
 * `?devduration`, `?devduration=1`, `=true`, `=yes` and `=on` all enable it.
 * The empty string is in the set because a bare `?devduration` parses to one —
 * which makes `?devduration=` enable it too, the two being indistinguishable
 * after parsing.
 *
 * Anything else, `=0` included, leaves the flag off: it can be switched off by
 * editing one character rather than surgery on the URL.
 */
const TRUTHY = new Set(['', '1', 'true', 'yes', 'on'])

function currentSearch() {
  try {
    return window.location.search
  } catch {
    // No window: the controller and its tests run headless (TECH_SPECS §28).
    return ''
  }
}

export function isFlagEnabled(name, search = currentSearch()) {
  try {
    const value = new URLSearchParams(search).get(name)
    return value !== null && TRUTHY.has(value.toLowerCase())
  } catch {
    // A malformed query string disables every flag rather than throwing on a
    // path that runs before the app has rendered anything.
    return false
  }
}

/** The one-breath development duration (SPECS §3). */
export function isDevDurationEnabled(search) {
  return isFlagEnabled(FLAG_DEV_DURATION, search)
}
