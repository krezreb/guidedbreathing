/** Italian. Register: tu. */
export default {
  meta: {
    title: 'Respirazione guidata',
  },
  app: {
    name: 'Respira',
    tagline: 'Qualche minuto di calma, guidato.',
  },
  home: {
    begin: 'Inizia',
    about: 'Informazioni sugli esercizi di respirazione',
    language: 'Lingua',
  },
  profile: {
    legend: 'Profilo di respirazione',
    timing: '{inhale}s inspirazione · {exhale}s espirazione',
    strengthen: { name: 'Rafforzare', description: 'Durate uguali' },
    chill: { name: 'Rilassare', description: 'Espirazione più lunga' },
    balance: { name: 'Equilibrio', description: 'Respirazione equilibrata' },
    beginner: { name: 'Principiante', description: 'Ciclo più breve per iniziare' },
  },
  duration: {
    legend: 'Durata',
    short: '{minutes} min',
    long: { one: '{minutes} minuto', other: '{minutes} minuti' },
  },
  session: {
    remaining: 'rimanente',
    inhale: 'Inspira',
    exhale: 'Espira',
    paused: 'In pausa',
    pausedAway: 'La tua sessione è stata messa in pausa mentre eri via.',
    pause: 'Pausa',
    resume: 'Riprendi',
    exit: 'Esci',
  },
  exitDialog: {
    title: 'Uscire dalla sessione?',
    body: 'La sessione in corso andrà perduta.',
    cancel: 'Annulla',
    confirm: 'Esci',
  },
  completion: {
    title: 'Ben fatto!',
    body: 'Hai completato la tua sessione di respirazione.',
    action: "Torna all'inizio",
  },
  info: {
    back: 'Indietro',
    title: 'Informazioni sugli esercizi di respirazione',
    whatHeading: "Che cos'è",
    whatBody:
      'La respirazione guidata consiste semplicemente nel seguire un ritmo regolare e consapevole di inspirazione ed espirazione. Questa app ti mostra quel ritmo: una bolla sale mentre inspiri e scende mentre espiri, così puoi seguirla senza contare.',
    whyHeading: 'Perché si pratica',
    whyBody:
      "Molte persone trovano che respirare lentamente e con un ritmo regolare sia calmante e aiuti a rilassarsi prima di dormire, tra un'attività e l'altra o dopo un momento stressante. Un'espirazione più lunga, come nel profilo {profile}, è una scelta comune per distendersi.",
    caveat:
      'Questa app serve solo al relax. Non costituisce un parere medico e non è un trattamento per alcuna condizione. Se hai dubbi sulla tua respirazione o sulla tua salute, parlane con un professionista sanitario qualificato.',
    tipsHeading: 'Per ottenere il meglio da una sessione',
    tips: [
      'Siediti o sdraiati in un posto comodo dove non verrai interrotto.',
      'Respira dal naso se ti viene naturale, verso la pancia più che verso il petto.',
      'Inizia con il profilo {profile} e una sessione breve: più lungo non vuol dire meglio.',
      'Non sforzarti. Se un ritmo risulta scomodo, passa a un profilo più delicato.',
      'Lascia che sia la bolla a dare il ritmo, invece di cercare di anticiparla.',
    ],
    resourcesHeading: 'Per saperne di più',
    resourcesIntro:
      'Queste pagine sono pubblicate da organizzazioni sanitarie e di psicologia, non da questa app. Si aprono nel tuo browser.',
    comingSoon: 'link in arrivo',
    languageNote: {
      en: 'in inglese',
    },
  },
  resources: {
    'nhs-breathing-exercises': {
      title: 'Esercizi di respirazione per lo stress — NHS',
      note: "Un'introduzione breve e concreta alla respirazione lenta: come sederti o sdraiarti, come respirare verso la pancia e come contare con calma.",
    },
    'apa-stress-management-tools': {
      title: 'Strumenti per gestire lo stress — American Psychological Association',
      note: 'Comprende un esercizio di respirazione ritmata — quattro inspirando, quattro di pausa, sei espirando — spiegato come modo per abbassare l’attivazione fisica.',
    },
    'ggsc-mindful-breathing': {
      title: 'Respirazione consapevole — Greater Good, UC Berkeley',
      note: 'Perché prestare attenzione al respiro aiuta, spiegato per tutti da un centro che divulga la ricerca psicologica, con riferimenti a studi pubblicati.',
    },
    'nccih-relaxation-techniques': {
      title: 'Tecniche di rilassamento: quello che serve sapere — NCCIH',
      note: 'Dove si colloca la respirazione tra le altre tecniche di rilassamento, cosa mostrano e cosa non mostrano le prove — variano a seconda del disturbo — e avvertenze di buon senso.',
    },
    'apa-handling-stressors': {
      title: 'Modi sani di affrontare lo stress — American Psychological Association',
      note: 'La respirazione come una possibilità tra tante, accanto al rilassamento muscolare progressivo, alla mindfulness e alle abitudini quotidiane, e non come rimedio universale.',
    },
    'ala-breathing-exercises': {
      title: 'Esercizi di respirazione — American Lung Association',
      note: 'Più dettagli sulla respirazione diaframmatica e sulle espirazioni lunghe. Una parte è rivolta a chi ha malattie polmonari: leggila come contesto, non come istruzioni di questa app.',
    },
  },
  language: {
    back: 'Indietro',
    title: 'Lingua',
    hint: 'La tua scelta viene ricordata su questo dispositivo.',
    done: 'OK',
  },
}
