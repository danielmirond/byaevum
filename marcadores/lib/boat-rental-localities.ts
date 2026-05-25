// lib/boat-rental-localities.ts
// Master data for all boat rental localities

export interface BoatRentalLocality {
  coast: string           // "Islas Baleares"
  province: string        // "Baleares"
  locality: string        // "Mallorca"
  slug: string           // "mallorca"
  samboatUrl: string     // "/alquiler-barco/mallorca"
  googleTrendsVolume: number
  description: string    // 1-2 sentence hook

  // Beaches/Calas accessible by boat
  beaches: Array<{
    name: string
    distance: string      // "5 min boat"
    type?: string        // "nudist", "family", "secret"
    description: string
  }>

  // Moorings/Fondeos
  moorings: Array<{
    name: string
    depth: number        // meters
    protection: 'high' | 'medium' | 'low'
    description: string
  }>

  // Pricing
  pricing: {
    small: { min: number; max: number }      // <5.5m
    medium: { min: number; max: number }     // 5.5-8m
    captain: { min: number; max: number }    // with captain
  }

  // Local regulations
  regulations: string[]

  // Best season
  bestSeason: string    // "Junio-Agosto"

  // Insider tip
  insiderTip: string

  // FAQ
  faq: Array<{
    question: string
    answer: string
  }>

  // Hero image from Unsplash
  images: {
    hero: {
      unsplashUrl: string
      alt: string
    }
  }
}

