<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLTableSectionElement>> = $props()
</script>

<tbody
  bind:this={ref}
  class={cn('[&_tr:last-child]:border-0', className)}
  data-slot="table-body"
  {...restProps}
>
  {@render children?.()}
</tbody>
