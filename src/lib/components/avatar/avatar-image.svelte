<script lang="ts">
  import { cn } from '$lib/utils'
  import { Avatar as AvatarPrimitive } from 'bits-ui'
  let {
    class: className,
    ref = $bindable(null),
    ...restProps
  }: AvatarPrimitive.ImageProps = $props()
</script>

<AvatarPrimitive.Image
  class={cn('aspect-square size-full rounded-full object-cover', className)}
  data-slot="avatar-image"
  bind:ref
  {...restProps}
/>
