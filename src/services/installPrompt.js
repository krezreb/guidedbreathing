/**
 * In-app install prompt (TECH_SPECS §8.4).
 *
 * Chromium fires `beforeinstallprompt` when the PWA install criteria are met,
 * but the browsers differ in what they then offer the user. Desktop Chromium
 * shows an install icon in the address bar; Brave on Android shows nothing at
 * all, hiding installation behind a menu item most people never open. Capturing
 * the event lets the app offer its own button, so the install path is the same
 * everywhere the event fires.
 *
 * Entirely best-effort, like the wake lock: browsers that never fire the event
 * (Firefox, Safari) simply never show the button, and nothing else changes.
 */
import { ref } from 'vue'

/** The captured event, usable exactly once. */
let deferred = null

/** True while an install prompt is available to show. */
export const canInstall = ref(false)

function capture(event) {
  // Suppresses Chrome for Android's mini-infobar in favour of the app's own
  // button. The desktop address-bar icon is unaffected by this.
  event.preventDefault()
  deferred = event
  canInstall.value = true
}

function forget() {
  deferred = null
  canInstall.value = false
}

/**
 * Start listening. Called from `App.vue` during setup, which runs before the
 * first paint — the event can fire as soon as the page loads and is not
 * replayed for a listener that attaches later.
 */
export function initInstallPrompt() {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', capture)
  // Covers installation through the browser's own UI as well as through ours.
  window.addEventListener('appinstalled', forget)
}

/**
 * Show the browser's install dialog.
 *
 * @returns {Promise<'accepted' | 'dismissed' | 'unavailable'>}
 */
export async function promptInstall() {
  if (!deferred) return 'unavailable'
  const event = deferred
  // The event cannot be reused, whatever the user chooses. Chromium fires a
  // fresh one on a later visit if the app is still uninstalled.
  forget()
  try {
    await event.prompt()
    const { outcome } = await event.userChoice
    return outcome
  } catch {
    // Already used, or dismissed by the browser rather than the user.
    return 'unavailable'
  }
}

/** Test seam: drop any captured event and stop offering the button. */
export function resetInstallPrompt() {
  forget()
}
