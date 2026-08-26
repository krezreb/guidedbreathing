/**
 * The session controller — the single source of truth for session state and
 * timing (TECH_SPECS §5, §6).
 *
 * Deliberately free of DOM, Vue and p5 references: it is a plain object over
 * numbers, driven by an injectable clock, so every timing requirement is
 * verifiable in a headless test rather than with a stopwatch (TECH_SPECS §28).
 *
 * Timing model: ONE authoritative accumulator, `activeElapsedMs`. Everything
 * else — breathing phase, bubble position, remaining time — is derived from it.
 * There is no second copy of progress that can drift out of step, so FR-09,
 * FR-10 and FR-11 hold arithmetically rather than by bookkeeping.
 */

export const SESSION_STATE = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
}

export const PHASE = {
  INHALE: 'INHALE',
  EXHALE: 'EXHALE',
}

export const PAUSE_REASON = {
  USER: 'USER',
  HIDDEN: 'HIDDEN',
}

/**
 * Half-cosine ease, mapping progress 0..1 onto position 0..1 exactly.
 *
 * The bubble slows as it approaches each extreme, the way breath does. The
 * endpoints are exact, so the bubble arrives precisely when the phase ends:
 * easing changes velocity within a phase, never its duration (TECH_SPECS §4.1).
 */
export function ease(t) {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t
  return (1 - Math.cos(Math.PI * clamped)) / 2
}

/**
 * @param {object} options
 * @param {object} options.profile        A breathing profile (see data/breathingProfiles).
 * @param {number} options.durationMinutes One of the duration presets.
 * @param {() => number} [options.now]    Monotonic clock in ms. Injectable for tests.
 */
export function createSession({ profile, durationMinutes, now = () => performance.now() }) {
  const inhaleMs = profile.inhaleSeconds * 1000
  const exhaleMs = profile.exhaleSeconds * 1000
  const cycleMs = inhaleMs + exhaleMs
  const durationMs = durationMinutes * 60 * 1000

  /**
   * A session always finishes on a completed exhale (SPECS §7.1): run to the
   * first cycle boundary at or after the configured duration. When the duration
   * divides evenly this is the duration itself; otherwise it overflows by less
   * than one cycle.
   */
  const endMs = Math.ceil(durationMs / cycleMs) * cycleMs

  let state = SESSION_STATE.IDLE
  let activeElapsedMs = 0
  let runStartedAt = 0
  let pauseReason = null

  function elapsed() {
    if (state !== SESSION_STATE.RUNNING) return activeElapsedMs
    return activeElapsedMs + (now() - runStartedAt)
  }

  /** Absorb the current running span into the accumulator and stop counting. */
  function settle() {
    activeElapsedMs = elapsed()
  }

  function start() {
    if (state !== SESSION_STATE.IDLE) return false
    activeElapsedMs = 0
    runStartedAt = now()
    pauseReason = null
    state = SESSION_STATE.RUNNING
    return true
  }

  function pause(reason = PAUSE_REASON.USER) {
    if (state !== SESSION_STATE.RUNNING) return false
    settle()
    pauseReason = reason
    state = SESSION_STATE.PAUSED
    return true
  }

  function resume() {
    if (state !== SESSION_STATE.PAUSED) return false
    // Only the clock reference moves; activeElapsedMs is untouched, so the
    // current phase continues from exactly where it stopped (FR-10).
    runStartedAt = now()
    pauseReason = null
    state = SESSION_STATE.RUNNING
    return true
  }

  /** Terminate and discard. Never reaches COMPLETED, so never fires the sound (FR-14). */
  function exit() {
    if (state === SESSION_STATE.IDLE) return false
    settle()
    state = SESSION_STATE.IDLE
    pauseReason = null
    return true
  }

  /**
   * Advance the state machine. Safe to call as often as the animation loop
   * likes; it only ever transitions RUNNING → COMPLETED.
   *
   * @returns {boolean} true on the single tick that completes the session.
   */
  function tick() {
    if (state !== SESSION_STATE.RUNNING) return false
    if (elapsed() < endMs) return false
    // Freeze at the exact end so the completion is not skewed by how late the
    // frame that noticed it happened to run.
    activeElapsedMs = endMs
    state = SESSION_STATE.COMPLETED
    pauseReason = null
    return true
  }

  function phaseAt(elapsedMs) {
    const positionInCycle = ((elapsedMs % cycleMs) + cycleMs) % cycleMs
    if (positionInCycle < inhaleMs) {
      const progress = inhaleMs === 0 ? 1 : positionInCycle / inhaleMs
      return {
        phase: PHASE.INHALE,
        progress,
        remainingMs: inhaleMs - positionInCycle,
        // 0 = bottom of the guide, 1 = top.
        position: ease(progress),
      }
    }
    const intoExhale = positionInCycle - inhaleMs
    const progress = exhaleMs === 0 ? 1 : intoExhale / exhaleMs
    return {
      phase: PHASE.EXHALE,
      progress,
      remainingMs: exhaleMs - intoExhale,
      position: 1 - ease(progress),
    }
  }

  /**
   * Remaining session time, clamped at zero so the display reads 0:00 during
   * the end-of-session overflow rather than going negative (TECH_SPECS §5.3).
   */
  function remainingMs() {
    const left = durationMs - elapsed()
    return left > 0 ? left : 0
  }

  /**
   * A consistent view of the session at one instant. The animation and the
   * timer both read from this, which is what keeps them synchronized: they
   * cannot disagree about the time because they are handed the same number.
   */
  function snapshot() {
    const elapsedMs = elapsed()
    const breathing = phaseAt(elapsedMs)
    return {
      state,
      pauseReason,
      elapsedMs,
      remainingMs: remainingMs(),
      phase: breathing.phase,
      phaseProgress: breathing.progress,
      phaseRemainingMs: breathing.remainingMs,
      position: breathing.position,
    }
  }

  return {
    profile,
    durationMinutes,
    durationMs,
    inhaleMs,
    exhaleMs,
    cycleMs,
    endMs,
    start,
    pause,
    resume,
    exit,
    tick,
    elapsed,
    remainingMs,
    phaseAt,
    snapshot,
    get state() {
      return state
    },
    get pauseReason() {
      return pauseReason
    },
  }
}

/**
 * Format remaining milliseconds as M:SS, rounding UP.
 *
 * Rounding up avoids showing 0:00 for a full second before the session actually
 * ends (TECH_SPECS §5.3).
 */
export function formatRemaining(ms) {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
