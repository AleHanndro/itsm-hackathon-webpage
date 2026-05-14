<script lang="ts">
  import { cn } from '$lib/utils'
  import { Command as CommandPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: CommandPrimitive.SeparatorProps = $props()
</script>

<CommandPrimitive.Separator
  class={cn('-mx-1 h-px w-auto bg-border', className)}
  data-slot="command-separator"
  bind:ref
  {...restProps}
/>
