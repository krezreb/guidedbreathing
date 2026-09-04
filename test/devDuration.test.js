/**
 * @vitest-environment jsdom
 *
 * The one-breath development duration and the `?devduration=1` URL flag that
 * reveals it (SPECS §3, TECH_SPECS §15.1).
 *
 * The flag is read from `location.search` on each check, so these tests set the
 * URL the way a browser would and then mount, rather than reaching into module
 * state.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp, nextTick } from 'vue'
import App from '../src/App.vue'
import CompletionMessage from '../src/components/CompletionMessage.vue'
import { BREATHING_PROFILES, findProfile } from '../src/data/breathingProfiles.js'
import {
  DEFAULT_DURATION_MINUTES,
  DEV_DURATION_MINUTES,
  durationOrDefault,
  isDevDuration,
  isValidDuration,
} from '../src/data/durations.js'
import { isDevDurationEnabled } from '../src/services/featureFlags.js'
import { createSession, PHASE, SESSION_STATE } from '../src/services/sessionController.js'
import { setLocale } from '../src/services/i18n.js'
import * as session from '../src/services/useSession.js'
import { fakeClock } from './helpers.js'

let app = null
let host = null

/** Point the page at a query string, the way a browser would. */
function visit(query) {
  window.history.replaceState({}, '', query || '/')
}

function mount() {
  host = document.createElement('div')
  document.body.appendChild(host)
  app = createApp(App)
  app.mount(host)
}

const buttons = () => [...host.querySelectorAll('button')]
const devButton = () => buttons().find((b) => b.textContent.trim().startsWith('Dev'))

beforeEach(() => {
  // These assertions read English copy, so pin the language.
  setLocale('en', { persist: false })
})

afterEach(() => {
  if (app) {
    if (session.isSessionActive.value) session.confirmExit()
    else session.returnHome()
    app.unmount()
    host.remove()
    app = null
  }
  // Do not leave a one-breath session as the remembered preference.
  visit('?devduration=1')
  session.selectDuration(DEFAULT_DURATION_MINUTES)
  visit('/')
})

describe('the devduration flag', () => {
  it.each([
    ['/', false],
    ['?devduration=1', true],
    ['?devduration', true],
    ['?devduration=true', true],
    ['?devduration=YES', true],
    ['?devduration=on', true],
    // A present-but-empty value is indistinguishable from a bare parameter
    // once parsed, so it enables too.
    ['?devduration=', true],
    // Switched off by editing one character, rather than surgery on the URL.
    ['?devduration=0', false],
    ['?devduration=false', false],
    ['?somethingelse=1', false],
  ])('reads %s as %s', (query, expected) => {
    visit(query)
    expect(isDevDurationEnabled()).toBe(expected)
  })

  it('is found among other parameters', () => {
    visit('?lang=fr&devduration=1&x=2')
    expect(isDevDurationEnabled()).toBe(true)
  })
})

describe('the duration selector', () => {
  it('offers nothing extra without the flag', () => {
    visit('/')
    mount()
    expect(devButton()).toBeUndefined()
    expect(host.textContent).not.toContain('1 breath')
    // The eight real presets are all that is on offer.
    expect(host.querySelectorAll('.duration')).toHaveLength(8)
  })

  it('offers the dev duration with the flag, unselected', () => {
    visit('?devduration=1')
    mount()
    const dev = devButton()
    expect(dev).toBeDefined()
    expect(dev.getAttribute('aria-pressed')).toBe('false')
  })

  it('selects the dev duration on tap, replacing the preset', async () => {
    visit('?devduration=1')
    mount()
    devButton().click()
    await nextTick()

    expect(session.selectedDurationMinutes.value).toBe(DEV_DURATION_MINUTES)
    expect(devButton().getAttribute('aria-pressed')).toBe('true')
    // Still exactly one profile and one duration selected.
    expect(host.querySelectorAll('[aria-pressed="true"]')).toHaveLength(2)
  })
})

describe('a one-breath session', () => {
  // The whole value of the duration is that it reaches COMPLETED after exactly
  // one breath, so assert that against the controller for every profile.
  it.each(BREATHING_PROFILES)('runs $id for one inhale and one exhale', (profile) => {
    const clock = fakeClock()
    const s = createSession({
      profile: findProfile(profile.id),
      durationMinutes: DEV_DURATION_MINUTES,
      now: clock.now,
    })
    expect(s.durationMs).toBeLessThan(s.cycleMs)
    expect(s.endMs).toBe(s.cycleMs)

    s.start()
    clock.advance(s.inhaleMs - 1)
    expect(s.snapshot().phase).toBe(PHASE.INHALE)
    expect(s.tick()).toBe(false)

    // One breath is not over until the exhale, and its hold, have finished.
    clock.advance(1 + s.holdMs)
    expect(s.snapshot().phase).toBe(PHASE.EXHALE)
    clock.advance(s.exhaleMs - 1)
    expect(s.tick()).toBe(false)
    expect(s.state).toBe(SESSION_STATE.RUNNING)

    clock.advance(1 + s.holdMs)
    expect(s.tick()).toBe(true)
    expect(s.state).toBe(SESSION_STATE.COMPLETED)
    expect(s.elapsed()).toBe(s.cycleMs)
  })

  it('begins from the main screen and is one cycle long', async () => {
    visit('?devduration=1')
    mount()
    devButton().click()
    await nextTick()
    session.begin()
    await nextTick()

    expect(session.controller.value.endMs).toBe(session.controller.value.cycleMs)
    expect(host.textContent).toContain('Breathe in')
  })
})

describe('an unflagged visit', () => {
  it('will not accept a dev duration selected on a previous, flagged one', () => {
    visit('?devduration=1')
    expect(isValidDuration(DEV_DURATION_MINUTES)).toBe(true)
    expect(durationOrDefault(DEV_DURATION_MINUTES)).toBe(DEV_DURATION_MINUTES)

    // Same persisted value, no flag: fall back rather than hand someone a
    // one-breath session they did not ask for.
    visit('/')
    expect(isValidDuration(DEV_DURATION_MINUTES)).toBe(false)
    expect(durationOrDefault(DEV_DURATION_MINUTES)).toBe(DEFAULT_DURATION_MINUTES)
  })

  it('leaves the real presets alone either way', () => {
    for (const query of ['/', '?devduration=1']) {
      visit(query)
      expect(isValidDuration(5)).toBe(true)
      expect(durationOrDefault(99)).toBe(DEFAULT_DURATION_MINUTES)
    }
  })

  it('still recognises the number itself: that is not a flag question', () => {
    visit('/')
    expect(isDevDuration(DEV_DURATION_MINUTES)).toBe(true)
    expect(isDevDuration(5)).toBe(false)
  })
})

// The completion screen is what the dev duration exists to reach, so it must
// not print "0.0166… minutes" when it gets there.
describe('the completion screen', () => {
  function renderCompletion(durationMinutes) {
    const probe = document.createElement('div')
    document.body.appendChild(probe)
    const completion = createApp(CompletionMessage, { profileId: 'beginner', durationMinutes })
    completion.mount(probe)
    const text = probe.textContent
    completion.unmount()
    probe.remove()
    return text
  }

  it('names the dev duration rather than showing a fraction of a minute', () => {
    const text = renderCompletion(DEV_DURATION_MINUTES)
    expect(text).toContain('1 breath (dev)')
    expect(text).not.toContain('0.0')
    expect(text).not.toContain('minute')
  })

  it('still spells out an ordinary duration', () => {
    expect(renderCompletion(5)).toContain('5 minutes')
  })
})
