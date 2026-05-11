import { preRegistrations } from '$lib/schema/pre-registrations'
import { db } from '$lib/server/db/database'
import { hasAnyRole } from '$lib/server/utils'
import { count, eq, inArray } from 'drizzle-orm'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { bulkActionSchema, searchParamsSchema } from './schema'

export const load = (async ({ url }) => {
  const { page, pageSize } = searchParamsSchema.parse({
    page: url.searchParams.get('page') ?? 1,
    pageSize: url.searchParams.get('pageSize') ?? 10,
  })

  const [form, totalResult, data] = await Promise.all([
    superValidate(zod4(bulkActionSchema)),
    db
      .select({ count: count() })
      .from(preRegistrations)
      .where(eq(preRegistrations.status, 'pendiente')),
    db.query.preRegistrations.findMany({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      where: eq(preRegistrations.status, 'pendiente'),
    }),
  ])

  const totalCount = totalResult[0].count
  return {
    form,
    pagination: { page, pageSize, totalCount, totalPages: Math.ceil(totalCount / pageSize) },
    preRegistrations: data,
  }
}) satisfies PageServerLoad

export const actions = {
  approve: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'staff']))
      return fail(403, { error: 'No autorizado' })

    const form = await superValidate(request, zod4(bulkActionSchema))
    if (!form.valid || form.data.ids.length === 0) return fail(400, { form })

    try {
      await db
        .update(preRegistrations)
        .set({ status: 'verificado', verifiedAt: new Date(), verifiedBy: locals.user?.id })
        .where(inArray(preRegistrations.id, form.data.ids))
    } catch (err) {
      console.error(err)

      return fail(500, { form })
    }

    return message(form, {
      text: `${form.data.ids.length.toString()} prerregistro(s) aprobado(s) exitosamente.`,
      type: 'success',
    })
  },
  deny: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'staff']))
      return fail(403, { error: 'No autorizado' })

    const form = await superValidate(request, zod4(bulkActionSchema))
    if (!form.valid || form.data.ids.length === 0) return fail(400, { form })

    try {
      await db
        .update(preRegistrations)
        .set({ status: 'rechazado', verifiedAt: new Date(), verifiedBy: locals.user?.id })
        .where(inArray(preRegistrations.id, form.data.ids))
    } catch (err) {
      console.error(err)

      return fail(500, { form })
    }

    return message(form, {
      text: `${form.data.ids.length.toString()} prerregistro(s) rechazado(s) exitosamente.`,
      type: 'success',
    })
  },
} satisfies Actions
