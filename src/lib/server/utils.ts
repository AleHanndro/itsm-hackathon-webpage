import type { Pathname } from '$app/types'

import { EVENT_START_DATE } from '$lib/consts'

// Re-export role utilities from shared module for backward compatibility
export { hasAnyRole, hasRole, type Role } from '$lib/utils'

export const getDashboardRoute = (): Pathname => '/dashboard'

export const hasEventStarted = () => new Date() >= EVENT_START_DATE
