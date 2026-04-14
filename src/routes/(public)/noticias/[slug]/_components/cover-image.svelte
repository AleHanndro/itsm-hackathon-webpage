<script lang="ts">
  import type { Picture } from '@sveltejs/enhanced-img'
  import type { SvelteHTMLElements } from 'svelte/elements'

  import { type WithoutChildren } from '$lib/utils'

  import Skeleton from './skeleton.svelte'

  const {
    alt,
    class: className,
    isExternal,
    src,
    ...restProps
  }: WithoutChildren<SvelteHTMLElements['img']> & {
    alt: string
    isExternal: boolean
    src: string
  } = $props()

  const covers = import.meta.glob<Picture>('/src/content/posts/**/*.{jpg,jpeg,png,webp,avif}', {
    import: 'default',
    query: { enhanced: true, format: 'avif', w: '400;800;1280' },
  })

  const loader = $derived(!isExternal ? covers[src] : null)
</script>

{#if isExternal}
  <img class={className} {alt} {src} {...restProps} />
{:else if loader}
  {#await loader()}
    <Skeleton class={className} />
  {:then picture}
    <enhanced:img
      class={className}
      {alt}
      fetchpriority="high"
      sizes="(max-width:800px) 100vw, 1280px"
      src={picture}
      {...restProps}
    />
  {/await}
{/if}
