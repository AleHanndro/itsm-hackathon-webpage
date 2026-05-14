<script lang="ts">
  import { cn } from '$lib/utils'
  import { Command as CommandPrimitive } from 'bits-ui'

  export type CommandRootApi = CommandPrimitive.Root

  let {
    api = $bindable(null),
    class: className,
    ref = $bindable(null),
    value = $bindable(''),
    ...restProps
  }: CommandPrimitive.RootProps & {
    api?: CommandRootApi | null
  } = $props()
</script>

<CommandPrimitive.Root
  bind:this={api}
  class={cn(
    'flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground',
    className,
  )}
  data-slot="command"
  bind:value
  bind:ref
  {...restProps}
/>
