<script lang="ts">
  import * as InputGroup from '$lib/components/ui/input-group/index'
  import { cn } from '$lib/utils'
  import SearchIcon from '@lucide/svelte/icons/search'
  import { Command as CommandPrimitive } from 'bits-ui'

  let {
    class: className,
    ref = $bindable(null),
    value = $bindable(''),
    ...restProps
  }: CommandPrimitive.InputProps = $props()
</script>

<div class="p-1 pb-0" data-slot="command-input-wrapper">
  <InputGroup.Root
    class="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!"
  >
    <CommandPrimitive.Input
      class={cn(
        'w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-slot="command-input"
      {value}
      {...restProps}
    >
      {#snippet child({ props })}
        <InputGroup.Input {...props} bind:value bind:ref />
      {/snippet}
    </CommandPrimitive.Input>
    <InputGroup.Addon>
      <SearchIcon class="size-4 shrink-0 opacity-50" />
    </InputGroup.Addon>
  </InputGroup.Root>
</div>
