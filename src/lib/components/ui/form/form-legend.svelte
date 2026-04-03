<script lang="ts">
  import { cn, type WithoutChild } from '$lib/utils'
  import * as FormPrimitive from 'formsnap'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChild<FormPrimitive.LegendProps> = $props()
</script>

<FormPrimitive.Legend
  class={cn('text-sm leading-none font-medium data-fs-error:text-destructive', className)}
  bind:ref
  {...restProps}
/>
