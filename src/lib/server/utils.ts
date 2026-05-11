import type { Pathname } from '$app/types'
import type { UserWithRole } from 'better-auth/plugins/admin'

type Role = null | UserWithRole['role']

const parseRoles = (role: Role): string[] =>
  (role ?? '')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)

export const hasRole = (userRole: Role, role: string): boolean =>
  parseRoles(userRole).includes(role)

export const hasAnyRole = (userRole: Role, roles: string[]): boolean => {
  const userRoles = parseRoles(userRole)
  return roles.some((role) => userRoles.includes(role))
}

export const getDashboardRoute = (userRole: Role): Pathname => {
  return hasAnyRole(userRole, ['admin', 'staff']) ? '/dashboard/evento' : '/dashboard'
}
