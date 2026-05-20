<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import * as Form from '$lib/components/ui/form/index'
  import * as InputGroup from '$lib/components/ui/input-group/index'
  import EyeIcon from '@lucide/svelte/icons/eye'
  import EyeOffIcon from '@lucide/svelte/icons/eye-off'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { changePasswordSchema, type ChangePasswordSchema } from '../schema'

  const { form: changePasswordForm }: { form: SuperValidated<Infer<ChangePasswordSchema>> } =
    $props()

  // svelte-ignore state_referenced_locally
  const form = superForm(changePasswordForm, {
    multipleSubmits: 'abort',
    validators: zod4Client(changePasswordSchema),
  })

  const { allErrors, enhance, form: formData, submitting } = form

  let showPassword = $state(false)
  const areAllFieldsFilled = $derived(
    !!$formData.currentPassword && !!$formData.newPassword && !!$formData.confirmNewPassword,
  )
</script>

{#snippet showPasswordToggle()}
  <Button
    aria-label="Mostrar contraseña"
    onclick={() => (showPassword = !showPassword)}
    title="Mostrar contraseña"
    variant="ghost"
  >
    {#if showPassword}
      <EyeOffIcon />
    {:else}
      <EyeIcon />
    {/if}
  </Button>
{/snippet}

<form action="?/changePassword" method="POST" use:enhance>
  <Form.Field name="currentPassword" {form}>
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Contraseña actual</Form.Label>
        <InputGroup.Root>
          <InputGroup.Input
            {...props}
            type={showPassword ? 'text' : 'password'}
            bind:value={$formData.currentPassword}
          />
          <InputGroup.Addon align="inline-end">
            {@render showPasswordToggle()}
          </InputGroup.Addon>
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field name="newPassword" {form}>
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Nueva contraseña</Form.Label>
        <InputGroup.Root>
          <InputGroup.Input
            {...props}
            type={showPassword ? 'text' : 'password'}
            bind:value={$formData.newPassword}
          />
          <InputGroup.Addon align="inline-end">
            {@render showPasswordToggle()}
          </InputGroup.Addon>
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field name="confirmNewPassword" {form}>
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Confirmar nueva contraseña</Form.Label>
        <InputGroup.Root>
          <InputGroup.Input
            {...props}
            type={showPassword ? 'text' : 'password'}
            bind:value={$formData.confirmNewPassword}
          />
          <InputGroup.Addon align="inline-end">
            {@render showPasswordToggle()}
          </InputGroup.Addon>
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button disabled={$allErrors.length > 0 || !areAllFieldsFilled || $submitting}>
    Cambiar contraseña
  </Form.Button>
</form>
