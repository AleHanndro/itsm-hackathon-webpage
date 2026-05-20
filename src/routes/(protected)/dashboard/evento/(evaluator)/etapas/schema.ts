import { z } from 'zod'

export const gradeStageSchema = z.object({
  projectId: z.number().int().positive('El proyecto es inválido'),
  stageId: z.number().int().positive('La etapa es inválida'),
})

export type GradeStageSchema = typeof gradeStageSchema
