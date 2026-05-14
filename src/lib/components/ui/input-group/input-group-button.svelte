<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants'

  const inputGroupButtonVariants = tv({
    base: 'gap-2 text-sm flex items-center shadow-none',
    defaultVariants: {
      size: 'xs',
    },
    variants: {
      size: {
        'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
        'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
        sm: 'cn-input-group-button-size-sm',
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
      },
    },
  })

  export type InputGroupButtonSize = VariantProps<typeof inputGroupButtonVariants>['size']
</script>

<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import Button from '$lib/components/ui/button.svelte'
  import { cn } from '$lib/utils'

  let {
    children,
    class: className,
    ref = $bindable(null),
    size = 'xs',
    type = 'button',
    variant = 'ghost',
    ...restProps
  }: Omit<ComponentProps<typeof Button>, 'href' | 'size'> & {
    size?: InputGroupButtonSize
  } = $props()
</script>

<Button
  class={cn(inputGroupButtonVariants({ size }), className)}
  data-size={size}
  {type}
  {variant}
  bind:ref
  {...restProps}
>
  {@render children?.()}
</Button>
