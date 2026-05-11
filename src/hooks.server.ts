import '$lib/z'
import type { Handle } from '@sveltejs/kit'

import { building } from '$app/environment'
import { auth } from '$lib/server/auth'
import { svelteKitHandler } from 'better-auth/svelte-kit'

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers })

  event.locals.session = session?.session ?? null
  event.locals.user = session?.user ?? null

  return svelteKitHandler({ auth, building, event, resolve })
}

export const handle: Handle = handleBetterAuth
