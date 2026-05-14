<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'

  import type { PageData } from './$types'

  import AddMemberDialog from './_components/add-member-dialog.svelte'
  import ConfirmDelete from './_components/confirm-delete.svelte'
  import CreateTeamDialog from './_components/create-team-dialog.svelte'
  import EditTeamName from './_components/edit-team-name.svelte'
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

  let editTeamNameState = $state({
    open: false,
    teamId: null as null | number,
    teamName: '',
  })

  const requestEditName = (teamId: number, teamName: string) => {
    editTeamNameState = {
      open: true,
      teamId,
      teamName,
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

<div class="space-y-6">
  <header class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Equipos</h1>

    <CreateTeamDialog form={data.createTeamForm} users={data.users} />
  </header>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {#each data.teams as team (team.id)}
      <TeamCard {requestDelete} {requestEditName} {team}>
        <Button class="w-full" onclick={() => openAddMemberDialog(team.id)} variant="secondary">
          Añadir miembro
        </Button>
      </TeamCard>
    {/each}
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

<EditTeamName
  form={data.renameTeamForm}
  teamId={editTeamNameState.teamId}
  teamName={editTeamNameState.teamName}
  bind:open={editTeamNameState.open}
/>
