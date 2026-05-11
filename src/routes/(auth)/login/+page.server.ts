import { auth } from '$lib/server/auth'
import { hasAnyRole } from '$lib/server/utils'
import { fail, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { loginSchema } from './schema'

export const load = (async ({ locals }) => {
  if (locals.user?.role)
    return redirect(
      302,
      hasAnyRole(locals.user.role, ['admin', 'staff']) ? '/dashboard/admin' : '/dashboard/usuario',
    )

  return { form: await superValidate(zod4(loginSchema)) }
}) satisfies PageServerLoad

export const actions = {
  signIn: async ({ request }) => {
    const form = await superValidate(request, zod4(loginSchema))

    if (!form.valid) {
      return fail(400, { form })
    }

    try {
      await auth.api.signInEmail({
        body: {
          email: form.data.email,
          password: form.data.password,
        },
      })
    } catch {
      return message(form, { text: 'Credenciales inválidas.', type: 'error' }, { status: 400 })
    }

    return redirect(302, '/dashboard/admin')
  },
  signInSocial: async () => {
    const result = await auth.api.signInSocial({
      body: { callbackURL: '/dashboard/usuario', provider: 'google' },
    })

    if (result.url) {
      return redirect(302, result.url)
    }

    return fail(400, { error: 'Error al iniciar sesión con Google.' })
  },
  signOut: async ({ request }) => {
    await auth.api.signOut({ headers: request.headers })
    return redirect(302, '/login')
  },
} satisfies Actions
