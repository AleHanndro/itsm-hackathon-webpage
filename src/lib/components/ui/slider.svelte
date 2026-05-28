<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from '$lib/utils'
  import { Slider as SliderPrimitive } from 'bits-ui'

  let {
    class: className,
    orientation = 'horizontal',
    ref = $bindable(null),
    value = $bindable(),
    ...restProps
  }: WithoutChildrenOrChild<SliderPrimitive.RootProps> = $props()
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
  class={cn(
    'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
    className,
  )}
  data-slot="slider"
  {orientation}
  bind:ref
  bind:value={value as never}
  {...restProps}
>
  {#snippet children({ thumbItems })}
    <span
      class={cn(
        'relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5',
      )}
      data-orientation={orientation}
      data-slot="slider-track"
    >
      <SliderPrimitive.Range
        class={cn('absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full')}
        data-slot="slider-range"
      />
    </span>
    {#each thumbItems as thumb (thumb.index)}
      <SliderPrimitive.Thumb
        class="block size-4 shrink-0 rounded-full border border-primary bg-white shadow-sm ring-ring/50 transition-[color,box-shadow] select-none hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        data-slot="slider-thumb"
        index={thumb.index}
      />
    {/each}
  {/snippet}
</SliderPrimitive.Root>
