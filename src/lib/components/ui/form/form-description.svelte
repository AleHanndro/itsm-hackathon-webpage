<script lang="ts">
  import { cn, type WithoutChild } from '$lib/utils'
  import * as FormPrimitive from 'formsnap'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChild<FormPrimitive.DescriptionProps> = $props()
</script>

<FormPrimitive.Description
  class={cn('text-sm text-muted-foreground', className)}
  data-slot="form-description"
  bind:ref
  {...restProps}
/>
