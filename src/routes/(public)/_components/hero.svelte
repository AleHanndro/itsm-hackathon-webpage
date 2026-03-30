<script lang="ts">
  import type { Snippet } from 'svelte'

  import GridContainer from '$lib/components/grid-container.svelte'

  const { children }: { children?: Snippet } = $props()
</script>

<section class="mt-16">
  <GridContainer>
    <h1
      class="px-2 font-display text-5xl leading-none font-bold tracking-tighter text-balance max-sm:px-4 lg:text-6xl xl:text-8xl"
    >
      ITSM Hackatón <span class="text-accent">2026</span>.
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
</section>
