<script lang="ts">
  import { cn } from '$lib/utils'
  import CheckIcon from '@lucide/svelte/icons/check'
  import { Command as CommandPrimitive } from 'bits-ui'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: CommandPrimitive.ItemProps = $props()
</script>

<CommandPrimitive.Item
  class={cn(
    "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
    className,
  )}
  data-slot="command-item"
  bind:ref
  {...restProps}
>
  {@render children?.()}
  <CheckIcon
    class="cn-command-item-indicator ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
  />
</CommandPrimitive.Item>
