/**
 * @vitest-environment jsdom
 *
 * The install button exists because Brave on Android offers no install UI of
 * its own (TECH_SPECS §8.4). What matters is that the button appears only once
 * the browser has said an install is possible, and that the captured event is
 * used exactly once.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick } from 'vue'
import InformationView from '../src/views/InformationView.vue'
import { setLocale, t } from '../src/services/i18n.js'
import {
  canInstall,
  initInstallPrompt,
  promptInstall,
  resetInstallPrompt,
} from '../src/services/installPrompt.js'

/** A stand-in for Chromium's BeforeInstallPromptEvent. */
function fireBeforeInstallPrompt(outcome = 'accepted') {
  const event = new Event('beforeinstallprompt', { cancelable: true })
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = Promise.resolve({ outcome })
  window.dispatchEvent(event)
  return event
}

let app
let host

beforeEach(() => {
  setLocale('en', { persist: false })
  resetInstallPrompt()
  host = document.createElement('div')
  document.body.appendChild(host)
})

afterEach(() => {
  if (app) app.unmount()
  app = null
  host.remove()
  resetInstallPrompt()
})

function mountInfo() {
  app = createApp(InformationView)
  app.mount(host)
}

describe('capturing the browser event', () => {
  beforeEach(() => initInstallPrompt())

  it('offers no install until the browser says one is possible', () => {
    expect(canInstall.value).toBe(false)
  })

  it('offers an install once the event fires', () => {
    fireBeforeInstallPrompt()
    expect(canInstall.value).toBe(true)
  })

  it('suppresses the browser mini-infobar in favour of the app button', () => {
    const event = fireBeforeInstallPrompt()
    expect(event.defaultPrevented).toBe(true)
  })

  it('withdraws the offer once the app is installed', () => {
    fireBeforeInstallPrompt()
    window.dispatchEvent(new Event('appinstalled'))
    expect(canInstall.value).toBe(false)
  })
})

describe('showing the prompt', () => {
  beforeEach(() => initInstallPrompt())

  it('reports the user\'s choice', async () => {
    fireBeforeInstallPrompt('accepted')
    await expect(promptInstall()).resolves.toBe('accepted')
  })

  it('reports a dismissal as such', async () => {
    fireBeforeInstallPrompt('dismissed')
    await expect(promptInstall()).resolves.toBe('dismissed')
  })

  it('spends the event, which cannot be shown twice', async () => {
    const event = fireBeforeInstallPrompt()
    await promptInstall()
    expect(event.prompt).toHaveBeenCalledTimes(1)
    expect(canInstall.value).toBe(false)
    await expect(promptInstall()).resolves.toBe('unavailable')
    expect(event.prompt).toHaveBeenCalledTimes(1)
  })

  it('is harmless where the browser never fires the event', async () => {
    await expect(promptInstall()).resolves.toBe('unavailable')
  })
})

describe('the information screen', () => {
  beforeEach(() => initInstallPrompt())

  it('shows no install button where installing is not possible', () => {
    mountInfo()
    expect(host.textContent).not.toContain(t('info.installHeading'))
  })

  it('shows the install button once the browser offers one', async () => {
    fireBeforeInstallPrompt()
    mountInfo()
    await nextTick()
    expect(host.textContent).toContain(t('info.installHeading'))
    const button = [...host.querySelectorAll('button')].find(
      (el) => el.textContent.trim() === t('info.installAction'),
    )
    expect(button).toBeTruthy()
  })

  it('shows the browser dialog when the button is pressed', async () => {
    const event = fireBeforeInstallPrompt()
    mountInfo()
    await nextTick()
    const button = [...host.querySelectorAll('button')].find(
      (el) => el.textContent.trim() === t('info.installAction'),
    )
    button.click()
    await nextTick()
    expect(event.prompt).toHaveBeenCalledTimes(1)
  })

  it('hides the button again once the offer is spent', async () => {
    fireBeforeInstallPrompt()
    mountInfo()
    await nextTick()
    await promptInstall()
    await nextTick()
    expect(host.textContent).not.toContain(t('info.installHeading'))
  })
})
