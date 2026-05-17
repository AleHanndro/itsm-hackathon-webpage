<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import PencilLineIcon from '@lucide/svelte/icons/pencil-line'
  import TrashIcon from '@lucide/svelte/icons/trash-2'

  import type { PageData } from './$types'

  import ConfirmDelete from '../equipos/_components/confirm-delete.svelte'
  import CreateProjectDialog from './_components/create-project-dialog.svelte'
  import UpdateProjectDialog from './_components/update-project-dialog.svelte'

  const { data }: { data: PageData } = $props()

  let editState = $state({
    open: false,
    projectData: null as null | { description: null | string; name: string; teamId: null | number },
    projectId: null as null | number,
  })

  let confirmDeleteState = $state({
    action: '',
    description: '',
    hiddenInputs: {} as Record<string, number | string>,
    open: false,
    title: '',
  })

  const requestEdit = (
    projectId: number,
    projectData: { description: null | string; name: string; teamId: null | number },
  ) => {
    editState = {
      open: true,
      projectData,
      projectId,
    }
  }

  const requestDelete = (projectId: number) => {
    confirmDeleteState = {
      action: '?/deleteProject',
      description:
        'Esta acción no se puede deshacer. El proyecto será eliminado permanentemente de la base de datos.',
      hiddenInputs: { projectId },
      open: true,
      title: '¿Estás seguro de eliminar el proyecto?',
    }
  }
</script>

<div class="space-y-6 p-4">
  <header class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Proyectos</h1>
      <p class="text-muted-foreground">Administra los proyectos y asígnalos a los equipos.</p>
    </div>
  </header>

  <div class="flex flex-col gap-3">
    <CreateProjectDialog form={data.createProjectForm} teams={data.teams} />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {#each data.projects as project (project.id)}
        <Card.Root>
          <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <Card.Title>{project.name}</Card.Title>
            </div>
            <div class="flex items-center gap-1">
              <Button
                class="size-8 text-muted-foreground"
                onclick={() =>
                  requestEdit(project.id, {
                    description: project.description,
                    name: project.name,
                    teamId: project.team?.id ?? null,
                  })}
                size="icon"
                variant="ghost"
              >
                <PencilLineIcon class="size-4" />
              </Button>

              <Button
                class="size-8 text-destructive hover:bg-destructive/10"
                onclick={() => requestDelete(project.id)}
                size="icon"
                variant="ghost"
              >
                <TrashIcon class="size-4" />
              </Button>
            </div>
          </Card.Header>

          <Card.Content class="flex-1 space-y-3">
            {#if project.description}
              <p class="text-sm text-muted-foreground">{project.description}</p>
            {/if}

            <div class="rounded-md bg-secondary/50 p-3 text-sm">
              <span class="font-medium text-foreground">Equipo asignado:</span>
              <span class="text-muted-foreground">
                {project.team ? project.team.name : 'Sin asignar'}
              </span>
            </div>
          </Card.Content>
        </Card.Root>
      {:else}
        <div
          class="col-span-full flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center"
        >
          <p class="text-sm text-muted-foreground">No hay proyectos registrados todavía.</p>
          <p class="text-xs text-muted-foreground">
            Usa el botón <strong>Nuevo Proyecto</strong> para comenzar.
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<UpdateProjectDialog
  form={data.updateProjectForm}
  onOpenChange={() => {
    if (!editState.open) {
      editState.projectId = null
      editState.projectData = null
    }
  }}
  projectData={editState.projectData}
  projectId={editState.projectId}
  teams={data.teams}
  bind:open={editState.open}
/>

<ConfirmDelete
  action={confirmDeleteState.action}
  description={confirmDeleteState.description}
  hiddenInputs={confirmDeleteState.hiddenInputs}
  title={confirmDeleteState.title}
  bind:open={confirmDeleteState.open}
/>
