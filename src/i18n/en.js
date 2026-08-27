/**
 * English — the source catalogue.
 *
 * Every user-visible string in the application lives in a catalogue like this
 * one. When adding a string, add it here first: `en` is the fallback for any
 * key a translation has not caught up with yet.
 *
 * Placeholders are `{name}`. Counted strings use `{ one, other }`.
 */
export default {
  meta: {
    title: 'Guided Breathing',
  },
  app: {
    name: 'Breathe',
    tagline: 'A few quiet minutes, guided.',
  },
  home: {
    begin: 'Begin',
    about: 'About breathing exercises',
    language: 'Language',
  },
  profile: {
    legend: 'Breathing profile',
    timing: '{inhale}s in · {exhale}s out',
    strengthen: { name: 'Strengthen', description: 'Equal-duration breathing' },
    chill: { name: 'Chill', description: 'Longer exhalation' },
    balance: { name: 'Balance', description: 'Balanced breathing' },
    beginner: { name: 'Beginner', description: 'Shorter cycle for beginners' },
  },
  duration: {
    legend: 'Duration',
    short: '{minutes} min',
    long: { one: '{minutes} minute', other: '{minutes} minutes' },
  },
  session: {
    remaining: 'remaining',
    inhale: 'Breathe in',
    exhale: 'Breathe out',
    paused: 'Paused',
    pausedAway: 'Your session paused while you were away.',
    pause: 'Pause',
    resume: 'Resume',
    exit: 'Exit',
  },
  exitDialog: {
    title: 'Exit session?',
    body: 'Your current session will be lost.',
    cancel: 'Cancel',
    confirm: 'Exit',
  },
  completion: {
    title: 'Well done!',
    body: "You've completed your breathing session.",
    action: 'Back to start',
  },
  info: {
    back: 'Back',
    title: 'About breathing exercises',
    whatHeading: 'What this is',
    whatBody:
      'Guided breathing simply means following a steady, deliberate rhythm of breathing in and breathing out. This app shows you that rhythm: a bubble rises while you breathe in and falls while you breathe out, so you can follow along without counting.',
    whyHeading: 'Why people do it',
    whyBody:
      'Many people find that slow, paced breathing feels calming and helps them settle before sleep, between tasks, or after something stressful. Longer exhalations, as in the {profile} profile, are a common choice for winding down.',
    caveat:
      'This app is for relaxation only. It is not medical advice and is not a treatment for any condition. If you have concerns about your breathing or your health, speak to a qualified healthcare professional.',
    tipsHeading: 'Getting the most from a session',
    tips: [
      'Sit or lie somewhere comfortable where you will not be interrupted.',
      'Breathe through your nose if that feels natural, into your belly rather than your chest.',
      'Start with the {profile} profile and a short session; longer is not better.',
      'Do not strain. If a pace feels uncomfortable, switch to a gentler profile.',
      'Let the bubble set the pace rather than trying to get ahead of it.',
    ],
    resourcesHeading: 'Learn more',
    resourcesIntro:
      'These pages are published by health and psychology organisations, not by this app. They open in your browser.',
    comingSoon: 'link coming soon',
    // Keyed by the destination's language. The badge appears only when that is
    // not the language the reader chose, so add a key here whenever a resource
    // in a new language is added.
    languageNote: {
      en: 'in English',
    },
  },
  resources: {
    'nhs-breathing-exercises': {
      title: 'Breathing exercises for stress — NHS',
      note: 'A short, practical introduction to slow breathing: how to sit or lie, how to breathe into your belly, and how to count gently as you go.',
    },
    'apa-stress-management-tools': {
      title: 'Stress management tools — American Psychological Association',
      note: 'Includes a paced breathing exercise — in for four, hold for four, out for six — and explains it as a way of lowering physical arousal.',
    },
    'ggsc-mindful-breathing': {
      title: 'Mindful Breathing — Greater Good, UC Berkeley',
      note: 'Why paying attention to your breathing helps, written for a general reader by a centre that translates psychology research, with references to published studies.',
    },
    'nccih-relaxation-techniques': {
      title: 'Relaxation Techniques: What You Need To Know — NCCIH',
      note: 'Where breathing sits among other relaxation techniques, what the evidence does and does not show — it varies by condition — and sensible safety notes.',
    },
    'apa-handling-stressors': {
      title: "Healthy ways to handle life's stressors — American Psychological Association",
      note: 'Breathing as one option among several, alongside progressive muscle relaxation, mindfulness and everyday habits, rather than as a cure-all.',
    },
    'ala-breathing-exercises': {
      title: 'Breathing Exercises — American Lung Association',
      note: 'More detail on belly breathing and longer exhalations. Parts of it are written for people with lung conditions, so read it as background rather than as instructions from this app.',
    },
  },
  language: {
    back: 'Back',
    title: 'Language',
    hint: 'Your choice is remembered on this device.',
    done: 'OK',
  },
}
