<script lang="ts">
  import GridContainer from '$lib/components/grid-container.svelte'
  import BriefCaseIcon from '@lucide/svelte/icons/briefcase'
  import CodeIcon from '@lucide/svelte/icons/code'
  import CpuIcon from '@lucide/svelte/icons/cpu'
  import MapPinIcon from '@lucide/svelte/icons/map-pin'
  import PresentationIcon from '@lucide/svelte/icons/presentation'
  import SquareCheckIcon from '@lucide/svelte/icons/square-check'

  const stages = [
    { desc: 'Definir el reto a afrontar.', icon: SquareCheckIcon, id: '01', title: 'Scoping' },
    {
      desc: 'Entender el dolor del usuario.',
      icon: MapPinIcon,
      id: '02',
      title: 'Problem Exploration',
    },
    { desc: 'Prototipado rápido.', icon: CodeIcon, id: '03', title: 'Solution Development' },
    { desc: 'Confirmar hipótesis.', icon: CpuIcon, id: '04', title: 'Validation & Testing' },
    { desc: 'Sostenibilidad.', icon: BriefCaseIcon, id: '05', title: 'Business Model' },
    { desc: 'Storytelling ante jueces.', icon: PresentationIcon, id: '06', title: 'Pitch Design' },
  ]
</script>

<div>
  <GridContainer>
    <span
      class="origin-bottom-right px-2 font-mono text-sm font-bold tracking-widest text-accent uppercase select-none max-sm:px-4"
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
        class="max-w-(--breakpoint-md) px-2 text-base/7 text-pretty text-muted-foreground max-sm:px-4"
      >
        El hackathon está diseñado para desafiarte en múltiples dimensiones. No solo se trata de
        resolver un problema, sino de hacerlo de manera innovadora, sostenible y presentarlo de
        manera convincente.
      </p>
    </GridContainer>

    <div class="relative isolate mt-6 md:mt-10">
      <div
        class="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 gap-10 max-md:gap-6 lg:grid-cols-3"
      >
        <div class="border-r border-line"></div>
        <div class="border-l border-line lg:border-x"></div>
        <div class="border-l border-line max-lg:hidden"></div>
      </div>
      <ol class="grid grid-cols-2 gap-6 md:gap-10 lg:grid-cols-3">
        {#each stages as stage (stage.id)}
          {@const Icon = stage.icon}
          <li class="before:z-10 after:z-10 max-lg:nth-[2n+1]:line-y lg:nth-[3n+1]:line-y">
            <div
              class="group relative h-full bg-card p-4 transition-colors hover:bg-accent/5 sm:p-8"
            >
              <div
                class="pointer-events-none mb-4 flex items-center justify-between select-none"
                aria-hidden="true"
              >
                <div
                  class="inline-grid size-12 place-content-center border border-line transition-colors group-hover:border-accent group-hover:text-accent"
                >
                  <Icon class="size-6" />
                </div>
                <div
                  class="font-display text-3xl font-bold text-muted-foreground transition-colors group-hover:text-accent sm:text-5xl lg:text-7xl"
                >
                  {stage.id}
                </div>
              </div>
              <span
                class="mb-3 font-display text-lg font-medium text-balance sm:text-xl md:text-2xl"
              >
                {stage.title}
              </span>
              <p class="max-w-(--breakpoint-md) text-base/7 text-pretty text-muted-foreground">
                {stage.desc}
              </p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>
</div>
