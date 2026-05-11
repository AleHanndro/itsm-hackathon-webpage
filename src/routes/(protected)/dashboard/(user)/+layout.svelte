<script lang="ts">
  import type { Snippet } from 'svelte'

  import DashboardSidebar from '$lib/components/dashboard-sidebar.svelte'
  import * as Sidebar from '$lib/components/ui/sidebar/index'

  import type { LayoutData } from './$types'

  import { groups } from './dashboard-config'

  const { children, data }: { children: Snippet; data: LayoutData } = $props()
</script>

<svelte:head>
  <title>Dashboard - Participante</title>
</svelte:head>

<Sidebar.Provider>
  <DashboardSidebar items={groups} user={data.user} />
  <Sidebar.Inset>
    <header class="flex h-16 shrink-0 items-center gap-2">
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ms-1" />
      </div>
    </header>

    <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
