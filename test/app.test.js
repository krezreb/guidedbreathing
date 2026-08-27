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
import { EXTERNAL_RESOURCES } from '../src/data/resources.js'
import { setLocale, t } from '../src/services/i18n.js'
import * as session from '../src/services/useSession.js'

let app
let host

beforeEach(() => {
  // These assertions read English copy, so pin the language.
  setLocale('en', { persist: false })
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
      const name = t(`profile.${profile.id}.name`)
      expect(labels.some((label) => label.includes(name))).toBe(true)
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

    // Every resource is a real, reviewed link, opened safely in a new tab.
    const links = [...host.querySelectorAll('.resource__link')]
    expect(links).toHaveLength(EXTERNAL_RESOURCES.length)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\//)
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
      expect(link.textContent.trim().length).toBeGreaterThan(0)
    }
    // Nothing is left marked unfinished, and no entry renders as a dead link.
    expect(host.textContent).not.toContain('link coming soon')
    expect(host.querySelectorAll('.resource__placeholder')).toHaveLength(0)

    host.querySelector('.info__back').click()
    await nextTick()
    expect(host.textContent).toContain('A few quiet minutes, guided.')
  })

  it('says which resources are in another language, and only then', async () => {
    const openInfo = async () => {
      const info = [...host.querySelectorAll('button')].find((b) =>
        b.textContent.includes(t('home.about')),
      )
      info.click()
      await nextTick()
    }

    await openInfo()
    // Reading English, the English resources need no warning.
    expect(host.textContent).not.toContain('in English')

    setLocale('fr', { persist: false })
    await nextTick()
    const badges = [...host.querySelectorAll('.resource__badge')]
    expect(badges).toHaveLength(EXTERNAL_RESOURCES.length)
    for (const badge of badges) expect(badge.textContent.trim()).toBe('en anglais')
  })
})

describe('session screen', () => {
  it('shows the phase and controls once begun', async () => {
    session.begin()
    await nextTick()
    // Uppercased by CSS; the accessible text stays sentence case.
    expect(host.textContent).toContain('Breathe in')
    expect(host.textContent).toContain('Pause')
    expect(host.textContent).toContain('Exit')
  })

  it('hides the remaining time while breathing and reveals it on pause', async () => {
    session.begin()
    await nextTick()
    const timer = host.querySelector('[role="timer"]')
    expect(timer.className).toContain('timer--hidden')
    expect(timer.getAttribute('aria-hidden')).toBe('true')

    session.pause()
    await nextTick()
    expect(timer.className).not.toContain('timer--hidden')
    expect(timer.getAttribute('aria-hidden')).toBe(null)
    expect(timer.textContent).toContain('remaining')

    session.resume()
    await nextTick()
    expect(timer.className).toContain('timer--hidden')
  })

  it('offers exit confirmation rather than exiting immediately', async () => {
    session.begin()
    await nextTick()
    session.requestExit()
    await nextTick()
    expect(host.textContent).toContain('Exit session?')
    expect(host.textContent).toContain('Your current session will be lost.')
    // The dialog carries the clock: the screen behind it is dimmed.
    const dialog = host.querySelector('[role="dialog"]')
    expect(dialog.textContent).toContain('remaining')

    session.cancelExit()
    await nextTick()
    expect(host.textContent).not.toContain('Exit session?')
  })
})

describe('switching language', () => {
  async function openLanguageMenu() {
    const item = [...host.querySelectorAll('button')].find((b) =>
      b.textContent.includes(t('home.language')),
    )
    item.click()
    await nextTick()
  }

  it('reaches the language screen from the main screen', async () => {
    await openLanguageMenu()
    // Each language is offered in its own name.
    for (const label of ['English', 'Deutsch', 'Español', 'Français', 'Italiano', 'Nederlands']) {
      expect(host.textContent).toContain(label)
    }
  })

  it('re-renders the whole interface in the chosen language', async () => {
    await openLanguageMenu()
    const french = [...host.querySelectorAll('button')].find(
      (b) => b.textContent.trim().startsWith('Français'),
    )
    french.click()
    await nextTick()

    // The language screen itself is now French...
    expect(host.textContent).toContain('Langue')

    host.querySelector('.language__back').click()
    await nextTick()

    // ...and so is the main screen it returns to.
    expect(host.textContent).toContain('Commencer')
    expect(host.textContent).toContain('Profil de respiration')
    expect(host.textContent).toContain('Débutant')
    expect(host.textContent).toContain('Durée')
    expect(host.textContent).not.toContain('Begin')
  })

  it('returns to the main screen from the OK button at the foot of the list', async () => {
    await openLanguageMenu()
    host.querySelector('.language__done').click()
    await nextTick()
    expect(host.textContent).toContain(t('home.begin'))
  })

  it('translates a running session, including its controls', async () => {
    setLocale('de', { persist: false })
    session.begin()
    await nextTick()
    expect(host.textContent).toContain('Einatmen')
    expect(host.textContent).toContain('übrig')
    expect(host.textContent).toContain('Pause')

    session.requestExit()
    await nextTick()
    expect(host.textContent).toContain('Sitzung beenden?')
    expect(host.textContent).toContain('Abbrechen')
    session.cancelExit()
  })

  it('remembers the choice for the next visit', async () => {
    setLocale('nl')
    const stored = JSON.parse(window.localStorage.getItem('guided-breathing.preferences'))
    expect(stored.locale).toBe('nl')
  })
})
