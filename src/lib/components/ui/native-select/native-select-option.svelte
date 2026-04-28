<script lang="ts">
  import type { WithElementRef } from '$lib/utils'
  import type { HTMLOptionAttributes } from 'svelte/elements'

  let {
    children,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLOptionAttributes> = $props()
</script>

<option bind:this={ref} data-slot="native-select-option" {...restProps}>
  {@render children?.()}
</option>
