<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> = $props()
</script>

<caption
  bind:this={ref}
  class={cn('mt-4 text-sm text-muted-foreground', className)}
  data-slot="table-caption"
  {...restProps}
>
  {@render children?.()}
</caption>
