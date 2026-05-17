<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import { TEAM_ROLES } from '$lib/schema/teams'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { addMemberSchema, type AddMemberSchema, type Member } from '../schema'
  import SelectUser from './select-user.svelte'

  const ROLE_LABELS: Record<(typeof TEAM_ROLES)[number], string> = {
    leader: 'Líder',
    speaker: 'Orador',
  }

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

  const { allErrors, enhance, form: formData, reset, submitting } = addMemberForm

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
      <Dialog.Description>
        Selecciona el usuario y, opcionalmente, asígnale un rol en el equipo.
      </Dialog.Description>
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

      <Form.Field name="roles" form={addMemberForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label
              >Rol en el equipo <span class="text-muted-foreground">(opcional)</span></Form.Label
            >
            <div class="flex flex-wrap gap-2 pt-1">
              {#each TEAM_ROLES as role (role)}
                {@const checked = $formData.roles.includes(role)}
                <label
                  class="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors {checked
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'}"
                >
                  <input
                    {...props}
                    name="roles"
                    class="sr-only"
                    type="checkbox"
                    value={role}
                    bind:group={$formData.roles}
                  />
                  {ROLE_LABELS[role]}
                </label>
              {/each}
            </div>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer>
        <Form.Button class="w-full" disabled={$submitting || $allErrors.length > 0 || !teamId}>
          {$submitting ? 'Añadiendo...' : 'Añadir Integrante'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
