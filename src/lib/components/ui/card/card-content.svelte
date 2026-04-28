<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
  bind:this={ref}
  class={cn('px-6 group-data-[size=sm]/card:px-4', className)}
  data-slot="card-content"
  {...restProps}
>
  {@render children?.()}
</div>
