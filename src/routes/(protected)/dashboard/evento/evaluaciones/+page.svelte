<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import * as Table from '$lib/components/ui/table'
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import CircleXIcon from '@lucide/svelte/icons/circle-x'
  import TrophyIcon from '@lucide/svelte/icons/trophy'

  import type { PageData } from './$types'

  const { data }: { data: PageData } = $props()
</script>

<div class="flex flex-col gap-6 p-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">Resumen de Evaluaciones</h1>
    <p class="text-muted-foreground">
      Vista general del desempeño de los equipos en las diferentes etapas.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each data.stageStats as stat (stat.name)}
      <Card.Root>
        <Card.Header class="pb-2">
          <Card.Title class="text-lg">{stat.name}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <CircleCheckIcon class="h-5 w-5 text-green-500" />
                <span class="text-sm font-medium">Aprobados</span>
              </div>
              <span class="font-bold">{stat.approvedCount}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <CircleXIcon class="h-5 w-5 text-red-500" />
                <span class="text-sm font-medium">Reprobados</span>
              </div>
              <span class="font-bold">{stat.reprovedCount}</span>
            </div>
            <div class="mt-2 rounded-md bg-secondary p-3">
              <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrophyIcon class="h-4 w-4 text-yellow-500" />
                Mejor Equipo
              </div>
              <div class="mt-1 flex items-center justify-between">
                <span class="font-semibold">{stat.topTeam || 'N/A'}</span>
                <span class="text-sm"
                  >{stat.highestScore >= 0 ? `${stat.highestScore}/100` : '-'}</span
                >
              </div>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    {/each}
  </div>

  <Card.Root class="mt-4">
    <Card.Header>
      <Card.Title>Top Equipos (Promedio General)</Card.Title>
    </Card.Header>
    <Card.Content>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-[100px]">Posición</Table.Head>
            <Table.Head>Equipo</Table.Head>
            <Table.Head>Proyecto</Table.Head>
            <Table.Head class="text-right">Promedio</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data.topOverallTeams as team, index (team.teamName)}
            <Table.Row>
              <Table.Cell class="font-medium">#{index + 1}</Table.Cell>
              <Table.Cell>{team.teamName}</Table.Cell>
              <Table.Cell>{team.projectName || 'Sin proyecto'}</Table.Cell>
              <Table.Cell class="text-right font-bold">{team.average.toFixed(1)}</Table.Cell>
            </Table.Row>
          {:else}
            <Table.Row>
              <Table.Cell class="text-center text-muted-foreground" colspan={4}>
                No hay equipos con proyectos asignados.
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Content>
  </Card.Root>
</div>
