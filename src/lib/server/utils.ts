import type { Pathname } from '$app/types'
import type { UserWithRole } from 'better-auth/plugins/admin'

import { EVENT_START_DATE } from '$lib/consts'
import { type Roles } from '$lib/permissions'

import { db as database } from './db/database'

type Role = null | UserWithRole['role']

const parseRoles = (role: Role): string[] =>
  (role ?? '')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)

export const hasRole = (userRole: Role, role: Roles): boolean => parseRoles(userRole).includes(role)

export const hasAnyRole = (userRole: Role, roles: Roles[]): boolean => {
  const userRoles = parseRoles(userRole)
  return roles.some((role) => userRoles.includes(role))
}

export const getDashboardRoute = (userRole: Role): Pathname => {
  return hasAnyRole(userRole, ['admin', 'staff']) ? '/dashboard/evento' : '/dashboard'
}

export const isUserAuthorized = async (email?: string) => {
  const user = email
    ? await database.query.preRegistrations.findFirst({
        columns: { status: true },
        where: (t, { eq }) => eq(t.email, email),
      })
    : null

  const now = new Date()
  const isApproved = user?.status === 'verificado'
  const hasEventStarted = now >= EVENT_START_DATE

  return {
    approved: isApproved,
    authorized: isApproved && hasEventStarted,
    eventStarted: hasEventStarted,
  }
}
