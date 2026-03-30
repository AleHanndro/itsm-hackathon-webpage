<script generics="T extends Record<string, unknown>, U extends FormPath<T>" lang="ts">
  import type { FormPath } from 'sveltekit-superforms'

  import { cn, type WithoutChild } from '$lib/utils'
  import * as FormPrimitive from 'formsnap'

  let {
    class: className,
    form,
    name,
    ref = $bindable(null),
    ...restProps
  }: WithoutChild<FormPrimitive.FieldsetProps<T, U>> = $props()
</script>

<FormPrimitive.Fieldset {name} class={cn('space-y-2', className)} {form} bind:ref {...restProps} />
