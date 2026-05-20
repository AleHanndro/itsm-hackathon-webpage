import type { PathnameWithSearchOrHash } from '$app/types'

import { stages } from '$lib/consts'
import { hasRole, type Role } from '$lib/utils'
import BookUserIcon from '@lucide/svelte/icons/book-user'
import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check'
import HouseIcon from '@lucide/svelte/icons/house'
import LayoutGridIcon from '@lucide/svelte/icons/layout-grid'
import ListTodoIcon from '@lucide/svelte/icons/list-todo'
import UserIcon from '@lucide/svelte/icons/user'
import UsersIcon from '@lucide/svelte/icons/users'

import type { SidebarGroups, SidebarItem } from './sidebar.svelte'

const getUserStagesUrls = (): SidebarItem[] =>
  Object.entries(stages).map(([order, title]) => ({
    icon: ListTodoIcon,
    title,
    url: `/dashboard/etapas/${order}` satisfies PathnameWithSearchOrHash,
  }))

const getEvaluatorStagesUrls = (): SidebarItem[] =>
  Object.entries(stages).map(([order, title]) => ({
    icon: ListTodoIcon,
    title,
    url: `/dashboard/evento/etapas/${order}` satisfies PathnameWithSearchOrHash,
  }))

const staffUrls: SidebarGroups = [
  {
    group: 'General',
    items: [
      {
        icon: HouseIcon,
        title: 'Inicio',
        url: '/dashboard/evento',
      },
      {
        icon: ClipboardCheckIcon,
        title: 'Evaluaciones',
        url: '/dashboard/evento/evaluaciones',
      },
    ],
  },
]

const organizerUrls: SidebarGroups = [
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

const evaluatorUrls: SidebarGroups = [
  {
    group: 'Evaluación',
    items: getEvaluatorStagesUrls(),
  },
]

const adminUrls: SidebarGroups = [
  {
    group: 'Administración',
    items: [
      {
        icon: UsersIcon,
        title: 'Usuarios',
        url: '/dashboard/evento/usuarios',
      },
    ],
  },
]

const userUrls: SidebarGroups = [
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
  {
    group: 'Etapas',
    items: getUserStagesUrls(),
  },
]

export const getUrls = (role: Role): SidebarGroups => {
  if (hasRole(role, 'admin')) return staffUrls.concat(adminUrls, organizerUrls, evaluatorUrls)
  if (hasRole(role, 'evaluator')) return staffUrls.concat(evaluatorUrls)
  if (hasRole(role, 'organizer')) return staffUrls.concat(organizerUrls)
  if (hasRole(role, 'staff')) return staffUrls

  return userUrls
}
