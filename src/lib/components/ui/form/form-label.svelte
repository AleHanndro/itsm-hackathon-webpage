<script lang="ts">
  import Label from '$lib/components/ui/label.svelte'
  import { cn, type WithoutChild } from '$lib/utils'
  import * as FormPrimitive from 'formsnap'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithoutChild<FormPrimitive.LabelProps> = $props()
</script>

<FormPrimitive.Label {...restProps} bind:ref>
  {#snippet child({ props })}
    <Label
      {...props}
      class={cn('data-fs-error:text-destructive', className)}
      data-slot="form-label"
    >
      {@render children?.()}
    </Label>
  {/snippet}
</FormPrimitive.Label>
