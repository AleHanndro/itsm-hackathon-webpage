import { allRoles, type Roles } from '$lib/permissions'
import { z } from '$lib/z'

const roleEnumValues = Object.keys(allRoles) as [Roles, ...Roles[]]

export const createUserSchema = z.object({
  email: z.email('Correo electrónico inválido.'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  role: z.enum(['user', 'staff', 'admin', 'evaluator'], {
    error: 'Rol inválido.',
  }),
})

export const setRoleSchema = z.object({
  role: z.enum(roleEnumValues, {
    error: 'Rol inválido.',
  }),
  userId: z.string().min(1),
})

export type CreateUserSchema = typeof createUserSchema
export type SetRoleSchema = typeof setRoleSchema
