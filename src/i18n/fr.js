/**
 * French. Register: tutoiement, the informal second person.
 */
export default {
  meta: {
    title: 'Respiration guidée',
  },
  app: {
    name: 'Respirez',
    tagline: 'Quelques minutes de calme, guidées.',
  },
  home: {
    begin: 'Commencer',
    about: 'À propos des exercices de respiration',
    language: 'Langue',
  },
  profile: {
    legend: 'Profil de respiration',
    timing: '{inhale}s inspiration · {exhale}s expiration',
    strengthen: { name: 'Renforcer', description: 'Durées égales' },
    chill: { name: 'Détente', description: 'Expiration plus longue' },
    balance: { name: 'Équilibre', description: 'Respiration équilibrée' },
    beginner: { name: 'Débutant', description: 'Cycle plus court pour débuter' },
  },
  duration: {
    legend: 'Durée',
    short: '{minutes} min',
    long: { one: '{minutes} minute', other: '{minutes} minutes' },
  },
  session: {
    remaining: 'restant',
    inhale: 'Inspire',
    exhale: 'Expire',
    paused: 'En pause',
    pausedAway: 'Ta séance a été mise en pause pendant ton absence.',
    pause: 'Pause',
    resume: 'Reprendre',
    exit: 'Quitter',
    mute: 'Couper le son',
    unmute: 'Activer le son',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
  },
  exitDialog: {
    title: 'Quitter la séance ?',
    body: 'Ta séance en cours sera perdue.',
    cancel: 'Annuler',
    confirm: 'Quitter',
  },
  completion: {
    title: 'Bravo !',
    body: 'Tu as terminé ta séance de respiration.',
    action: 'Retour au début',
  },
  info: {
    back: 'Retour',
    title: 'À propos des exercices de respiration',
    whatHeading: "Ce dont il s'agit",
    whatBody:
      "La respiration guidée consiste simplement à suivre un rythme régulier et volontaire d'inspiration et d'expiration. Cette application te montre ce rythme : une bulle monte pendant que tu inspires et descend pendant que tu expires, ce qui te permet de suivre sans compter.",
    whyHeading: 'Pourquoi on la pratique',
    whyBody:
      "Beaucoup de personnes trouvent que respirer lentement, à un rythme régulier, apaise et aide à se poser avant de dormir, entre deux tâches ou après un moment stressant. Une expiration plus longue, comme dans le profil {profile}, est un choix courant pour se détendre.",
    caveat:
      'Cette application est destinée à la détente uniquement. Elle ne constitue pas un avis médical et ne traite aucune affection. Si tu as des inquiétudes concernant ta respiration ou ta santé, parles-en à un professionnel de santé qualifié.',
    tipsHeading: "Pour profiter au mieux d'une séance",
    tips: [
      'Assieds-toi ou allonge-toi confortablement, là où tu ne seras pas dérangé.',
      'Respire par le nez si cela te semble naturel, vers le ventre plutôt que vers la poitrine.',
      'Commence par le profil {profile} et une séance courte : plus long ne veut pas dire mieux.',
      'Ne force pas. Si un rythme est inconfortable, passe à un profil plus doux.',
      "Laisse la bulle donner le rythme au lieu d'essayer de la devancer.",
    ],
    resourcesHeading: 'En savoir plus',
    resourcesIntro:
      "Ces pages sont publiées par des organismes de santé et de psychologie, et non par cette application. Elles s'ouvrent dans ton navigateur.",
    comingSoon: 'lien à venir',
    languageNote: {
      en: 'en anglais',
    },
  },
  resources: {
    'nhs-breathing-exercises': {
      title: 'Exercices de respiration contre le stress — NHS',
      note: "Une introduction courte et concrète à la respiration lente : comment t'asseoir ou t'allonger, comment respirer vers le ventre et comment compter doucement.",
    },
    'apa-stress-management-tools': {
      title: 'Outils de gestion du stress — American Psychological Association',
      note: "Propose un exercice de respiration rythmée — quatre temps d'inspiration, quatre de pause, six d'expiration — présenté comme un moyen de réduire l'activation physique.",
    },
    'ggsc-mindful-breathing': {
      title: 'Respiration en pleine conscience — Greater Good, UC Berkeley',
      note: "Pourquoi porter attention à sa respiration aide, expliqué pour tous par un centre qui vulgarise la recherche en psychologie, avec des références d'études publiées.",
    },
    'nccih-relaxation-techniques': {
      title: 'Techniques de relaxation : ce qu’il faut savoir — NCCIH',
      note: 'La place de la respiration parmi les autres techniques de relaxation, ce que les données montrent ou non — cela varie selon les troubles — et des précautions de bon sens.',
    },
    'apa-handling-stressors': {
      title: 'Des façons saines de gérer le stress — American Psychological Association',
      note: "La respiration comme une option parmi d'autres, aux côtés de la relaxation musculaire progressive, de la pleine conscience et des habitudes quotidiennes, plutôt que comme remède universel.",
    },
    'ala-breathing-exercises': {
      title: 'Exercices de respiration — American Lung Association',
      note: "Plus de détails sur la respiration abdominale et les expirations allongées. Une partie s'adresse aux personnes atteintes de maladies pulmonaires : à lire comme un complément, non comme des consignes de cette application.",
    },
  },
  language: {
    back: 'Retour',
    title: 'Langue',
    hint: 'Ton choix est conservé sur cet appareil.',
    done: 'OK',
  },
}
