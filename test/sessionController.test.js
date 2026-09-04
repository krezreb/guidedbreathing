import { describe, expect, it } from 'vitest'
import {
  createSession,
  ease,
  formatRemaining,
  PAUSE_REASON,
  PHASE,
  SESSION_STATE,
} from '../src/services/sessionController.js'
import { BREATHING_PROFILES, findProfile } from '../src/data/breathingProfiles.js'
import { DURATION_PRESETS_MINUTES } from '../src/data/durations.js'
import { fakeClock } from './helpers.js'

function session(profileId, durationMinutes, clock) {
  return createSession({
    profile: findProfile(profileId),
    durationMinutes,
    now: clock.now,
  })
}

describe('phase derivation', () => {
  // TECH_SPECS §28.2: across a cycle boundary, for every profile.
  it.each(BREATHING_PROFILES)('follows $id across a cycle boundary', (profile) => {
    const clock = fakeClock()
    const s = session(profile.id, 5, clock)
    const { inhaleMs, exhaleMs, cycleMs, holdMs } = s

    expect(s.phaseAt(0)).toMatchObject({ phase: PHASE.INHALE, progress: 0 })
    expect(s.phaseAt(inhaleMs - 1).phase).toBe(PHASE.INHALE)

    // The inhale ends on a brief hold at the top, still read as the inhale.
    expect(s.phaseAt(inhaleMs)).toMatchObject({ phase: PHASE.INHALE, progress: 1 })
    expect(s.phaseAt(inhaleMs + holdMs - 1)).toMatchObject({ phase: PHASE.INHALE, position: 1 })

    // Then straight into the exhale, with no gap.
    expect(s.phaseAt(inhaleMs + holdMs)).toMatchObject({ phase: PHASE.EXHALE, progress: 0 })
    expect(s.phaseAt(cycleMs - holdMs - 1).phase).toBe(PHASE.EXHALE)

    // And a matching hold at the bottom before the cycle wraps.
    expect(s.phaseAt(cycleMs - holdMs)).toMatchObject({ phase: PHASE.EXHALE, progress: 1 })
    expect(s.phaseAt(cycleMs - 1)).toMatchObject({ phase: PHASE.EXHALE, position: 0 })

    expect(s.phaseAt(cycleMs)).toMatchObject({ phase: PHASE.INHALE, progress: 0 })
    expect(s.phaseAt(cycleMs + inhaleMs + holdMs).phase).toBe(PHASE.EXHALE)

    expect(holdMs).toBe(400)
    expect(cycleMs).toBe(inhaleMs + exhaleMs + 2 * holdMs)
  })

  it('puts the bubble at the bottom on inhale start and the top at the end of the rise', () => {
    const clock = fakeClock()
    const s = session('chill', 5, clock)
    const { inhaleMs, holdMs, visualHoldMs, cycleMs } = s
    expect(s.phaseAt(0).position).toBeCloseTo(0, 10)
    expect(s.phaseAt(inhaleMs + holdMs - visualHoldMs).position).toBeCloseTo(1, 10)
    expect(s.phaseAt(cycleMs).position).toBeCloseTo(0, 10)
  })

  // The bubble is parked only for the last VISUAL_HOLD_MS of each hold: it is
  // still creeping into the extreme for the rest of it, so the approach reads
  // as fluid rather than as a long stop.
  it.each(BREATHING_PROFILES)('keeps $id moving through all but 100ms of each hold', (profile) => {
    const clock = fakeClock()
    const s = session(profile.id, 5, clock)
    const { inhaleMs, holdMs, visualHoldMs, cycleMs } = s
    const topStops = inhaleMs + holdMs - visualHoldMs
    const bottomStops = cycleMs - visualHoldMs

    expect(visualHoldMs).toBe(100)
    expect(s.phaseAt(topStops - 1).position).toBeLessThan(1)
    expect(s.phaseAt(topStops).position).toBeCloseTo(1, 10)
    expect(s.phaseAt(bottomStops - 1).position).toBeGreaterThan(0)
    expect(s.phaseAt(bottomStops).position).toBeCloseTo(0, 10)

    // And it arrives still moving: the last frame before the stop covers real
    // distance, rather than crawling the final pixels for half a second.
    const speedAtTop = 1 - s.phaseAt(topStops - 100).position
    expect(speedAtTop).toBeGreaterThan(0.5 * (100 / topStops))
  })

  it('eases without changing phase endpoints', () => {
    // Easing changes velocity within a phase, never its duration.
    expect(ease(0)).toBe(0)
    expect(ease(1)).toBe(1)
    expect(ease(0.5)).toBeCloseTo(0.5, 10)
    expect(ease(0.25)).toBeLessThan(0.25)
    expect(ease(-5)).toBe(0)
    expect(ease(5)).toBe(1)
  })
})

