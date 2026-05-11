<script lang="ts">
  import { cn } from '$lib/utils'
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: DialogPrimitive.OverlayProps = $props()
</script>

<DialogPrimitive.Overlay
  class={cn(
    'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
    className,
  )}
  data-slot="dialog-overlay"
  bind:ref
  {...restProps}
/>
