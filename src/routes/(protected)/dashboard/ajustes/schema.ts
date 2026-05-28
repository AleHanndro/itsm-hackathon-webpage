import { z } from '$lib/z'

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .max(32, 'La contraseña no puede tener más de 32 caracteres (¿Podrás memorizarte todo esto?).')

export const changePasswordSchema = z
  .object({
    confirmNewPassword: passwordSchema,
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: 'Las contraseñas no coinciden.',
    path: ['confirmNewPassword'],
  })

export type ChangePasswordSchema = typeof changePasswordSchema
