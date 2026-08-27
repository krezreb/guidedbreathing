/**
 * The four breathing profiles (SPECS §2).
 *
 * Timings only — the name and description of each profile live in the message
 * catalogues under `profile.<id>`, so this module holds no user-visible text.
 *
 * Adding a profile means adding an entry here plus its strings in every
 * catalogue; no UI code knows the list's length or contents.
 */
export const BREATHING_PROFILES = [
  { id: 'strengthen', inhaleSeconds: 6, exhaleSeconds: 6 },
  { id: 'chill', inhaleSeconds: 4, exhaleSeconds: 8 },
  { id: 'balance', inhaleSeconds: 5, exhaleSeconds: 5 },
  { id: 'beginner', inhaleSeconds: 3, exhaleSeconds: 5 },
]

export const DEFAULT_PROFILE_ID = 'beginner'

export function findProfile(id) {
  return BREATHING_PROFILES.find((profile) => profile.id === id) ?? null
}

export function profileOrDefault(id) {
  return findProfile(id) ?? findProfile(DEFAULT_PROFILE_ID)
}
