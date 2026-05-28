import type { LayoutServerLoad } from './$types'

export const load = (({ locals }) => {
  // locals.user is guaranteed non-null for /(protected) routes by src/hooks.server.ts
  const user = locals.user as NonNullable<typeof locals.user>
  return { user }
}) satisfies LayoutServerLoad
