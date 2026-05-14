<script lang="ts">
  import type { Table } from '@tanstack/table-core'
  import type { Infer, SuperForm } from 'sveltekit-superforms'

  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'
  import { engineeringMap } from '$lib/consts'

  import type { BulkActionSchema } from '../schema'
  import type { PreRegistrations } from './columns'

  let {
    data,
    form,
    open = $bindable(false),
    table,
  }: {
    data: null | PreRegistrations
    form: SuperForm<Infer<BulkActionSchema>>
    open?: boolean
    table: Table<PreRegistrations>
  } = $props()

  // svelte-ignore state_referenced_locally
  const { enhance, form: formData, submitting } = form

  const handleSubmission = (e: SubmitEvent) => {
    const submitter = e.submitter as HTMLButtonElement | null
    if (!submitter || !data) return

    $formData.ids = [data.id]
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Detalles de Prerregistro</Dialog.Title>
      <Dialog.Description>
        Verifica la información del prerregistro antes de proceder.
      </Dialog.Description>
    </Dialog.Header>

    {#if data}
      <div class="grid gap-2 text-sm">
        <div><span class="font-bold text-muted-foreground">Nombre:</span> {data.name}</div>
        <div>
          <span class="font-bold text-muted-foreground">Género:</span>
          <span class="capitalize">{data.gender}</span>
        </div>
        <div><span class="font-bold text-muted-foreground">Correo:</span> {data.email}</div>
        <div><span class="font-bold text-muted-foreground">Matrícula:</span> {data.studentId}</div>
        <div>
          <span class="font-bold text-muted-foreground">Ingeniería:</span>
          {engineeringMap[data.engineering]}
        </div>
        <div><span class="font-bold text-muted-foreground">Semestre:</span> {data.semester}</div>
        <div><span class="font-bold text-muted-foreground">Grupo:</span> {data.group}</div>
        <div>
          <span class="font-bold text-muted-foreground">Talla de Playera/Blusa:</span>
          {data.shirtSize}
        </div>
      </div>
    {/if}

    <Dialog.Footer class="flex pt-4 sm:justify-between">
      <Button onclick={() => (open = false)} variant="outline">Cancelar</Button>
      {#if data}
        <form
          class="flex gap-2 max-sm:*:flex-1"
          method="POST"
          onsubmit={handleSubmission}
          use:enhance={{
            onResult: ({ result }) => {
              if (result.type === 'success') {
                open = false
                table.toggleAllRowsSelected(false)
              }
            },
          }}
        >
          <input name="ids" type="hidden" value={data.id} />
          <Button
            disabled={$submitting || data.status === 'rechazado'}
            formaction="?/deny"
            type="submit"
            variant="destructive"
          >
            Rechazar
          </Button>
          <Button
            disabled={$submitting || data.status === 'verificado'}
            formaction="?/approve"
            type="submit">Aceptar</Button
          >
        </form>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
