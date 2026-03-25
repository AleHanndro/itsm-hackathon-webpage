<script lang="ts">
  import '$lib/styles/main.css'
  import type { Snippet } from 'svelte'

  import favicon from '$lib/assets/favicon.svg'
  import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/consts'

  const { children }: { children: Snippet } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{SITE_TITLE}</title>
  <meta name="title" content={SITE_TITLE} />
  <meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

{@render children()}
