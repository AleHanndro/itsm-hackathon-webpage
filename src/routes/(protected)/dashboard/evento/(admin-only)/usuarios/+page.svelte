<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import PlusIcon from '@lucide/svelte/icons/plus'
  import { superForm } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import type { PageServerData } from './$types'

  import CreateUserDialog from './_components/create-user-dialog.svelte'
  import UsersTable from './_components/users-table.svelte'
  import { createUserSchema, setRoleSchema } from './schema'

  const { data }: { data: PageServerData } = $props()

  // svelte-ignore state_referenced_locally
  const createUserForm = superForm(data.createUserForm, {
    resetForm: true,
    validators: zod4Client(createUserSchema),
  })

  const { message: createUserMessage } = createUserForm

  // svelte-ignore state_referenced_locally
  const setRoleForm = superForm(data.setRoleForm, {
    resetForm: false,
    validators: zod4Client(setRoleSchema),
  })

  const { message: setRoleMessage } = setRoleForm

  let createOpen = $state(false)
</script>

<svelte:head>
  <title>Gestión de Usuarios</title>
</svelte:head>

<div class="space-y-6 p-4">
  <!-- Header -->
  <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Usuarios</h1>
      <p class="mt-0.5 text-sm text-muted-foreground">
        Administra los usuarios y sus roles en el sistema.
      </p>
    </div>
    <Button class="max-sm:self-end" onclick={() => (createOpen = true)}>
      <PlusIcon />
      Agregar usuario
    </Button>
  </div>

  {#if $createUserMessage?.type === 'success'}
    <div
      class="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
    >
      {$createUserMessage.text}
    </div>
  {/if}

  {#if $setRoleMessage?.type === 'success'}
    <div
      class="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
    >
      {$setRoleMessage.text}
    </div>
  {/if}

  <!-- Table -->
  <UsersTable {setRoleForm} users={data.users} />
</div>

<!-- Dialogs -->
<CreateUserDialog form={createUserForm} bind:open={createOpen} />