describe('pause and resume', () => {
  // FR-09, FR-10: the spec's own worked example.
  it('resumes mid-inhale without restarting the phase', () => {
    const clock = fakeClock()
    const s = session('strengthen', 5, clock) // 6s inhale, 6s exhale
    s.start()

    clock.advance(2000)
    expect(s.snapshot()).toMatchObject({ phase: PHASE.INHALE, phaseRemainingMs: 4000 })

    s.pause()
    expect(s.state).toBe(SESSION_STATE.PAUSED)

    // A long absence must change nothing about where the breath is.
    clock.advance(90_000)
    expect(s.snapshot()).toMatchObject({ phase: PHASE.INHALE, phaseRemainingMs: 4000 })

    s.resume()
    expect(s.snapshot()).toMatchObject({ phase: PHASE.INHALE, phaseRemainingMs: 4000 })

    // The remaining 4s of the inhale, the hold at the top, then the exhale.
    clock.advance(3999)
    expect(s.snapshot().phase).toBe(PHASE.INHALE)
    clock.advance(1 + s.holdMs)
    expect(s.snapshot()).toMatchObject({ phase: PHASE.EXHALE, phaseProgress: 0 })
  })

  it('freezes the animation position while paused', () => {
    const clock = fakeClock()
    const s = session('balance', 5, clock)
    s.start()
    clock.advance(1234)
    const before = s.snapshot().position
    s.pause()
    clock.advance(60_000)
    expect(s.snapshot().position).toBe(before)
  })

  // FR-11: paused time is not session time.
  it('excludes paused time from session progress', () => {
    const clock = fakeClock()
    const s = session('beginner', 3, clock)
    s.start()

    clock.advance(30_000)
    s.pause()
    clock.advance(600_000) // ten minutes away
    s.resume()
    clock.advance(30_000)

    expect(s.elapsed()).toBe(60_000)
    expect(s.remainingMs()).toBe(120_000)
  })

  it('records why it paused, and clears that on resume', () => {
    const clock = fakeClock()
    const s = session('chill', 5, clock)
    s.start()
    s.pause(PAUSE_REASON.HIDDEN)
    expect(s.pauseReason).toBe(PAUSE_REASON.HIDDEN)
    s.resume()
    expect(s.pauseReason).toBeNull()
  })

  it('ignores transitions that do not apply', () => {
    const clock = fakeClock()
    const s = session('chill', 5, clock)
    expect(s.pause()).toBe(false) // not running yet
    expect(s.resume()).toBe(false)
    s.start()
    expect(s.start()).toBe(false) // already running
    expect(s.resume()).toBe(false) // not paused
    s.pause()
    expect(s.pause()).toBe(false) // already paused
  })
})

