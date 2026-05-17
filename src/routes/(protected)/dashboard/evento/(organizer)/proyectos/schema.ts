import { projects } from '$lib/schema/projects'
import { z } from '$lib/z'

export const createProjectSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(3, 'El nombre del proyecto debe tener al menos 3 caracteres'),
  teamId: z.coerce.number().int().optional().nullable(),
})

export const updateProjectSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(3, 'El nombre del proyecto debe tener al menos 3 caracteres'),
  projectId: z.coerce.number().int(),
  teamId: z.coerce.number().int().optional().nullable(),
})

export const deleteProjectSchema = z.object({
  projectId: z.coerce.number().int(),
})

export type CreateProjectSchema = typeof createProjectSchema
export type DeleteProjectSchema = typeof deleteProjectSchema
export type Project = typeof projects.$inferSelect

export type ProjectWithTeam = Project & {
  team: null | { id: number; name: string }
}
export type UpdateProjectSchema = typeof updateProjectSchema
