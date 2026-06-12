<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import * as Card from '$lib/components/ui/card'
  import PaperclipIcon from '@lucide/svelte/icons/paperclip'
  import { superForm } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import type { PageData } from './$types'

  import UploadAttachmentForm from '../components/upload-attachment-form.svelte'
  import { clientAttachmentsSchema } from '../schema'

  const { data }: { data: PageData } = $props()

  // svelte-ignore state_referenced_locally
  const form = superForm(data.form, {
    multipleSubmits: 'abort',
    onUpdated: ({ form: formUpdated }) => {
      if (formUpdated.valid) {
        form.reset({ data: { attachments: [null] } })
      }
    },
    validators: zod4Client(clientAttachmentsSchema),
  })

  const currentStageOrder = $derived(page.params.stageOrder)
  const { form: formData, validateForm } = form

  const handleFileInputChange = (
    e: Event & { currentTarget: EventTarget & HTMLInputElement },
    index: number,
  ) => {
    const file = e.currentTarget.files?.item(0) ?? null
    $formData.attachments[index] = file
  }

  const addSlot = () => {
    $formData.attachments = [...$formData.attachments, null]
  }

  const removeSlot = (index: number) => {
    $formData.attachments = $formData.attachments.filter((_, i) => i !== index)
    void validateForm({ focusOnError: false, update: true })
  }
</script>

<div class="space-y-6 p-4">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">Etapa {data.stage.order}: {data.stage.name}</h1>
    <p class="mt-2 text-muted-foreground">{data.stage.description || 'Sin descripción'}</p>
  </div>

  <div class="grid gap-6 md:grid-cols-[minmax(0,1fr)_var(--breakpoint-md)]">
    <div class="min-w-0 space-y-6">
      <Card.Root>
        <Card.Header>
          <Card.Title>Estado de Evaluación</Card.Title>
        </Card.Header>
        <Card.Content>
          <div class="flex items-center gap-2">
            <span
              class={[
                'text-3xl font-bold',
                data.verdict === null
                  ? 'text-muted-foreground'
                  : data.verdict
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-destructive',
              ]}
            >
              {data.verdict === null ? 'Pendiente' : data.verdict ? 'Aprobado' : 'No Aprobado'}
            </span>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Header>
          <Card.Title>Envío de Entregable</Card.Title>
          <Card.Description>
            Solo el líder del equipo puede enviar el archivo correspondiente a esta etapa.
          </Card.Description>
        </Card.Header>
        <Card.Content class="min-w-0 space-y-4">
          {#if data.attachments && data.attachments.length > 0}
            <div class="flex min-w-0 flex-col gap-2 rounded-lg border p-4">
              <h3 class="text-sm font-semibold">Archivos Subidos</h3>
              <div class="flex min-w-0 flex-col gap-1.5">
                {#each data.attachments as attachment (attachment.id)}
                  <a
                    class="flex max-w-full min-w-0 items-center gap-2 overflow-hidden text-sm text-blue-600 hover:underline dark:text-blue-400"
                    href={resolve('/(protected)/api/attachments/[id]', {
                      id: attachment.id.toString(),
                    })}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <PaperclipIcon class="size-4 shrink-0" />
                    <span class="min-w-0 flex-1 truncate">{attachment.fileName}</span>
                  </a>
                {/each}
              </div>
            </div>
          {/if}

          {#key currentStageOrder}
            <UploadAttachmentForm
              {addSlot}
              {form}
              {handleFileInputChange}
              isLeader={data.isLeader}
              {removeSlot}
            />
          {/key}
        </Card.Content>
      </Card.Root>
    </div>

    <Card.Root>
      <Card.Header>
        <Card.Title>Retroalimentación</Card.Title>
      </Card.Header>
      <Card.Content class="h-full">
        {#if data.comments.length > 0}
          <div class="space-y-4">
            {#each data.comments as comment (comment.id)}
              <div class="rounded-lg border bg-muted/50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  <div
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                  >
                    {comment.author?.name?.charAt(0) || 'U'}
                  </div>
                  <span class="text-sm font-medium">
                    {comment.author?.name || 'Usuario desconocido'}
                  </span>
                  <span class="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p class="text-sm">{comment.content}</p>
              </div>
            {/each}
          </div>
        {:else}
          <div
            class="grid h-full place-items-center rounded-lg border border-dashed py-8 text-center text-muted-foreground"
          >
            No hay comentarios aún para esta etapa.
          </div>
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
</div>
