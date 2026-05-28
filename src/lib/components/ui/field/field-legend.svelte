<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    variant = 'legend',
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLLegendElement>> & {
    variant?: 'label' | 'legend'
  } = $props()
</script>

<legend
  bind:this={ref}
  class={cn(
    'mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
    className,
  )}
  data-slot="field-legend"
  data-variant={variant}
  {...restProps}
>
  {@render children?.()}
</legend>
