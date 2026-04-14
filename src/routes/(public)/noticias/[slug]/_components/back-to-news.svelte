<script lang="ts">
  import { resolve } from '$app/paths'
  import { categoryMap } from '$lib/consts'
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'

  const { category }: { category?: keyof typeof categoryMap } = $props()
</script>

<a
  class={[
    'group inline-flex items-center gap-1 font-display text-sm/1 font-medium tracking-wide text-muted-foreground',
    {
      'hover:text-accent': category === 'evento',
      'hover:text-accent-2': category === 'noticia',
      'hover:text-accent-3': category === 'blog',
      'hover:text-transparent': category === 'anuncio',
    },
  ]}
  href={resolve('/noticias')}
>
  {#if category === 'anuncio'}
    <span
      class="inline-flex items-center gap-x-1 bg-clip-text not-hover:bg-muted-foreground hover:bg-linear-to-r hover:from-accent hover:to-accent-2"
    >
      <ArrowLeftIcon class="size-4 group-hover:text-accent" />
      Volver a noticias
    </span>
  {:else}
    <ArrowLeftIcon class="size-4" />
    Volver a noticias
  {/if}
</a>
