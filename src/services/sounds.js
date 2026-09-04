/**
 * Session sounds (TECH_SPECS §12).
 *
 * Three bundled sounds, all played through one shared audio context:
 *
 *   COMPLETION  the end-of-session chime (SPECS §16)
 *   INHALE      played when an exhale ends, cueing the breath in
 *   EXHALE      played when an inhale ends, cueing the breath out
 *
 * The completion sound plays minutes after the last user interaction. iOS Safari
 * does not permit that unless the audio context has been unlocked by a user
 * gesture, so `unlock()` MUST be called synchronously from the Begin tap and the
 * decoded buffers held for the whole session. Deferring setup to the moment a
 * sound is needed fails silently on iPhone — and that applies to the phase cues
 * too: the first of them is due only seconds after Begin, which is not long
 * enough to rely on a decode that has not been started.
 *
 * The iOS ringer switch still mutes Web Audio and nothing here can change that.
 * Nothing in a session ever depends on playback succeeding (TECH_SPECS §22).
 */
import { ref } from 'vue'
import { loadPreferences, updatePreferences } from './storage.js'
import completeUrl from '../assets/audio/complete.wav'
import inhaleUrl from '../assets/audio/inhale.wav'
import exhaleUrl from '../assets/audio/exhale.wav'

export const SOUND = {
  COMPLETION: 'COMPLETION',
  INHALE: 'INHALE',
  EXHALE: 'EXHALE',
}

/**
 * Per-sound source and level. The phase cues are quieter than the completion
 * chime: they recur every few seconds and must stay in the background of the
 * session rather than punctuate it (SPECS §16.1).
 */
const SOUNDS = {
  [SOUND.COMPLETION]: { url: completeUrl, gain: 0.9 },
  [SOUND.INHALE]: { url: inhaleUrl, gain: 0.5 },
  [SOUND.EXHALE]: { url: exhaleUrl, gain: 0.5 },
}

/**
 * Sound off. Persisted like any other preference, so a user who breathes in
 * silence is not asked again next session (TECH_SPECS §7.1). Owned here rather
 * than by the button, so every caller of `play()` is covered by one guard.
 */
export const muted = ref(loadPreferences().soundMuted === true)

export function toggleMute() {
  muted.value = !muted.value
  updatePreferences({ soundMuted: muted.value })
}

let context = null
/** Decoded buffers by SOUND key. A missing entry simply means "cannot play". */
const buffers = new Map()
let loading = false

function AudioContextClass() {
  return window.AudioContext || window.webkitAudioContext || null
}

/**
 * Prepare audio. Call from a user gesture handler.
 *
 * Creating/resuming the context is done synchronously; decoding happens in the
 * background. The phase cues are wanted first — the earliest is one inhale after
 * Begin — but a cue that is not yet decoded is simply skipped, exactly as a
 * cue is skipped when the device has no audio at all.
 */
export function unlock() {
  const Ctor = AudioContextClass()
  if (!Ctor) return
  try {
    if (!context) context = new Ctor()
    // Safari starts contexts suspended; only a gesture can resume them.
    if (context.state === 'suspended') context.resume().catch(() => {})
  } catch {
    context = null
    return
  }
  if (loading || buffers.size === Object.keys(SOUNDS).length) return
  loading = true
  const pending = Object.entries(SOUNDS).map(([key, { url }]) =>
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => context.decodeAudioData(data))
      .then((decoded) => {
        buffers.set(key, decoded)
      })
      .catch(() => {
        // This sound is unavailable. The session still runs and still completes.
      }),
  )
  Promise.all(pending).finally(() => {
    loading = false
  })
}

/**
 * Play one sound. Never throws; silently does nothing when audio is
 * unavailable or that buffer has not finished decoding.
 *
 * @param {string} sound A SOUND key.
 * @returns {boolean} true when playback was started.
 */
export function play(sound = SOUND.COMPLETION) {
  const buffer = buffers.get(sound)
  const settings = SOUNDS[sound]
  if (muted.value || !context || !buffer || !settings) return false
  try {
    if (context.state === 'suspended') context.resume().catch(() => {})
    const source = context.createBufferSource()
    source.buffer = buffer
    const gain = context.createGain()
    gain.gain.value = settings.gain
    source.connect(gain).connect(context.destination)
    source.start()
    return true
  } catch {
    return false
  }
}
