<script lang="ts">
  import * as Card from '$lib/components/ui/card/index'
  import * as Form from '$lib/components/ui/form/index'
  import TrophyIcon from '@lucide/svelte/icons/trophy'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { gradeStageSchema, type GradeStageSchema } from '../schema'

  let {
    form,
    initialScore,
    stageId,
    team,
  }: {
    form: SuperValidated<Infer<GradeStageSchema>>
    initialScore: '' | number
    stageId: number
    team: {
      id: number
      name: string
      project: null | {
        description: null | string
        id: number
        name: string
      }
    }
  } = $props()

  // svelte-ignore state_referenced_locally
  const gradeForm = superForm(form, {
    id: `grade-form-${team.id}`,
    resetForm: false,
    validators: zod4Client(gradeStageSchema),
  })

  const { enhance, form: formData, submitting } = gradeForm

  $effect(() => {
    if (team.project?.id) {
      $formData.projectId = team.project.id
    }
    $formData.stageId = stageId
  })
</script>

<Card.Root>
  <Card.Header class="pb-2">
    <div class="flex items-start justify-between">
      <div>
        <Card.Title class="text-lg">{team.name}</Card.Title>
        <p class="text-sm font-medium text-muted-foreground">
          Proyecto: {team.project?.name || 'Sin nombre'}
        </p>
      </div>
      {#if typeof initialScore === 'number' && initialScore >= 70}
        <TrophyIcon class="h-5 w-5 text-yellow-500" />
      {/if}
    </div>
  </Card.Header>
  <Card.Content>
    <p class="mb-4 line-clamp-3 text-xs text-muted-foreground">
      {team.project?.description || 'Sin descripción del proyecto.'}
    </p>

    <form class="flex flex-col gap-2" action="?/grade" method="POST" use:enhance>
      <Form.Field name="projectId" form={gradeForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} readonly type="hidden" bind:value={$formData.projectId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field name="stageId" form={gradeForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} readonly type="hidden" bind:value={$formData.stageId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Form.Button disabled={$submitting} formaction="?/deny" variant="destructive">
          Reprobado
        </Form.Button>
        <Form.Button disabled={$submitting} formaction="?/approve">Aprobado</Form.Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>
