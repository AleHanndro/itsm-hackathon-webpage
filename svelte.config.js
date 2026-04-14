import remarkEnhancedImage from '@m4r1vs/mdsvex-enhanced-images'
import adapter from '@sveltejs/adapter-vercel'
import { mdsvex } from 'mdsvex'
import { relative, sep } from 'node:path'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkSectionize from 'remark-sectionize'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    // defaults to rune mode for the project, execept for `node_modules`. Can be removed in svelte 6.
    runes: ({ filename }) => {
      const relativePath = relative(import.meta.dirname, filename)
      const pathSegments = relativePath.toLowerCase().split(sep)
      const isExternalLibrary = pathSegments.includes('node_modules')

      return isExternalLibrary ? undefined : true
    },
  },
  extensions: ['.svelte', '.md', '.svx'],
  kit: {
    adapter: adapter(),
    alias: {
      $content: 'src/content',
      '$content-collections': './.content-collections/generated',
    },
    prerender: {
      handleUnseenRoutes: 'warn',
    },
    typescript: {
      config: (cfg) => {
        // Include root directory ts/js files
        return {
          ...cfg,
          include: [
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Generated SvelteKit tsconfig.json isn't typed
            ...cfg.include,
            '../.content-collections/generated/index.d.ts',
            '../*.ts',
            '../*.js',
            '../*.mjs',
          ],
        }
      },
    },
  },
  preprocess: [
    mdsvex({
      extensions: ['.md', '.svx'],
      rehypePlugins: [
        // @ts-expect-error Types mismatch between rehype plugins, but they work fine
        rehypeSlug,
        // @ts-expect-error Types mismatch between rehype plugins, but they work fine
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
      remarkPlugins: [
        // @ts-expect-error Types mismatch between remark plugins, but they work fine
        remarkSectionize,
        [
          // @ts-expect-error Types mismatch between remark plugins, but they work fine
          remarkEnhancedImage,
          {
            // @ts-expect-error Due to types mismatch, the plugin doesn't recognize the `attributes` property, but it works fine
            attributes: {
              decoding: 'async',
              loading: 'lazy',
              sizes: '(max-width:800px) 100vw, 1280px',
            },
            imagetoolsDirectives: {
              format: 'avif',
              w: 'w=400;800;1280',
            },
          },
        ],
      ],
    }),
  ],
}

export default config
