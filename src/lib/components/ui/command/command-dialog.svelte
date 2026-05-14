<script lang="ts">
  import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import * as Dialog from '$lib/components/ui/dialog/index'
  import { cn, type WithoutChildrenOrChild } from '$lib/utils'

  import Command from './command.svelte'

  let {
    children,
    class: className,
    description = 'Search for a command to run...',
    open = $bindable(false),
    portalProps,
    ref = $bindable(null),
    showCloseButton = false,
    title = 'Command Palette',
    value = $bindable(''),
    ...restProps
  }: WithoutChildrenOrChild<CommandPrimitive.RootProps> &
    WithoutChildrenOrChild<DialogPrimitive.RootProps> & {
      children: Snippet
      class?: string
      description?: string
      portalProps?: DialogPrimitive.PortalProps
      showCloseButton?: boolean
      title?: string
    } = $props()
</script>

<Dialog.Root bind:open {...restProps}>
  <Dialog.Header class="sr-only">
    <Dialog.Title>{title}</Dialog.Title>
    <Dialog.Description>{description}</Dialog.Description>
  </Dialog.Header>
  <Dialog.Content
    class={cn('top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0', className)}
    {portalProps}
    {showCloseButton}
  >
    <Command {...restProps} {children} bind:value bind:ref />
  </Dialog.Content>
</Dialog.Root>
