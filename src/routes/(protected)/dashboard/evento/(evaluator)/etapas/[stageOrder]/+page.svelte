<script lang="ts">
  import type { PageData } from './$types'

  import GradeCard from '../_components/grade-card.svelte'

  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>Evaluación - {data.stage.name}</title>
</svelte:head>

<div class="flex flex-col gap-6 p-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">{data.stage.name}</h1>
    {#if data.stage.description}
      <p class="text-muted-foreground">
        {data.stage.description}
      </p>
    {/if}
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.teamsWithProjects as team (team.id)}
      {@const score = data.scores.find((s) => s.projectId === team.project?.id)?.score ?? ''}
      <GradeCard form={data.form} initialScore={score} stageId={data.stage.id} {team} />
    {:else}
      <p class="col-span-full text-sm text-muted-foreground">
        No hay equipos con proyectos asignados.
      </p>
    {/each}
  </div>
</div>
