<script lang="ts">
  import type { HTMLTdAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLTdAttributes> = $props()
</script>

<td
  bind:this={ref}
  class={cn('p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0', className)}
  data-slot="table-cell"
  {...restProps}
>
  {@render children?.()}
</td>
