<script lang="ts" module>
  import type { Pathname } from '$app/types'
  import type { LucideProps } from '@lucide/svelte/icons'
  import type { Component } from 'svelte'

  export interface SidebarItem {
    icon: Component<LucideProps>
    title: string
    url: Pathname
  }

  export interface SidebarGroup {
    group: string
    items: SidebarItem[]
  }

  export type SidebarGroups = SidebarGroup[]
</script>

<script lang="ts">
  import type { ComponentProps } from 'svelte'

  import { resolve } from '$app/paths'
  import * as Sidebar from '$lib/components/ui/sidebar/index'

  import NavUser from './nav-user.svelte'

  interface SidebarProps {
    items: SidebarGroups
    user: ComponentProps<typeof NavUser>['user']
  }

  let { items, user }: SidebarProps = $props()
</script>

<Sidebar.Root variant="inset">
  <Sidebar.Header />
  <Sidebar.Content>
    {#each items as { group, items: groupItems } (group)}
      <Sidebar.Group>
        <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each groupItems as item (item.title)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href={resolve(item.url)} {...props}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    {/each}
  </Sidebar.Content>
  <Sidebar.Footer>
    <NavUser {user} />
  </Sidebar.Footer>
</Sidebar.Root>
