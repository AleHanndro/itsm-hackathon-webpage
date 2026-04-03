<script lang="ts">
  import type { Snippet } from 'svelte'

  import GridContainer from '$lib/components/grid-container.svelte'

  const { children }: { children?: Snippet } = $props()
</script>

<header class="mt-16">
  <div class="px-4 pb-3 sm:px-2">
    <p class="font-display text-base/1 font-bold tracking-wider uppercase md:text-lg/1">
      <span
        class="inline animate-gradient bg-linear-to-r from-accent via-accent-2 to-accent bg-size-[300%_100%] bg-clip-text text-transparent"
      >
        28 - 29 de Mayo
      </span>
    </p>
  </div>

  <GridContainer>
    <h1
      class="px-2 font-display text-5xl leading-none font-bold tracking-tighter text-balance max-sm:px-4 lg:text-6xl xl:text-8xl"
    >
      ITSM Hackatón
      <span
        class="inline animate-gradient bg-linear-to-r from-accent via-accent-2 to-accent bg-size-[300%_100%] bg-clip-text text-transparent"
      >
        2026
      </span>.
    </h1>
  </GridContainer>

  <GridContainer class="mt-6 md:mt-10">
    <p
      class="max-w-(--breakpoint-md) px-2 text-lg/7 font-medium text-muted-foreground max-sm:px-4 md:text-2xl/7"
    >
      24 horas continuas de innovación.<br />Transforma tus ideas en soluciones reales.
    </p>
  </GridContainer>

  {@render children?.()}
</header>
