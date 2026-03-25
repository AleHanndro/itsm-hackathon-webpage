import adapter from '@sveltejs/adapter-vercel'
import { relative, sep } from 'node:path'

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
  kit: {
    adapter: adapter(),
    typescript: {
      config: (cfg) => {
        // Include root directory ts/js files
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Generated SvelteKit tsconfig.json isn't typed
        return { ...cfg, include: [...cfg.include, '../*.ts', '../*.js', '../*.mjs'] }
      },
    },
  },
}

export default config
