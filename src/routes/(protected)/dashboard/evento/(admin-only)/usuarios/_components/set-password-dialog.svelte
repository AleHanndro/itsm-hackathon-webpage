<script lang="ts">
  import type { UserWithRole } from 'better-auth/plugins/admin'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import KeyRoundIcon from '@lucide/svelte/icons/key-round'

  import type { SetPasswordSchema } from '../schema'

  let {
    form,
    onSuccess,
    open = $bindable(false),
    user,
  }: {
    form: SuperForm<Infer<SetPasswordSchema>>
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
      $formData.newPassword = ''
    }
  })
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-sm">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <KeyRoundIcon class="size-4" />
        Restablecer Contraseña
      </Dialog.Title>
      <Dialog.Description>
        {#if user}
          Establece una nueva contraseña para <span class="font-semibold">{user.name}</span>. Esta
          acción no requiere la contraseña actual del usuario.
        {:else}
          Establece una nueva contraseña para el usuario.
        {/if}
      </Dialog.Description>
    </Dialog.Header>

    {#if $message?.type === 'error'}
      <div
        class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {$message.text}
      </div>
    {/if}

    <form
      class="grid gap-4"
      action="?/setPassword"
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

      <Form.Field name="newPassword" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nueva contraseña</Form.Label>
            <Input
              {...props}
              autocomplete="new-password"
              placeholder="Mínimo 8 caracteres"
              type="password"
              bind:value={$formData.newPassword}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <div
        class="rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400"
      >
        El usuario deberá usar esta nueva contraseña en su próximo inicio de sesión.
      </div>

      <Dialog.Footer class="pt-2">
        <Button onclick={() => (open = false)} type="button" variant="outline">Cancelar</Button>
        <Form.Button disabled={$submitting}>
          {$submitting ? 'Guardando...' : 'Establecer contraseña'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
