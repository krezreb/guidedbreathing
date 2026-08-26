/**
 * The four breathing profiles (SPECS §2).
 *
 * Adding a profile means adding an entry here and nothing else — no UI code
 * knows the list's length or contents.
 */
export const BREATHING_PROFILES = [
  {
    id: 'strengthen',
    name: 'Strengthen',
    inhaleSeconds: 6,
    exhaleSeconds: 6,
    description: 'Equal-duration breathing',
  },
  {
    id: 'chill',
    name: 'Chill',
    inhaleSeconds: 4,
    exhaleSeconds: 8,
    description: 'Longer exhalation',
  },
  {
    id: 'balance',
    name: 'Balance',
    inhaleSeconds: 5,
    exhaleSeconds: 5,
    description: 'Balanced breathing',
  },
  {
    id: 'beginner',
    name: 'Beginner',
    inhaleSeconds: 3,
    exhaleSeconds: 5,
    description: 'Shorter cycle for beginners',
  },
]

export const DEFAULT_PROFILE_ID = 'beginner'

export function findProfile(id) {
  return BREATHING_PROFILES.find((profile) => profile.id === id) ?? null
}

export function profileOrDefault(id) {
  return findProfile(id) ?? findProfile(DEFAULT_PROFILE_ID)
}
