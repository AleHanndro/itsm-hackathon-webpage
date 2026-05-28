<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index'
  import * as Form from '$lib/components/ui/form/index'
  import Textarea from '$lib/components/ui/textarea.svelte'
  import { formatDate } from '$lib/utils'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import {
    deleteCommentSchema,
    type DeleteCommentSchema,
    editCommentSchema,
    type EditCommentSchema,
  } from '../schema'

  let {
    comment,
    currentUserId,
    deleteCommentForm,
    editCommentForm,
  }: {
    comment: {
      author: null | { id: string; image: null | string; name: string }
      authorId: null | string
      content: string
      createdAt: Date
      id: number
      projectId: number
      stageId: number
      updatedAt: Date
    }
    currentUserId: null | string
    deleteCommentForm: SuperValidated<Infer<DeleteCommentSchema>>
    editCommentForm: SuperValidated<Infer<EditCommentSchema>>
  } = $props()

  const isOwner = $derived(currentUserId !== null && comment.authorId === currentUserId)

  // --- Edit form ---
  let isEditing = $state(false)
  // svelte-ignore state_referenced_locally
  const editSF = superForm(editCommentForm, {
    id: `edit-comment-${comment.id}`,
    onUpdated({ form }) {
      if (form.valid) isEditing = false
    },
    resetForm: false,
    validators: zod4Client(editCommentSchema),
  })
  const { enhance: editEnhance, form: editData, submitting: editSubmitting } = editSF

  $effect(() => {
    if (isEditing) {
      $editData.commentId = comment.id
      $editData.content = comment.content
    }
  })

  // --- Delete form ---
  // svelte-ignore state_referenced_locally
  const deleteSF = superForm(deleteCommentForm, {
    id: `delete-comment-${comment.id}`,
    resetForm: false,
    validators: zod4Client(deleteCommentSchema),
  })
  const { enhance: deleteEnhance, form: deleteData, submitting: deleteSubmitting } = deleteSF

  $effect(() => {
    $deleteData.commentId = comment.id
  })

  // --- Helpers ---
  const initials = $derived(
    (comment.author?.name ?? 'A')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join(''),
  )

  const formattedDate = $derived(
    comment.createdAt ? formatDate(new Date(comment.createdAt), { withTime: true }) : '',
  )
</script>

<div class="group flex gap-2.5">
  <!-- Avatar -->
  <div
    class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
  >
    {#if comment.author?.image}
      <img
        class="size-7 rounded-full object-cover"
        alt={comment.author.name}
        src={comment.author.image}
      />
    {:else}
      {initials}
    {/if}
  </div>

  <!-- Body -->
  <div class="min-w-0 flex-1">
    <div class="flex items-baseline gap-1.5">
      <span class="text-xs font-semibold text-foreground">
        {comment.author?.name ?? 'Usuario eliminado'}
      </span>
      <span class="text-[10px] text-muted-foreground">{formattedDate}</span>
    </div>

    {#if isEditing}
      <!-- Inline edit form -->
      <form class="mt-1" action="?/editComment" method="POST" use:editEnhance>
        <input name="commentId" readonly type="hidden" bind:value={$editData.commentId} />
        <Form.Field name="content" form={editSF}>
          <Form.Control>
            {#snippet children({ props })}
              <Textarea
                {...props}
                class="min-h-[60px] text-xs"
                disabled={$editSubmitting}
                bind:value={$editData.content}
              />
            {/snippet}
          </Form.Control>
          <Form.FieldErrors class="text-xs" />
        </Form.Field>
        <div class="mt-1.5 flex gap-1.5">
          <Form.Button class="h-6 px-2 text-xs" disabled={$editSubmitting} size="sm" type="submit">
            Guardar
          </Form.Button>
          <button
            class="h-6 px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            disabled={$editSubmitting}
            onclick={() => (isEditing = false)}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </form>
    {:else}
      <p class="mt-0.5 text-xs leading-relaxed break-words text-foreground/80">
        {comment.content}
      </p>
    {/if}

    <!-- Owner actions -->
    {#if isOwner && !isEditing}
      <div class="mt-1 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          class="text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          onclick={() => (isEditing = true)}
          type="button"
        >
          Editar
        </button>

        <!-- Delete with confirmation -->
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            {#snippet child({ props })}
              <button
                {...props}
                class="text-[10px] text-muted-foreground transition-colors hover:text-destructive"
                type="button"
              >
                Eliminar
              </button>
            {/snippet}
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay />
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>¿Eliminar comentario?</AlertDialog.Title>
                <AlertDialog.Description>Esta acción no se puede deshacer.</AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
                <form action="?/deleteComment" method="POST" use:deleteEnhance>
                  <input
                    name="commentId"
                    readonly
                    type="hidden"
                    bind:value={$deleteData.commentId}
                  />
                  <AlertDialog.Action
                    class="text-destructive-foreground w-full bg-destructive hover:bg-destructive/90"
                    disabled={$deleteSubmitting}
                    type="submit"
                  >
                    Eliminar
                  </AlertDialog.Action>
                </form>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    {/if}
  </div>
</div>
