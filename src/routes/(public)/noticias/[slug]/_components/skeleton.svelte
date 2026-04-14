<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithoutChildren } from '$lib/utils'

  const { class: className, ...restProps }: WithoutChildren<HTMLAttributes<HTMLDivElement>> =
    $props()
</script>

<div class={cn('animate-pulse rounded bg-muted', className)} {...restProps}></div>
