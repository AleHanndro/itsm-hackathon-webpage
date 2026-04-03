<script lang="ts">
  import { cn } from '$lib/utils'
  import { Dialog as SheetPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: SheetPrimitive.TitleProps = $props()
</script>

<SheetPrimitive.Title
  class={cn('font-medium text-foreground', className)}
  data-slot="sheet-title"
  bind:ref
  {...restProps}
/>
