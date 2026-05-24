import { z } from '$lib/z'

export const requirementsList = [
  { id: 'req_1', name: 'Innovación y Creatividad', weight: 25 },
  { id: 'req_2', name: 'Viabilidad Técnica', weight: 25 },
  { id: 'req_3', name: 'Impacto y Relevancia', weight: 25 },
  { id: 'req_4', name: 'Calidad de la Presentación', weight: 25 },
] as const

const scoreField = z.coerce.number().min(0, 'Mínimo 0').max(100, 'Máximo 100').default(0)

export const finalEvaluationSchema = z.object({
  projectId: z.string().min(1, 'Debes seleccionar un proyecto'),
  req_1: scoreField,
  req_2: scoreField,
  req_3: scoreField,
  req_4: scoreField,
})
