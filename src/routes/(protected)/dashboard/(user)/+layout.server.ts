import { isUserAuthorized } from '$lib/server/utils'

import type { LayoutServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { approved, authorized } = await isUserAuthorized(locals.user?.email)

  return {
    approved,
    isAuthorized: authorized,
  }
}) satisfies LayoutServerLoad
