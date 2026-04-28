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
  class={cn('text-base leading-normal font-medium group-data-[size=sm]/card:text-sm', className)}
  data-slot="card-title"
  {...restProps}
>
  {@render children?.()}
</div>
