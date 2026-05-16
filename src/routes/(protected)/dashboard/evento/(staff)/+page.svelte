<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import { engineeringMap } from '$lib/consts'
  import CheckCircleIcon from '@lucide/svelte/icons/check-circle'
  import ClockIcon from '@lucide/svelte/icons/clock'
  import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap'
  import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard'
  import ShirtIcon from '@lucide/svelte/icons/shirt'
  import UsersIcon from '@lucide/svelte/icons/users'
  import XCircleIcon from '@lucide/svelte/icons/x-circle'

  import type { PageData } from './$types'

  type AcademicData = Record<
    string,
    {
      semesters: Record<
        string,
        {
          groups: Record<string, number>
          total: number
        }
      >
      total: number
    }
  >

  const { data }: { data: PageData } = $props()

  // Process status counts
  const statusCounts = $derived(
    data.statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr.count
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  const totalPreRegisters = $derived(data.statusCounts.reduce((acc, curr) => acc + curr.count, 0))

  const academicData = $derived(
    data.academicBreakdown
      .filter((curr) => curr.status === 'verificado')
      .reduce((acc, curr) => {
        if (!acc[curr.engineering]) acc[curr.engineering] = { semesters: {}, total: 0 }
        acc[curr.engineering].total += curr.count

        if (!acc[curr.engineering].semesters[curr.semester]) {
          acc[curr.engineering].semesters[curr.semester] = { groups: {}, total: 0 }
        }
        acc[curr.engineering].semesters[curr.semester].total += curr.count
        acc[curr.engineering].semesters[curr.semester].groups[curr.group] = curr.count

        return acc
      }, {} as AcademicData),
  )

  const unverifiedTotal = $derived(
    data.academicBreakdown
      .filter((curr) => curr.status !== 'verificado')
      .reduce((acc, curr) => acc + curr.count, 0),
  )

  const engineeringList = $derived(
    Object.entries(academicData).sort((a, b) => b[1].total - a[1].total),
  )
</script>

<div class="space-y-8 p-4 md:p-8">
  <div class="flex items-center gap-3">
    <div class="rounded-xl bg-primary/10 p-2.5">
      <LayoutDashboardIcon class="size-6 text-primary" />
    </div>
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Reporte del Evento</h1>
      <p class="text-muted-foreground">Resumen detallado de prerregistros y logística.</p>
    </div>
  </div>

  <!-- Summary Grid -->
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card.Root
      class="overflow-hidden border-none bg-linear-to-br from-blue-500/10 to-blue-600/5 shadow-md transition-all hover:shadow-lg"
    >
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Total Prerregistros</Card.Title>
        <UsersIcon class="size-4 text-blue-500" />
      </Card.Header>
      <Card.Content>
        <div class="text-3xl font-bold">{totalPreRegisters}</div>
        <p class="mt-1 text-xs text-muted-foreground">Alumnos interesados</p>
      </Card.Content>
    </Card.Root>

    <Card.Root
      class="overflow-hidden border-none bg-linear-to-br from-emerald-500/10 to-emerald-600/5 shadow-md transition-all hover:shadow-lg"
    >
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Verificados</Card.Title>
        <CheckCircleIcon class="size-4 text-emerald-500" />
      </Card.Header>
      <Card.Content>
        <div class="text-3xl font-bold text-emerald-600">{statusCounts.verificado || 0}</div>
        <p class="mt-1 text-xs text-muted-foreground">Inscritos confirmados</p>
      </Card.Content>
    </Card.Root>

    <Card.Root
      class="overflow-hidden border-none bg-linear-to-br from-amber-500/10 to-amber-600/5 shadow-md transition-all hover:shadow-lg"
    >
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Pendientes</Card.Title>
        <ClockIcon class="size-4 text-amber-500" />
      </Card.Header>
      <Card.Content>
        <div class="text-3xl font-bold text-amber-600">{statusCounts.pendiente || 0}</div>
        <p class="mt-1 text-xs text-muted-foreground">Por revisar</p>
      </Card.Content>
    </Card.Root>

    <Card.Root
      class="overflow-hidden border-none bg-linear-to-br from-rose-500/10 to-rose-600/5 shadow-md transition-all hover:shadow-lg"
    >
      <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium">Rechazados</Card.Title>
        <XCircleIcon class="size-4 text-rose-500" />
      </Card.Header>
      <Card.Content>
        <div class="text-3xl font-bold text-rose-600">{statusCounts.rechazado || 0}</div>
        <p class="mt-1 text-xs text-muted-foreground">No cumplen requisitos</p>
      </Card.Content>
    </Card.Root>
  </div>

  <div class="grid gap-8 lg:grid-cols-3">
    <!-- Academic Breakdown -->
    <div class="space-y-4 lg:col-span-2">
      <div class="mb-2 flex items-center gap-2">
        <GraduationCapIcon class="size-5 text-primary" />
        <h2 class="text-xl font-semibold">
          Distribución Académica
          {#if unverifiedTotal > 0}
            <span class="text-sm font-normal text-muted-foreground">
              ({unverifiedTotal} no contados)
            </span>
          {/if}
        </h2>
      </div>

      <div class="grid gap-4">
        {#each engineeringList as [eng, info] (eng)}
          <Card.Root class="overflow-hidden">
            <Card.Header class="bg-muted/50 py-3">
              <div class="flex items-center justify-between">
                <Card.Title class="text-base">
                  {engineeringMap[eng as keyof typeof engineeringMap] || eng}
                </Card.Title>
                <span
                  class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-primary"
                >
                  {info.total} alumnos
                </span>
              </div>
            </Card.Header>
            <Card.Content class="px-3">
              <div class="divide-y">
                {#each Object.entries(info.semesters).sort((a, b) => Number(a[0]) - Number(b[0])) as [semester, semInfo] (semester)}
                  <div
                    class="flex flex-col justify-between gap-2 px-4 py-3 sm:flex-row sm:items-center"
                  >
                    <div class="font-medium">
                      Semestre {semester}
                    </div>
                    <div class="flex flex-wrap gap-x-4 gap-y-1">
                      {#each Object.entries(semInfo.groups).sort() as [group, count] (group)}
                        <div class="flex items-center gap-1">
                          <span class="tracking-wider text-muted-foreground uppercase">
                            {group}:
                          </span>
                          <span class="font-semibold">{count}</span>
                        </div>
                      {/each}
                      <div class="flex items-center gap-1.5 border-l border-primary/20 pl-3">
                        <span class="text-sm tracking-wider text-muted-foreground"> Total: </span>
                        <span class="text-sm font-bold text-primary">{semInfo.total}</span>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </div>

    <!-- Logistics / Shirt Sizes -->
    <div class="space-y-4">
      <div class="mb-2 flex items-center gap-2">
        <ShirtIcon class="size-5 text-primary" />
        <h2 class="text-xl font-semibold">Tallas (participantes)</h2>
      </div>

      <Card.Root>
        <Card.Content class="pt-6">
          <div class="space-y-4">
            {#if data.shirtSizeCounts.length === 0}
              <p class="py-8 text-center text-muted-foreground">No hay alumnos verificados aún.</p>
            {:else}
              {#each data.shirtSizeCounts.sort((a, b) => b.count - a.count) as item (item.shirtSize)}
                <div class="group flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex size-10 items-center justify-center rounded-lg bg-primary/5 font-bold text-primary transition-colors group-hover:bg-primary/10"
                    >
                      {item.shirtSize}
                    </div>
                    <span class="text-sm font-medium">Talla {item.shirtSize}</span>
                  </div>
                  <div class="text-lg font-bold">
                    {item.count}
                  </div>
                </div>
              {/each}

              <div class="mt-6 border-t pt-4">
                <div class="flex items-center justify-between font-bold">
                  <span>Total de Playeras</span>
                  <span class="text-xl text-primary">
                    {data.shirtSizeCounts.reduce((a, b) => a + b.count, 0)}
                  </span>
                </div>
              </div>
            {/if}
          </div>
        </Card.Content>
      </Card.Root>

      <!-- Quick Info Card -->
      <Card.Root class="border-primary/20 bg-primary/5">
        <Card.Content class="flex gap-3 p-4">
          <div class="shrink-0 pt-0.5">
            <svg
              class="size-4 text-primary"
              fill="none"
              height="24"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
            >
          </div>
          <p class="text-xs leading-relaxed text-muted-foreground">
            Los datos de tallas se actualizan automáticamente cuando un prerregistro es aprobado por
            el equipo administrativo u organizador.
          </p>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
