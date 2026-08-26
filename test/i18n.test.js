/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, LOCALES, MESSAGES } from '../src/i18n/index.js'
import {
  currentLocale,
  detectLocale,
  initLocale,
  locale,
  setLocale,
  t,
  tp,
} from '../src/services/i18n.js'
import { BREATHING_PROFILES } from '../src/data/breathingProfiles.js'
import { EXTERNAL_RESOURCES } from '../src/data/resources.js'

/** Every leaf path in a catalogue, with the kind of value it holds. */
function leaves(node, prefix = '', out = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(value)) out.set(path, `array:${value.length}`)
    else if (value && typeof value === 'object') leaves(value, path, out)
    else out.set(path, typeof value)
  }
  return out
}

const source = leaves(MESSAGES[DEFAULT_LOCALE])

describe('catalogue completeness', () => {
  const translations = Object.keys(MESSAGES).filter((code) => code !== DEFAULT_LOCALE)

  it('registers every catalogue in the picker, and vice versa', () => {
    expect(LOCALES.map((entry) => entry.code).sort()).toEqual(Object.keys(MESSAGES).sort())
    // A picker entry with no label would be unreadable to the one person who
    // needs it most: someone who cannot read the current interface language.
    for (const entry of LOCALES) expect(entry.label.length).toBeGreaterThan(0)
  })

  it.each(translations)('%s has every key, with matching shapes', (code) => {
    const target = leaves(MESSAGES[code])
    const missing = [...source.keys()].filter((path) => !target.has(path))
    expect(missing).toEqual([])

    // Same shape as well as same key: an array that became a string, or a
    // tips list that lost an entry, would break the UI silently.
    const mismatched = [...source.entries()]
      .filter(([path, kind]) => target.get(path) !== kind)
      .map(([path, kind]) => `${path}: expected ${kind}, got ${target.get(path)}`)
    expect(mismatched).toEqual([])
  })

  it.each(translations)('%s has no keys the source lacks', (code) => {
    const extra = [...leaves(MESSAGES[code]).keys()].filter((path) => !source.has(path))
    expect(extra).toEqual([])
  })

  it.each(Object.keys(MESSAGES))('%s translates every profile and resource', (code) => {
    setLocale(code, { persist: false })
    for (const profile of BREATHING_PROFILES) {
      // t() returns the key itself when a key is missing, so a returned key
      // means an untranslated profile.
      expect(t(`profile.${profile.id}.name`)).not.toContain('profile.')
      expect(t(`profile.${profile.id}.description`)).not.toContain('profile.')
    }
    for (const resource of EXTERNAL_RESOURCES) {
      expect(t(`resources.${resource.id}.title`)).not.toContain('resources.')
      expect(t(`resources.${resource.id}.note`)).not.toContain('resources.')
    }
  })

  it.each(Object.keys(MESSAGES))('%s leaves no placeholder unfilled', (code) => {
    setLocale(code, { persist: false })
    // Every string that takes a parameter, rendered with its parameters.
    const rendered = [
      t('profile.timing', { inhale: 3, exhale: 5 }),
      t('duration.short', { minutes: 5 }),
      tp('duration.long', 1, { minutes: 1 }),
      tp('duration.long', 5, { minutes: 5 }),
      t('info.whyBody', { profile: t('profile.chill.name') }),
      ...t('info.tips', { profile: t('profile.beginner.name') }),
    ]
    for (const text of rendered) expect(text).not.toMatch(/\{\w+\}/)
  })
})

describe('translation lookup', () => {
  beforeEach(() => setLocale(DEFAULT_LOCALE, { persist: false }))

  it('interpolates parameters', () => {
    expect(t('profile.timing', { inhale: 4, exhale: 8 })).toBe('4s in · 8s out')
  })

  it('picks the singular only for one', () => {
    expect(tp('duration.long', 1, { minutes: 1 })).toBe('1 minute')
    expect(tp('duration.long', 2, { minutes: 2 })).toBe('2 minutes')
    expect(tp('duration.long', 20, { minutes: 20 })).toBe('20 minutes')
  })

  it('applies each language\'s own plural forms', () => {
    setLocale('de', { persist: false })
    expect(tp('duration.long', 1, { minutes: 1 })).toBe('1 Minute')
    expect(tp('duration.long', 3, { minutes: 3 })).toBe('3 Minuten')
    setLocale('nl', { persist: false })
    expect(tp('duration.long', 1, { minutes: 1 })).toBe('1 minuut')
    expect(tp('duration.long', 3, { minutes: 3 })).toBe('3 minuten')
  })

  it('translates arrays element-wise', () => {
    const tips = t('info.tips', { profile: 'Beginner' })
    expect(Array.isArray(tips)).toBe(true)
    expect(tips).toHaveLength(5)
    expect(tips[2]).toContain('Beginner')
  })

  it('returns the key when it does not exist, rather than blank', () => {
    expect(t('nope.not.here')).toBe('nope.not.here')
    expect(tp('nope.not.here', 1)).toBe('nope.not.here')
  })

  it('falls back to English for a key a translation is missing', () => {
    setLocale('fr', { persist: false })
    // Simulate a catalogue that has not caught up yet.
    const original = MESSAGES.fr.completion.title
    delete MESSAGES.fr.completion.title
    expect(t('completion.title')).toBe('Well done!')
    MESSAGES.fr.completion.title = original
    expect(t('completion.title')).toBe('Bravo !')
  })
})

describe('choosing a language', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setLocale(DEFAULT_LOCALE, { persist: false })
  })

  it('rejects unsupported codes', () => {
    expect(setLocale('klingon')).toBe(false)
    expect(locale.value).toBe(DEFAULT_LOCALE)
  })

  it('sets the document language, which assistive tech depends on', () => {
    setLocale('it')
    expect(document.documentElement.lang).toBe('it')
    expect(document.title).toBe('Respirazione guidata')
  })

  it('remembers an explicit choice', () => {
    setLocale('es')
    const stored = JSON.parse(window.localStorage.getItem('guided-breathing.preferences'))
    expect(stored.locale).toBe('es')
    expect(currentLocale.value.label).toBe('Español')
  })

  it('does not clobber the session preferences it shares a key with', async () => {
    const { updatePreferences, loadPreferences } = await import('../src/services/storage.js')
    updatePreferences({ profileId: 'chill', durationMinutes: 15 })
    setLocale('nl')
    expect(loadPreferences()).toEqual({
      profileId: 'chill',
      durationMinutes: 15,
      locale: 'nl',
    })
  })

  it('matches a regional browser tag to its language', () => {
    expect(detectLocale(['fr-CA', 'en-US'])).toBe('fr')
    expect(detectLocale(['de-AT'])).toBe('de')
    expect(detectLocale(['pt-BR', 'nl-BE'])).toBe('nl')
  })

  it('falls back to English for unsupported browser languages', () => {
    expect(detectLocale(['ja-JP', 'ko'])).toBe('en')
    expect(detectLocale([])).toBe('en')
    expect(detectLocale([null, undefined])).toBe('en')
  })

  it('prefers a remembered choice over the browser preference', () => {
    setLocale('it')
    expect(initLocale()).toBe('it')
  })

  it('does not persist a merely detected language', () => {
    window.localStorage.clear()
    initLocale()
    const stored = window.localStorage.getItem('guided-breathing.preferences')
    // Nothing was chosen, so nothing is remembered: the app keeps following
    // the device if its language setting changes.
    expect(stored).toBeNull()
  })
})
