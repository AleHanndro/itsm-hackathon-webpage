<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { addMemberSchema, type AddMemberSchema, type Member } from '../schema'
  import SelectUser from './select-user.svelte'

  let {
    form,
    open = $bindable(false),
    teamId = $bindable(null),
    users,
    ...rest
  }: ComponentProps<typeof Dialog.Root> & {
    form: SuperValidated<Infer<AddMemberSchema>>
    teamId: null | number
    users: Member[]
  } = $props()

  // svelte-ignore state_referenced_locally
  const addMemberForm = superForm(form, {
    resetForm: true,
    validators: zod4Client(addMemberSchema),
  })

  const { allErrors, enhance, reset, submitting } = addMemberForm

  $effect(() => {
    if (open) {
      reset()
    }
  })
</script>

<Dialog.Root bind:open {...rest}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Añadir Integrante</Dialog.Title>
      <Dialog.Description>Selecciona el usuario que deseas agregar al equipo.</Dialog.Description>
    </Dialog.Header>

    <form
      class="flex flex-col gap-4"
      action="?/addMember"
      method="POST"
      use:enhance={{
        onResult: ({ result }) => {
          if (result.type === 'success') {
            open = false
            teamId = null
          }
        },
      }}
    >
      <Form.Field name="teamId" form={addMemberForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} type="hidden" value={teamId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <SelectUser name="userId" form={addMemberForm} label="Selecciona un integrante" {users} />

      <Dialog.Footer>
        <Form.Button class="w-full" disabled={$submitting || $allErrors.length > 0 || !teamId}>
          {$submitting ? 'Añadiendo...' : 'Añadir Integrante'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
