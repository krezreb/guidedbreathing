/**
 * Service worker updates (TECH_SPECS §21).
 *
 * A new build must never interrupt a breathing session. Activating a waiting
 * worker reloads the page, so the swap is deferred until the app is idle — on
 * the main or information screen, where a reload costs nothing because
 * preferences are persisted and no session is in progress.
 */
import { watch } from 'vue'
import { isIdle } from './useSession.js'

/**
 * @param {(reload?: boolean) => Promise<void>} updateSW From virtual:pwa-register.
 */
export function applyWhenIdle(updateSW) {
  if (isIdle.value) {
    updateSW(true)
    return
  }
  const stop = watch(isIdle, (idle) => {
    if (!idle) return
    stop()
    updateSW(true)
  })
}