describe('completion and overflow', () => {
  // SPECS §7.1: always finish on a completed exhale.
  it('ends a Beginner 5-minute session at the end of an exhale, slightly long', () => {
    const clock = fakeClock()
    const s = session('beginner', 5, clock) // 8.8s cycle with the holds, 300s requested
    expect(s.endMs).toBe(308_000)
    expect(s.endMs).toBeGreaterThan(s.durationMs)
    expect(s.endMs - s.durationMs).toBeLessThan(s.cycleMs)
    expect(s.endMs % s.cycleMs).toBe(0)

    s.start()
    clock.advance(300_000)
    expect(s.tick()).toBe(false)
    expect(s.state).toBe(SESSION_STATE.RUNNING)
    // The timer has bottomed out but the breath is still finishing.
    expect(s.remainingMs()).toBe(0)
    expect(formatRemaining(s.remainingMs())).toBe('0:00')

    clock.advance(7_999)
    expect(s.tick()).toBe(false)

    clock.advance(1)
    expect(s.tick()).toBe(true)
    expect(s.state).toBe(SESSION_STATE.COMPLETED)
  })

  it('ends exactly on time when the duration divides evenly', () => {
    const clock = fakeClock()
    // 5s in, 4.2s out plus the two 400ms holds: a 10s cycle, so 60s divides evenly.
    const s = createSession({
      profile: { id: 'even', inhaleSeconds: 5, exhaleSeconds: 4.2 },
      durationMinutes: 1,
      now: clock.now,
    })
    expect(s.cycleMs).toBe(10_000)
    expect(s.endMs).toBe(60_000)
    s.start()
    clock.advance(60_000)
    expect(s.tick()).toBe(true)
    expect(s.elapsed()).toBe(60_000)
  })

  it('never overflows by a whole cycle, for any profile and duration', () => {
    for (const profile of BREATHING_PROFILES) {
      for (const minutes of DURATION_PRESETS_MINUTES) {
        const s = session(profile.id, minutes, fakeClock())
        expect(s.endMs).toBeGreaterThanOrEqual(s.durationMs)
        expect(s.endMs - s.durationMs).toBeLessThan(s.cycleMs)
        // A cycle boundary is the end of an exhale, by construction.
        expect(s.endMs % s.cycleMs).toBe(0)
      }
    }
  })

  it('reports completion on one tick only, and freezes elapsed time', () => {
    const clock = fakeClock()
    const s = session('balance', 1, clock)
    s.start()
    clock.advance(s.endMs + 5_000) // a very late frame
    expect(s.tick()).toBe(true)
    expect(s.tick()).toBe(false)
    // Frozen at the true end, not skewed by when the frame happened to run.
    expect(s.elapsed()).toBe(s.endMs)
  })

  it('does not complete while paused', () => {
    const clock = fakeClock()
    const s = session('balance', 1, clock)
    s.start()
    clock.advance(30_000)
    s.pause()
    clock.advance(600_000)
    expect(s.tick()).toBe(false)
    expect(s.state).toBe(SESSION_STATE.PAUSED)
  })
})

describe('exit', () => {
  // FR-14: exiting must never reach COMPLETED, from either state.
  it('discards a running session without completing it', () => {
    const clock = fakeClock()
    const s = session('beginner', 1, clock)
    s.start()
    clock.advance(s.endMs + 10_000)
    expect(s.exit()).toBe(true)
    expect(s.state).toBe(SESSION_STATE.IDLE)
    expect(s.tick()).toBe(false)
    expect(s.state).toBe(SESSION_STATE.IDLE)
  })

  it('discards a paused session without completing it', () => {
    const clock = fakeClock()
    const s = session('beginner', 1, clock)
    s.start()
    clock.advance(1_000)
    s.pause()
    clock.advance(s.endMs * 2)
    expect(s.exit()).toBe(true)
    expect(s.state).toBe(SESSION_STATE.IDLE)
    expect(s.tick()).toBe(false)
  })
})

describe('remaining time display', () => {
  it('formats as M:SS, rounding up', () => {
    expect(formatRemaining(300_000)).toBe('5:00')
    expect(formatRemaining(299_999)).toBe('5:00')
    expect(formatRemaining(60_000)).toBe('1:00')
    expect(formatRemaining(59_001)).toBe('1:00')
    expect(formatRemaining(59_000)).toBe('0:59')
    expect(formatRemaining(1)).toBe('0:01')
    expect(formatRemaining(1_000)).toBe('0:01')
  })

  it('clamps at zero rather than going negative during overflow', () => {
    expect(formatRemaining(0)).toBe('0:00')
    expect(formatRemaining(-4_000)).toBe('0:00')
  })

  it('counts down from the configured duration', () => {
    const clock = fakeClock()
    const s = session('strengthen', 20, clock)
    expect(formatRemaining(s.remainingMs())).toBe('20:00')
    s.start()
    clock.advance(1_000)
    expect(formatRemaining(s.remainingMs())).toBe('19:59')
  })
})
