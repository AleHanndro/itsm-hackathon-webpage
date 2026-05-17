import { hasAnyRole } from '$lib/server/utils'
import { error } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  if (!hasAnyRole(locals.user?.role, ['admin', 'evaluator'])) {
    error(403, 'No tienes permiso para acceder a esta sección')
  }
  return {}
}) satisfies LayoutServerLoad
