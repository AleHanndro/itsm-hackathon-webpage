import { hasAnyRole, hasEventStarted } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { role } = locals.user ?? {}
  const isStaff = hasAnyRole(role, ['admin', 'staff', 'evaluator', 'organizer'])

  let eventStarted = false

  if (!isStaff) {
    eventStarted = hasEventStarted()
  }

  return { eventStarted, isStaff }
}) satisfies LayoutServerLoad
