/**
 * Completion sound (TECH_SPECS §12).
 *
 * The sound plays minutes after the last user interaction. iOS Safari does not
 * permit that unless the audio context has been unlocked by a user gesture, so
 * `unlock()` MUST be called synchronously from the Begin tap and the decoded
 * buffer held for the whole session. Deferring setup to the completion event
 * fails silently on iPhone.
 *
 * The iOS ringer switch still mutes Web Audio and nothing here can change that.
 * Completion never depends on playback succeeding (TECH_SPECS §22).
 */
import completeUrl from '../assets/audio/complete.wav'

let context = null
let buffer = null
let loading = null

function AudioContextClass() {
  return window.AudioContext || window.webkitAudioContext || null
}

/**
 * Prepare audio. Call from a user gesture handler.
 *
 * Creating/resuming the context is done synchronously; decoding happens in the
 * background and has minutes to finish before the sound is needed.
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
  if (buffer || loading) return
  loading = fetch(completeUrl)
    .then((response) => response.arrayBuffer())
    .then((data) => context.decodeAudioData(data))
    .then((decoded) => {
      buffer = decoded
    })
    .catch(() => {
      // Audio unavailable. The session still completes.
      buffer = null
    })
    .finally(() => {
      loading = null
    })
}

/** Play the completion sound. Never throws; silently does nothing on failure. */
export function play() {
  if (!context || !buffer) return false
  try {
    if (context.state === 'suspended') context.resume().catch(() => {})
    const source = context.createBufferSource()
    source.buffer = buffer
    const gain = context.createGain()
    gain.gain.value = 0.9
    source.connect(gain).connect(context.destination)
    source.start()
    return true
  } catch {
    return false
  }
}
