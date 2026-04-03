<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '$lib/utils'

  const { children, class: className, ...restProps }: HTMLAttributes<HTMLElement> = $props()
</script>

<div
  class={cn(
    'relative',
    'before:absolute before:top-0 before:-left-[100vw] before:h-px before:w-[200vw] before:bg-line',
    'after:absolute after:bottom-0 after:-left-[100vw] after:h-px after:w-[200vw] after:bg-line',
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
