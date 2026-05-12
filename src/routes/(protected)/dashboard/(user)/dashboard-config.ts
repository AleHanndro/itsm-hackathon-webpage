import type { SidebarGroups } from '$lib/components/dashboard-layout/sidebar.svelte'

import HouseIcon from '@lucide/svelte/icons/house'

export const groups: SidebarGroups = [
  {
    group: 'General',
    items: [
      {
        icon: HouseIcon,
        title: 'Inicio',
        url: '/dashboard',
      },
    ],
  },
]
