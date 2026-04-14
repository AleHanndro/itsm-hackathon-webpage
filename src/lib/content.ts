import { allPosts } from '$content-collections'

export const getPublishedPosts = () => {
  return allPosts
    .filter((post) => import.meta.env.DEV || !post.draft)
    .toSorted((a, b) => b.date.getTime() - a.date.getTime())
}
