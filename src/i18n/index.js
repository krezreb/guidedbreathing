/**
 * Locale registry.
 *
 * Adding a language means adding a catalogue file, importing it here, and
 * adding one row to LOCALES. Nothing else in the application knows the list.
 */
import en from './en.js'
import fr from './fr.js'
import de from './de.js'
import it from './it.js'
import es from './es.js'
import nl from './nl.js'

export const MESSAGES = { en, fr, de, it, es, nl }

/**
 * `label` is the language's own name and is deliberately never translated: a
 * language picker has to be readable by someone who cannot read the current
 * interface language.
 */
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
]

export const DEFAULT_LOCALE = 'en'

export function isSupportedLocale(code) {
  return Object.prototype.hasOwnProperty.call(MESSAGES, code)
}
