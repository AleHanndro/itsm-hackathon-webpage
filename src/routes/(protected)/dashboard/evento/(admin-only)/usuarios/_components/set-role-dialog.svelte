<script lang="ts">
  import type { Roles } from '$lib/permissions'
  import type { UserWithRole } from 'better-auth/plugins/admin'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import { page } from '$app/state'
  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import * as NativeSelect from '$lib/components/ui/native-select/index'

  import type { SetRoleSchema } from '../schema'

  let {
    form,
    onSuccess,
    open = $bindable(false),
    user,
  }: {
    form: SuperForm<Infer<SetRoleSchema>>
    onSuccess?: () => void
    open?: boolean
    user: null | UserWithRole
  } = $props()

  // svelte-ignore state_referenced_locally
  const { enhance, form: formData, message, submitting } = form

  // Keep hidden userId in sync with selected user
  $effect(() => {
    if (user) {
      $formData.userId = user.id
      $formData.role = user.role as Roles
    }
  })
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-sm">
    <Dialog.Header>
      <Dialog.Title>Cambiar Rol</Dialog.Title>
      <Dialog.Description>
        {#if user}
          Modificar el rol de <span class="font-semibold">{user.name}</span>.
        {:else}
          Selecciona un nuevo rol para el usuario.
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    {#if page.status >= 400 && message}
      <div
        class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {$message}
      </div>
    {/if}

    <form
      class="grid gap-4"
      action="?/setRole"
      method="POST"
      use:enhance={{
        onResult: ({ result }) => {
          if (result.type === 'success') {
            open = false
            onSuccess?.()
          }
        },
      }}
    >
      <input name="userId" type="hidden" bind:value={$formData.userId} />

      <Form.Field name="role" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nuevo rol</Form.Label>
            <NativeSelect.Root {...props} class="w-full" bind:value={$formData.role}>
              <NativeSelect.Option value="user">Usuario</NativeSelect.Option>
              <NativeSelect.Option value="staff">Staff</NativeSelect.Option>
              <NativeSelect.Option value="admin">Administrador</NativeSelect.Option>
              <NativeSelect.Option value="evaluator">Evaluador</NativeSelect.Option>
              <NativeSelect.Option value="organizer">Organizador</NativeSelect.Option>
            </NativeSelect.Root>
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Dialog.Footer class="pt-2">
        <Button onclick={() => (open = false)} type="button" variant="outline">Cancelar</Button>
        <Form.Button disabled={$submitting}>
          {$submitting ? 'Guardando...' : 'Guardar cambios'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
