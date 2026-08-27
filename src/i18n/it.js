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
    comingSoon: 'link in arrivo',
    installHeading: "Installa l'app",
    installBody:
      'Aggiungila alla schermata home: si apre a schermo intero, senza i controlli del browser, e funziona senza connessione.',
    installAction: 'Installa',
  },
  resources: {
    'placeholder-breathing-basics': {
      title: 'Le basi degli esercizi di respirazione',
      note: "Un'introduzione generale alla respirazione ritmata.",
    },
    'placeholder-relaxation-techniques': {
      title: 'Tecniche di relax',
      note: 'Un contesto più ampio sulle pratiche di rilassamento.',
    },
    'placeholder-further-reading': {
      title: 'Approfondimenti',
      note: 'Letture di approfondimento affidabili.',
    },
  },
  language: {
    back: 'Indietro',
    title: 'Lingua',
    hint: 'La tua scelta viene ricordata su questo dispositivo.',
    done: 'OK',
  },
}
