import { z } from 'zod'

export const gradeStageSchema = z.object({
  projectId: z.number().int().positive('El proyecto es inválido'),
  score: z
    .number()
    .int('La calificación debe ser un número entero')
    .min(0, 'La calificación mínima es 0')
    .max(100, 'La calificación máxima es 100'),
  stageId: z.number().int().positive('La etapa es inválida'),
})

export type GradeStageSchema = typeof gradeStageSchema
