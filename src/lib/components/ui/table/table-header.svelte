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

<thead
  bind:this={ref}
  class={cn('[&_tr]:border-b', className)}
  data-slot="table-header"
  {...restProps}
>
  {@render children?.()}
</thead>
