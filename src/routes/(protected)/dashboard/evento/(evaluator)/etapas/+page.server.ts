import { db } from '$lib/server/db/database'
import { hasRole } from '$lib/server/utils'
import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const isAdmin = hasRole(locals.user?.role, 'admin')
  const isEvaluator = hasRole(locals.user?.role, 'evaluator')

  let stages: { id: number; order: number }[] = []

  if (isAdmin) {
    stages = await db.query.stages.findMany({
      columns: { id: true, order: true },
      orderBy: (t, { asc }) => [asc(t.order)],
    })
  } else if (isEvaluator && locals.user?.id) {
    const userId = locals.user.id
    const assigned = await db.query.stagesEvaluators.findMany({
      where: (se, { eq }) => eq(se.userId, userId),
      with: { stage: { columns: { id: true, order: true } } },
    })
    stages = assigned.map((a) => a.stage).sort((a, b) => a.order - b.order)
  }

  if (stages.length > 0) {
    redirect(302, `/dashboard/evento/etapas/${stages[0].id}`)
  }

  return { hasStages: false }
}) satisfies PageServerLoad
