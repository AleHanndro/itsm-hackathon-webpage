<script lang="ts">
  import type { Snippet } from 'svelte'

  import * as Avatar from '$lib/components/avatar/index'
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import PencilLineIcon from '@lucide/svelte/icons/pencil-line'
  import TrashIcon from '@lucide/svelte/icons/trash-2'
  import XIcon from '@lucide/svelte/icons/x'

  import type { TeamWithMembers } from '../schema'

  const {
    children,
    requestDelete,
    requestEditName,
    team,
  }: {
    children: Snippet
    requestDelete: (type: 'member' | 'team', data: Record<string, number | string>) => void
    requestEditName: (teamId: number, teamName: string) => void
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
        onclick={() => requestEditName(team.id, team.name)}
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
    {#each team.members as { user } (user.id)}
      <div class="group flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Avatar.Root class="flex items-center gap-3">
            <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
          </Avatar.Root>
          <div class="flex flex-col">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium">{user.name}</span>
              {#if user.id === team.leaderId}
                <span class="text-xs text-accent-2">Líder</span>
              {/if}
            </div>
            <span class="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>

        {#if user.id !== team.leaderId}
          <Button
            class="size-8 text-destructive transition-opacity group-hover:opacity-100 focus-within:opacity-100 hover:bg-destructive/10 sm:opacity-0"
            onclick={() => requestDelete('member', { teamId: team.id, userId: user.id })}
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
