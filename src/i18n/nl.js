/** Dutch. Register: je. */
export default {
  meta: {
    title: 'Begeleid ademen',
  },
  app: {
    name: 'Ademen',
    tagline: 'Een paar rustige minuten, met begeleiding.',
  },
  home: {
    begin: 'Beginnen',
    about: 'Over ademhalingsoefeningen',
    language: 'Taal',
  },
  profile: {
    legend: 'Ademprofiel',
    timing: '{inhale}s in · {exhale}s uit',
    strengthen: { name: 'Versterken', description: 'Gelijke duur' },
    chill: { name: 'Ontspannen', description: 'Langere uitademing' },
    balance: { name: 'Balans', description: 'Evenwichtige ademhaling' },
    beginner: { name: 'Beginner', description: 'Kortere cyclus om te beginnen' },
  },
  duration: {
    legend: 'Duur',
    short: '{minutes} min',
    long: { one: '{minutes} minuut', other: '{minutes} minuten' },
  },
  session: {
    remaining: 'resterend',
    inhale: 'Adem in',
    exhale: 'Adem uit',
    paused: 'Gepauzeerd',
    pausedAway: 'Je sessie is gepauzeerd terwijl je weg was.',
    pause: 'Pauze',
    resume: 'Hervatten',
    exit: 'Stoppen',
  },
  exitDialog: {
    title: 'Sessie stoppen?',
    body: 'Je huidige sessie gaat verloren.',
    cancel: 'Annuleren',
    confirm: 'Stoppen',
  },
  completion: {
    title: 'Goed gedaan!',
    body: 'Je hebt je ademsessie voltooid.',
    action: 'Terug naar het begin',
  },
  info: {
    back: 'Terug',
    title: 'Over ademhalingsoefeningen',
    whatHeading: 'Wat dit is',
    whatBody:
      'Begeleid ademen betekent simpelweg dat je een rustig, bewust ritme van in- en uitademen volgt. Deze app laat je dat ritme zien: een bel stijgt terwijl je inademt en daalt terwijl je uitademt, zodat je mee kunt gaan zonder te tellen.',
    whyHeading: 'Waarom mensen dit doen',
    whyBody:
      'Veel mensen ervaren langzaam, gelijkmatig ademen als kalmerend: het helpt om tot rust te komen voor het slapen, tussen twee taken of na iets stressvols. Een langere uitademing, zoals in het profiel {profile}, is een veelgebruikte keuze om af te bouwen.',
    caveat:
      'Deze app is alleen bedoeld om te ontspannen. Het is geen medisch advies en geen behandeling voor welke aandoening dan ook. Heb je zorgen over je ademhaling of je gezondheid, bespreek die dan met een gekwalificeerde zorgverlener.',
    tipsHeading: 'Haal meer uit een sessie',
    tips: [
      'Ga comfortabel zitten of liggen op een plek waar je niet gestoord wordt.',
      'Adem door je neus als dat natuurlijk voelt, naar je buik in plaats van je borst.',
      'Begin met het profiel {profile} en een korte sessie; langer is niet beter.',
      'Forceer niets. Voelt een tempo onprettig, kies dan een rustiger profiel.',
      'Laat de bel het tempo bepalen in plaats van erop vooruit te lopen.',
    ],
    resourcesHeading: 'Meer weten',
    comingSoon: 'link volgt',
  },
  resources: {
    'placeholder-breathing-basics': {
      title: 'De basis van ademhalingsoefeningen',
      note: 'Een algemene inleiding op ritmisch ademen.',
    },
    'placeholder-relaxation-techniques': {
      title: 'Ontspanningstechnieken',
      note: 'Bredere context over ontspanningsmethoden.',
    },
    'placeholder-further-reading': {
      title: 'Verder lezen',
      note: 'Betrouwbare achtergrondinformatie.',
    },
  },
  language: {
    back: 'Terug',
    title: 'Taal',
    hint: 'Je keuze wordt op dit apparaat bewaard.',
    done: 'OK',
  },
}
