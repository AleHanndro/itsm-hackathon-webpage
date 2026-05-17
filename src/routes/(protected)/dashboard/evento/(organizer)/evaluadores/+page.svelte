<script lang="ts">
  import { enhance } from '$app/forms'
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import TrashIcon from '@lucide/svelte/icons/trash-2'
  import UserPlusIcon from '@lucide/svelte/icons/user-plus'

  import type { PageData } from './$types'

  import AssignEvaluatorDialog from './_components/assign-evaluator-dialog.svelte'

  let { data }: { data: PageData } = $props()

  let isAssignDialogOpen = $state(false)
  let selectedStageId = $state<null | number>(null)

  const openAssignDialog = (stageId: number) => {
    selectedStageId = stageId
    isAssignDialogOpen = true
  }
</script>

<svelte:head>
  <title>Evaluadores - Staff</title>
</svelte:head>

<div class="flex flex-col gap-6 p-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">Asignación de Evaluadores</h1>
    <p class="text-muted-foreground">
      Configura qué evaluadores pueden calificar cada etapa del evento.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {#each data.stages as stage (stage.id)}
      <Card.Root>
        <Card.Header class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <Card.Title class="text-lg">{stage.name}</Card.Title>
            </div>
            <Button onclick={() => openAssignDialog(stage.id)} size="icon" variant="ghost">
              <UserPlusIcon class="size-4" />
              <span class="sr-only">Añadir evaluador</span>
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          {#if stage.stagesEvaluators.length === 0}
            <p class="text-sm text-muted-foreground">No hay evaluadores asignados.</p>
          {:else}
            <ul class="flex flex-col gap-3">
              {#each stage.stagesEvaluators as assignment (assignment.stageId)}
                <li class="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div class="flex flex-col">
                    <span class="font-medium">{assignment.user.name ?? assignment.user.email}</span>
                    {#if assignment.user.name}
                      <span class="text-xs text-muted-foreground">{assignment.user.email}</span>
                    {/if}
                  </div>
                  <form action="?/remove" method="POST" use:enhance>
                    <input name="stageId" type="hidden" value={stage.id} />
                    <input name="userId" type="hidden" value={assignment.user.id} />
                    <Button
                      class="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      size="icon"
                      type="submit"
                      variant="ghost"
                    >
                      <TrashIcon class="size-4" />
                      <span class="sr-only">Remover</span>
                    </Button>
                  </form>
                </li>
              {/each}
            </ul>
          {/if}
        </Card.Content>
      </Card.Root>
    {/each}
  </div>
</div>

<AssignEvaluatorDialog
  form={data.assignForm}
  users={data.availableEvaluators}
  bind:open={isAssignDialogOpen}
  bind:stageId={selectedStageId}
/>
