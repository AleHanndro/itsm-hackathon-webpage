<script lang="ts">
  import { cn } from '$lib/utils'
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: AlertDialogPrimitive.TitleProps = $props()
</script>

<AlertDialogPrimitive.Title
  class={cn(
    'text-lg font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
    className,
  )}
  data-slot="alert-dialog-title"
  bind:ref
  {...restProps}
/>
