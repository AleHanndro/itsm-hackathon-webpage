<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement> = $props()
</script>

<ul
  bind:this={ref}
  class={cn('flex w-full min-w-0 flex-col gap-1', className)}
  data-sidebar="menu"
  data-slot="sidebar-menu"
  {...restProps}
>
  {@render children?.()}
</ul>
