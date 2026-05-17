import type { PathnameWithSearchOrHash } from '$app/types'
import type { SidebarGroups } from '$lib/components/dashboard-layout/sidebar.svelte'

import BookUserIcon from '@lucide/svelte/icons/book-user'
import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check'
import HouseIcon from '@lucide/svelte/icons/home'
import LayoutGridIcon from '@lucide/svelte/icons/layout-grid'
import ListTodoIcon from '@lucide/svelte/icons/list-todo'
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
      {
        icon: LayoutGridIcon,
        title: 'Proyectos',
        url: '/dashboard/evento/proyectos',
      },
      {
        icon: UserIcon,
        title: 'Evaluadores',
        url: '/dashboard/evento/evaluadores',
      },
    ],
  },
]

const evaluatorSidebarGroups: SidebarGroups = [
  {
    group: 'Evaluación',
    items: [
      {
        icon: ClipboardCheckIcon,
        title: 'Evaluaciones',
        url: '/dashboard/evento/evaluaciones',
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

export const getSidebarGroups = ({
  isAdmin = false,
  isEvaluator = false,
  isOrganizer = false,
  stages = [] as { id: number; name: string }[],
} = {}) => {
  const groups: SidebarGroups = []

  if (isAdmin) {
    groups.push(
      ...config,
      ...adminSidebarGroups,
      ...organizerSidebarGroups,
      ...evaluatorSidebarGroups,
    )
  } else if (isOrganizer) {
    groups.push(...config, ...organizerSidebarGroups)
  } else if (isEvaluator) {
    groups.push(...config, ...evaluatorSidebarGroups)
  } else {
    groups.push(...config)
  }

  if ((isAdmin || isEvaluator) && stages && stages.length > 0) {
    groups.push({
      group: 'Etapas',
      items: stages.map((stage) => ({
        icon: ListTodoIcon,
        title: stage.name,
        url: `/dashboard/evento/etapas/${stage.id}` satisfies PathnameWithSearchOrHash,
      })),
    })
  }

  return groups
}
