import { hasAnyRole } from '$lib/server/utils'
import { redirect } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  // Only regular users (participants) can access these routes
  if (hasAnyRole(locals.user?.role, ['admin', 'staff', 'evaluator', 'organizer'])) {
    redirect(302, '/dashboard/evento')
  }

  return {}
}) satisfies LayoutServerLoad
