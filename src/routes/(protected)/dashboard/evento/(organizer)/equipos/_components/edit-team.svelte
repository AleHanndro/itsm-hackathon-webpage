<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import { TEAM_ROLES } from '$lib/schema/teams'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { editTeamSchema, type EditTeamSchema, type TeamWithMembers } from '../schema'

  const ROLE_LABELS: Record<(typeof TEAM_ROLES)[number], string> = {
    leader: 'Líder',
    speaker: 'Orador',
  }

  let {
    form,
    open = $bindable(false),
    team,
  }: {
    form: SuperValidated<Infer<EditTeamSchema>>
    open: boolean
    team: null | TeamWithMembers
  } = $props()

  // svelte-ignore state_referenced_locally
  const editForm = superForm(form, {
    resetForm: true,
    validators: zod4Client(editTeamSchema),
  })

  const { allErrors, enhance, form: formData, submitting } = editForm

  $effect(() => {
    if (open && team) {
      $formData.teamId = team.id
      $formData.name = team.name

      const leaderMember = team.members.find((m) => m.roles.includes('leader'))
      const speakerMember = team.members.find((m) => m.roles.includes('speaker'))

      $formData.leaderId = leaderMember?.user.id ?? ''
      $formData.speakerId = speakerMember?.user.id ?? ''
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
      <Dialog.Title>Editar Equipo</Dialog.Title>
      <Dialog.Description>Modifica el nombre, el líder y el orador del equipo.</Dialog.Description>
    </Dialog.Header>

    <form
      class="flex flex-col gap-4"
      action="?/editTeam"
      method="POST"
      use:enhance={{
        onResult: ({ result }) => {
          if (result.type === 'success') {
            open = false
          }
        },
      }}
    >
      <!-- Hidden teamId -->
      <Form.Field name="teamId" form={editForm}>
        <Form.Control>
          {#snippet children({ props: { name } })}
            <input {name} type="hidden" value={$formData.teamId} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <!-- Team name -->
      <Form.Field name="name" form={editForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nombre del equipo</Form.Label>
            <Input {...props} autocomplete="off" required bind:value={$formData.name} />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <!-- Leader selector -->
      <Form.Field name="leaderId" form={editForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>
              {ROLE_LABELS.leader}
              <span class="text-muted-foreground">(opcional)</span>
            </Form.Label>
            <select
              {...props}
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              bind:value={$formData.leaderId}
            >
              <option value="">— Sin asignar —</option>
              {#each team?.members ?? [] as member (member.user.id)}
                <option value={member.user.id}>
                  {member.user.name ?? member.user.email}
                </option>
              {/each}
            </select>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <!-- Speaker selector -->
      <Form.Field name="speakerId" form={editForm}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>
              {ROLE_LABELS.speaker}
              <span class="text-muted-foreground">(opcional)</span>
            </Form.Label>
            <select
              {...props}
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm ring-offset-background transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              bind:value={$formData.speakerId}
            >
              <option value="">— Sin asignar —</option>
              {#each team?.members ?? [] as member (member.user.id)}
                <option value={member.user.id}>
                  {member.user.name ?? member.user.email}
                </option>
              {/each}
            </select>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer class="mt-2">
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
