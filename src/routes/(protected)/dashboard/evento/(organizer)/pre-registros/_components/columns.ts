import type { ColumnDef } from '@tanstack/table-core'

import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index'
import { preRegistrations } from '$lib/schema/pre-registrations'
import { formatDate } from '$lib/utils'
import { createRawSnippet } from 'svelte'

import DataTableActions from './data-table-actions.svelte'
import DataTableCheckbox from './data-table-checkbox.svelte'

export type PreRegistrations = typeof preRegistrations.$inferSelect

export const columns: ColumnDef<PreRegistrations>[] = [
  {
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        'aria-label': 'Seleccionar fila',
        checked: row.getIsSelected(),
        onCheckedChange: (value) => {
          row.toggleSelected(!!value)
        },
      }),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        'aria-label': 'Seleccionar todos',
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => {
          table.toggleAllPageRowsSelected(!!value)
        },
      }),
    id: 'select',
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Correo Electrónico',
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const statusSnippet = createRawSnippet<[{ status: string }]>((getStatus) => {
        const { status } = getStatus()
        return { render: () => `<span class="capitalize">${status}</span>` }
      })

      return renderSnippet(statusSnippet, { status: row.original.status })
    },
    header: 'Estado de Solicitud',
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => formatDate(row.original.createdAt, { withTime: true }),
    header: 'Fecha de Prerregistro',
  },
  {
    cell: ({ row }) => renderComponent(DataTableActions, { data: row.original }),
    id: 'actions',
  },
]
