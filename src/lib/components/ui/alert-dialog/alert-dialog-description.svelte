<script lang="ts">
  import { cn } from '$lib/utils'
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: AlertDialogPrimitive.DescriptionProps = $props()
</script>

<AlertDialogPrimitive.Description
  class={cn(
    'text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
    className,
  )}
  data-slot="alert-dialog-description"
  bind:ref
  {...restProps}
/>
