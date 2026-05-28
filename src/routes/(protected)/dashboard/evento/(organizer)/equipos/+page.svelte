<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import UserPlusIcon from '@lucide/svelte/icons/user-plus'

  import type { PageData } from './$types'

  import AddMemberDialog from './_components/add-member-dialog.svelte'
  import ConfirmDelete from './_components/confirm-delete.svelte'
  import CreateTeamDialog from './_components/create-team-dialog.svelte'
  import EditTeam from './_components/edit-team.svelte'
  import TeamCard from './_components/team-card.svelte'

  const { data }: { data: PageData } = $props()

  let isAddMemberDialogOpen = $state(false)
  let selectedTeamId = $state<null | number>(null)

  const openAddMemberDialog = (teamId: number) => {
    selectedTeamId = teamId
    isAddMemberDialogOpen = true
  }

  let confirmDeleteState = $state({
    action: '',
    description: '',
    hiddenInputs: {} as Record<string, number | string>,
    open: false,
    title: '',
  })

  let editTeamState = $state({
    open: false,
    team: null as null | PageData['teams'][number],
  })

  const requestEditTeam = (team: PageData['teams'][number]) => {
    editTeamState = {
      open: true,
      team,
    }
  }

  const requestDelete = (
    type: 'member' | 'team',
    hiddenInputs: Record<string, number | string>,
  ) => {
    if (type === 'team') {
      confirmDeleteState = {
        action: '?/deleteTeam',
        description:
          'Esta acción no se puede deshacer. Los integrantes del equipo pasarán a estar disponibles para formar parte de otro equipo. Además, se perderán todos los datos asociados al equipo.',
        hiddenInputs,
        open: true,
        title: '¿Estás seguro de eliminar el equipo?',
      }
    } else {
      confirmDeleteState = {
        action: '?/removeMember',
        description:
          'Esta acción no se puede deshacer. El integrante será eliminado del equipo y pasará a estar disponible para formar parte de otro equipo.',
        hiddenInputs,
        open: true,
        title: '¿Estás seguro de eliminar al miembro del equipo?',
      }
    }
  }
</script>

<div class="space-y-6 p-4">
  <div class="flex flex-col">
    <h1 class="text-2xl font-bold">Equipos</h1>
    <p class="text-muted-foreground">Administra los equipos y sus integrantes.</p>
  </div>

  <div class="flex flex-col gap-3">
    <CreateTeamDialog form={data.createTeamForm} users={data.users} />

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {#each data.teams as team (team.id)}
        <TeamCard {requestDelete} {requestEditTeam} {team}>
          <div class="flex w-full flex-col gap-2">
            <Button
              class="w-full gap-2"
              onclick={() => openAddMemberDialog(team.id)}
              variant="secondary"
            >
              <UserPlusIcon class="size-4" />
              Añadir miembro
            </Button>
          </div>
        </TeamCard>
      {:else}
        <div
          class="col-span-full flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center"
        >
          <p class="text-muted-foreground text-sm">No hay equipos registrados todavía.</p>
          <p class="text-muted-foreground text-xs">
            Usa el botón <strong>Crear equipo</strong> para comenzar.
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>

<AddMemberDialog
  form={data.addMemberForm}
  onOpenChange={() => {
    if (!isAddMemberDialogOpen) {
      selectedTeamId = null
    }
  }}
  users={data.users}
  bind:teamId={selectedTeamId}
  bind:open={isAddMemberDialogOpen}
/>

<ConfirmDelete
  action={confirmDeleteState.action}
  description={confirmDeleteState.description}
  hiddenInputs={confirmDeleteState.hiddenInputs}
  title={confirmDeleteState.title}
  bind:open={confirmDeleteState.open}
/>

<EditTeam form={data.editTeamForm} team={editTeamState.team} bind:open={editTeamState.open} />
