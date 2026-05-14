<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import UsersIcon from '@lucide/svelte/icons/users'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { type CreateTeamSchema, createTeamSchema, type Member } from '../schema'
  import SelectUser from './select-user.svelte'

  let {
    form,
    users,
  }: {
    form: SuperValidated<Infer<CreateTeamSchema>>
    users: Member[]
  } = $props()

  let open = $state(false)

  // svelte-ignore state_referenced_locally
  const createForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success') {
        open = false
      }
    },
    validators: zod4Client(createTeamSchema),
  })

  const { allErrors, enhance, form: formData, reset, submitting } = createForm

  $effect(() => {
    if (open) {
      reset()
    }
  })
</script>

<Dialog.Root bind:open>
  <Dialog.Trigger>
    {#snippet child({ props })}
      <Button {...props} class="gap-2">
        <UsersIcon class="size-4" />
        Crear Equipo
      </Button>
    {/snippet}
  </Dialog.Trigger>

  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Nuevo Equipo</Dialog.Title>
      <Dialog.Description>
        Ingresa el nombre del equipo y selecciona a su líder para crearlo.
      </Dialog.Description>
    </Dialog.Header>

    <form class="flex flex-col gap-4" action="?/create" method="POST" use:enhance>
      <Form.Field name="name" form={createForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nombre del Equipo</Form.Label>
            <Input
              {...props}
              autocomplete="off"
              placeholder="Ej. Equipo Dinamita"
              bind:value={$formData.name}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <SelectUser name="leadMemberId" form={createForm} label="Líder del Equipo" {users} />

      <Dialog.Footer>
        <Form.Button class="w-full" disabled={$submitting || $allErrors.length > 0}>
          {$submitting ? 'Creando...' : 'Crear Equipo'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
