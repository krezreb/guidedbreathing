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
    mute: 'Silenciar sonidos',
    unmute: 'Activar sonidos',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
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
    resourcesIntro:
      'Estas páginas las publican organizaciones de salud y de psicología, no esta aplicación. Se abren en tu navegador.',
    comingSoon: 'enlace próximamente',
    languageNote: {
      en: 'en inglés',
    },
  },
  resources: {
    'nhs-breathing-exercises': {
      title: 'Ejercicios de respiración para el estrés — NHS',
      note: 'Una introducción breve y práctica a la respiración lenta: cómo sentarse o tumbarse, cómo respirar hacia el vientre y cómo contar con calma.',
    },
    'apa-stress-management-tools': {
      title: 'Herramientas para manejar el estrés — American Psychological Association',
      note: 'Incluye un ejercicio de respiración pausada — cuatro al inspirar, cuatro de pausa, seis al espirar — y lo explica como una forma de reducir la activación física.',
    },
    'ggsc-mindful-breathing': {
      title: 'Respiración consciente — Greater Good, UC Berkeley',
      note: 'Por qué ayuda prestar atención a la respiración, explicado para cualquier lector por un centro que divulga la investigación en psicología, con referencias a estudios publicados.',
    },
    'nccih-relaxation-techniques': {
      title: 'Técnicas de relajación: lo que conviene saber — NCCIH',
      note: 'El lugar de la respiración entre otras técnicas de relajación, qué muestra y qué no muestra la evidencia — varía según la afección — y advertencias de seguridad razonables.',
    },
    'apa-handling-stressors': {
      title: 'Formas saludables de afrontar el estrés — American Psychological Association',
      note: 'La respiración como una opción entre varias, junto con la relajación muscular progresiva, la atención plena y los hábitos cotidianos, y no como un remedio universal.',
    },
    'ala-breathing-exercises': {
      title: 'Ejercicios de respiración — American Lung Association',
      note: 'Más detalle sobre la respiración abdominal y las espiraciones largas. Parte del texto se dirige a personas con enfermedades pulmonares: léelo como contexto, no como instrucciones de esta aplicación.',
    },
  },
  language: {
    back: 'Volver',
    title: 'Idioma',
    hint: 'Tu elección se recuerda en este dispositivo.',
    done: 'OK',
  },
}
