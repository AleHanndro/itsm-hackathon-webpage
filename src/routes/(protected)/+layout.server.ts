import { redirect } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  // despite checking the session in the handle hook, check it here just to be sure
  if (!locals.user || !locals.session) {
    redirect(302, '/login')
  }

  return { user: locals.user }
}) satisfies LayoutServerLoad
