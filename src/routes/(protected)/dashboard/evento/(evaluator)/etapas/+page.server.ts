import { db } from '$lib/server/db/database'
import { hasRole } from '$lib/server/utils'
import { redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { id: userId, role } = locals.user ?? {}
  const isAdmin = hasRole(role, 'admin')
  const isEvaluator = hasRole(role, 'evaluator')

  let stages: { order: number }[] = []

  if (isAdmin) {
    stages = await db.query.stages.findMany({
      columns: { order: true },
      orderBy: (t, { asc }) => [asc(t.order)],
    })
  } else if (isEvaluator && userId) {
    const assigned = await db.query.stagesEvaluators.findMany({
      where: (se, { eq }) => eq(se.userId, userId),
      with: { stage: { columns: { order: true } } },
    })
    stages = assigned.map((a) => a.stage).sort((a, b) => a.order - b.order)
  }

  if (stages.length > 0) {
    return redirect(302, `/dashboard/evento/etapas/${stages[0].order}`)
  }

  return { hasStages: false }
}) satisfies PageServerLoad
