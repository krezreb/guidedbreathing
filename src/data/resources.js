/**
 * External informational resources (SPECS §10.1).
 *
 * Every entry here has been reviewed and its URL checked. Never invent one: a
 * placeholder that looks like a working link is worse than an obvious blank.
 * An entry with `url: null` still renders, marked as unfinished, so a resource
 * can be queued before its destination is settled.
 *
 * `lang` is the language the destination is written in. The screen warns when
 * that is not the language the reader chose, so nobody follows a link expecting
 * their own language and lands on English.
 *
 * Each entry's title and note live in the message catalogues under
 * `resources.<id>`; this module holds no user-visible text. Titles name their
 * publisher, so the reader can see whose page they are about to open.
 *
 * Order runs from the most practical to the most background: what to do, why it
 * works, where it sits among other techniques, then further reading.
 */
export const EXTERNAL_RESOURCES = [
  {
    id: 'nhs-breathing-exercises',
    url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/',
    lang: 'en',
  },
  {
    id: 'apa-stress-management-tools',
    url: 'https://www.apa.org/topics/stress/manage-stress-tools',
    lang: 'en',
  },
  {
    id: 'ggsc-mindful-breathing',
    url: 'https://ggia.berkeley.edu/practice/mindful_breathing',
    lang: 'en',
  },
  {
    id: 'nccih-relaxation-techniques',
    url: 'https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know',
    lang: 'en',
  },
  {
    id: 'apa-handling-stressors',
    url: 'https://www.apa.org/topics/stress/tips',
    lang: 'en',
  },
  {
    id: 'ala-breathing-exercises',
    url: 'https://www.lung.org/lung-health-diseases/wellness/breathing-exercises',
    lang: 'en',
  },
]

export const hasLiveResources = EXTERNAL_RESOURCES.some((r) => Boolean(r.url))
