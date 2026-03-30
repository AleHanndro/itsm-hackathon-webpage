<script lang="ts">
  import type { Snippet } from 'svelte'

  import Navbar, { type NavLink } from './_components/navbar.svelte'

  const { children }: { children: Snippet } = $props()

  const navLinks: NavLink[] = [{ href: '/', label: 'Inicio' }]
</script>

<div class="fixed inset-x-0 top-0 z-10 border-b border-line bg-card">
  <Navbar {navLinks} />
</div>

<div
  class="grid min-h-dvh grid-rows-[1fr_1px_auto_1px_auto] justify-center pt-16.25 [--gutter-width:4rem] md:grid-cols-[var(--gutter-width)_minmax(0,var(--breakpoint-2xl))_var(--gutter-width)]"
>
  <span
    class="bg-pattern col-start-1 row-span-full hidden border-x border-x-(--pattern-fg) bg-fixed [--pattern-fg:var(--color-line)] md:block"
  ></span>
  <main class="col-start-2 grid gap-16 pb-16 sm:gap-24 md:pb-24">
    {@render children()}
  </main>
  <span
    class="bg-pattern col-start-3 row-span-full row-start-1 hidden border-x border-x-(--pattern-fg) bg-fixed [--pattern-fg:var(--color-line)] md:block"
  ></span>
</div>
