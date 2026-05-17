<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { assignEvaluatorSchema, type AssignEvaluatorSchema, type Member } from '../schema'
  import SelectUser from './select-user.svelte'

  let {
    form,
    open = $bindable(false),
    stageId = $bindable(null),
    users,
    ...rest
  }: ComponentProps<typeof Dialog.Root> & {
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
</script>

<Dialog.Root onOpenChange={handleOpenChange} bind:open {...rest}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Añadir Evaluador</Dialog.Title>
      <Dialog.Description>
        Selecciona un usuario (con rol de evaluador) para asignarlo a esta etapa.
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

      <SelectUser name="userId" form={assignForm} label="Selecciona un evaluador" {users} />

      <Dialog.Footer>
        <Form.Button class="w-full" disabled={$submitting || $allErrors.length > 0 || !stageId}>
          {$submitting ? 'Añadiendo...' : 'Añadir Evaluador'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
