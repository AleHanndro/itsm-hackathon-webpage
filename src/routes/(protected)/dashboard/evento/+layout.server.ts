import { db } from '$lib/server/db/database'
import { hasRole } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const isAdmin = hasRole(locals.user?.role, 'admin')
  const isEvaluator = hasRole(locals.user?.role, 'evaluator')

  let stages: {
    createdAt: Date
    description: null | string
    id: number
    name: string
    order: number
    updatedAt: Date
  }[] = []

  if (isAdmin) {
    stages = await db.query.stages.findMany({
      orderBy: (t, { asc }) => [asc(t.order)],
    })
  } else if (isEvaluator && locals.user?.id) {
    const userId = locals.user.id
    const assigned = await db.query.stagesEvaluators.findMany({
      where: (se, { eq }) => eq(se.userId, userId),
      with: { stage: true },
    })
    stages = assigned.map((a) => a.stage).sort((a, b) => a.order - b.order)
  }

  return {
    isAdmin,
    isEvaluator,
    stages,
  }
}) satisfies LayoutServerLoad
