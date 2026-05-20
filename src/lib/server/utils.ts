import type { Pathname } from '$app/types'

import { EVENT_START_DATE } from '$lib/consts'

import { db as database } from './db/database'

// Re-export role utilities from shared module for backward compatibility
export { hasAnyRole, hasRole, type Role } from '$lib/utils'

export const getDashboardRoute = (): Pathname => '/dashboard'

export const isUserAuthorized = async (email?: string) => {
  const user = email
    ? await database.query.preRegistrations.findFirst({
        columns: { status: true },
        where: (t, { eq }) => eq(t.email, email),
      })
    : null

  const isApproved = user?.status === 'verificado'

  return {
    approved: isApproved,
    authorized: !(isApproved && hasEventStarted),
  }
}

export const hasEventStarted = () => new Date() >= EVENT_START_DATE
