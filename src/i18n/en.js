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
    comingSoon: 'link coming soon',
    installHeading: 'Install this app',
    installBody:
      'Add it to your home screen: it opens full-screen, without browser controls, and works without a connection.',
    installAction: 'Install',
  },
  resources: {
    'placeholder-breathing-basics': {
      title: 'Breathing exercise basics',
      note: 'A general introduction to paced breathing.',
    },
    'placeholder-relaxation-techniques': {
      title: 'Relaxation techniques',
      note: 'Wider context on relaxation practices.',
    },
    'placeholder-further-reading': {
      title: 'Further reading',
      note: 'Reputable background reading.',
    },
  },
  language: {
    back: 'Back',
    title: 'Language',
    hint: 'Your choice is remembered on this device.',
    done: 'OK',
  },
}
