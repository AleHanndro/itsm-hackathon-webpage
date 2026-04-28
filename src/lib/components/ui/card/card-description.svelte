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
  class={cn('text-sm text-muted-foreground', className)}
  data-slot="card-description"
  {...restProps}
>
  {@render children?.()}
</p>
