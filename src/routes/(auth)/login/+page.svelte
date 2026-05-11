<script lang="ts">
  import * as Alert from '$lib/components/ui/alert/index'
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import Separator from '$lib/components/ui/separator.svelte'
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
        <Form.Field name="email" {form}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Correo Electrónico</Form.Label>
              <Input
                {...props}
                autocomplete="email"
                placeholder="nombre.matricula@itsmotul.edu.mx"
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

      <div class="flex items-center gap-4">
        <Separator class="flex-1" />
        <span class="text-xs text-muted-foreground uppercase">o continúa con</span>
        <Separator class="flex-1" />
      </div>

      <form action="?/signInSocial" method="POST">
        <Button class="w-full" type="submit" variant="outline">
          <svg class="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Iniciar Sesión con Google
        </Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
