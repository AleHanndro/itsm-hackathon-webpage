<script lang="ts">
  import type { Snippet } from 'svelte'

  import { cn, type WithoutChildrenOrChild } from '$lib/utils'
  import CheckIcon from '@lucide/svelte/icons/check'
  import MinusIcon from '@lucide/svelte/icons/minus'
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  let {
    checked = $bindable(false),
    children: childrenProp,
    class: className,
    indeterminate = $bindable(false),
    ref = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
    children?: Snippet
  } = $props()
</script>

<DropdownMenuPrimitive.CheckboxItem
  class={cn(
    "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-8 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  data-slot="dropdown-menu-checkbox-item"
  bind:ref
  bind:checked
  bind:indeterminate
  {...restProps}
>
  {#snippet children({ checked, indeterminate })}
    <span
      class="pointer-events-none absolute right-2 flex items-center justify-center"
      data-slot="dropdown-menu-checkbox-item-indicator"
    >
      {#if indeterminate}
        <MinusIcon />
      {:else if checked}
        <CheckIcon />
      {/if}
    </span>
    {@render childrenProp?.()}
  {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
