import { getPublishedPosts } from '$lib/content'
import { error } from '@sveltejs/kit'

import type { EntryGenerator, PageLoad } from './$types'

export const entries = (() => {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}) satisfies EntryGenerator

export const load = (({ params }) => {
  const post = getPublishedPosts().find((post) => post.slug === params.slug)

  if (!post) error(404, 'Publicación no encontrada.')

  return { post }
}) satisfies PageLoad
