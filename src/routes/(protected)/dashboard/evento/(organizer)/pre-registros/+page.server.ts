import { preRegistrations } from '$lib/schema/pre-registrations'
import { db } from '$lib/server/db/database'
import { dbTry } from '$lib/server/db/errors'
import { hasAnyRole } from '$lib/server/utils'
import { eq, getTableColumns, inArray, sql } from 'drizzle-orm'
import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'

import type { Actions, PageServerLoad } from './$types'

import { bulkActionSchema, searchParamsSchema } from './schema'

export const load = (async ({ url }) => {
  const { page, pageSize, status } = searchParamsSchema.parse({
    page: url.searchParams.get('page') ?? 1,
    pageSize: url.searchParams.get('pageSize') ?? 10,
    status: url.searchParams.get('status') ?? 'pendiente',
  })

  const statusFilter = status !== 'todos' ? eq(preRegistrations.status, status) : undefined

  // Single query: paginated rows + total count via window function
  const [form, rows] = await Promise.all([
    superValidate(zod4(bulkActionSchema)),
    db
      .select({
        ...getTableColumns(preRegistrations),
        totalCount: sql<number>`COUNT(*) OVER()`.mapWith(Number),
      })
      .from(preRegistrations)
      .where(statusFilter)
      .orderBy(sql`${preRegistrations.createdAt} DESC`)
      .limit(pageSize)
      .offset((page - 1) * pageSize),
  ])

  const totalCount = rows[0]?.totalCount ?? 0

  // Strip the synthetic totalCount field before sending to the client
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = rows.map(({ totalCount: _, ...rest }) => rest)

  return {
    form,
    pagination: {
      page,
      pageSize,
      status,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
    preRegistrations: data,
  }
}) satisfies PageServerLoad

export const actions = {
  approve: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { error: 'No autorizado' })

    const form = await superValidate(request, zod4(bulkActionSchema))
    if (!form.valid || form.data.ids.length === 0) return fail(400, { form })

    const { error } = await dbTry(() =>
      db
        .update(preRegistrations)
        .set({ status: 'verificado', verifiedAt: new Date(), verifiedBy: locals.user?.id })
        .where(inArray(preRegistrations.id, form.data.ids)),
    )

    if (error && error.kind === 'unknown') {
      console.error('[approve]', error.cause)
      return fail(500, { form })
    }

    return message(form, {
      text: `${form.data.ids.length.toString()} prerregistro(s) aprobado(s) exitosamente.`,
      type: 'success',
    })
  },
  deny: async ({ locals, request }) => {
    if (!hasAnyRole(locals.user?.role, ['admin', 'organizer']))
      return fail(403, { error: 'No autorizado' })

    const form = await superValidate(request, zod4(bulkActionSchema))
    if (!form.valid || form.data.ids.length === 0) return fail(400, { form })

    const { error } = await dbTry(() =>
      db
        .update(preRegistrations)
        .set({ status: 'rechazado', verifiedAt: new Date(), verifiedBy: locals.user?.id })
        .where(inArray(preRegistrations.id, form.data.ids)),
    )

    if (error && error.kind === 'unknown') {
      console.error('[deny]', error.cause)
      return fail(500, { form })
    }

    return message(form, {
      text: `${form.data.ids.length.toString()} prerregistro(s) rechazado(s) exitosamente.`,
      type: 'success',
    })
  },
} satisfies Actions
