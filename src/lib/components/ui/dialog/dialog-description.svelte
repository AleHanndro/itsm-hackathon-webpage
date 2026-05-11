<script lang="ts">
  import { cn } from '$lib/utils'
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: DialogPrimitive.DescriptionProps = $props()
</script>

<DialogPrimitive.Description
  class={cn(
    'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
    className,
  )}
  data-slot="dialog-description"
  bind:ref
  {...restProps}
/>
