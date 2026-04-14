<script lang="ts">
  import type { Post } from '$content-collections'

  import { resolve } from '$app/paths'
  import { categoryMap } from '$lib/consts'
  import { formatDate } from '$lib/utils'
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right'

  const { post }: { post: Omit<Post, 'component'> } = $props()
</script>

<a class="group space-y-3" href={resolve('/(public)/noticias/[slug]', { slug: post.slug })}>
  <div>
    <h3 class="font-display text-xl font-bold">{post.title}</h3>

    {#if post.category}
      <span class="pr-2">{categoryMap[post.category]}</span> •
    {/if}

    {#if post.date}
      <time class="pl-2" datetime={post.date.toISOString()}>
        {formatDate(post.date)}
      </time>
    {/if}
  </div>

  <p class="text-muted-foreground">{post.summary}</p>

  <div class="flex items-center gap-2 font-medium text-accent-3">
    Leer más
    <ArrowRightIcon class="size-4 transition-transform group-hover:translate-x-1" />
  </div>
</a>
