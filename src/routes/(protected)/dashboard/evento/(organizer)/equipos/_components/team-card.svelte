<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as Avatar from '$lib/components/avatar/index'
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import { userRolesMap } from '$lib/consts'
  import PencilLineIcon from '@lucide/svelte/icons/pencil-line'
  import TrashIcon from '@lucide/svelte/icons/trash-2'
  import XIcon from '@lucide/svelte/icons/x'

  import type { TeamWithMembers } from '../schema'

  const {
    children,
    requestDelete,
    requestEditTeam,
    team,
  }: {
    children: Snippet
    requestDelete: (type: 'member' | 'team', data: Record<string, number | string>) => void
    requestEditTeam: (team: TeamWithMembers) => void
    team: TeamWithMembers
  } = $props()
</script>

<Card.Root>
  <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
    <div>
      <Card.Title>{team.name}</Card.Title>
      <Card.Description>{team.members.length} / 5 Miembros</Card.Description>
    </div>
    <div class="flex items-center gap-1">
      <Button
        class="size-8 text-muted-foreground"
        onclick={() => requestEditTeam(team)}
        size="icon"
        variant="ghost"
      >
        <PencilLineIcon class="size-4" />
      </Button>

      <Button
        class="size-8 text-destructive hover:bg-destructive/10"
        onclick={() => requestDelete('team', { teamId: team.id })}
        size="icon"
        variant="ghost"
      >
        <TrashIcon class="size-4" />
      </Button>
    </div>
  </Card.Header>

  <Card.Content class="flex-1 space-y-3">
    {#if team.project}
      <div class="rounded-md bg-secondary/50 p-3 text-sm">
        <span class="font-medium text-foreground">Proyecto:</span>
        <span class="text-muted-foreground">{team.project.name}</span>
      </div>
    {/if}
    {#each team.members as member (member.user.id)}
      {@const isLeader = member.roles.includes('leader')}
      <div class="group flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Avatar.Root class="flex items-center gap-3">
            <Avatar.Fallback>{member.user.name.charAt(0)}</Avatar.Fallback>
          </Avatar.Root>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{member.user.name}</span>
              {#each member.roles as role (role)}
                <span class="text-xs text-accent-2">{userRolesMap[role] ?? role}</span>
              {/each}
            </div>
            <span class="text-sm text-muted-foreground">{member.user.email}</span>
          </div>
        </div>

        {#if !isLeader}
          <Button
            class="size-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 hover:bg-destructive/10"
            onclick={() => requestDelete('member', { teamId: team.id, userId: member.user.id })}
            size="icon"
            variant="ghost"
          >
            <XIcon class="size-4" />
          </Button>
        {/if}
      </div>
    {/each}
  </Card.Content>

  {#if team.members.length < 5}
    <Card.Footer>
      {@render children()}
    </Card.Footer>
  {/if}
</Card.Root>
