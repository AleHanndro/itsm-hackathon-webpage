<script lang="ts">
  import { categoryMap } from '$lib/consts'
  import { cn, formatDate } from '$lib/utils'

  const {
    category,
    date,
  }: {
    category?: 'anuncio' | 'blog' | 'evento' | 'noticia'
    date: Date
  } = $props()
</script>

<div class="my-4 flex items-baseline gap-x-3 text-sm md:text-base">
  <time
    class="font-display font-bold tracking-wider text-muted-foreground uppercase"
    datetime={date.toISOString()}
  >
    {formatDate(date)}
  </time>

  {#if category}
    {@const isAnoucement = category === 'anuncio'}
    {@const categoryText = categoryMap[category]}

    <div
      class={cn(
        'cursor-pointer rounded bg-muted-foreground/10 px-1.5 py-0.5 font-mono font-bold text-muted-foreground',
        {
          'bg-accent-2/15 text-accent-2': category === 'noticia',
          'bg-accent-3/15 text-accent-3': category === 'blog',
          'bg-accent/15 text-accent': category === 'evento',
          'bg-linear-to-r from-accent/15 to-accent-2/15 text-transparent': isAnoucement,
        },
      )}
    >
      {#if isAnoucement}
        <span class="bg-linear-to-r from-accent to-accent-2 bg-clip-text">
          {categoryText}
        </span>
      {:else}
        {categoryText}
      {/if}
    </div>
  {/if}
</div>
