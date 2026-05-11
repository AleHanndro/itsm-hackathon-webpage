<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    inset,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    inset?: boolean
  } = $props()
</script>

<div
  bind:this={ref}
  class={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8', className)}
  data-inset={inset}
  data-slot="dropdown-menu-label"
  {...restProps}
>
  {@render children?.()}
</div>
