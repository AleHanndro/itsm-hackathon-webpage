import { hasAnyRole, hasEventStarted, isUserAuthorized } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const role = locals.user?.role
  const isStaff = hasAnyRole(role, ['admin', 'staff', 'evaluator', 'organizer'])

  let approved = false
  let eventStarted = false

  if (!isStaff) {
    const authResult = await isUserAuthorized(locals.user?.email)
    approved = authResult.approved
    eventStarted = hasEventStarted()
  }

  return { approved, eventStarted, isStaff }
}) satisfies LayoutServerLoad
