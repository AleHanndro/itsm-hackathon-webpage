<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props()
</script>

<tr
  bind:this={ref}
  class={cn(
    'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
    className,
  )}
  data-slot="table-row"
  {...restProps}
>
  {@render children?.()}
</tr>
