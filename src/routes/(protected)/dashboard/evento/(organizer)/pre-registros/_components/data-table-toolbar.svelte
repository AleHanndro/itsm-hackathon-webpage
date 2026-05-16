<script lang="ts">
  import type { Table } from '@tanstack/table-core'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import Button from '$lib/components/ui/button.svelte'
  import Input from '$lib/components/ui/input.svelte'

  import type { BulkActionSchema, StatusFilter } from '../schema'
  import type { PreRegistrations } from './columns'

  import { STATUS_OPTIONS } from '../schema'

  const {
    form,
    table,
  }: { form: SuperForm<Infer<BulkActionSchema>>; table: Table<PreRegistrations> } = $props()

  // svelte-ignore state_referenced_locally
  const { enhance, form: formData, submitting } = form

  const selectedIds = $derived(table.getSelectedRowModel().flatRows.map((row) => row.original.id))
  const isSelectedEmpty = $derived(selectedIds.length === 0)

  const currentStatus = $derived(
    (page.url.searchParams.get('status') ?? 'pendiente') as StatusFilter,
  )

  const STATUS_LABELS: Record<StatusFilter, string> = {
    pendiente: 'Pendientes',
    rechazado: 'Rechazados',
    todos: 'Todos',
    verificado: 'Verificados',
  }

  const handleFilterInput = (e: Event & { currentTarget: HTMLInputElement }) => {
    table.getColumn('email')?.setFilterValue(e.currentTarget.value)
  }

  const handleStatusChange = async (status: StatusFilter) => {
    const url = new URL(page.url)
    url.searchParams.set('status', status)
    url.searchParams.set('page', '1')
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    await goto(url, { keepFocus: true, noScroll: true })
  }

  const handleSubmission = (e: SubmitEvent) => {
    const submitter = e.submitter as HTMLButtonElement | null
    if (!submitter) return

    $formData.ids = selectedIds
  }
</script>

<div class="flex flex-col gap-3 py-4">
  <!-- Status tabs -->
  <div class="flex flex-wrap gap-1 border-b pb-3">
    {#each STATUS_OPTIONS as status (status)}
      <button
        class="rounded-md px-3 py-1 text-sm font-medium transition-colors
          {currentStatus === status
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        onclick={() => handleStatusChange(status)}
        type="button"
      >
        {STATUS_LABELS[status]}
      </button>
    {/each}
  </div>

  <!-- Search + bulk actions row -->
  <div class="flex items-center justify-between max-sm:flex-col max-sm:gap-2">
    <Input
      class="max-w-sm"
      onchange={handleFilterInput}
      oninput={handleFilterInput}
      placeholder="Buscar correo"
      value={table.getColumn('email')?.getFilterValue() ?? ''}
    />

    {#if currentStatus === 'pendiente' || currentStatus === 'todos'}
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
            Aceptar Seleccionados
          </Button>
        </form>
      </div>
    {/if}
  </div>
</div>
