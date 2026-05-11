<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import Button from '$lib/components/ui/button.svelte'
  import { cn, type WithElementRef } from '$lib/utils'
  import { Dialog as DialogPrimitive } from 'bits-ui'

  let {
    children,
    class: className,
    ref = $bindable(null),
    showCloseButton = false,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    showCloseButton?: boolean
  } = $props()
</script>

<div
  bind:this={ref}
  class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
  data-slot="dialog-footer"
  {...restProps}
>
  {@render children?.()}
  {#if showCloseButton}
    <DialogPrimitive.Close>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Close</Button>
      {/snippet}
    </DialogPrimitive.Close>
  {/if}
</div>
