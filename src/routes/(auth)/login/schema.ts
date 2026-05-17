import { z } from '$lib/z'

const studentIdRegex = /^[a-z]?\d{8}$/
const emailRegex = /^[a-z]+\.[a-z]?\d{8}@itsmotul\.edu\.mx$/

export const loginSchema = z
  .object({
    identifier: z.string().trim(),
    password: z.string().min(1, 'La contraseña es requerida.'),
  })
  .superRefine((val, ctx) => {
    const isEmail = val.identifier.includes('@')

    if (!isEmail && !z.string().regex(studentIdRegex).safeParse(val.identifier).success) {
      ctx.addIssue({
        code: 'custom',
        input: val.identifier,
        message: 'Tu usuario deben ser 8 o 9 digitos (Matrícula).',
        path: ['identifier'],
      })
    }

    if (isEmail && !z.email().regex(emailRegex).safeParse(val.identifier).success) {
      ctx.addIssue({
        code: 'invalid_format',
        format: 'email',
        input: val.identifier,
        message:
          'El correo electrónico debe seguir el formato institucional: nombre.matricula@itsmotul.edu.mx.',
        path: ['identifier'],
      })
    }
  })

export type LoginSchema = typeof loginSchema
