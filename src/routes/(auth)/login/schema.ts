import { z } from '$lib/z'

export const loginSchema = z.object({
  email: z
    .email('Debe ser un correo válido')
    .toLowerCase()
    .regex(
      /^[a-z]+\.[a-z]?[0-9]{8}@itsmotul\.edu\.mx$/,
      'El correo debe tener el formato nombre.matricula@itsmotul.edu.mx',
    ),
  password: z.string().min(1, 'La contraseña es requerida.'),
})

export type LoginSchema = typeof loginSchema
