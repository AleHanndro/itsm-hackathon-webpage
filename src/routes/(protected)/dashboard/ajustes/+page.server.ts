import { auth } from '$lib/server/auth'
import { isAPIError } from 'better-auth/api'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { changePasswordSchema } from './schema'

export const load = (async () => {
  return { form: await superValidate(zod4(changePasswordSchema)) }
}) satisfies PageServerLoad

export const actions = {
  changePassword: async ({ request }) => {
    const form = await superValidate(request, zod4(changePasswordSchema))
    if (!form.valid) return fail(400, { form })

    try {
      const { currentPassword, newPassword } = form.data
      await auth.api.changePassword({
        body: { currentPassword, newPassword },
        headers: request.headers,
      })
    } catch (err: unknown) {
      if (isAPIError(err) && err.body?.code) {
        const { code } = err.body

        if (code === 'INVALID_PASSWORD') {
          return setError(
            form,
            'currentPassword',
            'La contraseña actual es incorrecta. Por favor, verifica la contraseña y vuelve a intentarlo.',
            { status: 400 },
          )
        }
      }

      console.error('[changePassword]', err)
      return message(
        form,
        { text: 'Error al actualizar la contraseña.', type: 'error' },
        { status: 500 },
      )
    }

    return message(form, { text: 'Contraseña actualizada exitosamente.', type: 'success' })
  },
} satisfies Actions
