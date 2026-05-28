import { db } from '$lib/server/db/database'
import { hasAnyRole, hasEventStarted } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { id: userId, role } = locals.user ?? {}
  const isStaff = hasAnyRole(role, ['admin', 'staff', 'evaluator', 'organizer'])

  let eventStarted = false
  let canEvaluateFinal = false

  if (!isStaff) {
    eventStarted = hasEventStarted()
  } else if (role === 'evaluator' || role === 'admin') {
    if (role === 'admin') {
      canEvaluateFinal = true
    } else if (userId) {
      const evaluatorStages = await db.query.stagesEvaluators.findMany({
        where: (t, { and, eq }) => and(eq(t.userId, userId), eq(t.canEvaluateFinal, true)),
      })
      canEvaluateFinal = evaluatorStages.length > 0
    }
  }

  return { canEvaluateFinal, eventStarted, isStaff }
}) satisfies LayoutServerLoad
