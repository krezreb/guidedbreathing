/**
 * Session orchestration: the bridge between the pure controller and the
 * browser.
 *
 * The controller owns state and arithmetic; this module owns the side effects —
 * animation loop, document visibility, wake lock, history, audio. Views read
 * reactive state from here and never touch timing directly.
 *
 * Reactive values are updated only when they actually change, not every frame.
 * The p5 sketch reads the controller directly for smooth motion, so per-frame
 * Vue re-renders are unnecessary.
 */
import { computed, ref, shallowRef } from 'vue'
import {
  createSession,
  formatRemaining,
  PAUSE_REASON,
  PHASE,
  SESSION_STATE,
} from './sessionController.js'
import { profileOrDefault, DEFAULT_PROFILE_ID } from '../data/breathingProfiles.js'
import { durationOrDefault, DEFAULT_DURATION_MINUTES } from '../data/durations.js'
import { loadPreferences, updatePreferences } from './storage.js'
import * as wakeLock from './screenWakeLock.js'
import * as sound from './sounds.js'

const HISTORY_MARKER = 'guided-breathing-session'

const stored = loadPreferences()

/** Selections on the main screen. Persisted (TECH_SPECS §7.1). */
export const selectedProfileId = ref(profileOrDefault(stored.profileId)?.id ?? DEFAULT_PROFILE_ID)
export const selectedDurationMinutes = ref(
  durationOrDefault(stored.durationMinutes ?? DEFAULT_DURATION_MINUTES),
)

/** 'home' | 'info' | 'language' — which non-session screen is showing. */
export const homeScreen = ref('home')

export const sessionState = ref(SESSION_STATE.IDLE)
export const pauseReason = ref(null)
export const phase = ref(null)
export const remainingLabel = ref('')
export const exitConfirmVisible = ref(false)

/** The live controller. Shallow: it is a plain object, not reactive data. */
export const controller = shallowRef(null)

export const isSessionActive = computed(
  () => sessionState.value === SESSION_STATE.RUNNING || sessionState.value === SESSION_STATE.PAUSED,
)
export const isCompleted = computed(() => sessionState.value === SESSION_STATE.COMPLETED)
/** True only on the main/information screens, where a reload loses nothing. */
export const isIdle = computed(() => sessionState.value === SESSION_STATE.IDLE)
export const isPaused = computed(() => sessionState.value === SESSION_STATE.PAUSED)
export const pausedWhileAway = computed(() => pauseReason.value === PAUSE_REASON.HIDDEN)

let frameHandle = null

function syncReactive() {
  const active = controller.value
  if (!active) return null
  const snapshot = active.snapshot()
  if (sessionState.value !== snapshot.state) sessionState.value = snapshot.state
  if (pauseReason.value !== snapshot.pauseReason) pauseReason.value = snapshot.pauseReason
  if (phase.value !== snapshot.phase) phase.value = snapshot.phase
  const label = formatRemaining(snapshot.remainingMs)
  if (remainingLabel.value !== label) remainingLabel.value = label
  return snapshot
}

/* -- Phase cue sounds (SPECS §16.1) --------------------------------------- */

/**
 * The phase whose cue has already been dealt with. Seeded at Begin so the first
 * inhale — which no exhale preceded — is silent, and cleared at teardown.
 */
let cuedPhase = null

/**
 * Sound the end of a breathing phase.
 *
 * A cue marks a transition, so it is driven by the phase *change* rather than by
 * a time: it plays on the first frame of the new phase, which is the moment the
 * previous one ended. The cue names the breath now due — the inhale cue at the
 * end of an exhale, the exhale cue at the end of an inhale — so it tells the
 * user what to do rather than what they have just finished.
 *
 * Called only from the animation loop, and only on a frame that did not complete
 * the session: a paused session runs no frames, so it makes no sound, and the
 * final exhale is marked by the completion chime alone rather than by two sounds
 * at once (FR-26).
 */
function cuePhaseChange(currentPhase) {
  if (currentPhase === cuedPhase) return
  cuedPhase = currentPhase
  sound.play(currentPhase === PHASE.INHALE ? sound.SOUND.INHALE : sound.SOUND.EXHALE)
}

function stopLoop() {
  if (frameHandle !== null) {
    cancelAnimationFrame(frameHandle)
    frameHandle = null
  }
}

function startLoop() {
  if (frameHandle !== null) return
  const step = () => {
    frameHandle = null
    const active = controller.value
    if (!active) return
    if (active.tick()) {
      onCompleted()
      return
    }
    const snapshot = syncReactive()
    if (snapshot && active.state === SESSION_STATE.RUNNING) {
      cuePhaseChange(snapshot.phase)
      frameHandle = requestAnimationFrame(step)
    }
  }
  frameHandle = requestAnimationFrame(step)
}

