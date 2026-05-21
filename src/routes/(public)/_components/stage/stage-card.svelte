<script lang="ts" module>
  import type { LucideIcon } from '@lucide/svelte/icons'

  export interface Stage {
    desc: string
    icon: LucideIcon
    order: string
    title: string
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { cn } from '$lib/utils'

  const {
    class: className,
    stage,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & { stage: Stage } = $props()
</script>

<div
  class={cn(
    'group relative h-full bg-card p-4 transition-colors hover:bg-accent-2/5 sm:p-8',
    className,
  )}
  {...restProps}
>
  <div
    class="pointer-events-none mb-4 flex items-center justify-between select-none"
    aria-hidden="true"
  >
    <div
      class="inline-grid size-12 place-content-center border border-line transition-colors group-hover:border-accent-2 group-hover:text-accent-2"
    >
      <stage.icon class="size-6" />
    </div>
    <div
      class="font-display text-3xl font-bold text-muted-foreground transition-colors group-hover:text-accent-2 sm:text-5xl lg:text-7xl"
    >
      {stage.order}
    </div>
  </div>
  <span class="mb-3 font-display text-lg font-medium text-balance sm:text-xl md:text-2xl">
    {stage.title}
  </span>
  <p class="max-w-(--breakpoint-md) text-base/7 text-pretty text-muted-foreground">
    {stage.desc}
  </p>
</div>
