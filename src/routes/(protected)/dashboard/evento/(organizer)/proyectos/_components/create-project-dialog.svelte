<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import FilePlusCornerIcon from '@lucide/svelte/icons/file-plus-corner'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { createProjectSchema, type CreateProjectSchema } from '../schema'

  let {
    form,
    teams,
    ...rest
  }: {
    form: SuperValidated<Infer<CreateProjectSchema>>
    teams: { id: number; name: string }[]
  } = $props()

  let open = $state(false)

  // svelte-ignore state_referenced_locally
  const createForm = superForm(form, {
    onResult: ({ result }) => {
      if (result.type === 'success') {
        open = false
      }
    },
    resetForm: true,
    validators: zod4Client(createProjectSchema),
  })

  const { allErrors, enhance, form: formData, reset, submitting } = createForm

  $effect(() => {
    if (open) {
      reset()
    }
  })
</script>

<Dialog.Root bind:open {...rest}>
  <Dialog.Trigger disabled={teams.length === 0}>
    {#snippet child({ props })}
      <Button {...props} class="gap-2 self-end">
        <FilePlusCornerIcon class="size-4" />
        Añadir Proyecto
      </Button>
    {/snippet}
  </Dialog.Trigger>

  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Nuevo Proyecto</Dialog.Title>
      <Dialog.Description>
        Ingresa la información del proyecto y, opcionalmente, asígnalo a un equipo.
      </Dialog.Description>
    </Dialog.Header>

    <form class="flex flex-col gap-4" action="?/createProject" method="POST" use:enhance>
      <Form.Field name="name" form={createForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nombre del Proyecto</Form.Label>
            <Input
              {...props}
              autocomplete="off"
              placeholder="Ej. App Innovadora"
              bind:value={$formData.name}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field name="description" form={createForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Descripción del Proyecto</Form.Label>
            <Input
              {...props}
              autocomplete="off"
              placeholder="Breve descripción..."
              bind:value={$formData.description}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field name="teamId" form={createForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Equipo Asignado (Opcional)</Form.Label>
            <select
              {...props}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              bind:value={$formData.teamId}
            >
              <option value={null}>Sin Asignar</option>
              {#each teams as team (team.name)}
                <option value={team.id}>{team.name}</option>
              {/each}
            </select>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        <Form.Button class="w-full" disabled={$submitting || $allErrors.length > 0}>
          {$submitting ? 'Creando...' : 'Crear Proyecto'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
