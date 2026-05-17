import { db } from '$lib/server/db/database'
import { isUserAuthorized } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { approved, authorized, eventStarted } = await isUserAuthorized(locals.user?.email)

  const stages = await db.query.stages.findMany({
    columns: { name: true, order: true },
    orderBy: (stages, { asc }) => [asc(stages.order)],
  })

  return {
    approved,
    eventStarted,
    isAuthorized: authorized,
    stages,
  }
}) satisfies LayoutServerLoad
