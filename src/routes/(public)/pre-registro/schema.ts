import { preRegistrations } from '$lib/schema/pre-registrations'
import { createInsertSchema, z } from '$lib/z'

export const emailRegex = /^[^.]+\.(\d{8})@itsmotul\.edu\.mx$/
export const genders = ['masculino', 'femenino', 'otro', 'prefiero no decirlo'] as const

export const dropdownEnum = <T extends z.ZodEnum>(
  zodEnum: T,
  errorMessage = 'Por favor selecciona una opción válida',
) =>
  zodEnum
    .or(z.literal(''))
    .transform((val, ctx) => {
      if (val === '') {
        ctx.addIssue({
          code: 'invalid_value',
          input: val,
          message: errorMessage,
          values: zodEnum.options,
        })

        return z.NEVER
      }

      return val
    })
    .default('' as never)

const baseSchema = createInsertSchema(preRegistrations, {
  email: z
    .email()
    .regex(emailRegex, 'El correo debe seguir el formato: nombre.matrícula@itsmotul.edu.mx'),
  engineering: (schema) => dropdownEnum(schema, 'Por favor, selecciona tu carrera.'),
  group: (schema) => dropdownEnum(schema, 'Por favor, selecciona el grupo al que perteneces.'),
  name: (schema) => schema.trim().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  semester: (schema) =>
    schema
      .positive()
      .min(1, 'El semestre debe ser al menos 1.')
      .max(12, 'El semestre no puede ser mayor a 12.')
      .default('' as never),
  shirtSize: (schema) => dropdownEnum(schema, 'Por favor, selecciona tu talla de playera o blusa.'),
}).omit({
  createdAt: true,
  status: true,
  studentId: true,
  updatedAt: true,
  verifiedAt: true,
  verifiedBy: true,
})

export const newPreRegistrationSchema = baseSchema.extend({
  acceptPreregistration: z
    .boolean()
    .default(false)
    .refine((val) => val, {
      error: 'Debes aceptar el prerregistro para continuar.',
    }),
  acceptTerms: z
    .boolean()
    .default(false)
    .refine((val) => val, {
      error: 'Debes aceptar los términos y condiciones.',
    }),
})

export type NewPreRegistration = z.input<NewPreRegistrationSchema>
export type NewPreRegistrationSchema = typeof newPreRegistrationSchema
