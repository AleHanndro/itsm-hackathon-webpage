<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props()
</script>

<p
  bind:this={ref}
  class={cn(
    'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
    'last:mt-0 nth-last-2:-mt-1',
    '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
    className,
  )}
  data-slot="field-description"
  {...restProps}
>
  {@render children?.()}
</p>
