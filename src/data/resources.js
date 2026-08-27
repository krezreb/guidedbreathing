/**
 * External informational resources (SPECS §10.1).
 *
 * STUBBED FOR V1. The real resources have not been chosen yet, so these entries
 * carry no URL and render as visibly unfinished placeholders. Populating this
 * list later is a data change only — InformationView reads it generically and
 * needs no edits.
 *
 * To activate an entry, add a reviewed `url`. Never invent one: a placeholder
 * that looks like a working link is worse than an obvious blank.
 *
 * Each entry's title and note live in the message catalogues under
 * `resources.<id>`; this module holds no user-visible text.
 */
export const EXTERNAL_RESOURCES = [
  { id: 'placeholder-breathing-basics', url: null },
  { id: 'placeholder-relaxation-techniques', url: null },
  { id: 'placeholder-further-reading', url: null },
]

export const hasLiveResources = EXTERNAL_RESOURCES.some((r) => Boolean(r.url))
