<script lang="ts">
  import type { UserWithRole } from 'better-auth/plugins/admin'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import * as Table from '$lib/components/ui/table/index'
  import { formatDate } from '$lib/utils'
  import ShieldCheckIcon from '@lucide/svelte/icons/shield-check'
  import UserIcon from '@lucide/svelte/icons/user'
  import UserCogIcon from '@lucide/svelte/icons/user-cog'

  import type { SetRoleSchema } from '../schema'

  import SetRoleDialog from './set-role-dialog.svelte'

  let {
    setRoleForm,
    users,
  }: {
    setRoleForm: SuperForm<Infer<SetRoleSchema>>
    users: UserWithRole[]
  } = $props()

  let selectedUser = $state<null | UserWithRole>(null)
  let setRoleOpen = $state(false)

  function openSetRole(user: UserWithRole) {
    selectedUser = user
    setRoleOpen = true
  }

  const roleLabel: Record<string, string> = {
    admin: 'Administrador',
    evaluator: 'Evaluador',
    staff: 'Staff',
    user: 'Usuario',
  }

  const roleBadgeClass: Record<string, string> = {
    admin: 'bg-primary/10 text-primary border-primary/20',
    evaluator: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
    staff: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    user: 'bg-muted text-muted-foreground border-border',
  }
</script>

<SetRoleDialog form={setRoleForm} user={selectedUser} bind:open={setRoleOpen} />

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
        <Table.Row>
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
              <span class="font-medium">{user.name}</span>
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
            <button
              class="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
              onclick={() => openSetRole(user)}
              type="button"
            >
              <UserCogIcon class="size-3.5" />
              Cambiar rol
            </button>
          </Table.Cell>
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell class="h-24 text-center text-muted-foreground" colspan={5}>
            No hay usuarios registrados aún.
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
