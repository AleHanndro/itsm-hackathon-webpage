/**@type {import('lint-staged').Configuration} */
export default {
  '*': 'prettier --check --ignore-unknown',
  '*.{ts,js,mjs,svelte}': 'eslint',
}
