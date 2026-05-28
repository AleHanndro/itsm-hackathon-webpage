<script lang="ts">
  import type { UserWithRole } from 'better-auth/plugins/admin'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import * as Table from '$lib/components/ui/table/index'
  import { formatDate } from '$lib/utils'
  import KeyRoundIcon from '@lucide/svelte/icons/key-round'
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
  import UserIcon from '@lucide/svelte/icons/user'
  import UserCogIcon from '@lucide/svelte/icons/user-cog'

  import type { SetPasswordSchema, SetRoleSchema } from '../schema'

  import SetPasswordDialog from './set-password-dialog.svelte'
  import SetRoleDialog from './set-role-dialog.svelte'

  let {
    currentUserId,
    emptyMessage = 'No hay usuarios registrados aún.',
    setPasswordForm,
    setRoleForm,
    users,
  }: {
    currentUserId: string | undefined
    emptyMessage?: string
    setPasswordForm: SuperForm<Infer<SetPasswordSchema>>
    setRoleForm: SuperForm<Infer<SetRoleSchema>>
    users: UserWithRole[]
  } = $props()

  let selectedUser = $state<null | UserWithRole>(null)
  let setRoleOpen = $state(false)
  let setPasswordOpen = $state(false)

  function openSetRole(user: UserWithRole) {
    selectedUser = user
    setRoleOpen = true
  }

  function openSetPassword(user: UserWithRole) {
    selectedUser = user
    setPasswordOpen = true
  }

  const roleLabel: Record<string, string> = {
    admin: 'Administrador',
    evaluator: 'Evaluador',
    organizer: 'Organizador',
    staff: 'Staff',
    user: 'Participante',
  }

  const roleBadgeClass: Record<string, string> = {
    admin: 'bg-primary/10 text-primary border-primary/20',
    evaluator: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    organizer: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
    staff: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    user: 'bg-muted text-muted-foreground border-border',
  }
</script>

<SetRoleDialog form={setRoleForm} user={selectedUser} bind:open={setRoleOpen} />
<SetPasswordDialog form={setPasswordForm} user={selectedUser} bind:open={setPasswordOpen} />

<div class="overflow-hidden rounded-lg border border-border bg-card">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Usuario</Table.Head>
        <Table.Head>Correo</Table.Head>
        <Table.Head>Rol</Table.Head>
        <Table.Head>Registro</Table.Head>
        <Table.Head class="text-right">Acciones</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each users as user (user.id)}
        {@const role = user.role ?? 'user'}
        {@const isSelf = user.id === currentUserId}
        <Table.Row class={isSelf ? 'opacity-60' : ''}>
          <Table.Cell>
            <div class="flex items-center gap-2.5">
              <div
                class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                {#if role === 'admin'}
                  <ShieldCheckIcon class="size-4" />
                {:else if role === 'staff'}
                  <UserCogIcon class="size-4" />
                {:else}
                  <UserIcon class="size-4" />
                {/if}
              </div>
              <div class="flex flex-col">
                <span class="font-medium">{user.name}</span>
                {#if isSelf}
                  <span
                    class="inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-1.5 py-px text-[10px] font-medium text-primary"
                    >Tú</span
                  >
                {/if}
              </div>
            </div>
          </Table.Cell>
          <Table.Cell class="text-muted-foreground">{user.email}</Table.Cell>
          <Table.Cell>
            <span
              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium {roleBadgeClass[
                role
              ] ?? roleBadgeClass.user}"
            >
              {roleLabel[role] ?? role}
            </span>
          </Table.Cell>
          <Table.Cell class="text-muted-foreground">
            {formatDate(user.createdAt)}
          </Table.Cell>
          <Table.Cell class="text-right">
            {#if isSelf}
              <span class="text-xs text-muted-foreground italic">Sin acciones</span>
            {:else}
              <div class="flex items-center justify-end gap-1.5">
                <button
                  class="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  onclick={() => openSetRole(user)}
                  type="button"
                >
                  <UserCogIcon class="size-3.5" />
                  Cambiar rol
                </button>
                <button
                  class="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  onclick={() => openSetPassword(user)}
                  type="button"
                >
                  <KeyRoundIcon class="size-3.5" />
                  Contraseña
                </button>
              </div>
            {/if}
          </Table.Cell>
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell class="h-24 text-center text-muted-foreground" colspan={5}>
            {emptyMessage}
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
