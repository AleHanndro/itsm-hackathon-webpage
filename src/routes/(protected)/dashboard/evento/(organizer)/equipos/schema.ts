import { users } from '$lib/schema/auth'
import { teams } from '$lib/schema/teams'
import { z } from '$lib/z'

export const createTeamSchema = z.object({
  leadMemberId: z.string().min(1, 'Debes seleccionar un usuario de la lista'),
  name: z.string().min(3, 'El nombre del equipo debe tener al menos 3 caracteres'),
})

export const addMemberSchema = z.object({
  teamId: z.coerce.number().int(),
  userId: z.string().min(1, 'Debes seleccionar un usuario de la lista'),
})

export const renameTeamSchema = z.object({
  name: z.string().min(3, 'El nombre del equipo debe tener al menos 3 caracteres'),
  teamId: z.coerce.number().int(),
})

export const deleteTeamSchema = z.object({
  teamId: z.coerce.number().int(),
})

export const removeMemberSchema = z.object({
  teamId: z.coerce.number().int(),
  userId: z.string(),
})

export type AddMemberSchema = typeof addMemberSchema
export type CreateTeamSchema = typeof createTeamSchema
export type DeleteTeamSchema = typeof deleteTeamSchema
export type Member = Pick<typeof users.$inferSelect, 'email' | 'id' | 'name'>
export type RemoveMemberSchema = typeof removeMemberSchema
export type RenameTeamSchema = typeof renameTeamSchema
export type Team = Omit<typeof teams.$inferSelect, 'createdAt' | 'updatedAt'>
export type TeamWithMembers = Team & {
  members: { user: Member }[]
}
