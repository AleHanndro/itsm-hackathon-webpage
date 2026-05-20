import '$lib/z'
import type { Pathname } from '$app/types'

import { building } from '$app/environment'
import { auth } from '$lib/server/auth'
import { hasAnyRole } from '$lib/server/utils'
import { type Handle, redirect as redirectPrimitive } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { svelteKitHandler } from 'better-auth/svelte-kit'

const protected_routes = {
  admin: '/(admin-only)',
  organizer: '/(organizer)',
  protected: '/(protected)',
} as const

const redirect = ({
  route = '/dashboard',
  status = 303,
}: {
  route?: Pathname
  status?: Parameters<typeof redirectPrimitive>[0]
} = {}) => redirectPrimitive(status, route)

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers })

  event.locals.session = session?.session ?? null
  event.locals.user = session?.user ?? null

  return svelteKitHandler({ auth, building, event, resolve })
}

const handleAuthorization: Handle = ({ event, resolve }) => {
  const routeId = event.route.id
  const user = event.locals.user

  if (routeId?.includes(protected_routes.protected) && !user) return redirect({ route: '/login' })

  if (routeId?.includes(protected_routes.admin) && user?.role !== 'admin') return redirect()

  if (
    routeId?.includes(protected_routes.organizer) &&
    !hasAnyRole(user?.role, ['admin', 'organizer'])
  )
    return redirect()

  return resolve(event)
}

export const handle: Handle = sequence(handleBetterAuth, handleAuthorization)
