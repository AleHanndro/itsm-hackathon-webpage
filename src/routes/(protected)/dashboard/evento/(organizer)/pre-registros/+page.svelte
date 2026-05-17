<script lang="ts">
  import type { PageData } from './$types'

  import { columns } from './_components/columns'
  import DataTable from './_components/data-table.svelte'

  const { data }: { data: PageData } = $props()
</script>

<div class="space-y-6 p-4">
  <div class="flex flex-col">
    <h1 class="text-2xl font-bold">Prerregistros</h1>
    <p class="text-muted-foreground">Administra los prerregistros y conviértelos en equipos.</p>
  </div>

  <DataTable {columns} data={data.preRegistrations} form={data.form} pagination={data.pagination} />
</div>
