<script lang="ts">
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import { page } from '$app/state'
  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import * as NativeSelect from '$lib/components/ui/native-select/index'

  import type { CreateUserSchema } from '../schema'

  let {
    form,
    onSuccess,
    open = $bindable(false),
  }: {
    form: SuperForm<Infer<CreateUserSchema>>
    onSuccess?: () => void
    open?: boolean
  } = $props()

  // svelte-ignore state_referenced_locally
  const { enhance, form: formData, message, submitting } = form
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>Agregar Usuario</Dialog.Title>
      <Dialog.Description>
        Crea una cuenta nueva. El usuario podrá acceder con estas credenciales.
      </Dialog.Description>
    </Dialog.Header>

    {#if page.status >= 400 && $message}
      <div
        class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        {$message}
      </div>
    {/if}

    <form
      class="grid gap-4"
      action="?/createUser"
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
      <Form.Field name="name" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nombre completo</Form.Label>
            <Input
              {...props}
              placeholder="Ej. Juan Pérez"
              type="text"
              bind:value={$formData.name}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field name="email" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Correo electrónico</Form.Label>
            <Input
              {...props}
              placeholder="usuario@ejemplo.com"
              type="email"
              bind:value={$formData.email}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field name="password" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Contraseña</Form.Label>
            <Input
              {...props}
              placeholder="Mínimo 8 caracteres"
              type="password"
              bind:value={$formData.password}
            />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field name="role" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Rol</Form.Label>
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
          {$submitting ? 'Creando...' : 'Crear usuario'}
        </Form.Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