export const BOAT_RENTAL_LOCALITIES: Record<string, BoatRentalLocality> = {
  // ===== ISLAS BALEARES =====
  mallorca: {
    coast: 'Islas Baleares',
    province: 'Baleares',
    locality: 'Mallorca',
    slug: 'mallorca',
    samboatUrl: '/alquiler-barco/mallorca',
    googleTrendsVolume: 77,
    description:
      'La mayor isla de Baleares ofrece 838 barcos disponibles desde €120/día. Navega por calas escondidas, fondeos naturales y playas de arena blanca.',

    beaches: [
      {
        name: 'Cala Mayor',
        distance: '10 min desde Palma',
        type: 'family',
        description: 'Playa urbana protegida, aguas calmadas, ideal para principiantes'
      },
      {
        name: 'Cala Millor',
        distance: '30 min desde Palma',
        description: 'Arena blanca, aguas turquesas, fondeo natural seguro'
      },
      {
        name: 'Calo des Moro',
        distance: '45 min desde Palma',
        type: 'secret',
        description: 'Cala secreta de película, acantilados, solo accesible en barco'
      },
      {
        name: 'Es Trenc',
        distance: '60 min desde Palma',
        description: 'Playa virgen del sur, dunas intactas, fondeos en arena'
      },
      {
        name: 'Sa Calobra',
        distance: '90 min Costa Brava',
        description: 'Cañón marino espectacular, solo accesible en barco'
      }
    ],

    moorings: [
      {
        name: 'Cala Mayor',
        depth: 8,
        protection: 'high',
        description: 'Fondeadero principal Palma, arena, protección alta'
      },
      {
        name: 'Es Pontás',
        depth: 12,
        protection: 'medium',
        description: 'Roca característica, fondeo rocoso, vistas espectaculares'
      },
      {
        name: 'Cala Millor',
        depth: 10,
        protection: 'high',
        description: 'Fondeo seguro, arena, aguas calmadas'
      },
      {
        name: 'Calo des Moro',
        depth: 15,
        protection: 'medium',
        description: 'Fondeo en roca, profundidad variable, vistas de acantilado'
      }
    ],

    pricing: {
      small: { min: 120, max: 180 },
      medium: { min: 200, max: 350 },
      captain: { min: 280, max: 420 }
    },

    regulations: [
      'AMP Montgrí: No fondear a <60m profundidad',
      'Pesca prohibida en reserva marina',
      'Temporada alta: Julio-Agosto (40% más caro)',
      'Depósito caución: €500-€1000 típico',
      'Equipo obligatorio: chalecos, botiquín, extintores'
    ],

    bestSeason: 'Junio-Septiembre (clima perfecto, aguas 24°C)',

    insiderTip:
      'Ruta secreta: Palma → Cala Mayor → Es Pontás → Calo des Moro → Sa Calobra (salida mañana, retorno atardecer). Evita julio-agosto mediodía (multitudes).',

    faq: [
      {
        question: '¿Edad mínima para alquilar sin licencia?',
        answer: '16 años en barcos <5.5m. Recomendamos 18+ para comodidad y seguridad.'
      },
      {
        question: '¿Qué fondeos son seguros sin licencia?',
        answer:
          'Cala Mayor, Cala Millor, Es Pontás. Evita aguas profundas (>20m) sin experiencia.'
      },
      {
        question: '¿Dormir a bordo está permitido?',
        answer: 'Sí, pero solo en fondeos autorizados. Calo des Moro es popular para dormir.'
      },
      {
        question: '¿Gasolina incluida?',
        answer: 'No. Combustible: ~€1.50/litro. Motor 150cv consume 15-20L/hora a crucero.'
      },
      {
        question: '¿Playas tranquilas en Mallorca?',
        answer: 'Calo des Moro, Sa Calobra, Es Trenc. Evita Magaluf, Palma Nova (turismo masivo).'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,mallorca,mediterranean,turquoise',
        alt: 'Barcos de vela anclados en Mallorca con aguas turquesas'
      }
    }
  },

  ibiza: {
    coast: 'Islas Baleares',
    province: 'Baleares',
    locality: 'Ibiza',
    slug: 'ibiza',
    samboatUrl: '/alquiler-barco/ibiza',
    googleTrendsVolume: 71,
    description:
      'Isla cosmopolita con 104 veleros y 317 barcos desde €200/día. Fondeos en Es Vedrà, Cala Salada, y calas nudistas protegidas.',

    beaches: [
      {
        name: 'Es Vedrà',
        distance: '20 min desde San Antonio',
        type: 'iconic',
        description: 'Roca icónica del mediterráneo, fondeo cercano, puesta de sol espectacular'
      },
      {
        name: 'Cala Salada',
        distance: '15 min desde San Antonio',
        description: 'Playa salvaje norte, aguas cristalinas, arena blanca'
      },
      {
        name: 'Cala Conta',
        distance: '10 min desde San Antonio',
        description: 'Playas múltiples conectadas, aguas turquesas, fondeos naturales'
      },
      {
        name: 'Cala Bassa',
        distance: '25 min desde Ibiza ciudad',
        type: 'family',
        description: 'Playa de arena, beach clubs, aguas calmadas'
      },
      {
        name: 'Cala Llonga',
        distance: '30 min desde Ibiza ciudad',
        type: 'nudist',
        description: 'Cala nudista, fondeo en arena, ambiente relajado'
      }
    ],

    moorings: [
      {
        name: 'Es Vedrà',
        depth: 20,
        protection: 'medium',
        description: 'Fondeo rocky, profundidad variable, vista de roca icónica'
      },
      {
        name: 'Cala Salada',
        depth: 10,
        protection: 'high',
        description: 'Arena fina, protección norte, ideal familia'
      },
      {
        name: 'Cala Conta',
        depth: 8,
        protection: 'high',
        description: 'Múltiples spots, aguas calmadas, ideal sin experiencia'
      },
      {
        name: 'Cala Bassa',
        depth: 12,
        protection: 'medium',
        description: 'Fondeo arenoso, fácil entrada, cerca de amenidades'
      }
    ],

    pricing: {
      small: { min: 150, max: 250 },
      medium: { min: 250, max: 450 },
      captain: { min: 320, max: 550 }
    },

    regulations: [
      'Posidonia prohibida: No fondear <60m profundidad en lechos de posidonia',
      'Club 54 enforcement: Zona norte protegida, no motos de agua',
      'Temporada: Mayo-octubre (invierno cierra varios fondeos)',
      'Equipo: obligatorio salvavidas, botiquín, señales',
      'Edad mínima: 16 años sin licencia (18+ recomendado)'
    ],

    bestSeason: 'Mayo-Septiembre (agua 22-26°C, viento ligero norte)',

    insiderTip:
      'Sunset route: San Antonio → Cala Conta (4pm) → Es Vedrà (6:30pm puesta) → Cala Salada (noche). Evita sábados noche (superyates de clubes).',

    faq: [
      {
        question: '¿Fondeos nudistas en Ibiza?',
        answer: 'Cala Llonga y Cala Xarraca (este). Ambas son fondeos relajados, aceptados socialmente.'
      },
      {
        question: '¿Es seguro fondear sin licencia en Es Vedrà?',
        answer:
          'Sí, pero solo marineros. Fondeo rocky, profundidad 15-25m, necesitas ancla segura.'
      },
      {
        question: '¿Mejor época para playas tranquilas?',
        answer: 'Mayo, junio, septiembre. Julio-agosto: multitudes en Cala Conta.'
      },
      {
        question: '¿Pesca permitida?',
        answer: 'Limitada. Fondeos protegidos sin pesca comercial. Pesca recreativa con moderación.'
      },
      {
        question: '¿Hay anclas disponibles?',
        answer: 'Lleva 2 anclas (Danforth + rocas). Fondo arenoso-rocoso variable.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?yacht,ibiza,turquoise,beach',
        alt: 'Yate de lujo frente a las playas de Ibiza'
      }
    }
  },

  menorca: {
    coast: 'Islas Baleares',
    province: 'Baleares',
    locality: 'Menorca',
    slug: 'menorca',
    samboatUrl: '/alquiler-barco/menorca',
    googleTrendsVolume: 87,
    description:
      'Isla UNESCO con 264 barcos desde €110/día. Fondeos en cala Galdana, Son Bou, y calas vírgenes al este.',

    beaches: [
      {
        name: 'Cala Galdana',
        distance: '30 min desde Mahón',
        type: 'family',
        description: 'Playa de arena blanca, 500m, aguas turquesas, fondeo natural'
      },
      {
        name: 'Son Bou',
        distance: '25 min desde Mahón',
        description: 'Segunda playa más larga, aguas calmadas, fondeo rocoso'
      },
      {
        name: 'Fornells',
        distance: '20 min desde Mahón',
        description: 'Pueblo costero tranquilo, puerto seguro, caldereta de langosta'
      },
      {
        name: 'Cala Mitjana',
        distance: '35 min desde Mahón',
        type: 'secret',
        description: 'Cala salvaje, solo accesible en barco o senderismo, fondeo natural'
      },
      {
        name: 'Cavalleria',
        distance: '40 min norte',
        description: 'Faro rojo-blanco icónico, fondeo expuesto norte'
      }
    ],

    moorings: [
      {
        name: 'Cala Galdana',
        depth: 8,
        protection: 'high',
        description: 'Arena fina, protección sur, ideal familia'
      },
      {
        name: 'Son Bou',
        depth: 12,
        protection: 'medium',
        description: 'Rocas dispersas, fondeo robusto, poco crowded'
      },
      {
        name: 'Fornells',
        depth: 6,
        protection: 'high',
        description: 'Puerto tranquilo, entrada fácil, protección total'
      },
      {
        name: 'Cala Mitjana',
        depth: 15,
        protection: 'medium',
        description: 'Fondeo rocoso, vistas de acantilado, poco turismo'
      }
    ],

    pricing: {
      small: { min: 110, max: 170 },
      medium: { min: 180, max: 320 },
      captain: { min: 250, max: 400 }
    },

    regulations: [
      'UNESCO Biosphere: No motos de agua en fondeos',
      'Pesca: Muy limitada en calas protegidas',
      'Cavalleria: Expuesto a norte, evitar con Tramontana',
      'Fornells: Puerto con amarre, tasas portuarias €10-15/noche',
      'Equipo: Obligatorio en todas las calas'
    ],

    bestSeason: 'Mayo-Octubre (agua 20-25°C, vientos predecibles)',

    insiderTip:
      'Ruta este (evita turismo): Mahón → Fornells (caldereta) → Cavalleria (faro) → Cala Mitjana (secreto) → retorno. Tramontana: evitar norte 24h.',

    faq: [
      {
        question: '¿Menorca es más tranquila que Mallorca?',
        answer: 'Sí. UNESCO protection mantiene desarrollo limitado. Fondeos menos crowded, ideales principiantes.'
      },
      {
        question: '¿Dónde comer bien a bordo?',
        answer:
          'Fornells: caldereta de langosta (especialidad). Restaurantes puerto. Llevar provisiones (compras en Mahón).'
      },
      {
        question: '¿Riesgo de Tramontana?',
        answer:
          'Viento norte fuerte, llega sin aviso. Monitoreá partes. Si viene: busca Sur (Cala Galdana), evita norte 48h.'
      },
      {
        question: '¿Fondeos nudistas?',
        answer: 'Cala Mitjana (de facto). Ambiente respetado, pocos nudistas, libertad de elección.'
      },
      {
        question: '¿Sin licencia es suficiente?',
        answer: 'Sí para barcos <5.5m. Aguas predecibles, fondeos seguros. Recomendamos 18+ experiencia marina.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?boat,menorca,anchorage,mediterranean',
        alt: 'Barco anclado en una cala protegida de Menorca'
      }
    }
  },

  barcelona: {
    coast: 'Costa Brava',
    province: 'Barcelona',
    locality: 'Barcelona',
    slug: 'barcelona',
    samboatUrl: '/alquiler-barco/barcelona',
    googleTrendsVolume: 51,
    description:
      'Ciudad costera cosmopolita. Alquila barcos desde €100/día. Vela por la Montjuïc, playas urbanas, y calas de Sitges/Castelldefels.',

    beaches: [
      {
        name: 'Barceloneta',
        distance: '0 min centro ciudad',
        type: 'urban',
        description: 'Playa urbana, paseo marítimo, salida desde Puerto Vell'
      },
      {
        name: 'Montjuïc',
        distance: '5 min oeste',
        description: 'Vistas de castillo, fondeo urbano, museos visible'
      },
      {
        name: 'Sitges',
        distance: '30 min sur',
        description: 'Pueblo costero pintoresco, arquitectura modernista, playas tranquilas'
      },
      {
        name: 'Castelldefels',
        distance: '25 min sur',
        description: 'Playa larga dorada, castillo en acantilado, fondeo robusto'
      },
      {
        name: 'Garraf',
        distance: '40 min sur',
        type: 'secret',
        description: 'Calas naturales protegidas, acantilados, poco turismo'
      }
    ],

    moorings: [
      {
        name: 'Port Vell',
        depth: 8,
        protection: 'high',
        description: 'Puerto protegido, amarre pagado, fácil logística'
      },
      {
        name: 'Montjuïc',
        depth: 10,
        protection: 'medium',
        description: 'Fondeo rocoso, vistas de ciudad, poco espacio'
      },
      {
        name: 'Sitges',
        depth: 9,
        protection: 'high',
        description: 'Fondeo arenoso, protegido sur, tranquilo'
      },
      {
        name: 'Castelldefels',
        depth: 12,
        protection: 'medium',
        description: 'Fondeo rocoso, protección variable, castillo vistas'
      }
    ],

    pricing: {
      small: { min: 100, max: 180 },
      medium: { min: 180, max: 320 },
      captain: { min: 240, max: 400 }
    },

    regulations: [
      'Port Vell: Zona de tráfico intenso, vigilancia guardacostas',
      'Velocidad: Máx 3 nudos en puerto, 5 en costa urbana',
      'Motos agua: Prohibidas zona urbana (0-100m)',
      'Pesca: Solo recreativa, sin comercial',
      'Temporada: Todo el año, pero mejor mayo-octubre'
    ],

    bestSeason: 'Mayo-Septiembre (agua 19-24°C, vientos ligeros)',

    insiderTip:
      'Urbano + rural: Mañana Puerto Vell → Montjuïc (Museos MNAC visible) → tarde Sitges (arquitectura) → Garraf (calas secretas) → retorno atardecer.',

    faq: [
      {
        question: '¿Tráfico marítimo intenso?',
        answer: 'Sí. Puerto Vell es busy. Mejor mañana temprano o madrugada. Radar/AIS recomendado.'
      },
      {
        question: '¿Dónde comer en barco?',
        answer:
          'Sitges: restaurantes playa excelentes. Provision en Port Vell supermarkets. Chiringuitos Castelldefels.'
      },
      {
        question: '¿Seguro sin licencia?',
        answer: 'Sí si evitas puerto comercial. Fondeos Sitges/Castelldefels son tranquilos, ideales principiantes.'
      },
      {
        question: '¿WiFi/electricidad?',
        answer: 'Port Vell: sí (pagado amarre). Fondeos naturales: no.'
      },
      {
        question: '¿Ver arquitectura Gaudí desde barco?',
        answer: 'No directo. Sagrada Familia/Batllo no visible desde costa. Mejor visita terrestre.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?catamaran,barcelona,mediterranean,sailing',
        alt: 'Catamarán navegando en la costa de Barcelona'
      }
    }
  },

  alicante: {
    coast: 'Costa Blanca',
    province: 'Alicante',
    locality: 'Alicante',
    slug: 'alicante',
    samboatUrl: '/alquiler-barco/alicante',
    googleTrendsVolume: 25,
    description:
      'Puerta a Costa Blanca. 35 barcos desde €100/día. Fondeos en Tabarca, Benidorm, y calas de Jávea.',

    beaches: [
      {
        name: 'Isla de Tabarca',
        distance: '20 min isla protegida',
        type: 'protected',
        description: 'Isla deshabitada, reserva marina, fondeos múltiples'
      },
      {
        name: 'Playa del Postiguet',
        distance: '0 min ciudad',
        description: 'Playa urbana, castillo de Santa Bárbara vista, logística fácil'
      },
      {
        name: 'Cala de Finestrat',
        distance: '20 min norte',
        description: 'Cala rocosa, Penyal d\'Ifach icónico (Calpe), fondeo natural'
      },
      {
        name: 'Jávea (Xàbia)',
        distance: '30 min norte',
        description: 'Pueblo marinero, 3 playas, calas escondidas, vino local'
      },
      {
        name: 'Denia',
        distance: '40 min norte',
        description: 'Puerto histórico, castillo, salida a Columbretes'
      }
    ],

    moorings: [
      {
        name: 'Tabarca',
        depth: 10,
        protection: 'high',
        description: 'Múltiples spots, arena/roca, reserva protegida'
      },
      {
        name: 'Postiguet',
        depth: 8,
        protection: 'high',
        description: 'Puerto urbano, amarre fácil, casco histórico acceso'
      },
      {
        name: 'Finestrat',
        depth: 12,
        protection: 'medium',
        description: 'Rocas, Penyal vista espectacular, poco crowded'
      },
      {
        name: 'Jávea',
        depth: 9,
        protection: 'high',
        description: 'Puerto tranquilo, 3 playas protegidas, ambiente bohemio'
      }
    ],

    pricing: {
      small: { min: 100, max: 160 },
      medium: { min: 160, max: 280 },
      captain: { min: 220, max: 360 }
    },

    regulations: [
      'Tabarca: Reserva Marina, protección total, no pesca, no motos agua',
      'Penyal Ifach: Parque Natural, no fondeo <100m distancia',
      'Jávea: Puerto pequeño, amarre limitado, reserva con antelación',
      'Denia: Puerto activo, tráfico comercial, evitar horas punta',
      'Equipo obligatorio en todas las calas'
    ],

    bestSeason: 'Mayo-Octubre (agua 20-26°C, Levante vientos ligeros)',

    insiderTip:
      'Costa Blanca secret: Alicante → Tabarca (snorkel/pesca foto) → Finestrat (Penyal foto) → Jávea (comida vino) → Denia opcional. Levante viento: monitorea, cierra rapido.',

    faq: [
      {
        question: '¿Tabarca merece el viaje?',
        answer:
          'Sí. Isla deshabitada, reserva marina intacta, snorkel extraordinario, fondeos seguros.'
      },
      {
        question: '¿Sin licencia es suficiente?',
        answer: 'Sí. Costa Blanca fondeos son calmados, ideales principiantes, protegidos.'
      },
      {
        question: '¿Levante viento es peligroso?',
        answer:
          'Puede ser. Viene del este, rápido, sin aviso. Monitor partes, busca amarre. Pasa usualmente 12-24h.'
      },
      {
        question: '¿Denia vale pena vs Alicante?',
        answer: 'Sí si tienes tiempo. Columbretes (isla remota) salida desde Denia. +2h comparado a Alicante.'
      },
      {
        question: '¿Vino local a bordo?',
        answer: 'Jávea/Denia: vinos DO Alicante. Compra en puerto, disfruta fondeado.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,alicante,mediterranean,coast',
        alt: 'Barco de vela frente a la costa de Alicante'
      }
    }
  },

  // ===== COSTA BLANCA: VALENCIA =====
  valencia: {
    coast: 'Costa Blanca',
    province: 'Valencia',
    locality: 'Valencia',
    slug: 'valencia',
    samboatUrl: '/alquiler-barco/valencia',
    googleTrendsVolume: 35,
    description:
      'La capital de la Costa Blanca ofrece 156 barcos desde €95/día. Navega por playas urbanas, islas remotas y lagoons protegidas.',

    beaches: [
      {
        name: 'Playa de la Malvarrosa',
        distance: '15 min desde puerto',
        type: 'urban',
        description: 'Playa urbana principal, aguas calmadas, fácil acceso'
      },
      {
        name: 'Isla de Cullera',
        distance: '30 min desde Valencia',
        description: 'Isla rocosa con fondeo natural, vistas panorámicas'
      },
      {
        name: 'Punta del Saler',
        distance: '40 min desde Valencia',
        type: 'natural',
        description: 'Zona de humedales protegida, fauna marina especial'
      },
      {
        name: 'Playa Ampolla',
        distance: '45 min sur',
        description: 'Cala arenosa tranquila, ideal familias'
      },
      {
        name: 'Isla Brava',
        distance: '50 min sur',
        type: 'snorkel',
        description: 'Islote rocoso, excelente snorkel y buceo'
      }
    ],

    moorings: [
      {
        name: 'Puerto de Valencia',
        depth: 6,
        protection: 'high',
        description: 'Fondeadero principal, marina con servicios'
      },
      {
        name: 'Cullera Bay',
        depth: 12,
        protection: 'high',
        description: 'Bahía protegida, fondeo en arena'
      },
      {
        name: 'Saler Lagoon',
        depth: 3,
        protection: 'high',
        description: 'Laguna tranquila, ideal para principiantes'
      },
      {
        name: 'Isla Brava Mooring',
        depth: 14,
        protection: 'medium',
        description: 'Fondeo rocoso, vistas espectaculares'
      }
    ],

    pricing: {
      small: { min: 95, max: 160 },
      medium: { min: 180, max: 320 },
      captain: { min: 240, max: 400 }
    },

    regulations: [
      'Zona húmeda protegida: Respetar distancias a fauna',
      'Fondeo prohibido en lagunas principales (Albufera)',
      'Marina obligatoria en puerto de Valencia',
      'Temporada: Todo el año (clima suave)',
      'Equipo: chaleco salvavidas, botiquín, GPS recomendado'
    ],

    bestSeason: 'Marzo-Junio y Septiembre-Octubre (clima 18-22°C)',

    insiderTip:
      'Combinación perfecta: mañana en Albufera (lagoon tranquila) + tarde en Isla Brava (snorkel). Cena de arròs en puerto.',

    faq: [
      {
        question: '¿Qué diferencia hay entre Valencia y Alicante?',
        answer: 'Valencia: zona húmeda protegida, aguas tranquilas. Alicante: calas rocosas, islas remotas. Valencia = familias, Alicante = aventura.'
      },
      {
        question: '¿Se puede fondear en la Albufera?',
        answer: 'Solo en zonas designadas. Marina recomienda Saler Lagoon o puerto. Albufera es zona natural protegida.'
      },
      {
        question: '¿Mejor que Jávea/Denia?',
        answer: 'Si prefieres playa urbana + servicios: Valencia. Si prefieres calas remotas: Jávea/Denia (30min norte).'
      },
      {
        question: '¿Paella a bordo?',
        answer: 'Sí! Compra ingredientes en puerto, prepara a bordo en lagoon tranquila. Máxima experiencia Valencia.'
      },
      {
        question: '¿Fauna marina?',
        answer: 'Delfines ocasionales en aguas abiertas. Flamencos en lagoon. Erizos y peces en Isla Brava.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?boat,valencia,beach,mediterranean',
        alt: 'Barco en las aguas de Valencia'
      }
    }
  },

  // ===== MALLORCA: SUB-LOCALIDADES =====
  palma: {
    coast: 'Islas Baleares',
    province: 'Baleares',
    locality: 'Palma',
    slug: 'palma',
    samboatUrl: '/alquiler-barco/mallorca/palma',
    googleTrendsVolume: 35,
    description:
      'Capital de Mallorca con 312 barcos disponibles desde €115/día. Puerto principal, calas urbanas y acceso a fondeos mediterráneos.',

    beaches: [
      {
        name: 'Playa del Puerto',
        distance: '2 min desde puerto',
        type: 'urban',
        description: 'Playa urbana junto catedral, servicios cercanos'
      },
      {
        name: 'Cala Mayor',
        distance: '5 min desde puerto',
        description: 'Cala protegida, fondeo fácil, servicios'
      },
      {
        name: 'Paseo Marítimo',
        distance: '10 min desde puerto',
        type: 'scenic',
        description: 'Navegación pintoresca, fondeo urbano'
      },
      {
        name: 'Isla Tafona',
        distance: '30 min oeste',
        description: 'Islote rocoso, snorkel de nivel'
      },
      {
        name: 'Cala Estancia',
        distance: '40 min sur',
        description: 'Cala pequeña tranquila, fondeo natural'
      }
    ],

    moorings: [
      {
        name: 'Puerto Palma',
        depth: 8,
        protection: 'high',
        description: 'Marina principal, servicios premium'
      },
      {
        name: 'Cala Mayor',
        depth: 9,
        protection: 'high',
        description: 'Fondeadero seguro, arena'
      },
      {
        name: 'Isla Tafona',
        depth: 14,
        protection: 'medium',
        description: 'Fondeo rocoso, vistas espectaculares'
      },
      {
        name: 'Cala Estancia',
        depth: 11,
        protection: 'high',
        description: 'Arena fina, protección excelente'
      }
    ],

    pricing: {
      small: { min: 115, max: 185 },
      medium: { min: 205, max: 360 },
      captain: { min: 290, max: 440 }
    },

    regulations: [
      'Tráfico portuario alto',
      'Zona histórica: Catedral Mallorca (área protegida)',
      'Marina obligatoria (servicios incluidos)',
      'Temporada: Todo el año',
      'Equipo: GPS, comunicaciones, protocolo puerto'
    ],

    bestSeason: 'Abril-Junio y Septiembre-Octubre',

    insiderTip:
      'Base perfecta: Duerme en puerto Palma, explora calas día. Catedral al atardecer desde barco = mágico.',

    faq: [
      {
        question: '¿Base mejor que otras playas Mallorca?',
        answer: 'Sí si quieres ciudad. Servicios premium, restaurantes. Pero más caro. Otras playas más tranquilas pero menos infraestructura.'
      },
      {
        question: '¿Fondeo en ciudad?',
        answer: 'Marina con servicios. Fondeo libre solo en calas cercanas. Puerto obligatorio = caro pero seguro.'
      },
      {
        question: '¿Catedral desde barco?',
        answer: 'Espectacular vista nocturna. Iluminada al atardecer. Fondo catedral desde Cala Mayor o puerto.'
      },
      {
        question: '¿Alternativa con fondeo libre?',
        answer: 'Cala Mayor o Cala Estancia. Fondeo libre pero lejos servicios. 20min a restaurantes.'
      },
      {
        question: '¿Es muy turístico?',
        answer: 'Sí. Pero mañana temprano = soledad. Tarde = turismo. Navega temprano, regresa 18h.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,palma,harbor,mediterranean',
        alt: 'Barcos de vela en el puerto de Palma'
      }
    }
  },

  alcudia: {
    coast: 'Islas Baleares',
    province: 'Baleares',
    locality: 'Alcúdia',
    slug: 'alcudia',
    samboatUrl: '/alquiler-barco/mallorca/alcudia',
    googleTrendsVolume: 28,
    description:
      'Norte de Mallorca con 156 barcos desde €110/día. Bahía protegida, fondeos seguros, playas de familia, parque marino protegido.',

    beaches: [
      {
        name: 'Playa de Alcúdia',
        distance: '5 min desde puerto',
        type: 'family',
        description: 'Playa principal de arena, aguas calmadas'
      },
      {
        name: 'Playa Can Picafort',
        distance: '10 min este',
        description: 'Playa ancha de arena, ideal familia'
      },
      {
        name: 'Reserva Marina Peninsular',
        distance: '20 min norte',
        type: 'snorkel',
        description: 'Área protegida, fauna marina especial'
      },
      {
        name: 'Cala Sant Vicenç',
        distance: '25 min norte',
        description: 'Cala de pinares, fondeo natural hermoso'
      },
      {
        name: 'Punta Avellana',
        distance: '30 min este',
        type: 'scenic',
        description: 'Acantilado rocoso, vistas norte'
      }
    ],

    moorings: [
      {
        name: 'Puerto Alcúdia',
        depth: 7,
        protection: 'high',
        description: 'Marina principal, servicios familia'
      },
      {
        name: 'Bahía Alcúdia',
        depth: 6,
        protection: 'high',
        description: 'Fondeo libre en arena, muy protegido'
      },
      {
        name: 'Cala Sant Vicenç',
        depth: 10,
        protection: 'high',
        description: 'Arena fina, pinares protectores'
      },
      {
        name: 'Punta Avellana',
        depth: 12,
        protection: 'medium',
        description: 'Fondeo rocoso, vistas norte Mallorca'
      }
    ],

    pricing: {
      small: { min: 110, max: 170 },
      medium: { min: 190, max: 320 },
      captain: { min: 260, max: 410 }
    },

    regulations: [
      'Reserva Marina Peninsular: Fondeo restringido <30m',
      'Zona familia protegida: No motos agua en bahía',
      'Pesca vedada en reserva',
      'Temporada: Todo el año, mejor mayo-octubre',
      'Equipo: GPS recomendado, chaleco obligatorio'
    ],

    bestSeason: 'Mayo-Octubre (aguas 18-23°C)',

    insiderTip:
      'Paraíso familiar: Bahía Alcúdia súper protegida para niños. Snorkel en Reserva Marina (peces abundantes). Atardecer en pinares.',

    faq: [
      {
        question: '¿Mejor para familia que Palma?',
        answer: 'Sí. Playas más tranquilas, bahía muy protegida, menos tráfico. Perfecto niños 0-12.'
      },
      {
        question: '¿Fondeo libre en bahía?',
        answer: 'Sí, excelente. Arena fina, sin corrientes. Marina también disponible si necesitas servicios.'
      },
      {
        question: '¿Snorkel en Reserva Marina?',
        answer: 'Sí, excelente. Peces abundantes, corales. Respetar zona <30m. Guía local recomendado.'
      },
      {
        question: '¿Clima invierno?',
        answer: 'Diciembre-Febrero: 10-15°C, algunos fondeos cierran. Mejor febrero+. Noviembre-marzo: viento Tramontana.'
      },
      {
        question: '¿Es muy turístico?',
        answer: 'Menor que Palma. Pero junio-agosto lleno. Abril-mayo y septiembre mejores para tranquilidad.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?boat,alcudia,beach,turquoise',
        alt: 'Barco en la playa de Alcudia'
      }
    }
  },

  pollenca: {
    coast: 'Islas Baleares',
    province: 'Baleares',
    locality: 'Pollença',
    slug: 'pollenca',
    samboatUrl: '/alquiler-barco/mallorca/pollenca',
    googleTrendsVolume: 22,
    description:
      'Noroeste Mallorca, 89 barcos desde €105/día. Bahía semicerrada, calas pinares, fondeo ultra protegido, poco turismo.',

    beaches: [
      {
        name: 'Playa de Pollença',
        distance: '3 min desde puerto',
        type: 'quiet',
        description: 'Playa semicerrada, muy tranquila'
      },
      {
        name: 'Cala de Molins',
        distance: '10 min sur',
        description: 'Cala rocosa pequeña, snorkel bueno'
      },
      {
        name: 'Cala Bóquer',
        distance: '15 min norte',
        type: 'scenic',
        description: 'Cala aislada, camino a pie desde tierra'
      },
      {
        name: 'Formentor',
        distance: '20 min norte',
        type: 'iconic',
        description: 'Faro histórico, acantilados espectaculares'
      },
      {
        name: 'Illa de Colomer',
        distance: '25 min norte',
        description: 'Islote rocoso, snorkel experto'
      }
    ],

    moorings: [
      {
        name: 'Puerto Pollença',
        depth: 6,
        protection: 'high',
        description: 'Puerto pequeño tranquilo, servicios básicos'
      },
      {
        name: 'Bahía Pollença',
        depth: 5,
        protection: 'high',
        description: 'Fondeo libre arena, ultra protegido'
      },
      {
        name: 'Cala Molins',
        depth: 9,
        protection: 'high',
        description: 'Fondeo rocoso, peces abundantes'
      },
      {
        name: 'Formentor Bay',
        depth: 15,
        protection: 'medium',
        description: 'Fondeo profundo, corriente norte ocasional'
      }
    ],

    pricing: {
      small: { min: 105, max: 160 },
      medium: { min: 170, max: 300 },
      captain: { min: 240, max: 390 }
    },

    regulations: [
      'Bahía semicerrada: Entrada única permitida',
      'Fondeo solo en zona designada (muy pequeña)',
      'Sin motos agua',
      'Pesca vedada',
      'Temporada: Mayo-octubre ideal, resto limitado'
    ],

    bestSeason: 'Mayo-Octubre (tranquilidad máxima)',

    insiderTip:
      'Secreto Mallorca: Bahía Pollença es la más TRANQUILA de España. Fondea en bahía, camina a Formentor. Silencio total. Meditación en barco.',

    faq: [
      {
        question: '¿Por qué tan poco turismo?',
        answer: 'Bahía pequeña, entrada única, fondeo limitado. Menos barcos = menos gente. Ventaja nuestra!'
      },
      {
        question: '¿Fondeo libre seguro?',
        answer: 'Muy seguro. Bahía semicerrada, protección 360°. Una de las más seguras Baleares.'
      },
      {
        question: '¿Llego a Formentor?',
        answer: 'A pie por sendero 2h ida/vuelta. En barco: navegas alrededor, no desembarco. Faro espectacular desde mar.'
      },
      {
        question: '¿Es muy caro?',
        answer: 'No, más barato que Palma/Alcúdia. Menos infraestructura = menos costo.'
      },
      {
        question: '¿Mejor para retiro/meditación?',
        answer: 'Sí. Silencio total, naturaleza pura. Perfecto desconexión. Lleva provisiones (tiendas lejanas).'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,pollenca,cove,mediterranean',
        alt: 'Barcos en la ensenada de Pollença'
      }
    }
  },

  // ===== COSTA BRAVA: SUB-LOCALIDADES =====
  tossa: {
    coast: 'Costa Brava',
    province: 'Girona',
    locality: 'Tossa de Mar',
    slug: 'tossa-de-mar',
    samboatUrl: '/alquiler-barco/tossa-de-mar',
    googleTrendsVolume: 32,
    description:
      'Costa Brava centro con 67 barcos desde €120/día. Pueblo amurallado medieval, calas pinares, fondeos seguros, belleza escénica.',

    beaches: [
      {
        name: 'Playa Mayor Tossa',
        distance: '2 min desde puerto',
        type: 'scenic',
        description: 'Playa junto muralla medieval'
      },
      {
        name: 'Cala Fustera',
        distance: '10 min sur',
        description: 'Cala pequeña de arenas, pinares'
      },
      {
        name: 'Platja d\'Or',
        distance: '15 min sur',
        type: 'exclusive',
        description: 'Cala dorada privada, snorkel bueno'
      },
      {
        name: 'Cala Giverola',
        distance: '25 min sur',
        description: 'Cala virgen, fondeo natural'
      },
      {
        name: 'Punta Llevant',
        distance: '30 min norte',
        type: 'scenic',
        description: 'Punta rocosa norte, vistas espectaculares'
      }
    ],

    moorings: [
      {
        name: 'Puerto Tossa',
        depth: 7,
        protection: 'high',
        description: 'Puerto pequeño pintoresco'
      },
      {
        name: 'Cala Fustera',
        depth: 10,
        protection: 'high',
        description: 'Arena fina, fondeo excelente'
      },
      {
        name: 'Platja d\'Or',
        depth: 12,
        protection: 'high',
        description: 'Fondeo arena, muy protegido'
      },
      {
        name: 'Cala Giverola',
        depth: 11,
        protection: 'high',
        description: 'Fondeo virgen, pinares alrededor'
      }
    ],

    pricing: {
      small: { min: 120, max: 190 },
      medium: { min: 200, max: 370 },
      captain: { min: 280, max: 460 }
    },

    regulations: [
      'Zona histórica: Muralla medieval protegida',
      'AMP: Fondeo <40m restringido',
      'Pesca vedada',
      'Temporada: Mayo-octubre ideal',
      'Equipo: GPS, comunicaciones, chaleco obligatorio'
    ],

    bestSeason: 'Junio-Septiembre (clima perfecto)',

    insiderTip:
      'Belleza medieval: Duerme en puerto Tossa, muralla iluminada de noche. Navega mañana a Cala Giverola, snorkel, regresa atardecer. Cena en pueblo amurallado.',

    faq: [
      {
        question: '¿Muralla observable desde barco?',
        answer: 'Espectacular. Iluminada noche. Fondea cerca, nada historias de Tossa (piratas medievales).'
      },
      {
        question: '¿Mejor Tossa vs Lloret?',
        answer: 'Tossa: pueblo histórico, fondeos seguros, menos multitud. Lloret: calas remotas, snorkel mejor.'
      },
      {
        question: '¿Snorkel en calas?',
        answer: 'Bueno en Platja d\'Or y Cala Giverola. No espectacular como Lloret pero muy lindo.'
      },
      {
        question: '¿Turismo en temporada?',
        answer: 'Sí, junio-agosto lleno. Pero pueblo bonito pese a ello. Mayo y septiembre ideales.'
      },
      {
        question: '¿Presupuesto recomendado?',
        answer: 'Pequeño barco <5.5m: €120-190/día. Suficiente para calas. Patrón si no tienes experiencia.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,tossa,cove,mediterranean',
        alt: 'Barco de vela en Tossa de Mar'
      }
    }
  },

  // ===== COSTA BRAVA: HUB =====
  'costa-brava': {
    coast: 'Costa Brava',
    province: 'Girona',
    locality: 'Costa Brava',
    slug: 'costa-brava',
    samboatUrl: '/alquiler-barco/costa-brava',
    googleTrendsVolume: 45,
    description:
      'Costa Brava completa: 400+ barcos desde €100/día. Acantilados espectaculares, calas remotas, snorkel premium, buceo avanzado.',

    beaches: [
      {
        name: 'Múltiples calas',
        distance: 'Variable por localidad',
        type: 'scenic',
        description: 'Cientos de playas vírgenes accesibles solo en barco'
      },
      {
        name: 'Punta Brava',
        distance: '20-60 min según base',
        type: 'snorkel',
        description: 'Snorkel clase mundial en toda la costa'
      },
      {
        name: 'Acantilados norte',
        distance: '40-80 min Lloret base',
        type: 'scenic',
        description: 'Formaciones géologicas espectaculares'
      },
      {
        name: 'Islas off-shore',
        distance: '60-120 min',
        type: 'adventure',
        description: 'Islas remotas, snorkel experto'
      },
      {
        name: 'Calas pinares',
        distance: '30-50 min',
        type: 'scenic',
        description: 'Pinares descienden a agua, paraíso'
      }
    ],

    moorings: [
      {
        name: 'Lloret Port',
        depth: 7,
        protection: 'high',
        description: 'Puerto base norte'
      },
      {
        name: 'Tossa Port',
        depth: 7,
        protection: 'high',
        description: 'Puerto base centro'
      },
      {
        name: 'Blanes',
        depth: 8,
        protection: 'high',
        description: 'Puerto sur, acceso fácil'
      },
      {
        name: 'Fondeos remotos',
        depth: 15,
        protection: 'medium',
        description: 'Cientos fondeos vírgenes registrados (profundidad variable 10-20m)'
      }
    ],

    pricing: {
      small: { min: 100, max: 180 },
      medium: { min: 180, max: 350 },
      captain: { min: 250, max: 450 }
    },

    regulations: [
      'AMP Montgrí-Medes: Múltiples zonas protegidas',
      'Fondeo <40m restringido en áreas específicas',
      'Pesca vedada en reservas',
      'Temporada: Mayo-octubre ideal',
      'Equipo: GPS obligatorio, cartas actualizadas, comunicaciones'
    ],

    bestSeason: 'Junio-Septiembre (clima 18-25°C)',

    insiderTip:
      'Ruta legendaria Costa Brava: 5 días Lloret → Tossa → Cala Giverola → Acantilados norte → Snorkel Punta Brava. Retorno atardecer. Experiencia de vida.',

    faq: [
      {
        question: '¿Dónde me quedo: Lloret o Tossa?',
        answer: 'Lloret: calas remotas norte, mejor snorkel. Tossa: pueblo histórico, fondeos seguros. Elige por vibe.'
      },
      {
        question: '¿Experiencia requerida?',
        answer: 'Con patrón: ninguna. Sin patrón: experiencia media+. Acantilados y corrientes requieren cuidado.'
      },
      {
        question: '¿Snorkel nivel?',
        answer: 'Principiante: Cala Giverola. Intermedio: Punta Brava. Experto: Islas remotas, buceo 20m+'
      },
      {
        question: '¿Cuántos días mínimo?',
        answer: '3 días: calas cercanas. 5 días: experiencia completa. 7 días: islas remotas.'
      },
      {
        question: '¿Es muy caro?',
        answer: 'No. Competitivo con Baleares. Barcos pequeños desde €100/día. Mejor relación calidad-precio Europa.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,costa-brava,cliffs,mediterranean',
        alt: 'Velero navegando entre acantilados de la Costa Brava'
      }
    }
  },

  // ===== COSTA BRAVA: LLORET =====
  'lloret-de-mar': {
    coast: 'Costa Brava',
    province: 'Girona',
    locality: 'Lloret de Mar',
    slug: 'lloret-de-mar',
    samboatUrl: '/alquiler-barco/lloret-de-mar',
    googleTrendsVolume: 38,
    description:
      'Costa Brava norte con 89 barcos desde €125/día. Calas remotas, snorkel clase mundial, acantilados espectaculares, fondeos vírgenes.',

    beaches: [
      {
        name: 'Playa Lloret',
        distance: '0 min desde puerto',
        type: 'urban',
        description: 'Playa urbana, puerto principal, servicios completos'
      },
      {
        name: 'Cala Banys',
        distance: '10 min norte',
        description: 'Cala rocosa pequeña, snorkel bueno, fondeo protegido'
      },
      {
        name: 'Cala Bona',
        distance: '15 min norte',
        type: 'scenic',
        description: 'Cala dorada, acantilados altos, vista espectacular'
      },
      {
        name: 'Cala Morisca',
        distance: '20 min norte',
        type: 'snorkel',
        description: 'Snorkel nivel intermedio, peces abundantes, fondeo natural'
      },
      {
        name: 'Calas del norte',
        distance: '30-50 min',
        type: 'remote',
        description: 'Calas vírgenes accesibles solo en barco, aventura pura'
      }
    ],

    moorings: [
      {
        name: 'Puerto Lloret',
        depth: 6,
        protection: 'high',
        description: 'Puerto principal, servicios premium'
      },
      {
        name: 'Cala Banys',
        depth: 9,
        protection: 'high',
        description: 'Fondeo rocoso, protección excelente'
      },
      {
        name: 'Cala Bona',
        depth: 11,
        protection: 'high',
        description: 'Arena y roca, vistas acantilado'
      },
      {
        name: 'Cala Morisca',
        depth: 10,
        protection: 'high',
        description: 'Fondeo natural, snorkel integrado'
      }
    ],

    pricing: {
      small: { min: 125, max: 200 },
      medium: { min: 210, max: 380 },
      captain: { min: 290, max: 480 }
    },

    regulations: [
      'AMP Montgrí-Medes: Fondeo <40m restringido',
      'Pesca vedada en reservas',
      'Zona histórica: Patrimonio protegido',
      'Temporada: Mayo-octubre ideal',
      'Equipo: GPS obligatorio, cartas actualizadas'
    ],

    bestSeason: 'Junio-Septiembre (clima 20-26°C)',

    insiderTip:
      'Snorkel épico: Puerto → Cala Morisca (snorkel intermedio) → Calas norte (aventura) → Retorno atardecer. 5 días = experiencia Costa Brava completa.',

    faq: [
      {
        question: '¿Mejor Lloret que Tossa?',
        answer: 'Lloret: calas remotas norte, snorkel mejor. Tossa: pueblo medieval, menos aventura. Elige por actividad.'
      },
      {
        question: '¿Snorkel para principiantes?',
        answer: 'Cala Banys sí. Cala Morisca intermedio. Calas norte experto. Opción patrón recomendada.'
      },
      {
        question: '¿Acantilados peligrosos?',
        answer: 'No en fondeos designados. Respeta distancia a rocas. Patrón local conoce spots seguros.'
      },
      {
        question: '¿Cuántos días mínimo?',
        answer: '3 días: calas cercanas. 5+ días: experiencia remota completa. Cada día = nueva cala.'
      },
      {
        question: '¿Es muy caro?',
        answer: 'Competitivo. €125/día barcos pequeños. Similar Costa Blanca, mejor snorkel.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?yacht,lloret,snorkel,turquoise',
        alt: 'Yate anclado en una cala remota de Lloret de Mar'
      }
    }
  },

  // ===== ISLAS CANARIAS: TENERIFE =====
  tenerife: {
    coast: 'Islas Canarias',
    province: 'Tenerife',
    locality: 'Tenerife',
    slug: 'tenerife',
    samboatUrl: '/alquiler-barco/tenerife',
    googleTrendsVolume: 45,
    description:
      'Mayor isla Canarias con 156 barcos desde €130/día. Vistas Teide, calas volcánicas, fondeos en bahías protegidas, aguas cálidas todo año.',

    beaches: [
      {
        name: 'Playa de Las Américas',
        distance: '10 min sur',
        type: 'resort',
        description: 'Playa turística sur, aguas calmadas, servicios excelentes'
      },
      {
        name: 'Cala del Infierno',
        distance: '15 min norte',
        type: 'volcanic',
        description: 'Cala volcánica negra, geología única, snorkel especial'
      },
      {
        name: 'Bahía de San Juan',
        distance: '20 min norte',
        description: 'Bahía histórica protegida, fondeo natural seguro'
      },
      {
        name: 'Cala Negra Anaga',
        distance: '40 min noreste',
        type: 'remote',
        description: 'Cala remota norte, acantilados espectaculares, poco turismo'
      },
      {
        name: 'Los Silos',
        distance: '50 min noroeste',
        description: 'Pueblo costero tranquilo, fondeo tranquilo, Teide vista'
      }
    ],

    moorings: [
      {
        name: 'Puerto Las Américas',
        depth: 10,
        protection: 'high',
        description: 'Marina moderna, servicios 5 estrellas'
      },
      {
        name: 'Cala del Infierno',
        depth: 12,
        protection: 'medium',
        description: 'Fondeo rocoso, vista Teide espectacular'
      },
      {
        name: 'Bahía San Juan',
        depth: 8,
        protection: 'high',
        description: 'Fondeo protegido, Historia pirata'
      },
      {
        name: 'Anaga Bay',
        depth: 14,
        protection: 'medium',
        description: 'Fondeo remoto, naturaleza pura'
      }
    ],

    pricing: {
      small: { min: 130, max: 210 },
      medium: { min: 220, max: 400 },
      captain: { min: 310, max: 520 }
    },

    regulations: [
      'Zona marina protegida norte',
      'Pesca limitada en fondeos',
      'Puerto Las Américas: Tráfico comercial intenso',
      'Temporada: Todo el año (clima 18-28°C)',
      'Equipo: GPS recomendado, comunicaciones'
    ],

    bestSeason: 'Octubre-Mayo (clima perfecto 20-25°C, viento ligero)',

    insiderTip:
      'Canarias unique: Cala Infierno (volcánica) → Bahía San Juan (piratería histórica) → Teide vista desde mar (único en Europa). Anaga remotos para aventureros.',

    faq: [
      {
        question: '¿Vejo Teide desde el barco?',
        answer: 'Sí. Especialmente norte (Anaga). Foto épica: volcán + barco. Mejor madrugada.'
      },
      {
        question: '¿Mejor Tenerife vs Baleares?',
        answer: 'Tenerife: clima todo año, volcánico único. Baleares: calas más remotas. Elige por clima/aventura.'
      },
      {
        question: '¿Aguas cálidas?',
        answer: 'Sí. 18-28°C según mes. Invierno: 18-20°C (neopreno). Verano: 25-28°C (sin).'
      },
      {
        question: '¿Snorkel en calas volcánicas?',
        answer: 'Bueno en Cala Infierno. Geología única. Peces especiales aguas Canarias.'
      },
      {
        question: '¿Sin licencia es seguro?',
        answer: 'Sí. Fondeos bahías protegidas. Patrón recomendado norte (corrientes, viento).'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?sailboat,tenerife,volcano,ocean',
        alt: 'Velero navegando en Tenerife con vista del Teide'
      }
    }
  },

  // ===== ANDALUSIA: MÁLAGA =====
  malaga: {
    coast: 'Costa del Sol',
    province: 'Málaga',
    locality: 'Málaga',
    slug: 'malaga',
    samboatUrl: '/alquiler-barco/malaga',
    googleTrendsVolume: 42,
    description:
      'Puerta Costa del Sol con 234 barcos desde €110/día. Calas mediterráneas, Marbella cercano, fondeos protegidos, clima subtropical.',

    beaches: [
      {
        name: 'Playa de Málaga',
        distance: '0 min puerto',
        type: 'urban',
        description: 'Playa urbana centro ciudad, servicios excelentes'
      },
      {
        name: 'Cala Moral',
        distance: '15 min oeste',
        description: 'Cala pequeña tranquila, montaña vista'
      },
      {
        name: 'Playa El Pino',
        distance: '20 min oeste',
        type: 'family',
        description: 'Playa ancha arenosa, aguas calmadas, familias'
      },
      {
        name: 'Marbella (cercano)',
        distance: '35 min oeste',
        description: 'Resort famoso, playas de lujo, fondeos premium'
      },
      {
        name: 'Calas Mijas',
        distance: '40 min oeste',
        type: 'scenic',
        description: 'Calas rocosas pinares, snorkel bueno'
      }
    ],

    moorings: [
      {
        name: 'Puerto Málaga',
        depth: 8,
        protection: 'high',
        description: 'Marina ciudad, servicios completos'
      },
      {
        name: 'Cala Moral Bay',
        depth: 7,
        protection: 'high',
        description: 'Fondeo protegido, vistas montaña'
      },
      {
        name: 'El Pino Beach',
        depth: 9,
        protection: 'high',
        description: 'Arena, familias, muy seguro'
      },
      {
        name: 'Marbella Marina',
        depth: 10,
        protection: 'high',
        description: 'Lujo marino, servicios premium'
      }
    ],

    pricing: {
      small: { min: 110, max: 180 },
      medium: { min: 190, max: 340 },
      captain: { min: 270, max: 440 }
    },

    regulations: [
      'Puerto Málaga: Tráfico portuario activo',
      'Zonas protegidas parciales costa',
      'Pesca recreativa permitida',
      'Temporada: Todo el año',
      'Equipo: GPS, comunicaciones recomendadas'
    ],

    bestSeason: 'Marzo-Noviembre (clima 16-28°C)',

    insiderTip:
      'Costa del Sol completa: Málaga puerto (base) → Calas oeste mañana → Marbella tarde (lujo) → Fondeos calas retorno. Clima subtropical = navegación todo año.',

    faq: [
      {
        question: '¿Málaga puerto vs Marbella?',
        answer: 'Málaga: ciudad viva, servicios. Marbella: playas lujo, fondeos premium. Ambas vale pena, 35min distancia.'
      },
      {
        question: '¿Snorkel bueno?',
        answer: 'Decente. Calas Mijas mejor. Nada comparado Baleares/Costa Brava, pero agradable.'
      },
      {
        question: '¿Clima en invierno?',
        answer: '16-18°C. Navegable pero frío. Primavera-otoño ideal. Verano: 27-30°C perfecto.'
      },
      {
        question: '¿Fondeos libres o marina?',
        answer: 'Ambas. Marina si quieres servicios. Calas = fondeo libre. Flexible.'
      },
      {
        question: '¿Patrón recomendado?',
        answer: 'Opcional. Puertos bien señalizados. Pero tráfico comercial = patrón seguro.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?catamaran,malaga,mediterranean,beach',
        alt: 'Catamarán navegando en la Costa del Sol near Málaga'
      }
    }
  },

  // ===== ANDALUSIA: MARBELLA =====
  marbella: {
    coast: 'Costa del Sol',
    province: 'Málaga',
    locality: 'Marbella',
    slug: 'marbella',
    samboatUrl: '/alquiler-barco/marbella',
    googleTrendsVolume: 38,
    description:
      'Resort de lujo Costa del Sol con 156 barcos desde €120/día. Playas exclusivas, fondeos premium, calas rocosas, ambiente sofisticado.',

    beaches: [
      {
        name: 'Playa Marbella Centro',
        distance: '2 min puerto',
        type: 'luxury',
        description: 'Playa urbana lujo, paseo marítimo famoso'
      },
      {
        name: 'Cala de las Barcas',
        distance: '10 min norte',
        type: 'exclusive',
        description: 'Cala privada rocosa, snorkel nivel'
      },
      {
        name: 'Playa Puerto Banús',
        distance: '15 min norte',
        type: 'resort',
        description: 'Puerto de superyates, ambiente super premium'
      },
      {
        name: 'Cala Verde',
        distance: '25 min norte',
        type: 'scenic',
        description: 'Cala pinares rocosa, privacidad, fondeo natural'
      },
      {
        name: 'Calas Estepona',
        distance: '40 min oeste',
        description: 'Calas remotas oeste, menos lujo, más naturaleza'
      }
    ],

    moorings: [
      {
        name: 'Puerto Marbella',
        depth: 8,
        protection: 'high',
        description: 'Marina lujo, servicios 5 estrellas'
      },
      {
        name: 'Puerto Banús',
        depth: 10,
        protection: 'high',
        description: 'Superyates, prestigio máximo'
      },
      {
        name: 'Cala Verde',
        depth: 12,
        protection: 'high',
        description: 'Fondeo rocoso privado'
      },
      {
        name: 'Estepona Bay',
        depth: 9,
        protection: 'medium',
        description: 'Fondeo natural, menos turismo'
      }
    ],

    pricing: {
      small: { min: 120, max: 200 },
      medium: { min: 210, max: 380 },
      captain: { min: 290, max: 480 }
    },

    regulations: [
      'Puerto Banús: Protocolo lujo, seguridad alta',
      'Zona protegida parcial',
      'Pesca recreativa permitida',
      'Temporada: Todo el año',
      'Equipo: GPS, VHF, protocolo premium'
    ],

    bestSeason: 'Abril-Octubre (clima 18-28°C)',

    insiderTip:
      'Experiencia lujo: Amarre Puerto Banús (superyates) → Navegación Cala Verde (privacidad) → Snorkel calas norte → Cena Puerto Banús atardecer. Glamour Mediterranean.',

    faq: [
      {
        question: '¿Puerto Banús es obligatorio?',
        answer: 'No. Opción. Marino espectacular pero caro. Cala Verde: similar privacidad, 50% menos precio.'
      },
      {
        question: '¿Muy caro?',
        answer: 'Lujo tiene precio. Pero calas naturales = fondeo libre. Mix presupuesto posible.'
      },
      {
        question: '¿Snorkel bueno?',
        answer: 'Aceptable. Calas rocosas. Nada épico, pero bonito.'
      },
      {
        question: '¿Menos turismo que Málaga?',
        answer: 'Puerto: igual lujo. Calas: sí, más privacidad. Estepona oeste: mucho menos turismo.'
      },
      {
        question: '¿Experiencia global?',
        answer: 'Premium. Si buscas lujo + mar bonito + fondeos seguros. Presupuesto alto.'
      }
    ],

    images: {
      hero: {
        unsplashUrl: 'https://source.unsplash.com/1200x600/?yacht,marbella,luxury,mediterranean',
        alt: 'Yate de lujo en Marbella, Costa del Sol'
      }
    }
  }
}

