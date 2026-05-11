<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Button from '$lib/components/ui/button.svelte'
  import { cn } from '$lib/utils'
  import PanelLeftIcon from '@lucide/svelte/icons/panel-left'

  import { useSidebar } from './context.svelte'

  let {
    class: className,
    onclick,
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof Button> & {
    onclick?: (e: MouseEvent) => void
  } = $props()

  const sidebar = useSidebar()
</script>

<Button
  class={cn('cn-sidebar-trigger', className as never)}
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  onclick={(e: MouseEvent) => {
    onclick?.(e)
    sidebar.toggle()
  }}
  size="icon-sm"
  type="button"
  variant="ghost"
  bind:ref
  {...restProps}
>
  <PanelLeftIcon />
  <span class="sr-only">Toggle Sidebar</span>
</Button>
