<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import PlusIcon from '@lucide/svelte/icons/plus'
  import ShieldIcon from '@lucide/svelte/icons/shield'
  import UsersIcon from '@lucide/svelte/icons/users'
  import { superForm } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import type { PageServerData } from './$types'

  import CreateUserDialog from './_components/create-user-dialog.svelte'
  import UsersTable from './_components/users-table.svelte'
  import { createUserSchema, setPasswordSchema, setRoleSchema } from './schema'

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

  // svelte-ignore state_referenced_locally
  const setPasswordForm = superForm(data.setPasswordForm, {
    resetForm: true,
    validators: zod4Client(setPasswordSchema),
  })
  const { message: setPasswordMessage } = setPasswordForm

  let createOpen = $state(false)
  let activeTab = $state<'participantes' | 'personal'>('personal')
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

  <!-- Success / Error messages -->
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

  {#if $setPasswordMessage?.type === 'success'}
    <div
      class="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
    >
      {$setPasswordMessage.text}
    </div>
  {/if}

  <!-- Tabs -->
  <div class="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
    <button
      class="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
        {activeTab === 'personal'
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'}"
      onclick={() => (activeTab = 'personal')}
      type="button"
    >
      <ShieldIcon class="size-4" />
      Personal
      <span class="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
        {data.staff.length}
      </span>
    </button>
    <button
      class="flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
        {activeTab === 'participantes'
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'}"
      onclick={() => (activeTab = 'participantes')}
      type="button"
    >
      <UsersIcon class="size-4" />
      Participantes
      <span class="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
        {data.participants.length}
      </span>
    </button>
  </div>

  <!-- Table -->
  {#if activeTab === 'personal'}
    <UsersTable
      currentUserId={data.currentUserId}
      emptyMessage="No hay personal registrado aún."
      {setPasswordForm}
      {setRoleForm}
      users={data.staff}
    />
  {:else}
    <UsersTable
      currentUserId={data.currentUserId}
      emptyMessage="No hay participantes registrados aún."
      {setPasswordForm}
      {setRoleForm}
      users={data.participants}
    />
  {/if}
</div>

<!-- Dialogs -->
<CreateUserDialog form={createUserForm} bind:open={createOpen} />
