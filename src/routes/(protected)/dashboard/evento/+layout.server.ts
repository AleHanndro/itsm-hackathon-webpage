import { db } from '$lib/server/db/database'
import { hasRole } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const stages = await db.query.stages.findMany({
    orderBy: (t, { asc }) => [asc(t.order)],
  })

  return {
    isAdmin: hasRole(locals.user?.role, 'admin'),
    isEvaluator: hasRole(locals.user?.role, 'evaluator'),
    stages,
  }
}) satisfies LayoutServerLoad
