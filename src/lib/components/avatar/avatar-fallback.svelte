<script lang="ts">
  import { cn } from '$lib/utils'
  import { Avatar as AvatarPrimitive } from 'bits-ui'
  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: AvatarPrimitive.FallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
  class={cn(
    'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs',
    className,
  )}
  data-slot="avatar-fallback"
  bind:ref
  {...restProps}
/>
