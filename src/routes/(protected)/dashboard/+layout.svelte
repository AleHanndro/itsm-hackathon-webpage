<script lang="ts">
  import type { Snippet } from 'svelte'

  import { getUrls } from '$lib/components/dashboard-layout/sidedar-urls'
  import DashboardWrapper from '$lib/components/dashboard-layout/wrapper.svelte'

  import type { LayoutData } from './$types'

  const { children, data }: { children: Snippet; data: LayoutData } = $props()

  const items = $derived(getUrls(data.user.role))
</script>

<DashboardWrapper {items} user={data.user}>
  {@render children()}
</DashboardWrapper>
