/**
 * Translation.
 *
 * A deliberately small implementation rather than a dependency: the app needs
 * lookup, interpolation and a two-form plural, which is about forty lines. It
 * stays in the spirit of the minimal dependency list.
 *
 * Reactivity comes for free — `t()` reads the `locale` ref, so any component
 * that calls it during render re-renders when the language changes.
 */
import { computed, ref } from 'vue'
import { DEFAULT_LOCALE, isSupportedLocale, LOCALES, MESSAGES } from '../i18n/index.js'
import { loadPreferences, updatePreferences } from './storage.js'

export const locale = ref(DEFAULT_LOCALE)

export const currentLocale = computed(
  () => LOCALES.find((entry) => entry.code === locale.value) ?? LOCALES[0],
)

function resolve(catalogue, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), catalogue)
}

function interpolate(template, params) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in params ? String(params[key]) : match,
  )
}

function lookup(path) {
  // Fall back to English for any key a translation has not caught up with,
  // rather than showing a gap.
  const message = resolve(MESSAGES[locale.value], path)
  return message === undefined ? resolve(MESSAGES[DEFAULT_LOCALE], path) : message
}

/**
 * Translate `path`, interpolating `{name}` placeholders from `params`.
 *
 * Arrays are translated element-wise, so a catalogue can hold a list.
 * A missing key returns the key itself: visible in testing, harmless in use.
 */
export function t(path, params) {
  const message = lookup(path)
  if (Array.isArray(message)) return message.map((item) => interpolate(item, params))
  if (typeof message !== 'string') return path
  return interpolate(message, params)
}

/**
 * Translate a counted string from a `{ one, other }` pair.
 *
 * All six supported languages share the same two-form rule for the values this
 * app uses (1..20 minutes), so `count === 1` is enough. A language with a
 * different rule would need this function extended, not its callers.
 */
export function tp(path, count, params) {
  const forms = lookup(path)
  if (!forms || typeof forms !== 'object') return path
  const form = count === 1 ? forms.one : forms.other
  return interpolate(form ?? forms.other ?? '', { count, ...params })
}

/** Match a browser language tag such as `fr-CA` to a supported locale. */
export function detectLocale(languages = navigator.languages ?? [navigator.language]) {
  for (const tag of languages) {
    if (!tag) continue
    const primary = String(tag).toLowerCase().split('-')[0]
    if (isSupportedLocale(primary)) return primary
  }
  return DEFAULT_LOCALE
}

export function setLocale(code, { persist = true } = {}) {
  if (!isSupportedLocale(code)) return false
  locale.value = code
  // Assistive technology and hyphenation both depend on this being right.
  document.documentElement.lang = code
  document.title = t('meta.title')
  if (persist) updatePreferences({ locale: code })
  return true
}

/**
 * Choose the starting language: a remembered choice, else the browser's
 * preference, else English.
 */
export function initLocale() {
  const stored = loadPreferences().locale
  const chosen = isSupportedLocale(stored) ? stored : detectLocale()
  // Only an explicit choice is persisted; a detected language is not written
  // back, so the app keeps following the device if that setting changes.
  setLocale(chosen, { persist: false })
  return chosen
}
