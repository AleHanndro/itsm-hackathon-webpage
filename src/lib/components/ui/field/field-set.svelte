<script lang="ts">
  import type { HTMLFieldsetAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLFieldsetAttributes> = $props()
</script>

<fieldset
  bind:this={ref}
  class={cn(
    'flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
    className,
  )}
  data-slot="field-set"
  {...restProps}
>
  {@render children?.()}
</fieldset>
