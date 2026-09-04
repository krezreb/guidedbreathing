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
    mute: 'Geluid uit',
    unmute: 'Geluid aan',
    fullscreen: 'Volledig scherm',
    exitFullscreen: 'Volledig scherm sluiten',
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
    resourcesIntro:
      'Deze pagina’s worden uitgegeven door gezondheids- en psychologieorganisaties, niet door deze app. Ze openen in je browser.',
    comingSoon: 'link volgt',
    languageNote: {
      en: 'in het Engels',
    },
  },
  resources: {
    'nhs-breathing-exercises': {
      title: 'Ademhalingsoefeningen bij stress — NHS',
      note: 'Een korte, praktische inleiding op langzaam ademen: hoe je zit of ligt, hoe je naar je buik ademt en hoe je rustig meetelt.',
    },
    'apa-stress-management-tools': {
      title: 'Hulpmiddelen bij stress — American Psychological Association',
      note: 'Met een oefening in ritmisch ademen — vier in, vier vasthouden, zes uit — uitgelegd als manier om de lichamelijke spanning te verlagen.',
    },
    'ggsc-mindful-breathing': {
      title: 'Aandachtig ademen — Greater Good, UC Berkeley',
      note: 'Waarom aandacht voor je ademhaling helpt, begrijpelijk uitgelegd door een centrum dat psychologisch onderzoek toegankelijk maakt, met verwijzingen naar gepubliceerde studies.',
    },
    'nccih-relaxation-techniques': {
      title: 'Ontspanningstechnieken: wat je moet weten — NCCIH',
      note: 'Waar ademhaling staat tussen andere ontspanningstechnieken, wat het bewijs wel en niet aantoont — dat verschilt per aandoening — en verstandige veiligheidsopmerkingen.',
    },
    'apa-handling-stressors': {
      title: 'Gezonde manieren om met stress om te gaan — American Psychological Association',
      note: 'Ademhaling als één van meerdere mogelijkheden, naast progressieve spierrelaxatie, mindfulness en dagelijkse gewoonten, en niet als wondermiddel.',
    },
    'ala-breathing-exercises': {
      title: 'Ademhalingsoefeningen — American Lung Association',
      note: 'Meer over buikademhaling en langer uitademen. Een deel is bedoeld voor mensen met longaandoeningen: lees het als achtergrond, niet als instructies van deze app.',
    },
  },
  language: {
    back: 'Terug',
    title: 'Taal',
    hint: 'Je keuze wordt op dit apparaat bewaard.',
    done: 'OK',
  },
}
