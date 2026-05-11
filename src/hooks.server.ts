import '$lib/z'
import type { Pathname } from '$app/types'

import { building } from '$app/environment'
import { auth } from '$lib/server/auth'
import { hasAnyRole, hasRole } from '$lib/server/utils'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { svelteKitHandler } from 'better-auth/svelte-kit'

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers })

  event.locals.session = session?.session ?? null
  event.locals.user = session?.user ?? null

  return svelteKitHandler({ auth, building, event, resolve })
}

const handleAuthorization: Handle = ({ event, resolve }) => {
  const routeId = event.route.id
  const user = event.locals.user

  if (event.url.pathname.includes('/dashboard') && !user)
    return redirect(303, '/login' satisfies Pathname)

  if (routeId?.includes('/(admin-only)') && !hasRole(user?.role, 'admin'))
    return redirect(303, '/dashboard/evento' satisfies Pathname)

  if (routeId?.includes('/(staff)') && !hasAnyRole(user?.role, ['admin', 'staff']))
    return redirect(303, '/dashboard' satisfies Pathname)

  // admin or staff users cannot access user routes
  if (routeId?.includes('/(user)') && hasAnyRole(user?.role, ['admin', 'staff']))
    return redirect(303, '/dashboard/evento' satisfies Pathname)

  return resolve(event)
}

export const handle: Handle = sequence(handleBetterAuth, handleAuthorization)
