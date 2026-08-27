/**
 * German. Register: du, which is the convention for wellness and lifestyle
 * apps in German.
 */
export default {
  meta: {
    title: 'Geführtes Atmen',
  },
  app: {
    name: 'Atmen',
    tagline: 'Ein paar ruhige Minuten, geführt.',
  },
  home: {
    begin: 'Starten',
    about: 'Über Atemübungen',
    language: 'Sprache',
  },
  profile: {
    legend: 'Atemprofil',
    timing: '{inhale}s ein · {exhale}s aus',
    strengthen: { name: 'Stärken', description: 'Gleich lange Atemzüge' },
    chill: { name: 'Entspannen', description: 'Längeres Ausatmen' },
    balance: { name: 'Gleichgewicht', description: 'Ausgeglichene Atmung' },
    beginner: { name: 'Anfänger', description: 'Kürzerer Zyklus für den Anfang' },
  },
  duration: {
    legend: 'Dauer',
    short: '{minutes} Min.',
    long: { one: '{minutes} Minute', other: '{minutes} Minuten' },
  },
  session: {
    remaining: 'übrig',
    inhale: 'Einatmen',
    exhale: 'Ausatmen',
    paused: 'Pausiert',
    pausedAway: 'Deine Sitzung wurde pausiert, während du weg warst.',
    pause: 'Pause',
    resume: 'Fortsetzen',
    exit: 'Beenden',
  },
  exitDialog: {
    title: 'Sitzung beenden?',
    body: 'Deine aktuelle Sitzung geht verloren.',
    cancel: 'Abbrechen',
    confirm: 'Beenden',
  },
  completion: {
    title: 'Gut gemacht!',
    body: 'Du hast deine Atemübung abgeschlossen.',
    action: 'Zurück zum Start',
  },
  info: {
    back: 'Zurück',
    title: 'Über Atemübungen',
    whatHeading: 'Was das ist',
    whatBody:
      'Geführtes Atmen bedeutet einfach, einem gleichmäßigen, bewussten Rhythmus aus Einatmen und Ausatmen zu folgen. Diese App zeigt dir diesen Rhythmus: Eine Blase steigt, während du einatmest, und sinkt, während du ausatmest – so kannst du mitgehen, ohne zu zählen.',
    whyHeading: 'Warum Menschen das machen',
    whyBody:
      'Viele Menschen empfinden langsames, gleichmäßiges Atmen als beruhigend – es hilft, vor dem Schlafen, zwischen zwei Aufgaben oder nach etwas Stressigem zur Ruhe zu kommen. Längeres Ausatmen, wie im Profil {profile}, ist eine gängige Wahl zum Herunterkommen.',
    caveat:
      'Diese App dient ausschließlich der Entspannung. Sie ist keine medizinische Beratung und keine Behandlung für irgendeine Erkrankung. Wenn du Bedenken wegen deiner Atmung oder deiner Gesundheit hast, sprich mit einer qualifizierten medizinischen Fachperson.',
    tipsHeading: 'So holst du mehr aus einer Sitzung',
    tips: [
      'Setz oder leg dich bequem an einen Ort, an dem du nicht gestört wirst.',
      'Atme durch die Nase, wenn sich das natürlich anfühlt – in den Bauch statt in die Brust.',
      'Beginne mit dem Profil {profile} und einer kurzen Sitzung; länger ist nicht besser.',
      'Streng dich nicht an. Fühlt sich ein Tempo unangenehm an, wechsle zu einem sanfteren Profil.',
      'Lass die Blase das Tempo vorgeben, statt ihr vorauszueilen.',
    ],
    resourcesHeading: 'Mehr erfahren',
    resourcesIntro:
      'Diese Seiten werden von Gesundheits- und Psychologieorganisationen veröffentlicht, nicht von dieser App. Sie öffnen sich in Ihrem Browser.',
    comingSoon: 'Link folgt',
    languageNote: {
      en: 'auf Englisch',
    },
  },
  resources: {
    'nhs-breathing-exercises': {
      title: 'Atemübungen bei Stress — NHS',
      note: 'Eine kurze, praktische Einführung in langsames Atmen: wie Sie sitzen oder liegen, wie Sie in den Bauch atmen und wie Sie ruhig mitzählen.',
    },
    'apa-stress-management-tools': {
      title: 'Werkzeuge zur Stressbewältigung — American Psychological Association',
      note: 'Enthält eine Übung zum rhythmischen Atmen — vier ein, vier halten, sechs aus — und erklärt sie als Weg, die körperliche Erregung zu senken.',
    },
    'ggsc-mindful-breathing': {
      title: 'Achtsames Atmen — Greater Good, UC Berkeley',
      note: 'Warum es hilft, auf den eigenen Atem zu achten — allgemein verständlich von einem Zentrum, das psychologische Forschung aufbereitet, mit Verweisen auf veröffentlichte Studien.',
    },
    'nccih-relaxation-techniques': {
      title: 'Entspannungstechniken: Was Sie wissen sollten — NCCIH',
      note: 'Wo Atmen unter den anderen Entspannungstechniken steht, was die Evidenz zeigt und was nicht — das unterscheidet sich je nach Beschwerdebild — und vernünftige Sicherheitshinweise.',
    },
    'apa-handling-stressors': {
      title: 'Gesunde Wege, mit Stress umzugehen — American Psychological Association',
      note: 'Atmen als eine Möglichkeit unter mehreren, neben progressiver Muskelentspannung, Achtsamkeit und Alltagsgewohnheiten — und nicht als Allheilmittel.',
    },
    'ala-breathing-exercises': {
      title: 'Atemübungen — American Lung Association',
      note: 'Mehr Details zur Bauchatmung und zu längerem Ausatmen. Teile richten sich an Menschen mit Lungenerkrankungen: als Hintergrund zu lesen, nicht als Anleitung dieser App.',
    },
  },
  language: {
    back: 'Zurück',
    title: 'Sprache',
    hint: 'Deine Auswahl wird auf diesem Gerät gespeichert.',
    done: 'OK',
  },
}
