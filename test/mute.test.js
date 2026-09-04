/**
 * @vitest-environment jsdom
 *
 * Muting the session sounds.
 *
 * The guard lives in `play()` rather than in its callers, so this covers the
 * completion chime and both phase cues at once. jsdom has no Web Audio, so
 * `play()` cannot succeed here either way — what is checked is that muting is
 * remembered and that nothing throws when it is toggled.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { SOUND, muted, play, toggleMute } from '../src/services/sounds.js'
import { loadPreferences } from '../src/services/storage.js'

beforeEach(() => {
  window.localStorage.clear()
  muted.value = false
})

afterEach(() => {
  muted.value = false
  window.localStorage.clear()
})

describe('sound muting', () => {
  it('starts unmuted', () => {
    expect(muted.value).toBe(false)
  })

  it('toggles and persists the choice', () => {
    toggleMute()
    expect(muted.value).toBe(true)
    expect(loadPreferences().soundMuted).toBe(true)

    toggleMute()
    expect(muted.value).toBe(false)
    expect(loadPreferences().soundMuted).toBe(false)
  })

  it('plays nothing while muted', () => {
    toggleMute()
    for (const sound of Object.values(SOUND)) {
      expect(play(sound)).toBe(false)
    }
  })
})
