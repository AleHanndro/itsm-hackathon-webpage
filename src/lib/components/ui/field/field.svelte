<script lang="ts" module>
  import { tv, type VariantProps } from 'tailwind-variants'

  export const fieldVariants = tv({
    base: 'data-[invalid=true]:text-destructive gap-3 group/field flex w-full',
    defaultVariants: {
      orientation: 'vertical',
    },
    variants: {
      orientation: {
        horizontal:
          'cn-field-orientation-horizontal flex-row items-center has-[>[data-slot=field-content]]:items-start [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        responsive:
          'cn-field-orientation-responsive flex-col @md/field-group:flex-row @md/field-group:items-center @md/field-group:has-[>[data-slot=field-content]]:items-start [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        vertical: 'cn-field-orientation-vertical flex-col [&>*]:w-full [&>.sr-only]:w-auto',
      },
    },
  })

  export type FieldOrientation = VariantProps<typeof fieldVariants>['orientation']
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn, type WithElementRef } from '$lib/utils'

  let {
    children,
    class: className,
    orientation = 'vertical',
    ref = $bindable(null),
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    orientation?: FieldOrientation
  } = $props()
</script>

<div
  bind:this={ref}
  class={cn(fieldVariants({ orientation }), className)}
  data-orientation={orientation}
  data-slot="field"
  role="group"
  {...restProps}
>
  {@render children?.()}
</div>
