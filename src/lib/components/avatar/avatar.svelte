<script lang="ts">
  import { cn } from '$lib/utils'
  import { Avatar as AvatarPrimitive } from 'bits-ui'
  let {
    class: className,
    loadingStatus = $bindable('loading'),
    ref = $bindable(null),
    size = 'default',
    ...restProps
  }: AvatarPrimitive.RootProps & {
    size?: 'default' | 'lg' | 'sm'
  } = $props()
</script>

<AvatarPrimitive.Root
  class={cn(
    'group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
    className,
  )}
  data-size={size}
  data-slot="avatar"
  bind:ref
  bind:loadingStatus
  {...restProps}
/>
