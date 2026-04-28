import type { Component } from 'svelte'

import { createDefaultImport, defineCollection, defineConfig } from '@content-collections/core'
import { posix } from 'node:path'
import { z } from 'zod'

const coverSchema = z.object({
  alt: z.string(),
  isExternal: z.boolean().optional(),
  src: z.string(),
})

const posts = defineCollection({
  directory: 'src/content/posts',
  include: ['**/*.md', '**/*.svx'],
  name: 'posts',
  parser: 'frontmatter-only',
  schema: z.object({
    canonicalUrl: z.string().optional(),
    category: z.enum(['anuncio', 'noticia', 'evento', 'blog']).optional(),
    cover: coverSchema.optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    slug: z.string().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    title: z.string(),
  }),
  transform: (data) => {
    const slug = data.slug?.trim() ?? data._meta.path.toLowerCase().trim().replace(/\s+/g, '-')
    const resolveCover = (cover: z.input<typeof coverSchema>, directory: string) => {
      const isExternal =
        cover.isExternal ??
        (cover.src.startsWith('http://') ||
          cover.src.startsWith('https://') ||
          cover.src.startsWith('//'))
      const src = isExternal ? cover.src : posix.join('/src/content/posts/', directory, cover.src)

      return { ...cover, isExternal, src }
    }

    return {
      ...data,
      component: createDefaultImport<Component>(`$content/posts/${data._meta.filePath}`),
      cover: data.cover ? resolveCover(data.cover, data._meta.directory) : undefined,
      slug,
    }
  },
})

export default defineConfig({
  content: [posts],
})
