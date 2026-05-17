<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { updateProjectSchema, type UpdateProjectSchema } from '../schema'

  let {
    form,
    open = $bindable(false),
    projectData,
    projectId,
    teams,
    ...rest
  }: ComponentProps<typeof Dialog.Root> & {
    form: SuperValidated<Infer<UpdateProjectSchema>>
    projectData: null | { description: null | string; name: string; teamId: null | number }
    projectId: null | number
    teams: { id: number; name: string }[]
  } = $props()

  // svelte-ignore state_referenced_locally
  const updateForm = superForm(form, {
    resetForm: false,
    validators: zod4Client(updateProjectSchema),
  })

  const { allErrors, enhance, form: formData, reset, submitting } = updateForm

  $effect(() => {
    if (open && projectData && projectId) {
      $formData.projectId = projectId
      $formData.name = projectData.name
      $formData.description = projectData.description || ''
      $formData.teamId = projectData.teamId
    } else if (!open) {
      reset()
    }
  })
</script>

<Dialog.Root bind:open {...rest}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Editar Proyecto</Dialog.Title>
      <Dialog.Description>
        Modifica la información del proyecto o reasígnalo a otro equipo.
      </Dialog.Description>
    </Dialog.Header>

    <form
      class="flex flex-col gap-4"
      action="?/updateProject"
      method="POST"
      use:enhance={{
        onResult: ({ result }) => {
          if (result.type === 'success') {
            open = false
          }
        },
      }}
    >
      <Form.Field name="projectId" form={updateForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} type="hidden" value={$formData.projectId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field name="name" form={updateForm}>
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

      <Form.Field name="description" form={updateForm}>
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

      <Form.Field name="teamId" form={updateForm}>
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
          {$submitting ? 'Guardando...' : 'Guardar Cambios'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
