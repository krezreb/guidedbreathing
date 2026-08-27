/**
 * French. Register: vouvoiement, which is the convention for French UI and
 * matches the standard breathing cues "Inspirez / Expirez".
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
    inhale: 'Inspirez',
    exhale: 'Expirez',
    paused: 'En pause',
    pausedAway: 'Votre séance a été mise en pause pendant votre absence.',
    pause: 'Pause',
    resume: 'Reprendre',
    exit: 'Quitter',
  },
  exitDialog: {
    title: 'Quitter la séance ?',
    body: 'Votre séance en cours sera perdue.',
    cancel: 'Annuler',
    confirm: 'Quitter',
  },
  completion: {
    title: 'Bravo !',
    body: 'Vous avez terminé votre séance de respiration.',
    action: 'Retour au début',
  },
  info: {
    back: 'Retour',
    title: 'À propos des exercices de respiration',
    whatHeading: "Ce dont il s'agit",
    whatBody:
      "La respiration guidée consiste simplement à suivre un rythme régulier et volontaire d'inspiration et d'expiration. Cette application vous montre ce rythme : une bulle monte pendant que vous inspirez et descend pendant que vous expirez, ce qui vous permet de suivre sans compter.",
    whyHeading: 'Pourquoi on la pratique',
    whyBody:
      "Beaucoup de personnes trouvent que respirer lentement, à un rythme régulier, apaise et aide à se poser avant de dormir, entre deux tâches ou après un moment stressant. Une expiration plus longue, comme dans le profil {profile}, est un choix courant pour se détendre.",
    caveat:
      'Cette application est destinée à la détente uniquement. Elle ne constitue pas un avis médical et ne traite aucune affection. Si vous avez des inquiétudes concernant votre respiration ou votre santé, parlez-en à un professionnel de santé qualifié.',
    tipsHeading: "Pour profiter au mieux d'une séance",
    tips: [
      'Asseyez-vous ou allongez-vous confortablement, là où vous ne serez pas dérangé.',
      'Respirez par le nez si cela vous semble naturel, vers le ventre plutôt que vers la poitrine.',
      'Commencez par le profil {profile} et une séance courte : plus long ne veut pas dire mieux.',
      'Ne forcez pas. Si un rythme est inconfortable, passez à un profil plus doux.',
      "Laissez la bulle donner le rythme au lieu d'essayer de la devancer.",
    ],
    resourcesHeading: 'En savoir plus',
    comingSoon: 'lien à venir',
    installHeading: "Installer l'application",
    installBody:
      "Ajoutez-la à votre écran d'accueil : elle s'ouvre en plein écran, sans les commandes du navigateur, et fonctionne sans connexion.",
    installAction: 'Installer',
  },
  resources: {
    'placeholder-breathing-basics': {
      title: 'Les bases des exercices de respiration',
      note: 'Une introduction générale à la respiration rythmée.',
    },
    'placeholder-relaxation-techniques': {
      title: 'Techniques de relaxation',
      note: 'Un contexte plus large sur les pratiques de relaxation.',
    },
    'placeholder-further-reading': {
      title: 'Pour aller plus loin',
      note: 'Des lectures de fond fiables.',
    },
  },
  language: {
    back: 'Retour',
    title: 'Langue',
    hint: 'Votre choix est conservé sur cet appareil.',
    done: 'OK',
  },
}
