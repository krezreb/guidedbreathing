/**
 * @vitest-environment jsdom
 *
 * A smoke test that the app mounts and the main screen presents its three
 * areas. Rendering fidelity and animation smoothness are verified by hand on a
 * device (TECH_SPECS §28.3); this only guards against the app failing to boot.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import App from '../src/App.vue'
import { BREATHING_PROFILES } from '../src/data/breathingProfiles.js'
import { DURATION_PRESETS_MINUTES } from '../src/data/durations.js'
import * as session from '../src/services/useSession.js'

let app
let host

beforeEach(() => {
  host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp(App)
  app.mount(host)
})

afterEach(() => {
  if (session.isSessionActive.value) session.confirmExit()
  else session.returnHome()
  app.unmount()
  host.remove()
})

describe('main screen', () => {
  it('offers every profile and every duration preset', () => {
    const labels = [...host.querySelectorAll('button')].map((b) => b.textContent.trim())
    for (const profile of BREATHING_PROFILES) {
      expect(labels.some((label) => label.includes(profile.name))).toBe(true)
    }
    for (const minutes of DURATION_PRESETS_MINUTES) {
      expect(labels).toContain(`${minutes} min`)
    }
  })

  it('shows each profile its timings, so the choice is legible', () => {
    expect(host.textContent).toContain('3s in · 5s out')
    expect(host.textContent).toContain('4s in · 8s out')
  })

  it('marks exactly one profile and one duration as selected', () => {
    const pressed = [...host.querySelectorAll('[aria-pressed="true"]')]
    expect(pressed).toHaveLength(2)
    const pressedLabels = pressed.map((el) => el.textContent.trim())
    expect(pressedLabels).toContain('5 min')
    expect(pressedLabels.some((label) => label.includes('Beginner'))).toBe(true)
  })

  it('has an enabled Begin button', () => {
    const begin = [...host.querySelectorAll('button')].find(
      (b) => b.textContent.trim() === 'Begin',
    )
    expect(begin).toBeDefined()
    expect(begin.disabled).toBe(false)
  })

  it('reaches the information screen and back', async () => {
    const info = [...host.querySelectorAll('button')].find((b) =>
      b.textContent.includes('About breathing exercises'),
    )
    info.click()
    await nextTick()
    expect(host.textContent).toContain('About breathing exercises')
    // Placeholder resources are visibly unfinished rather than dead links.
    expect(host.textContent).toContain('link coming soon')
    expect(host.querySelectorAll('a[href]')).toHaveLength(0)

    host.querySelector('.info__back').click()
    await nextTick()
    expect(host.textContent).toContain('A few quiet minutes, guided.')
  })
})

describe('session screen', () => {
  it('shows the timer, phase and controls once begun', async () => {
    session.begin()
    await nextTick()
    expect(host.textContent).toContain('remaining')
    // Uppercased by CSS; the accessible text stays sentence case.
    expect(host.textContent).toContain('Breathe in')
    expect(host.textContent).toContain('Pause')
    expect(host.textContent).toContain('Exit')
  })

  it('offers exit confirmation rather than exiting immediately', async () => {
    session.begin()
    await nextTick()
    session.requestExit()
    await nextTick()
    expect(host.textContent).toContain('Exit session?')
    expect(host.textContent).toContain('Your current session will be lost.')

    session.cancelExit()
    await nextTick()
    expect(host.textContent).not.toContain('Exit session?')
  })
})
