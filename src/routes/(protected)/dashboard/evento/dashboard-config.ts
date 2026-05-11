import type { SidebarGroups } from '$lib/components/dashboard-sidebar.svelte'

import BookUserIcon from '@lucide/svelte/icons/book-user'
import HouseIcon from '@lucide/svelte/icons/home'
import UserIcon from '@lucide/svelte/icons/user'

const adminSidebarGroups: SidebarGroups = [
  {
    group: 'Administración',
    items: [
      {
        icon: UserIcon,
        title: 'Usuarios',
        url: '/dashboard/evento/usuarios',
      },
    ],
  },
]

export const config: SidebarGroups = [
  {
    group: 'General',
    items: [
      {
        icon: HouseIcon,
        title: 'Inicio',
        url: '/dashboard/evento',
      },
      {
        icon: BookUserIcon,
        title: 'Prerregistros',
        url: '/dashboard/evento/pre-registros',
      },
    ],
  },
]

export const getSidebarGroups = ({ isAdmin = false } = {}) => {
  if (isAdmin) return [...adminSidebarGroups, ...config]

  return config
}