// Helper: Get locality by slug
export const getLocalityBySlug = (slug: string): BoatRentalLocality | undefined => {
  return BOAT_RENTAL_LOCALITIES[slug]
}

// Helper: Get all localities
export const getAllLocalities = (): BoatRentalLocality[] => {
  return Object.values(BOAT_RENTAL_LOCALITIES)
}

// Helper: Get all localities by coast
export const getLocalitiesByCoast = (coast: string): BoatRentalLocality[] => {
  return Object.values(BOAT_RENTAL_LOCALITIES).filter(loc => loc.coast === coast)
}

// Helper: Get all localities by province
export const getLocalitiesByProvince = (province: string): BoatRentalLocality[] => {
  return Object.values(BOAT_RENTAL_LOCALITIES).filter(loc => loc.province === province)
}

// Helper: Get coast from locality slug
export const getCoastFromLocality = (slug: string): string | undefined => {
  const locality = getLocalityBySlug(slug)
  return locality?.coast
}

// Helper: SamBoat Awin URL generator
export const samboatAwinUrl = (
  affId: string,
  samboatPath: string,
  clickref?: string
): string => {
  const params = new URLSearchParams({
    awinmid: '32683',
    awinaffid: affId,
    clickref: clickref || 'playasdeespana',
    ued: `https://www.samboat.es${samboatPath}`
  })
  return `https://www.awin1.com/cread.php?${params.toString()}`
}
