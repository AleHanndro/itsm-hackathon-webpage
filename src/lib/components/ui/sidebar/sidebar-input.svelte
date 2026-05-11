<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Input from '$lib/components/ui/input.svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(''),
    ...restProps
  }: ComponentProps<typeof Input> = $props()
</script>

<Input
  class={cn('h-8 w-full bg-background shadow-none', className as never)}
  data-sidebar="input"
  data-slot="sidebar-input"
  bind:ref
  bind:value
  {...restProps}
/>
