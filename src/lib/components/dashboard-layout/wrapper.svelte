<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte'

  import * as Sidebar from '../ui/sidebar/index'
  import DashboardSidebar from './sidebar.svelte'

  const {
    children,
    items,
    user,
  }: {
    children: Snippet
    items?: ComponentProps<typeof DashboardSidebar>['items']
    user: ComponentProps<typeof DashboardSidebar>['user']
  } = $props()
</script>

<Sidebar.Provider>
  <DashboardSidebar {items} {user} />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex items-center gap-2 px-8">
        <Sidebar.Trigger class="-ms-1" />
      </div>
    </header>

    <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
