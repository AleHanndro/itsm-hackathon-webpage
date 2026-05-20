import type { Roles } from '$lib/permissions'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export type Role = null | string | undefined

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

export const formatDate = (
  date: Date,
  { withTime = false }: Partial<{ withTime: boolean }> = {},
) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }

  if (withTime) {
    Object.assign<typeof options, typeof options>(options, {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const dateTime = new Intl.DateTimeFormat(['es-MX', 'en-US'], options)

  return dateTime.format(date)
}

export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: null | U }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
