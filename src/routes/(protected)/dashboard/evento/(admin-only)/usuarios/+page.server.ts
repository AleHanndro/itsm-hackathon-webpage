import { auth } from '$lib/server/auth'
import { hasRole } from '$lib/server/utils'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { createUserSchema, setRoleSchema } from './schema'

export const load = (async ({ request }) => {
  const [createUserForm, setRoleForm, usersResult] = await Promise.all([
    superValidate(zod4(createUserSchema)),
    superValidate(zod4(setRoleSchema)),
    auth.api.listUsers({
      headers: request.headers,
      query: { limit: 100, offset: 0, sortBy: 'createdAt', sortDirection: 'desc' },
    }),
  ])

  return {
    createUserForm,
    setRoleForm,
    users: usersResult.users,
  }
}) satisfies PageServerLoad

export const actions = {
  createUser: async ({ locals, request }) => {
    if (!hasRole(locals.user?.role, 'admin')) return fail(403, { error: 'No autorizado' })

    const form = await superValidate(request, zod4(createUserSchema))
    if (!form.valid) return fail(400, { form })

    try {
      await auth.api.createUser({
        body: {
          email: form.data.email,
          name: form.data.name,
          password: form.data.password,
          role: form.data.role,
        },
        headers: request.headers,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      return message(form, { text: errorMessage, type: 'error' } as const, { status: 400 })
    }

    return message(form, {
      text: `Usuario "${form.data.name}" creado exitosamente.`,
      type: 'success',
    } as const)
  },

  setRole: async ({ locals, request }) => {
    if (!hasRole(locals.user?.role, 'admin')) return fail(403, { error: 'No autorizado' })

    const form = await superValidate(request, zod4(setRoleSchema))
    if (!form.valid) return fail(400, { form })

    try {
      await auth.api.setRole({
        body: {
          role: form.data.role,
          userId: form.data.userId,
        },
        headers: request.headers,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      return message(form, { text: errorMessage, type: 'error' } as const, { status: 400 })
    }

    return message(form, { text: 'Rol actualizado exitosamente.', type: 'success' } as const)
  },
} satisfies Actions
