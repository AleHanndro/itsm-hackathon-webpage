<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Separator from '$lib/components/ui/separator.svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: ComponentProps<typeof Separator> = $props()
</script>

<Separator
  class={cn('mx-2 w-auto bg-sidebar-border', className as never)}
  data-sidebar="separator"
  data-slot="sidebar-separator"
  bind:ref
  {...restProps}
/>
