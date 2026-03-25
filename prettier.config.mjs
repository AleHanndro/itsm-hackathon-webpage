/**@type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  tailwindStylesheet: './src/lib/styles/main.css',
  trailingComma: 'all',
  useTabs: false,
}
