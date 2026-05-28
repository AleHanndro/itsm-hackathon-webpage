import { hasAnyRole } from '$lib/server/utils'
import { redirect } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  // Only staff roles can access /dashboard/evento routes
  if (!hasAnyRole(locals.user?.role, ['admin', 'staff', 'evaluator', 'organizer'])) {
    redirect(302, '/dashboard')
  }

  return {}
}) satisfies LayoutServerLoad
