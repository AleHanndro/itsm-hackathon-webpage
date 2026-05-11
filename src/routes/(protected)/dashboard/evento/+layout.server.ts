import { hasRole } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  return { isAdmin: hasRole(locals.user?.role, 'admin') }
}) satisfies LayoutServerLoad
