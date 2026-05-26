import { z } from 'zod'

export const assignEvaluatorSchema = z.object({
  canEvaluateFinal: z.boolean().default(false),
  stageId: z.coerce.number().int().positive(),
  userId: z.string().min(1),
})

export const removeEvaluatorSchema = z.object({
  stageId: z.coerce.number().int().positive(),
  userId: z.string().min(1),
})

export const updateFinalEvalSchema = z.object({
  canEvaluateFinal: z
    .string()
    .transform((v) => v === 'true')
    .or(z.boolean()),
  stageId: z.coerce.number().int().positive(),
  userId: z.string().min(1),
})

export type AssignEvaluatorSchema = typeof assignEvaluatorSchema
export interface Member {
  email: string
  id: string
  name: null | string
}

export type RemoveEvaluatorSchema = typeof removeEvaluatorSchema
export type UpdateFinalEvalSchema = typeof updateFinalEvalSchema
