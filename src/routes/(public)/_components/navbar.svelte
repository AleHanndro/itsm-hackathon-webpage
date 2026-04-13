<script lang="ts" module>
  import type { Pathname } from '$app/types'

  export interface NavLink {
    href: Pathname
    label: string
  }
</script>

<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { buttonVariants } from '$lib/components/ui/button.svelte'
  import * as Sheet from '$lib/components/ui/sheet'
  import MenuIcon from '@lucide/svelte/icons/menu'

  const { navLinks }: { navLinks: NavLink[] } = $props()
</script>

{#snippet links(className: string)}
  {#each navLinks as { href, label } (href)}
    {@const isActive = page.url.pathname === href || page.url.pathname.startsWith(href + '/')}
    <a
      class={[className, { 'text-accent': isActive }]}
      aria-current={isActive ? 'page' : undefined}
      href={resolve(href)}
    >
      {label}
    </a>
  {/each}
{/snippet}

<div
  class="relative mx-auto flex h-16 max-w-(--breakpoint-2xl) items-center justify-between px-4 md:px-10"
>
  <a class="shrink-0 font-display text-xl font-medium tracking-tighter" href={resolve('/')}>
    ITSM Hackatón
  </a>

  <nav class="hidden items-center gap-8 font-display font-medium tracking-wider uppercase md:flex">
    {@render links('hover:text-accent transition-colors')}
  </nav>

  <div class="md:hidden">
    <Sheet.Root>
      <Sheet.Trigger
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        class={buttonVariants({ size: 'icon', variant: 'outline' })}
        aria-label="Abrir Menú"
      >
        <MenuIcon />
      </Sheet.Trigger>
      <Sheet.Content class="border-l border-line bg-card font-display font-medium" side="right">
        <nav class="flex flex-col gap-6 pt-10">
          {@render links('border-b border-border px-10 pb-2 uppercase tracking-widest')}
        </nav>
      </Sheet.Content>
    </Sheet.Root>
  </div>
</div>