function onCompleted() {
  stopLoop()
  syncReactive()
  wakeLock.release()
  releaseHistoryEntry()
  sound.play(sound.SOUND.COMPLETION)
}

/* -- Android hardware back button (TECH_SPECS §6.2) ----------------------- */

function claimHistoryEntry() {
  try {
    if (window.history.state?.[HISTORY_MARKER]) return
    window.history.pushState({ [HISTORY_MARKER]: true }, '')
  } catch {
    // History unavailable; back simply leaves the app as it would otherwise.
  }
}

function releaseHistoryEntry() {
  try {
    if (window.history.state?.[HISTORY_MARKER]) window.history.back()
  } catch {
    /* ignore */
  }
}

/* -- Public actions ------------------------------------------------------- */

export function selectProfile(profileId) {
  const profile = profileOrDefault(profileId)
  if (!profile) return
  selectedProfileId.value = profile.id
  persist()
}

export function selectDuration(minutes) {
  selectedDurationMinutes.value = durationOrDefault(minutes)
  persist()
}

function persist() {
  updatePreferences({
    profileId: selectedProfileId.value,
    durationMinutes: selectedDurationMinutes.value,
  })
}

/** Must be called from the Begin tap handler: iOS audio unlock needs a gesture. */
export function begin() {
  sound.unlock()
  const profile = profileOrDefault(selectedProfileId.value)
  const session = createSession({
    profile,
    durationMinutes: selectedDurationMinutes.value,
  })
  controller.value = session
  session.start()
  // The session opens on an inhale that no exhale preceded: nothing to cue yet.
  cuedPhase = PHASE.INHALE
  syncReactive()
  claimHistoryEntry()
  wakeLock.acquire()
  startLoop()
}

export function pause(reason = PAUSE_REASON.USER) {
  const active = controller.value
  if (!active || !active.pause(reason)) return
  stopLoop()
  syncReactive()
  wakeLock.release()
}

export function resume() {
  const active = controller.value
  if (!active || !active.resume()) return
  syncReactive()
  wakeLock.acquire()
  startLoop()
}

export function togglePause() {
  if (sessionState.value === SESSION_STATE.RUNNING) pause()
  else if (sessionState.value === SESSION_STATE.PAUSED) resume()
}

/**
 * True when the exit dialog paused a running session itself, so Cancel knows
 * whether to resume. A session the user had already paused stays paused.
 */
let resumeAfterExitCancel = false

/** Asking about exiting stops the guide: nothing keeps breathing behind the
 *  dialog while the user decides (SPECS §6.3). */
export function requestExit() {
  if (!isSessionActive.value) return
  if (sessionState.value === SESSION_STATE.RUNNING) {
    pause()
    resumeAfterExitCancel = true
  }
  exitConfirmVisible.value = true
}

export function cancelExit() {
  exitConfirmVisible.value = false
  const shouldResume = resumeAfterExitCancel
  resumeAfterExitCancel = false
  // Not while the app is hidden: the auto-pause owns that case.
  if (shouldResume && !document.hidden) resume()
}

/** Discards the session. Never reaches COMPLETED, so no sound and no message. */
export function confirmExit() {
  exitConfirmVisible.value = false
  resumeAfterExitCancel = false
  const active = controller.value
  if (active) active.exit()
  teardown()
}

/** Leave the completion screen. */
export function returnHome() {
  teardown()
}

function teardown() {
  resumeAfterExitCancel = false
<<<<<<< HEAD
=======
  cuedPhase = null
>>>>>>> worktree-phase-sounds
  stopLoop()
  wakeLock.release()
  releaseHistoryEntry()
  controller.value = null
  sessionState.value = SESSION_STATE.IDLE
  pauseReason.value = null
  phase.value = null
  remainingLabel.value = ''
  homeScreen.value = 'home'
}

/* -- Browser lifecycle wiring -------------------------------------------- */

let lifecycleInstalled = false

/** Called once from App.vue's setup; safe to call again. */
export function installLifecycleHandlers() {
  if (lifecycleInstalled) return
  lifecycleInstalled = true

  const autoPause = () => {
    if (document.hidden) pause(PAUSE_REASON.HIDDEN)
  }
  document.addEventListener('visibilitychange', autoPause)
  // iOS Safari does not always deliver visibilitychange on app switch.
  window.addEventListener('pagehide', () => pause(PAUSE_REASON.HIDDEN))

  window.addEventListener('popstate', () => {
    if (!isSessionActive.value) return
    // The entry is already gone; take another so the app is not left without
    // one, then ask instead of navigating away.
    claimHistoryEntry()
    requestExit()
  })

  window.addEventListener('keydown', (event) => {
    if (!isSessionActive.value) return
    if (event.code === 'Space') {
      // Space is the pause/resume shortcut; do not also scroll or re-trigger a
      // focused button.
      event.preventDefault()
      togglePause()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      if (exitConfirmVisible.value) cancelExit()
      else requestExit()
    }
  })
}
