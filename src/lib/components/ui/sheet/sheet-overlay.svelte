<script lang="ts">
  import { cn } from '$lib/utils'
  import { Dialog as SheetPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: SheetPrimitive.OverlayProps = $props()
</script>

<SheetPrimitive.Overlay
  class={cn('fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs', className)}
  data-slot="sheet-overlay"
  bind:ref
  {...restProps}
/>
