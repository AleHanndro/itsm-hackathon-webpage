<script generics="TData, TValue" lang="ts">
  import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index'
  import * as Table from '$lib/components/ui/table/index'
  import {
    type ColumnDef,
    type ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    type RowSelectionState,
  } from '@tanstack/table-core'
  import { setContext } from 'svelte'
  import { superForm } from 'sveltekit-superforms'

  import type { PageServerData } from '../$types'

  import DataTablePagination from './data-table-pagination.svelte'
  import DataTableToolbar from './data-table-toolbar.svelte'
  import DetailsDialog from './details-dialog.svelte'
  import { TABLE_STATE_KEY, TableState } from './table-state.svelte'

  interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    form: Pick<PageServerData, 'form'>['form']
    pagination: { page: number; pageSize: number; totalCount: number; totalPages: number }
  }

  const { columns, data, form, pagination }: DataTableProps<TData, TValue> = $props()

  const tableState = new TableState()
  setContext(TABLE_STATE_KEY, tableState)

  let rowSelection = $state<RowSelectionState>({})
  let columnFilters = $state<ColumnFiltersState>([])

  // svelte-ignore state_referenced_locally
  const sForm = superForm(form, {
    dataType: 'json',
    onResult: () => {
      table.toggleAllRowsSelected(false)
    },
  })

  // svelte-ignore state_referenced_locally
  const table = createSvelteTable({
    columns,
    get data() {
      return data
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters)
      } else {
        columnFilters = updater
      }
    },
    onRowSelectionChange: (updater) => {
      if (typeof updater === 'function') {
        rowSelection = updater(rowSelection)
      } else {
        rowSelection = updater
      }
    },
    state: {
      get columnFilters() {
        return columnFilters
      },
      get rowSelection() {
        return rowSelection
      },
    },
  })
</script>

<div>
  <DataTableToolbar form={sForm} table={table as never} />
  <div class="border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <FlexRender
                    content={header.column.columnDef.header}
                    context={header.getContext()}
                  />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>

      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && 'selected'}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell>
                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell class="h-24 text-center" colspan={columns.length}>
              Sin resultados.
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <DataTablePagination {pagination} />
</div>

<DetailsDialog
  data={tableState.selected}
  form={sForm}
  table={table as never}
  bind:open={tableState.isOpen}
/>
