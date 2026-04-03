import type { PageServerLoad } from './$types'

export const prerender = true

// eslint-disable-next-line @typescript-eslint/require-await -- Just a placeholder for now
export const load: PageServerLoad = async () => {
  return {}
}
