import { getPublishedPosts } from '$lib/content'

import type { PageServerLoad } from './$types'

export const load = (() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const posts = getPublishedPosts().map(({ component, ...post }) => post)

  return { posts }
}) satisfies PageServerLoad
