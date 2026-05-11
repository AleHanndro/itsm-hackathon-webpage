<script lang="ts">
  import { cn } from '$lib/utils'
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title
  class={cn('leading-none font-medium', className)}
  data-slot="dialog-title"
  bind:ref
  {...restProps}
/>
