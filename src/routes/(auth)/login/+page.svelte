<script lang="ts">
  import * as Alert from '$lib/components/ui/alert/index'
  import * as Card from '$lib/components/ui/card/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import { SITE_TITLE } from '$lib/consts'
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert'
  import { superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'

  import type { PageData } from './$types'

  import { loginSchema } from './schema'

  let { data }: { data: PageData } = $props()

  // svelte-ignore state_referenced_locally
  const form = superForm(data.form, {
    validators: zod4(loginSchema),
  })

  const { enhance, form: formData, message } = form
</script>

<svelte:head>
  <title>Iniciar Sesión — {SITE_TITLE}</title>
</svelte:head>

<div class="flex min-h-svh items-center justify-center bg-background p-4">
  <Card.Root class="w-full max-w-md">
    <Card.Header>
      <Card.Title class="text-center font-display text-2xl font-bold">
        {SITE_TITLE}
      </Card.Title>
      <Card.Description class="text-center">
        Inicia sesión para acceder a tu cuenta.
      </Card.Description>
    </Card.Header>

    <Card.Content class="flex flex-col gap-6">
      {#if $message?.type === 'error'}
        <Alert.Root variant="destructive">
          <CircleAlertIcon />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{$message.text}</Alert.Description>
        </Alert.Root>
      {/if}

      <form class="flex flex-col gap-4" action="?/signIn" method="POST" use:enhance>
        <Form.Field name="identifier" {form}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Correo o Usuario</Form.Label>
              <Input
                {...props}
                autocomplete="username"
                placeholder="usuario o correo@itsmotul.edu.mx"
                type="text"
                bind:value={$formData.identifier}
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
                placeholder="••••••••"
                type="password"
                bind:value={$formData.password}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <Form.Button class="mt-2 w-full">Iniciar Sesión</Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
