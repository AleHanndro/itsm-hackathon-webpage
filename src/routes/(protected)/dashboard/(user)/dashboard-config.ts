import type { Pathname } from '$app/types'
import type { SidebarGroups } from '$lib/components/dashboard-layout/sidebar.svelte'

import FlagIcon from '@lucide/svelte/icons/flag'
import HouseIcon from '@lucide/svelte/icons/house'

export const getGroups = (stages: { name: string; order: number }[] = []): SidebarGroups => {
  const baseGroups: SidebarGroups = [
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

  if (stages.length > 0) {
    baseGroups.push({
      group: 'Etapas',
      items: stages.map((stage) => ({
        icon: FlagIcon,
        title: stage.name,
        url: `/dashboard/etapas/${stage.order}` as Pathname,
      })),
    })
  }

  return baseGroups
}
