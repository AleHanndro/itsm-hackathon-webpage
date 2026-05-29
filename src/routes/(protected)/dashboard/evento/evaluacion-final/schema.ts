import { z } from '$lib/z'

export interface RubricCriterion {
  id: string
  maxScore: number
  name: string
  tiers: RubricTier[]
  weight: number
}

export interface RubricTier {
  description: string
  label: string
  range: [number, number]
}

export const requirementsList: RubricCriterion[] = [
  {
    id: 'creatividad',
    maxScore: 25,
    name: 'Creatividad e Innovación',
    tiers: [
      {
        description:
          'La solución es altamente creativa, rompe esquemas y aborda el problema desde una perspectiva única y sorprendente.',
        label: 'Excelente',
        range: [21, 25],
      },
      {
        description:
          'La propuesta es buena y creativa, pero se parece a soluciones existentes o es una evolución predecible de algo que ya existe.',
        label: 'Bueno',
        range: [13, 20],
      },
      {
        description:
          'La idea es muy básica o común; replica soluciones del mercado con cambios mínimos.',
        label: 'En Desarrollo',
        range: [6, 12],
      },
      {
        description:
          'No hay innovación. Es una idea genérica que no aporta valor nuevo al reto planteado.',
        label: 'Insatisfactorio',
        range: [0, 5],
      },
    ],
    weight: 25,
  },
  {
    id: 'prototipado',
    maxScore: 25,
    name: 'Grado de Desarrollo y Prototipado (MVP)',
    tiers: [
      {
        description:
          'Lograron construir un MVP funcional (código ejecutable, hardware operando o interfaz interactiva de alta fidelidad) que demuestra el flujo principal.',
        label: 'Excelente',
        range: [21, 25],
      },
      {
        description:
          'El prototipo es visualmente claro y muestra la idea, pero varias funciones clave están simuladas (hardcoded) o son maquetas estáticas.',
        label: 'Bueno',
        range: [13, 20],
      },
      {
        description:
          'El prototipo es muy preliminar (bocetos sueltos, wireframes básicos) y no logra demostrar cómo funcionaría la solución real.',
        label: 'En Desarrollo',
        range: [6, 12],
      },
      {
        description:
          'No presentan prototipo, solo diapositivas. No hubo desarrollo tangible durante el hackathon.',
        label: 'Insatisfactorio',
        range: [0, 5],
      },
    ],
    weight: 25,
  },
  {
    id: 'viabilidad',
    maxScore: 20,
    name: 'Viabilidad Técnica y Arquitectura',
    tiers: [
      {
        description:
          'Uso inteligente de tecnologías, APIs o frameworks. La arquitectura planteada es sólida, realista y lista para escalar a producción.',
        label: 'Excelente',
        range: [16, 20],
      },
      {
        description:
          'La solución funciona, pero la estructura técnica es frágil ("atada con alambres") o depende de soluciones poco óptimas a largo plazo.',
        label: 'Bueno',
        range: [10, 15],
      },
      {
        description:
          'El planteamiento técnico es confuso, sobredimensionado o utiliza herramientas inadecuadas para el problema.',
        label: 'En Desarrollo',
        range: [5, 9],
      },
      {
        description:
          'La propuesta técnica es inviable, rompe leyes básicas de seguridad/privacidad o es técnicamente imposible de realizar.',
        label: 'Insatisfactorio',
        range: [0, 4],
      },
    ],
    weight: 20,
  },
  {
    id: 'negocio',
    maxScore: 15,
    name: 'Modelo de Negocio y Potencial de Mercado',
    tiers: [
      {
        description:
          'Identifican claramente al usuario final y proponen un modelo de monetización lógico, viable y con potencial de escalar.',
        label: 'Excelente',
        range: [11, 15],
      },
      {
        description:
          'El mercado objetivo está claro, pero la estrategia para generar ingresos o mantener el proyecto a flote es débil o vaga.',
        label: 'Bueno',
        range: [7, 10],
      },
      {
        description:
          'El modelo es demasiado idealista (ej. "depender solo de donaciones") o no se entiende quién pagaría por la solución.',
        label: 'En Desarrollo',
        range: [4, 6],
      },
      {
        description: 'No se menciona cómo se sostendrá el proyecto ni a quién va dirigido.',
        label: 'Insatisfactorio',
        range: [0, 3],
      },
    ],
    weight: 15,
  },
  {
    id: 'pitch',
    maxScore: 15,
    name: 'Pitch y Demo',
    tiers: [
      {
        description:
          'Presentación de alto impacto. Explican el problema con pasión, la demo en vivo funciona perfectamente y dominan el tiempo límite.',
        label: 'Excelente',
        range: [11, 15],
      },
      {
        description:
          'Explicación clara y buena demo, pero el equipo se puso nervioso, le faltó dinamismo o el tiempo les quedó muy justo.',
        label: 'Bueno',
        range: [7, 10],
      },
      {
        description:
          'El pitch fue confuso o se centraron tanto en el código que olvidaron explicar el problema. La demo falló o no se entendió.',
        label: 'En Desarrollo',
        range: [4, 6],
      },
      {
        description:
          'Excedieron el tiempo por mucho, no mostraron la demo o la presentación fue completamente desorganizada.',
        label: 'Insatisfactorio',
        range: [0, 3],
      },
    ],
    weight: 15,
  },
] as const

/** Dynamically builds the Zod schema from the rubric definition. */
const criteriaFields = Object.fromEntries(
  requirementsList.map((req) => [
    req.id,
    z.coerce
      .number()
      .int()
      .min(0, 'Mínimo 0')
      .max(req.maxScore, `Máximo ${req.maxScore}`)
      .default(0),
  ]),
)

export const finalEvaluationSchema = z
  .object({
    projectId: z.string().min(1, 'Debes seleccionar un proyecto'),
    ...criteriaFields,
  })
  .catchall(z.any())
