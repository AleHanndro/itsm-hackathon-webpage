<script lang="ts">
  import { enhance } from '$app/forms'
  import Button from '$lib/components/ui/button.svelte'
  import * as Card from '$lib/components/ui/card'
  import Input from '$lib/components/ui/input.svelte'

  import type { ActionData, PageData } from './$types'

  const { data, form }: { data: PageData; form: ActionData } = $props()

  let isSubmitting = $state(false)
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold tracking-tight">Etapa {data.stage.order}: {data.stage.name}</h1>
    <p class="mt-2 text-muted-foreground">{data.stage.description || 'Sin descripción'}</p>
  </div>

  <div class="grid gap-6 md:grid-cols-2">
    <Card.Root class="p-6">
      <h2 class="mb-4 text-xl font-semibold">Envío de Entregable</h2>
      <p class="mb-6 text-sm text-muted-foreground">
        Solo el líder del equipo puede enviar el archivo correspondiente a esta etapa.
      </p>

      <form
        class="space-y-4"
        enctype="multipart/form-data"
        method="POST"
        use:enhance={() => {
          isSubmitting = true
          return async ({ update }) => {
            isSubmitting = false
            await update()
          }
        }}
      >
        <div>
          <Input
            name="file"
            accept=".pdf,.zip,.rar"
            disabled={!data.isLeader || isSubmitting}
            required
            type="file"
          />
        </div>

        {#if form}
          <div
            class="rounded-md p-3 text-sm {form.success
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}"
          >
            {form.message}
          </div>
        {/if}

        <Button class="w-full" disabled={!data.isLeader || isSubmitting} type="submit">
          {isSubmitting ? 'Enviando...' : 'Subir Archivo'}
        </Button>

        {#if !data.isLeader}
          <p class="mt-2 text-center text-xs text-muted-foreground">
            Funcionalidad deshabilitada. Solo el líder del equipo puede realizar el envío.
          </p>
        {/if}
      </form>
    </Card.Root>

    <div class="space-y-6">
      <Card.Root class="p-6">
        <h2 class="mb-2 text-xl font-semibold">Calificación Actual</h2>
        <div class="flex items-end gap-2">
          <span class="text-4xl font-bold">{data.score}</span>
          <span class="mb-1 text-muted-foreground">/ 100</span>
        </div>
      </Card.Root>

      <Card.Root class="p-6">
        <h2 class="mb-4 text-xl font-semibold">Comentarios / Retroalimentación</h2>

        {#if data.comments.length > 0}
          <div class="space-y-4">
            {#each data.comments as comment (comment.id)}
              <div class="rounded-lg border bg-muted/50 p-4">
                <div class="mb-2 flex items-center gap-2">
                  {#if comment.author?.image}
                    <img
                      class="h-6 w-6 rounded-full"
                      alt={comment.author.name}
                      src={comment.author.image}
                    />
                  {:else}
                    <div
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
                    >
                      {comment.author?.name?.charAt(0) || 'U'}
                    </div>
                  {/if}
                  <span class="text-sm font-medium"
                    >{comment.author?.name || 'Usuario desconocido'}</span
                  >
                  <span class="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p class="text-sm">{comment.content}</p>
              </div>
            {/each}
          </div>
        {:else}
          <div class="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
            No hay comentarios aún para esta etapa.
          </div>
        {/if}
      </Card.Root>
    </div>
  </div>
</div>
