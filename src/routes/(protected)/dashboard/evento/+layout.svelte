<script lang="ts">
  import type { Snippet } from 'svelte'

  import DashboardWrapper from '$lib/components/dashboard-layout/wrapper.svelte'

  import type { LayoutData } from './$types'

  import { getSidebarGroups } from './dashboard-config'

  const { children, data }: { children: Snippet; data: LayoutData } = $props()

  // svelte-ignore state_referenced_locally
  const items = getSidebarGroups({
    isAdmin: data.isAdmin,
    isOrganizer: data.user.role === 'organizer',
  })
</script>

<svelte:head>
  <title>Dashboard - Staff</title>
</svelte:head>

<DashboardWrapper {items} user={data.user}>
  {@render children()}
</DashboardWrapper>
