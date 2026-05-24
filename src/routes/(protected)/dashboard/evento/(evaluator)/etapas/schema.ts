import { z } from 'zod'

export const resultSchema = z.enum(['pass', 'fail', 'pending'])
const resultWithoutPendingSchema = resultSchema.exclude(['pending'])

export const gradeStageSchema = z.object({
  projectId: z.number().int().positive('El proyecto es inválido'),
  result: resultWithoutPendingSchema,
  stageId: z.number().int().positive('La etapa es inválida'),
})

export const resultToVerdict = (result: z.infer<typeof resultWithoutPendingSchema>): boolean =>
  result === 'pass'
export const verdictToResult = (verdict: boolean | null): string =>
  verdict === null ? 'Aún no calificado' : verdict ? 'Aprobado' : 'No aprobado'

export type GradeStageSchema = typeof gradeStageSchema

const commentContentField = z
  .string()
  .min(1, 'El comentario no puede estar vacío')
  .max(1000, 'El comentario no puede superar los 1000 caracteres')

export const addCommentSchema = z.object({
  content: commentContentField,
  projectId: z.number().int().positive(),
  stageId: z.number().int().positive(),
})

export const editCommentSchema = z.object({
  commentId: z.number().int().positive(),
  content: commentContentField,
})

export const deleteCommentSchema = z.object({
  commentId: z.number().int().positive(),
})

export type AddCommentSchema = typeof addCommentSchema
export type DeleteCommentSchema = typeof deleteCommentSchema
export type EditCommentSchema = typeof editCommentSchema
