<script lang="ts">
  import type { User } from '$lib/server/auth'

  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index'
  import * as Sidebar from '$lib/components/ui/sidebar/index'
  import { useSidebar } from '$lib/components/ui/sidebar/index'
  import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down'
  import LogOutIcon from '@lucide/svelte/icons/log-out'

  import * as Avatar from '../avatar/index'
  import Button from '../ui/button.svelte'

  const { user }: { user: User } = $props()

  const sidebar = useSidebar()
</script>

{#snippet avatar()}
  <Avatar.Root class="size-8 rounded-full">
    <Avatar.Image
      alt={user.name}
      fetchpriority="high"
      referrerpolicy="no-referrer"
      src={user.image}
    />
    <Avatar.Fallback class="rounded-full">{user.name.charAt(0)}</Avatar.Fallback>
  </Avatar.Root>
{/snippet}

{#snippet userInfo()}
  <div class="grid flex-1 text-start text-sm leading-tight">
    <span class="truncate font-medium">{user.name}</span>
    <span class="truncate text-sm">{user.email}</span>
  </div>
{/snippet}

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton size="lg" {...props}>
            {@render avatar()}
            {@render userInfo()}
            <ChevronsUpDownIcon class="ms-auto size-4" />
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56"
        align="end"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            {@render avatar()}
            {@render userInfo()}
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <form action="/login?/signOut" method="POST">
            <DropdownMenu.Item class="p-0">
              <Button class="w-full justify-start" type="submit" variant="ghost">
                <LogOutIcon />
                Cerrar Sesión
              </Button>
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
