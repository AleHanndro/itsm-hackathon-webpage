import type { Pathname } from '$app/types'

import { auth } from '$lib/server/auth'
import { getDashboardRoute } from '$lib/server/utils'
import { fail, redirect } from '@sveltejs/kit'
import { isAPIError } from 'better-auth/api'
import { message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { loginSchema } from './schema'

export const load = (async ({ locals }) => {
  if (locals.user?.role) return redirect(302, getDashboardRoute())

  return { form: await superValidate(zod4(loginSchema)) }
}) satisfies PageServerLoad

export const actions = {
  signIn: async ({ request }) => {
    const form = await superValidate(request, zod4(loginSchema))

    if (!form.valid) {
      console.error({ form })
      return fail(400, { form })
    }

    const isEmail = form.data.identifier.includes('@')

    try {
      if (isEmail) {
        await auth.api.signInEmail({
          body: { email: form.data.identifier, password: form.data.password },
        })
      } else {
        await auth.api.signInUsername({
          body: { password: form.data.password, username: form.data.identifier },
        })
      }
    } catch (err: unknown) {
      if (isAPIError(err)) {
        if (err.status === 'UNAUTHORIZED') {
          return message(
            form,
            {
              text: 'Tu usuario, correo electrónico o contraseña son incorrectos. Por favor, verifica los datos e intenta nuevamente.',
              type: 'error',
            },
            { status: 400 },
          )
        }

        return message(form, { text: err.body?.message, type: 'error' }, { status: 500 })
      }
      console.error('[X] Error on login:', err)
      return message(form, { text: 'Error al iniciar sesión.', type: 'error' }, { status: 500 })
    }

    return redirect(302, getDashboardRoute())
  },

  signOut: async ({ request }) => {
    await auth.api.signOut({ headers: request.headers })
    return redirect(302, '/login' satisfies Pathname)
  },
} satisfies Actions
