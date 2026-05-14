<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { renameTeamSchema, type RenameTeamSchema } from '../schema'

  let {
    form,
    open = $bindable(false),
    teamId,
    teamName,
  }: {
    form: SuperValidated<Infer<RenameTeamSchema>>
    open: boolean
    teamId: null | number
    teamName: string
  } = $props()

  // svelte-ignore state_referenced_locally
  const renameForm = superForm(form, {
    resetForm: true,
    validators: zod4Client(renameTeamSchema),
  })

  const { allErrors, enhance, form: formData, submitting } = renameForm

  $effect(() => {
    if (open && teamName) {
      $formData.name = teamName
      $formData.teamId = teamId || 0
    }
  })
</script>

<Dialog.Root
  onOpenChange={(v) => {
    if (!v) open = false
  }}
  bind:open
>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Editar nombre del equipo</Dialog.Title>
    </Dialog.Header>

    <form
      action="?/renameTeam"
      method="POST"
      use:enhance={{
        onResult: ({ result }) => {
          if (result.type === 'success') {
            open = false
          }
        },
      }}
    >
      <Form.Field name="teamId" form={renameForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} type="hidden" value={$formData.teamId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field name="name" form={renameForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nombre</Form.Label>
            <Input {...props} autocomplete="off" required bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer class="mt-4">
        <Dialog.Close>
          {#snippet child({ props })}
            <Form.Button {...props} type="button" variant="outline">Cancelar</Form.Button>
          {/snippet}
        </Dialog.Close>
        <Form.Button disabled={$submitting || $allErrors.length > 0}>Guardar Cambios</Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
