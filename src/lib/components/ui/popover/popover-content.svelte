<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { cn, type WithoutChildrenOrChild } from '$lib/utils'
  import { Popover as PopoverPrimitive } from 'bits-ui'

  import PopoverPortal from './popover-portal.svelte'

  let {
    align = 'center',
    class: className,
    portalProps,
    ref = $bindable(null),
    sideOffset = 4,
    ...restProps
  }: PopoverPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof PopoverPortal>>
  } = $props()
</script>

<PopoverPortal {...portalProps}>
  <PopoverPrimitive.Content
    class={cn(
      'z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-md bg-popover p-4 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
      className,
    )}
    {align}
    data-slot="popover-content"
    {sideOffset}
    bind:ref
    {...restProps}
  />
</PopoverPortal>
