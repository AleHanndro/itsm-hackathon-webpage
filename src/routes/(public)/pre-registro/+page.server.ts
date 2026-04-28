import { preRegistrations } from '$lib/schema/pre-registrations'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { fail } from '@sveltejs/kit'
import { message, setError, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { emailRegex, newPreRegistrationSchema } from './schema'

export const prerender = false

export const load = (async () => {
  return {
    form: await superValidate(zod4(newPreRegistrationSchema)),
  }
}) satisfies PageServerLoad

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(newPreRegistrationSchema))

    if (!form.valid) return fail(400, { form })

    const match = emailRegex.exec(form.data.email)
    const studentId = match ? match[1] : null

    if (!studentId) {
      return setError(
        form,
        'email',
        'No se pudo extraer tu matrícula de tu correo. Asegúrate de que tu correo institucional sea correcto y vuelve a intentarlo.',
      )
    }

    const { error } = await dbTry(() =>
      db.insert(preRegistrations).values({ ...form.data, studentId }),
    )

    if (error) {
      switch (error.kind) {
        case 'unique_violation':
          if (error.constraint.includes('email') || error.constraint.includes('student_id'))
            return setError(form, 'email', 'Este correo ya ha sido registrado anteriormente.')
          return setError(form, '', 'Ya has realizado un prerregistro anteriormente.')

        case 'unknown':
          console.error('[Db]', error.cause)
          return fail(500, { form })
      }
    }

    return message(form, 'Nos pondremos en contacto contigo pronto.')
  },
} satisfies Actions
