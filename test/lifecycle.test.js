/**
 * @vitest-environment jsdom
 *
 * The auto-pause behaviour (TECH_SPECS §6.1) lives in the browser wiring rather
 * than the controller, so it is tested against a real document.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SESSION_STATE } from '../src/services/sessionController.js'
import * as session from '../src/services/useSession.js'

function hide(hidden) {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: () => hidden,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('automatic pause on hidden document', () => {
  beforeEach(() => {
    session.installLifecycleHandlers()
    if (session.isSessionActive.value) session.confirmExit()
    else session.returnHome()
  })

  it('pauses a running session when the document is hidden', () => {
    session.begin()
    expect(session.sessionState.value).toBe(SESSION_STATE.RUNNING)

    hide(true)
    expect(session.sessionState.value).toBe(SESSION_STATE.PAUSED)
    expect(session.pausedWhileAway.value).toBe(true)
  })

  it('does not auto-resume when the document becomes visible again', () => {
    session.begin()
    hide(true)
    hide(false)

    // The user's attention was elsewhere; resuming is their decision.
    expect(session.sessionState.value).toBe(SESSION_STATE.PAUSED)
    expect(session.isPaused.value).toBe(true)

    session.resume()
    expect(session.sessionState.value).toBe(SESSION_STATE.RUNNING)
    expect(session.pausedWhileAway.value).toBe(false)
  })

  it('pauses on pagehide as well, for iOS app switches', () => {
    session.begin()
    window.dispatchEvent(new Event('pagehide'))
    expect(session.sessionState.value).toBe(SESSION_STATE.PAUSED)
  })

  it('leaves an already-paused session alone', () => {
    session.begin()
    session.pause()
    const reason = session.pauseReason.value
    hide(true)
    expect(session.sessionState.value).toBe(SESSION_STATE.PAUSED)
    // A user pause is not relabelled as an away-pause.
    expect(session.pauseReason.value).toBe(reason)
  })
})

describe('exit confirmation', () => {
  beforeEach(() => {
    if (session.isSessionActive.value) session.confirmExit()
  })

  it('asks before discarding, and cancelling keeps the session', () => {
    session.begin()
    session.requestExit()
    expect(session.exitConfirmVisible.value).toBe(true)
    expect(session.sessionState.value).toBe(SESSION_STATE.RUNNING)

    session.cancelExit()
    expect(session.exitConfirmVisible.value).toBe(false)
    expect(session.sessionState.value).toBe(SESSION_STATE.RUNNING)
  })

  it('returns to IDLE on confirm, never to COMPLETED', () => {
    session.begin()
    session.requestExit()
    session.confirmExit()
    expect(session.sessionState.value).toBe(SESSION_STATE.IDLE)
    expect(session.isCompleted.value).toBe(false)
    expect(session.controller.value).toBeNull()
  })

  it('does not open the dialog when there is no session', () => {
    session.requestExit()
    expect(session.exitConfirmVisible.value).toBe(false)
  })
})

describe('preferences', () => {
  it('persists and restores selections', () => {
    session.selectProfile('chill')
    session.selectDuration(15)
    expect(session.selectedProfileId.value).toBe('chill')
    expect(session.selectedDurationMinutes.value).toBe(15)

    const stored = JSON.parse(window.localStorage.getItem('guided-breathing.preferences'))
    expect(stored).toEqual({ profileId: 'chill', durationMinutes: 15 })
  })

  it('ignores values that are not valid presets', () => {
    session.selectProfile('chill')
    session.selectDuration(15)
    session.selectProfile('not-a-profile')
    session.selectDuration(7)
    // Falls back to the defaults rather than accepting nonsense.
    expect(session.selectedProfileId.value).toBe('beginner')
    expect(session.selectedDurationMinutes.value).toBe(5)
  })

  it('keeps working when localStorage throws', () => {
    const setItem = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => session.selectDuration(8)).not.toThrow()
    expect(session.selectedDurationMinutes.value).toBe(8)
    setItem.mockRestore()
  })
})

describe('deferred service worker updates', () => {
  beforeEach(() => {
    if (session.isSessionActive.value) session.confirmExit()
    else session.returnHome()
  })

  it('applies an update immediately when the app is idle', async () => {
    const { applyWhenIdle } = await import('../src/services/appUpdate.js')
    const updateSW = vi.fn()
    applyWhenIdle(updateSW)
    expect(updateSW).toHaveBeenCalledWith(true)
  })

  it('waits for the session to finish before reloading', async () => {
    const { applyWhenIdle } = await import('../src/services/appUpdate.js')
    const { nextTick } = await import('vue')
    const updateSW = vi.fn()

    session.begin()
    applyWhenIdle(updateSW)
    // A new build must not interrupt a breath.
    expect(updateSW).not.toHaveBeenCalled()

    session.pause()
    await nextTick()
    expect(updateSW).not.toHaveBeenCalled()

    session.confirmExit()
    await nextTick()
    expect(updateSW).toHaveBeenCalledWith(true)
  })
})
