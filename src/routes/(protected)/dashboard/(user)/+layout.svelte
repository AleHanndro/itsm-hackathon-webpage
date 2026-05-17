<script lang="ts">
  import type { Snippet } from 'svelte'

  import DashboardWrapper from '$lib/components/dashboard-layout/wrapper.svelte'

  import type { LayoutData } from './$types'

  import { getGroups } from './dashboard-config'

  const { children, data }: { children: Snippet; data: LayoutData } = $props()
</script>

<svelte:head>
  <title>Dashboard - Participante</title>
</svelte:head>

<DashboardWrapper items={data.isAuthorized ? getGroups(data.stages) : undefined} user={data.user}>
  {@render children()}
</DashboardWrapper>
