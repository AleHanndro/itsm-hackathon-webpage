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
  class={cn(
    'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
    className,
  )}
  data-slot="field-label"
  {...restProps}
>
  {@render children?.()}
</div>
