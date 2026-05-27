import { allRoles, type Roles } from '$lib/permissions'
import { z } from '$lib/z'

const roleEnumValues = Object.keys(allRoles) as [Roles, ...Roles[]]

export const createUserSchema = z.object({
  displayUsername: z.string().min(1),
  email: z.email('Correo electrónico inválido.'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  role: z.enum(roleEnumValues, {
    error: 'Rol inválido.',
  }),
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido.')
    .max(16, 'El nombre de usuario no puede superar 16 caracteres.'),
})

export const setRoleSchema = z.object({
  role: z.enum(roleEnumValues, {
    error: 'Rol inválido.',
  }),
  userId: z.string().min(1),
})

export const setPasswordSchema = z.object({
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  userId: z.string().min(1),
})

export type CreateUserSchema = typeof createUserSchema
export type SetPasswordSchema = typeof setPasswordSchema
export type SetRoleSchema = typeof setRoleSchema
