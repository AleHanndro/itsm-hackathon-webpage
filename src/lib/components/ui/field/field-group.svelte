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
    'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
    className,
  )}
  data-slot="field-group"
  {...restProps}
>
  {@render children?.()}
</div>
