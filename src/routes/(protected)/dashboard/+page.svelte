<script lang="ts">
  import { resolve } from '$app/paths'
  import Separator from '$lib/components/ui/separator.svelte'
  import { EVENT_START_DATE, userRolesMap } from '$lib/consts'
  import { formatDate } from '$lib/utils'

  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()
</script>

<svelte:head>
  <title>Dashboard - Participante</title>
</svelte:head>

{#if !data.eventStarted}
  <div class="mt-12 mb-12 flex flex-col items-center justify-center space-y-4 p-4 text-center">
    <h2 class="text-2xl font-bold text-primary">Evento no iniciado</h2>
    <p class="max-w-md text-muted-foreground">
      El evento aún no ha comenzado. La fecha de inicio está programada para el
      {formatDate(EVENT_START_DATE, { withTime: true })}
    </p>
  </div>
{/if}

{#if data.teamInfo}
  <div class="mt-8 space-y-6 p-4">
    <div>
      <h2 class="text-xl font-bold">Tu Equipo: {data.teamInfo.name}</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.teamInfo.members as member (member.email)}
          <div class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <p class="font-semibold">{member.name}</p>
            <p class="text-sm text-muted-foreground">{member.email}</p>
            {#if member.roles.length > 0}
              <div class="mt-2 flex gap-1">
                {#each member.roles as role, idx (idx)}
                  <span
                    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {userRolesMap[role]}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    {#if data.eventStarted}
      <Separator />
      {#if data.projectInfo}
        <div>
          <h2 class="text-xl font-bold">Proyecto: {data.projectInfo.name}</h2>
          <p class="mt-2 text-muted-foreground">{data.projectInfo.description}</p>
        </div>

        <div class="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Progreso General</h3>
            <div class="flex items-center gap-3 text-sm">
              <span class="flex items-center gap-1 text-green-600 dark:text-green-400">
                <span class="font-bold">{data.stages.filter((s) => s.verdict === true).length}</span
                >
                Aprobadas
              </span>
              <span class="text-muted-foreground">·</span>
              <span class="flex items-center gap-1 text-muted-foreground">
                <span class="font-bold">{data.stages.filter((s) => s.verdict === null).length}</span
                >
                Pendientes
              </span>
              <span class="text-muted-foreground">·</span>
              <span class="flex items-center gap-1 text-destructive">
                <span class="font-bold"
                  >{data.stages.filter((s) => s.verdict === false).length}</span
                >
                No Aprobadas
              </span>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="mb-4 font-medium">Estado por Etapa</h4>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {#each data.stages as stage (stage.name)}
                <a
                  class="block rounded-lg border p-4 transition-colors hover:border-primary"
                  href={resolve('/(protected)/dashboard/(user)/etapas/[stageOrder]', {
                    stageOrder: stage.order.toString(),
                  })}
                >
                  <p class="text-sm font-semibold">{stage.name}</p>
                  <p
                    class={[
                      'mt-2 text-2xl font-bold',
                      stage.verdict === null
                        ? 'text-muted-foreground'
                        : stage.verdict
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-destructive',
                    ]}
                  >
                    {stage.verdict === null
                      ? 'Pendiente'
                      : stage.verdict
                        ? 'Aprobado'
                        : 'No Aprobado'}
                  </p>
                </a>
              {/each}
            </div>
          </div>
        </div>
      {:else}
        <div class="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
          Aún no tienen un proyecto asignado.
        </div>
      {/if}
    {/if}
  </div>
{:else}
  <div class="mt-8 rounded-lg border border-dashed p-6 text-center">
    <p class="text-muted-foreground">Aún no perteneces a ningún equipo.</p>
  </div>
{/if}
