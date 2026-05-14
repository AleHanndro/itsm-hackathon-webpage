<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Input from '$lib/components/ui/input.svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(),
    ...props
  }: ComponentProps<typeof Input> = $props()
</script>

<Input
  class={cn(
    'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent',
    className,
  )}
  data-slot="input-group-control"
  bind:ref
  bind:value
  {...props}
/>
