<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props()
</script>

<span
  bind:this={ref}
  class={cn(
    'ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground',
    className,
  )}
  data-slot="command-shortcut"
  {...restProps}
>
  {@render children?.()}
</span>
