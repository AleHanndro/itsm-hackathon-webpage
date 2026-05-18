<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card/index'
  import * as Form from '$lib/components/ui/form/index'
  import * as InputGroup from '$lib/components/ui/input-group/index'
  import FilePlusCornerIcon from '@lucide/svelte/icons/file-plus-corner'
  import Trash2Icon from '@lucide/svelte/icons/trash-2'
  import { type Infer, type SuperForm } from 'sveltekit-superforms'

  import { type ClientAttachmentsSchema } from '../schema'

  interface Props {
    addSlot: () => void
    form: SuperForm<Infer<ClientAttachmentsSchema>>
    handleFileInputChange: (
      e: Event & { currentTarget: EventTarget & HTMLInputElement },
      index: number,
    ) => void
    isLeader: boolean
    removeSlot: (index: number) => void
  }

  const { addSlot, form, handleFileInputChange, isLeader, removeSlot }: Props = $props()

  // svelte-ignore state_referenced_locally
  const { allErrors, enhance, form: formData, submitting } = form
  const isButtonDisabled = $derived(!isLeader || $submitting)
</script>

<form class="space-y-4" enctype="multipart/form-data" method="POST" use:enhance>
  <Form.Fieldset name="attachments" {form}>
    <Form.Legend>Evidencias a entregar</Form.Legend>

    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each $formData.attachments as fileOrNull, i (i)}
      <Form.ElementField name="attachments[{i}]" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label class="sr-only">Evidencia {i + 1}</Form.Label>
            <InputGroup.Root>
              <InputGroup.Input
                {...props}
                accept=".pdf,.zip,.rar"
                disabled={!isLeader || $submitting}
                onchange={(e) => handleFileInputChange(e, i)}
                type="file"
              />
              {#if i > 0}
                <InputGroup.Addon align="inline-end">
                  <InputGroup.Button
                    aria-label="Eliminar evidencia"
                    onclick={() => removeSlot(i)}
                    title="Eliminar evidencia"
                  >
                    <Trash2Icon />
                  </InputGroup.Button>
                </InputGroup.Addon>
              {/if}
            </InputGroup.Root>
            {#if fileOrNull}
              <span class="text-sm text-muted-foreground">
                {fileOrNull.name} ({(fileOrNull.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            {/if}
          {/snippet}
        </Form.Control>
        <Form.Description class="sr-only">
          El archivo no puede ser mayor a 50MB. Puedes subir archivos en formato PDF, ZIP o RAR.
        </Form.Description>
        <Form.FieldErrors />
      </Form.ElementField>
    {/each}
    <Form.FieldErrors />
  </Form.Fieldset>

  <Button class="w-full" disabled={isButtonDisabled} onclick={addSlot} variant="outline">
    <FilePlusCornerIcon />
    Añadir Archivo
  </Button>
  <Form.Button
    class="w-full"
    disabled={$formData.attachments.length === 0 || isButtonDisabled || $allErrors.length > 0}
  >
    Entregar
  </Form.Button>

  <Card.Footer class="px-0">
    {#if isLeader}
      <p class="text-center text-xs text-muted-foreground">
        Funcionalidad deshabilitada. Solo el líder del equipo puede realizar el envío.
      </p>
    {/if}
  </Card.Footer>
</form>
