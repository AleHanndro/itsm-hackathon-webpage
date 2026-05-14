<script lang="ts">
  import { cn } from '$lib/utils'
  import { Command as CommandPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: CommandPrimitive.ListProps = $props()
</script>

<CommandPrimitive.List
  class={cn(
    'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none',
    className,
  )}
  data-slot="command-list"
  bind:ref
  {...restProps}
/>
