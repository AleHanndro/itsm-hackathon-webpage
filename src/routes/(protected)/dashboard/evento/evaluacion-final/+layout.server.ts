import { hasAnyRole } from '$lib/server/utils'
import { error } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  // On /(protected) routes, locals.user is guaranteed by src/hooks.server.ts
  const user = locals.user as NonNullable<typeof locals.user>

  if (!hasAnyRole(user.role, ['admin', 'staff', 'organizer'])) {
    return error(403, 'No tienes permiso para realizar la evaluación final')
  }

  return {}
}) satisfies LayoutServerLoad
