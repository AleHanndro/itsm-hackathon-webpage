import type { SidebarGroups } from '$lib/components/dashboard-layout/sidebar.svelte'

import BookUserIcon from '@lucide/svelte/icons/book-user'
import HouseIcon from '@lucide/svelte/icons/home'
import UserIcon from '@lucide/svelte/icons/user'
import UsersIcon from '@lucide/svelte/icons/users'

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

const organizerSidebarGroups: SidebarGroups = [
  {
    group: 'Organización',
    items: [
      {
        icon: BookUserIcon,
        title: 'Prerregistros',
        url: '/dashboard/evento/pre-registros',
      },
      {
        icon: UsersIcon,
        title: 'Equipos',
        url: '/dashboard/evento/equipos',
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
    ],
  },
]

export const getSidebarGroups = ({ isAdmin = false, isOrganizer = false } = {}) => {
  if (isAdmin) return [...config, ...adminSidebarGroups, ...organizerSidebarGroups]
  if (isOrganizer) return [...config, ...organizerSidebarGroups]

  return config
}
