import { db } from '$lib/server/db/database'
import { hasEventStarted, isUserAuthorized } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { approved, authorized } = await isUserAuthorized(locals.user?.email)
  const eventStarted = hasEventStarted()

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
