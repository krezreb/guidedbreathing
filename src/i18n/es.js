/** Spanish. Register: tú. */
export default {
  meta: {
    title: 'Respiración guiada',
  },
  app: {
    name: 'Respira',
    tagline: 'Unos minutos de calma, guiados.',
  },
  home: {
    begin: 'Comenzar',
    about: 'Sobre los ejercicios de respiración',
    language: 'Idioma',
  },
  profile: {
    legend: 'Perfil de respiración',
    timing: '{inhale}s inspiración · {exhale}s espiración',
    strengthen: { name: 'Fortalecer', description: 'Duraciones iguales' },
    chill: { name: 'Relajar', description: 'Espiración más larga' },
    balance: { name: 'Equilibrio', description: 'Respiración equilibrada' },
    beginner: { name: 'Principiante', description: 'Ciclo más corto para empezar' },
  },
  duration: {
    legend: 'Duración',
    short: '{minutes} min',
    long: { one: '{minutes} minuto', other: '{minutes} minutos' },
  },
  session: {
    remaining: 'restante',
    inhale: 'Inspira',
    exhale: 'Espira',
    paused: 'En pausa',
    pausedAway: 'Tu sesión se pausó mientras no estabas.',
    pause: 'Pausa',
    resume: 'Continuar',
    exit: 'Salir',
  },
  exitDialog: {
    title: '¿Salir de la sesión?',
    body: 'Se perderá tu sesión actual.',
    cancel: 'Cancelar',
    confirm: 'Salir',
  },
  completion: {
    title: '¡Bien hecho!',
    body: 'Has completado tu sesión de respiración.',
    action: 'Volver al inicio',
  },
  info: {
    back: 'Volver',
    title: 'Sobre los ejercicios de respiración',
    whatHeading: 'Qué es esto',
    whatBody:
      'La respiración guiada consiste simplemente en seguir un ritmo constante y consciente de inspiración y espiración. Esta aplicación te muestra ese ritmo: una burbuja sube mientras inspiras y baja mientras espiras, para que puedas seguirla sin contar.',
    whyHeading: 'Por qué se practica',
    whyBody:
      'A muchas personas les resulta calmante respirar despacio y a un ritmo constante, y les ayuda a serenarse antes de dormir, entre tareas o después de algo estresante. Una espiración más larga, como en el perfil {profile}, es una opción habitual para relajarse.',
    caveat:
      'Esta aplicación es solo para relajarse. No es un consejo médico ni un tratamiento para ninguna afección. Si tienes dudas sobre tu respiración o tu salud, consulta a un profesional sanitario cualificado.',
    tipsHeading: 'Cómo aprovechar mejor una sesión',
    tips: [
      'Siéntate o túmbate en un lugar cómodo donde nadie te interrumpa.',
      'Respira por la nariz si te resulta natural, hacia el vientre más que hacia el pecho.',
      'Empieza con el perfil {profile} y una sesión corta: más largo no es mejor.',
      'No fuerces. Si un ritmo te resulta incómodo, cambia a un perfil más suave.',
      'Deja que la burbuja marque el ritmo en lugar de intentar adelantarte.',
    ],
    resourcesHeading: 'Más información',
    comingSoon: 'enlace próximamente',
    installHeading: 'Instalar la aplicación',
    installBody:
      'Añádela a tu pantalla de inicio: se abre a pantalla completa, sin los controles del navegador, y funciona sin conexión.',
    installAction: 'Instalar',
  },
  resources: {
    'placeholder-breathing-basics': {
      title: 'Fundamentos de los ejercicios de respiración',
      note: 'Una introducción general a la respiración pausada.',
    },
    'placeholder-relaxation-techniques': {
      title: 'Técnicas de relajación',
      note: 'Contexto más amplio sobre las prácticas de relajación.',
    },
    'placeholder-further-reading': {
      title: 'Lecturas adicionales',
      note: 'Lecturas de fondo fiables.',
    },
  },
  language: {
    back: 'Volver',
    title: 'Idioma',
    hint: 'Tu elección se recuerda en este dispositivo.',
    done: 'OK',
  },
}
