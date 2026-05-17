import { z } from 'zod'

export const assignEvaluatorSchema = z.object({
  stageId: z.number().int().positive(),
  userId: z.string().min(1),
})

export const removeEvaluatorSchema = z.object({
  stageId: z.number().int().positive(),
  userId: z.string().min(1),
})

export type AssignEvaluatorSchema = typeof assignEvaluatorSchema
export interface Member {
  email: string
  id: string
  name: null | string
}

export type RemoveEvaluatorSchema = typeof removeEvaluatorSchema
