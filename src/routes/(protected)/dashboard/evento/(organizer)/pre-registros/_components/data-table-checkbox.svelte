<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Checkbox from '$lib/components/ui/checkbox.svelte'

  let {
    checked = false,

    onCheckedChange = (v) => (checked = v),
    ...restProps
  }: ComponentProps<typeof Checkbox> = $props()
</script>

<Checkbox bind:checked={() => checked as never, onCheckedChange} {...restProps} />
