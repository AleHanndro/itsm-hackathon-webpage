import { db } from '$lib/server/db/database'
import { error } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const userId = locals.user?.id
  if (!userId) {
    return error(401, 'No autorizado')
  }

  if (locals.user?.role === 'admin') {
    return {}
  }

  // Check if evaluator has canEvaluateFinal in any of their assigned stages
  const evaluatorStages = await db.query.stagesEvaluators.findMany({
    where: (t, { and, eq }) => and(eq(t.userId, userId), eq(t.canEvaluateFinal, true)),
  })

  if (evaluatorStages.length === 0) {
    return error(403, 'No tienes permiso para realizar la evaluación final')
  }

  return {}
}) satisfies LayoutServerLoad
