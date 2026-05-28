<script lang="ts">
  import { enhance } from '$app/forms'
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import StarIcon from '@lucide/svelte/icons/star'
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

  /** IDs of evaluators already assigned to the currently selected stage */
  const assignedIds = $derived(
    data.stages.find((s) => s.id === selectedStageId)?.stagesEvaluators.map((e) => e.user.id) ?? [],
  )
</script>

<svelte:head>
  <title>Evaluadores - Staff</title>
</svelte:head>

<div class="flex flex-col gap-6 p-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">Asignación de Evaluadores</h1>
    <p class="text-muted-foreground">
      Configura qué evaluadores pueden calificar cada etapa del evento y quiénes pueden realizar la
      evaluación final.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {#each data.stages as stage (stage.id)}
      <Card.Root>
        <Card.Header class="pb-3">
          <div class="flex items-start justify-between">
            <div>
              <Card.Title class="text-lg">{stage.name}</Card.Title>
              <Card.Description>{stage.stagesEvaluators.length} evaluador(es)</Card.Description>
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
            <ul class="flex flex-col gap-2">
              {#each stage.stagesEvaluators as assignment (assignment.user.id)}
                <li class="flex items-center justify-between rounded-md border p-2 text-sm">
                  <div class="flex min-w-0 flex-col">
                    <div class="flex items-center gap-1.5">
                      <span class="truncate font-medium">
                        {assignment.user.name ?? assignment.user.email}
                      </span>
                      {#if assignment.canEvaluateFinal}
                        <span
                          class="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
                        >
                          <StarIcon class="size-3" />
                          Final
                        </span>
                      {/if}
                    </div>
                    {#if assignment.user.name}
                      <span class="text-xs text-muted-foreground">{assignment.user.email}</span>
                    {/if}
                  </div>

                  <div class="ml-2 flex shrink-0 items-center gap-1">
                    <!-- Toggle canEvaluateFinal -->
                    <form action="?/updateFinalEval" method="POST" use:enhance>
                      <input name="stageId" type="hidden" value={stage.id} />
                      <input name="userId" type="hidden" value={assignment.user.id} />
                      <input
                        name="canEvaluateFinal"
                        type="hidden"
                        value={assignment.canEvaluateFinal ? 'false' : 'true'}
                      />
                      <Button
                        class="size-8 transition-colors {assignment.canEvaluateFinal
                          ? 'text-amber-500 hover:bg-amber-500/10 hover:text-amber-600'
                          : 'text-muted-foreground hover:text-amber-500'}"
                        size="icon"
                        title={assignment.canEvaluateFinal
                          ? 'Quitar permiso de evaluación final'
                          : 'Permitir evaluación final'}
                        type="submit"
                        variant="ghost"
                      >
                        <StarIcon
                          class="size-4"
                          fill={assignment.canEvaluateFinal ? 'currentColor' : 'none'}
                        />
                        <span class="sr-only">
                          {assignment.canEvaluateFinal
                            ? 'Quitar permiso de evaluación final'
                            : 'Permitir evaluación final'}
                        </span>
                      </Button>
                    </form>

                    <!-- Remove evaluator -->
                    <form action="?/remove" method="POST" use:enhance>
                      <input name="stageId" type="hidden" value={stage.id} />
                      <input name="userId" type="hidden" value={assignment.user.id} />
                      <Button
                        class="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        size="icon"
                        type="submit"
                        variant="ghost"
                      >
                        <TrashIcon class="size-4" />
                        <span class="sr-only">Remover</span>
                      </Button>
                    </form>
                  </div>
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
  assignedUserIds={assignedIds}
  form={data.assignForm}
  users={data.availableEvaluators}
  bind:open={isAssignDialogOpen}
  bind:stageId={selectedStageId}
/>
