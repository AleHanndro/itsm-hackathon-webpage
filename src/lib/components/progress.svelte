<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from '$lib/utils.js'
  import { Progress as ProgressPrimitive } from 'bits-ui'

  let {
    class: className,
    indicatorClass,
    max = 100,
    ref = $bindable(null),
    value,
    ...restProps
  }: WithoutChildrenOrChild<ProgressPrimitive.RootProps> & { indicatorClass?: string } = $props()
</script>

<ProgressPrimitive.Root
  class={cn(
    'relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-muted',
    className,
  )}
  data-slot="progress"
  {max}
  {value}
  bind:ref
  {...restProps}
>
  <div
    style="transform: translateX(-{100 - (100 * (value ?? 0)) / (max ?? 1)}%)"
    class={cn('size-full flex-1 bg-primary transition-all', indicatorClass)}
    data-slot="progress-indicator"
  ></div>
</ProgressPrimitive.Root>
