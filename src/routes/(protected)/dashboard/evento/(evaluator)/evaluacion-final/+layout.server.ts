import { db } from '$lib/server/db/database'
import { error } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  // On /(protected) routes, locals.user is guaranteed by src/hooks.server.ts
  const user = locals.user as NonNullable<typeof locals.user>

  if (user.role === 'admin') {
    return {}
  }

  // Check if evaluator has canEvaluateFinal in any of their assigned stages
  const userId = user.id
  const evaluatorStages = await db.query.stagesEvaluators.findMany({
    where: (t, { and, eq }) => and(eq(t.userId, userId), eq(t.canEvaluateFinal, true)),
  })

  if (evaluatorStages.length === 0) {
    return error(403, 'No tienes permiso para realizar la evaluación final')
  }

  return {}
}) satisfies LayoutServerLoad
