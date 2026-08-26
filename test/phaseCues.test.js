/**
 * @vitest-environment jsdom
 *
 * The breathing phase cue sounds (SPECS §16.1).
 *
 * A cue is triggered by the animation loop rather than by the controller, so
 * these tests drive the real loop with a fake clock — faking
 * `requestAnimationFrame` and `performance.now` together, which is what keeps
 * frames and session time in step. The sound module itself is stubbed: what
 * matters here is which cue is asked for and when, not that Web Audio (absent
 * in jsdom) produced anything.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/services/sounds.js', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, unlock: vi.fn(), play: vi.fn(() => true) }
})

import { findProfile } from '../src/data/breathingProfiles.js'
import { DEV_DURATION_MINUTES } from '../src/data/durations.js'
import { SESSION_STATE } from '../src/services/sessionController.js'
import { SOUND, play } from '../src/services/sounds.js'
import * as session from '../src/services/useSession.js'

const profile = findProfile('beginner') // 3s in, 5s out
const INHALE_MS = profile.inhaleSeconds * 1000
const EXHALE_MS = profile.exhaleSeconds * 1000

/** Advance the fake clock, running the animation frames it passes through. */
function run(ms) {
  vi.advanceTimersByTime(ms)
}

/** Which cues have been played, in order, ignoring any completion chime. */
function cues() {
  return play.mock.calls.map(([sound]) => sound).filter((sound) => sound !== SOUND.COMPLETION)
}

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout'],
  })
  play.mockClear()
  session.selectProfile('beginner')
})

afterEach(() => {
  if (session.isSessionActive.value) session.confirmExit()
  else session.returnHome()
  vi.useRealTimers()
  window.history.replaceState({}, '', '/')
})

describe('phase cue sounds', () => {
  it('plays no cue when the session begins', () => {
    session.begin()
    // The opening inhale was not preceded by an exhale, so there is nothing to
    // mark — and the Begin tap itself already told the user the session started.
    run(500)
    expect(cues()).toEqual([])
  })

  it('plays the exhale cue when the inhale ends, and the inhale cue when the exhale ends', () => {
    session.begin()

    run(INHALE_MS - 200)
    expect(cues()).toEqual([])

    // End of the first inhale: breathe out.
    run(400)
    expect(cues()).toEqual([SOUND.EXHALE])

    run(EXHALE_MS - 400)
    expect(cues()).toEqual([SOUND.EXHALE])

    // End of the first exhale: breathe in.
    run(400)
    expect(cues()).toEqual([SOUND.EXHALE, SOUND.INHALE])
  })

  it('plays one cue per phase, on the first frame of the new phase', () => {
    session.begin()
    run(INHALE_MS + EXHALE_MS + INHALE_MS + 100)
    // Two boundaries crossed in the middle of the session, two cues.
    expect(cues()).toEqual([SOUND.EXHALE, SOUND.INHALE, SOUND.EXHALE])
  })

  it('makes no sound while the session is paused', () => {
    session.begin()
    run(INHALE_MS + 100)
    expect(cues()).toEqual([SOUND.EXHALE])

    session.pause()
    // Time passing over what would have been a phase boundary changes nothing:
    // a paused session does not advance, and runs no frames (FR-13).
    run(EXHALE_MS * 3)
    expect(cues()).toEqual([SOUND.EXHALE])

    session.resume()
    run(EXHALE_MS)
    expect(cues()).toEqual([SOUND.EXHALE, SOUND.INHALE])
  })

  it('does not repeat a cue when a session is resumed mid-phase', () => {
    session.begin()
    run(INHALE_MS + 500)
    session.pause()
    session.resume()
    run(100)
    // Still the same exhale; the cue that opened it is not played again.
    expect(cues()).toEqual([SOUND.EXHALE])
  })

  it('ends the session on the completion chime alone, with no cue for the final exhale', () => {
    // One-breath session: inhale, exhale, complete (SPECS §3).
    window.history.replaceState({}, '', '?devduration=1')
    session.selectDuration(DEV_DURATION_MINUTES)
    session.begin()

    run(INHALE_MS + EXHALE_MS + 500)
    expect(session.sessionState.value).toBe(SESSION_STATE.COMPLETED)

    // The end of that exhale is also the end of the session: one sound, not two.
    expect(cues()).toEqual([SOUND.EXHALE])
    expect(play).toHaveBeenLastCalledWith(SOUND.COMPLETION)
  })

  it('plays no cue at all when the user exits mid-session', () => {
    session.begin()
    run(INHALE_MS + 100)
    play.mockClear()

    session.requestExit()
    session.confirmExit()
    run(EXHALE_MS * 2)
    expect(play).not.toHaveBeenCalled()
  })
})
