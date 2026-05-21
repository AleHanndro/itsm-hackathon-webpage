<script lang="ts">
  import GridContainer from '$lib/components/grid-container.svelte'

  import Stage01 from './stage/stage-01.svelte'
  import Stage02 from './stage/stage-02.svelte'
  import Stage03 from './stage/stage-03.svelte'
  import Stage04 from './stage/stage-04.svelte'
  import Stage05 from './stage/stage-05.svelte'
  import Stage06 from './stage/stage-06.svelte'

  const stages = [Stage01, Stage02, Stage03, Stage04, Stage05, Stage06]
</script>

<div>
  <GridContainer>
    <span
      class="origin-bottom-right px-2 font-mono text-sm font-bold tracking-widest text-accent-2 uppercase select-none max-sm:px-4"
    >
      Etapas
    </span>
  </GridContainer>

  <section>
    <GridContainer class="mt-4">
      <h2
        class="max-w-lg px-2 font-display text-[2.5rem]/10 font-medium tracking-tighter max-sm:px-4"
      >
        ¿A qué me voy a enfrentar?
      </h2>
    </GridContainer>

    <GridContainer class="mt-6 md:mt-10">
      <p
        class="mb-[1.25em] max-w-(--breakpoint-md) px-2 text-base/7 text-pretty text-muted-foreground max-sm:px-4"
      >
        El hackatón está diseñado para desafiarte en múltiples dimensiones. No solo se trata de
        resolver un problema, sino de hacerlo de manera innovadora, sostenible y presentarlo de
        manera convincente.
      </p>
      <p
        class="max-w-(--breakpoint-md) px-2 text-base/7 text-pretty text-muted-foreground max-sm:px-4"
      >
        Por ello hemos elegido un programa de innovación utilizado por empresas en todo el mundo y
        que se divide en seis etapas. Cada una de ellas diseñada para asegurar el éxito de tu
        propuesta. A continuación, te presentamos las etapas del hackatón,
        <b class="font-bold text-foreground">
          puedes dar clic en cada una de ellas para obtener más información
        </b>.
      </p>
    </GridContainer>

    <div class="relative isolate mt-6 md:mt-10">
      <div
        class="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 gap-10 max-md:gap-6 lg:grid-cols-3"
      >
        <div class="border-r border-line max-md:hidden"></div>
        <div class="border-l border-line lg:border-x"></div>
        <div class="border-l border-line max-lg:hidden"></div>
      </div>
      <ol class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {#each stages as Stage, i (i)}
          <li
            class="before:z-10 after:z-10 max-md:line-y md:max-lg:nth-[2n+1]:line-y lg:nth-[3n+1]:line-y"
          >
            <Stage />
          </li>
        {/each}
      </ol>
    </div>
  </section>
</div>
