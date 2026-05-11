<script lang="ts">
  import type { PageData } from './$types'

  import { columns } from './_components/columns'
  import DataTable from './_components/data-table.svelte'

  const { data }: { data: PageData } = $props()
</script>

<DataTable {columns} data={data.preRegistrations} form={data.form} pagination={data.pagination} />
