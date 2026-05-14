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
    variant = 'default',
    ...restProps
  }: AlertDialogPrimitive.ActionProps & {
    size?: ButtonSize
    variant?: ButtonVariant
  } = $props()
</script>

<AlertDialogPrimitive.Action
  class={cn(buttonVariants({ size, variant }), 'cn-alert-dialog-action', className)}
  data-slot="alert-dialog-action"
  bind:ref
  {...restProps}
/>
