import type { Pathname } from '$app/types'
import type { Roles } from '$lib/permissions'
import type { UserWithRole } from 'better-auth/plugins/admin'

import { users } from '$lib/schema/auth'
import { eq } from 'drizzle-orm'
import { jwtDecode } from 'jwt-decode'

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

export const syncGoogleImageToUser = async ({
  account,
  db,
  userTable,
}: {
  account: { idToken?: null | string; providerId: string; userId?: null | string }
  db: typeof database
  userTable: typeof users
}) => {
  if (account.providerId !== 'google') return
  if (!account.idToken || !account.userId) return

  let picture: string | undefined
  try {
    const decoded = jwtDecode<{ picture?: string }>(account.idToken)
    picture = decoded.picture
  } catch (err) {
    console.error('[syncGoogleImage] Failed to decode Google ID token:', err)
    return
  }

  if (!picture) return

  await db.update(userTable).set({ image: picture }).where(eq(userTable.id, account.userId))
}
