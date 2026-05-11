<script lang="ts">
  import { cn } from '$lib/utils'
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  let {
    children,
    class: className,
    inset,
    ref = $bindable(null),
    ...restProps
  }: DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean
  } = $props()
</script>

<DropdownMenuPrimitive.SubTrigger
  class={cn(
    "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-8 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  data-inset={inset}
  data-slot="dropdown-menu-sub-trigger"
  bind:ref
  {...restProps}
>
  {@render children?.()}
  <ChevronRightIcon class="ml-auto" />
</DropdownMenuPrimitive.SubTrigger>
