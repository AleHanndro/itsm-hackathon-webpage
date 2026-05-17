<script lang="ts">
  import type { PageData } from './$types'

  let { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>Etapas de Evaluación</title>
</svelte:head>

<div class="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">Etapas de Evaluación</h1>
    {#if !data.hasStages}
      <p class="text-muted-foreground">No hay etapas configuradas en el sistema todavía.</p>
    {/if}
  </div>
</div>
