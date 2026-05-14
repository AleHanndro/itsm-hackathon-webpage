<script lang="ts">
  import {
    type ButtonSize,
    type ButtonVariant,
    buttonVariants,
  } from '$lib/components/ui/button.svelte'
  import { cn } from '$lib/utils'
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    size = 'default',
    variant = 'outline',
    ...restProps
  }: AlertDialogPrimitive.CancelProps & {
    size?: ButtonSize
    variant?: ButtonVariant
  } = $props()
</script>

<AlertDialogPrimitive.Cancel
  class={cn(buttonVariants({ size, variant }), 'cn-alert-dialog-cancel', className)}
  data-slot="alert-dialog-cancel"
  bind:ref
  {...restProps}
/>
