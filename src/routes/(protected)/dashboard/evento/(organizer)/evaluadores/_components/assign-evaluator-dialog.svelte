<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { assignEvaluatorSchema, type AssignEvaluatorSchema, type Member } from '../schema'
  import SelectUser from './select-user.svelte'

  let {
    assignedUserIds = [],
    form,
    open = $bindable(false),
    stageId = $bindable(null),
    users,
    ...rest
  }: ComponentProps<typeof Dialog.Root> & {
    assignedUserIds: string[]
    form: SuperValidated<Infer<AssignEvaluatorSchema>>
    stageId: null | number
    users: Member[]
  } = $props()

  // svelte-ignore state_referenced_locally
  const assignForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success') {
        open = false
        stageId = null
      }
    },
    resetForm: true,
    validators: zod4Client(assignEvaluatorSchema),
  })

  const { allErrors, enhance, form: formData, reset, submitting } = assignForm

  const handleOpenChange = () => {
    if (!open) {
      stageId = null
    }
  }

  $effect(() => {
    if (open) {
      reset()
    }
  })

  $effect(() => {
    if (stageId) {
      $formData.stageId = stageId
    }
  })

  /** Evaluators not yet assigned to the selected stage */
  const availableUsers = $derived(users.filter((u) => !assignedUserIds.includes(u.id)))
</script>

<Dialog.Root onOpenChange={handleOpenChange} bind:open {...rest}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Añadir Evaluador</Dialog.Title>
      <Dialog.Description>
        Selecciona un evaluador disponible y configura sus permisos para esta etapa.
      </Dialog.Description>
    </Dialog.Header>

    <form class="flex flex-col gap-4" action="?/assign" method="POST" use:enhance>
      <Form.Field name="stageId" form={assignForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} type="hidden" bind:value={$formData.stageId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      {#if availableUsers.length === 0}
        <p
          class="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground"
        >
          Todos los evaluadores ya han sido asignados a esta etapa.
        </p>
      {:else}
        <SelectUser
          name="userId"
          form={assignForm}
          label="Selecciona un evaluador"
          users={availableUsers}
        />
      {/if}

      <Form.Field name="canEvaluateFinal" form={assignForm}>
        <Form.Control>
          {#snippet children({ props })}
            <label
              class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors {$formData.canEvaluateFinal
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'}"
            >
              <input
                {...props}
                class="mt-0.5 accent-primary"
                type="checkbox"
                bind:checked={$formData.canEvaluateFinal}
              />
              <span class="flex flex-col gap-0.5">
                <span class="text-sm font-medium">Puede evaluar la final</span>
                <span class="text-xs text-muted-foreground">
                  Permite a este evaluador participar en la evaluación final del evento.
                </span>
              </span>
            </label>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        <Form.Button
          class="w-full"
          disabled={$submitting || $allErrors.length > 0 || !stageId || availableUsers.length === 0}
        >
          {$submitting ? 'Añadiendo...' : 'Añadir Evaluador'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
