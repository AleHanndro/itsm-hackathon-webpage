<script lang="ts">
  import type { Table } from '@tanstack/table-core'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import Button from '$lib/components/ui/button.svelte'
  import Input from '$lib/components/ui/input.svelte'

  import type { BulkActionSchema } from '../schema'
  import type { PreRegistrations } from './columns'

  const {
    form,
    table,
  }: { form: SuperForm<Infer<BulkActionSchema>>; table: Table<PreRegistrations> } = $props()

  // svelte-ignore state_referenced_locally
  const { enhance, form: formData, submitting } = form

  const selectedIds = $derived(table.getSelectedRowModel().flatRows.map((row) => row.original.id))
  const isSelectedEmpty = $derived(selectedIds.length === 0)

  const handleFilterInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    table.getColumn('email')?.setFilterValue(e.currentTarget.value)
  }

  const handleSubmission = (e: SubmitEvent) => {
    const submitter = e.submitter as HTMLButtonElement | null
    if (!submitter) return

    $formData.ids = selectedIds
  }
</script>

<div class="flex items-center justify-between py-4 max-sm:flex-col max-sm:gap-2">
  <Input
    class="max-w-sm"
    onchange={handleFilterInput}
    oninput={handleFilterInput}
    placeholder="Buscar correo"
    value={table.getColumn('email')?.getFilterValue() ?? ''}
  />

  <div class="flex items-center gap-2">
    <form method="POST" onsubmit={handleSubmission} use:enhance>
      <Button
        disabled={isSelectedEmpty || $submitting}
        formaction="?/deny"
        size="sm"
        type="submit"
        variant="destructive"
      >
        Rechazar Seleccionados
      </Button>
      <Button
        disabled={isSelectedEmpty || $submitting}
        formaction="?/approve"
        size="sm"
        type="submit"
      >
        Acceptar Seleccionados
      </Button>
    </form>
  </div>
</div>
