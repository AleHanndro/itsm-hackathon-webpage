<script lang="ts">
  import { resolve } from '$app/paths'
  import * as Card from '$lib/components/ui/card/index'
  import * as Collapsible from '$lib/components/ui/collapsible/index'
  import * as Form from '$lib/components/ui/form/index'
  import Textarea from '$lib/components/ui/textarea.svelte'
  import PaperclipIcon from '@lucide/svelte/icons/paperclip'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import {
    addCommentSchema,
    type AddCommentSchema,
    type DeleteCommentSchema,
    type EditCommentSchema,
    gradeStageSchema,
    type GradeStageSchema,
    verdictToResult,
  } from '../schema'
  import CommentItem from './comment-item.svelte'

  interface Comment {
    author: null | { id: string; image: null | string; name: string }
    authorId: null | string
    content: string
    createdAt: Date
    id: number
    projectId: number
    stageId: number
    updatedAt: Date
  }

  interface Attachment {
    fileName: string
    fileSize: number
    fileUrl: string
    id: number
    mimeType: string
    projectId: number
    stageId: number
  }

  let {
    addCommentForm,
    attachments,
    comments,
    currentUserId,
    deleteCommentForm,
    editCommentForm,
    form,
    initialVerdict,
    stageId,
    team,
  }: {
    addCommentForm: SuperValidated<Infer<AddCommentSchema>>
    attachments: Attachment[]
    comments: Comment[]
    currentUserId: null | string
    deleteCommentForm: SuperValidated<Infer<DeleteCommentSchema>>
    editCommentForm: SuperValidated<Infer<EditCommentSchema>>
    form: SuperValidated<Infer<GradeStageSchema>>
    initialVerdict: boolean | null
    stageId: number
    team: {
      id: number
      name: string
      project: null | {
        description: null | string
        id: number
        name: string
      }
    }
  } = $props()

  // --- Grade form ---
  // svelte-ignore state_referenced_locally
  const gradeForm = superForm(form, {
    id: `grade-form-${team.id}`,
    resetForm: false,
    validators: zod4Client(gradeStageSchema),
  })
  const { enhance, form: formData, submitting } = gradeForm

  $effect(() => {
    if (team.project?.id) {
      $formData.projectId = team.project.id
    }
    $formData.stageId = stageId
  })

  // --- Add comment form ---
  // svelte-ignore state_referenced_locally
  const addSF = superForm(addCommentForm, {
    id: `add-comment-${team.id}`,
    onUpdated: ({ form }) => {
      if (form.valid) {
        $addData.content = ''
      }
    },
    resetForm: false,
    validators: zod4Client(addCommentSchema),
  })
  const { enhance: addEnhance, form: addData, submitting: addSubmitting } = addSF

  $effect(() => {
    if (team.project?.id) {
      $addData.projectId = team.project.id
    }
    $addData.stageId = stageId
  })

  // --- Collapsible state ---
  let commentsOpen = $state(false)
  const commentCount = $derived(comments.length)
  const commentLabel = $derived(
    commentCount === 0
      ? 'Sin comentarios'
      : commentCount === 1
        ? '1 comentario'
        : `${commentCount} comentarios`,
  )
</script>

<Card.Root class="flex flex-col">
  <Card.Header class="pb-2">
    <Card.Title class="text-xl">{team.name}</Card.Title>
    <Card.Description class="text-foreground">
      proyecto: {team.project?.name ?? 'Sin nombre'}
    </Card.Description>
  </Card.Header>

  <Card.Content class="flex flex-1 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {team.project?.description ?? 'Sin descripción del proyecto.'}
    </p>

    {#if attachments && attachments.length > 0}
      <div class="flex flex-col gap-1.5">
        <span class="text-xs font-semibold text-muted-foreground">Archivos Adjuntos</span>
        <div class="flex flex-col gap-1">
          {#each attachments as attachment (attachment.id)}
            <a
              class="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
              href={resolve('/(protected)/api/attachments/[id]', { id: attachment.id.toString() })}
              rel="noopener noreferrer"
              target="_blank"
            >
              <PaperclipIcon class="size-4 shrink-0" />
              <span class="truncate">{attachment.fileName}</span>
            </a>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Comments collapsible section -->
    <Collapsible.Root bind:open={commentsOpen}>
      <Collapsible.Trigger class="w-full">
        <div
          class="flex w-full items-center gap-1.5 rounded-md py-1 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            class={['size-3 transition-transform', commentsOpen ? 'rotate-90' : ''].join(' ')}
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg
            class="size-3"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-2-2z"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {commentLabel}
        </div>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <div class="mt-1 flex flex-col gap-3">
          <!-- Scrollable comments list -->
          {#if comments.length > 0}
            <div class="flex max-h-44 flex-col gap-3 overflow-y-auto pr-1">
              {#each comments as comment (comment.id)}
                <CommentItem {comment} {currentUserId} {deleteCommentForm} {editCommentForm} />
              {/each}
            </div>
          {:else}
            <p class="text-xs text-muted-foreground">Aún no hay comentarios.</p>
          {/if}

          <!-- Add comment form -->
          {#if currentUserId}
            <form class="flex flex-col gap-1.5" action="?/addComment" method="POST" use:addEnhance>
              <input name="projectId" readonly type="hidden" bind:value={$addData.projectId} />
              <input name="stageId" readonly type="hidden" bind:value={$addData.stageId} />

              <Form.Field name="content" form={addSF}>
                <Form.Control>
                  {#snippet children({ props })}
                    <Textarea
                      {...props}
                      class="min-h-[60px] text-xs"
                      disabled={$addSubmitting}
                      placeholder="Agregar comentario..."
                      bind:value={$addData.content}
                    />
                  {/snippet}
                </Form.Control>
                <Form.FieldErrors class="text-xs" />
              </Form.Field>

              <Form.Button class="self-end" disabled={$addSubmitting} size="sm" type="submit">
                Comentar
              </Form.Button>
            </form>
          {/if}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  </Card.Content>

  <Card.Footer>
    {#if initialVerdict === null}
      <form class="w-full" action="?/grade" method="POST" use:enhance>
        <Form.Field name="projectId" form={gradeForm}>
          <Form.Control>
            {#snippet children({ props: { name } })}
              <input {name} readonly type="hidden" bind:value={$formData.projectId} />
            {/snippet}
          </Form.Control>
        </Form.Field>

        <Form.Field name="stageId" form={gradeForm}>
          <Form.Control>
            {#snippet children({ props: { name } })}
              <input {name} readonly type="hidden" bind:value={$formData.stageId} />
            {/snippet}
          </Form.Control>
        </Form.Field>

        <Form.Field name="result" form={gradeForm}>
          <Form.Control>
            {#snippet children({ props })}
              <div class="mb-0 grid grid-cols-2 gap-3">
                <Form.Button {...props} disabled={$submitting} value="pass">Aprobado</Form.Button>
                <Form.Button {...props} disabled={$submitting} value="fail" variant="destructive">
                  No Aprobado
                </Form.Button>
              </div>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </form>
    {:else}
      <div
        class={[
          'w-full px-2 py-1 text-center',
          initialVerdict
            ? 'bg-green-400/10 text-green-700 dark:bg-green-400/20 dark:text-green-400'
            : 'bg-red-400/10 text-red-700 dark:bg-red-400/20 dark:text-red-400',
        ]}
      >
        {verdictToResult(initialVerdict)}
      </div>
    {/if}
  </Card.Footer>
</Card.Root>
