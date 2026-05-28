<script lang="ts">
  import type { ActionResult } from '@sveltejs/kit'

  import { deserialize } from '$app/forms'
  import * as Card from '$lib/components/ui/card/index'
  import * as Field from '$lib/components/ui/field/index'
  import * as Form from '$lib/components/ui/form/index'
  import * as NativeSelect from '$lib/components/ui/native-select/index'
  import { cn } from '$lib/utils'
  import { superForm } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import type { PageServerData } from './$types'

  import CriterionEvaluationCard from './criterion-evaluation-card.svelte'
  import { finalEvaluationSchema } from './schema'

  const { data }: { data: PageServerData } = $props()

  // svelte-ignore state_referenced_locally
  const form = superForm(data.form, {
    validators: zod4Client(finalEvaluationSchema),
  })

  const { enhance, form: formData, message, submitting } = form

  const liveTotal = $derived(
    data.requirementsList.reduce((sum, req) => {
      const score = Number(($formData as Record<string, unknown>)[req.id]) || 0
      return sum + score * (req.weight / req.maxScore)
    }, 0),
  )

  // svelte-ignore state_referenced_locally
  let openRubric = $state<Record<string, boolean>>(
    Object.fromEntries(data.requirementsList.map((r) => [r.id, false])),
  )

  let loadingScores = $state(false)

  async function handleProjectChange(projectId: string) {
    if (!projectId) return
    loadingScores = true
    try {
      const fd = new FormData()
      fd.set('projectId', projectId)
      const res = await fetch('?/loadScores', {
        body: fd,
        headers: { 'x-sveltekit-action': 'true' },
        method: 'POST',
      })
      if (res.ok) {
        const text = await res.text()
        const result = deserialize(text) as ActionResult

        if (result.type === 'success' && result.data?.form) {
          const loadedScores = result.data.form.data as Record<string, number> | undefined

          if (loadedScores) {
            for (const req of data.requirementsList) {
              // Update superforms store directly
              ;($formData as Record<string, unknown>)[req.id] = loadedScores[req.id] ?? 0
            }
          }
        }
      }
    } finally {
      loadingScores = false
    }
  }
</script>

<div class="space-y-6 p-4">
  <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Evaluación Final</h1>
      <p class="mt-0.5 text-sm text-muted-foreground">
        Califica a los equipos que han llegado a la evaluación final del evento.
      </p>
    </div>
    <!-- Live total pill -->
    <div
      class="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm"
    >
      <span class="text-muted-foreground">Total:</span>
      <span
        class={cn(
          'text-lg font-bold text-red-600 tabular-nums transition-colors dark:text-red-400',
          {
            'text-amber-600 dark:text-amber-400': liveTotal >= 40,
            'text-blue-600 dark:text-blue-400': liveTotal >= 60,
            'text-emerald-600 dark:text-emerald-400': liveTotal >= 80,
          },
        )}
      >
        {liveTotal.toFixed(1)}
      </span>
      <span class="text-muted-foreground">/ 100</span>
    </div>
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title>Formulario de Evaluación</Card.Title>
      <Card.Description>
        Asigna una calificación a cada rubro según la rúbrica oficial. El total ponderado se calcula
        automáticamente.
      </Card.Description>
    </Card.Header>
    <Card.Content>
      {#if $message?.type === 'success'}
        <div
          class="mb-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          {$message.text}
        </div>
      {/if}
      {#if $message?.type === 'error'}
        <div
          class="mb-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {$message.text}
        </div>
      {/if}

      <form class="flex flex-col gap-8" action="?/evaluate" method="POST" use:enhance>
        <!-- Project selector -->
        <Form.Field name="projectId" {form}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Equipo / Proyecto</Form.Label>
              <NativeSelect.Root
                onchange={(e) => handleProjectChange((e.target as HTMLSelectElement).value)}
                bind:value={$formData.projectId}
                {...props}
              >
                <NativeSelect.Option disabled value="">
                  Selecciona un equipo para evaluar
                </NativeSelect.Option>
                {#each data.eligibleProjects as project (project.name)}
                  <NativeSelect.Option value={project.id?.toString()}>
                    {project.teamName} — {project.name}
                  </NativeSelect.Option>
                {:else}
                  <NativeSelect.Option disabled value="">
                    No hay equipos elegibles disponibles
                  </NativeSelect.Option>
                {/each}
              </NativeSelect.Root>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <!-- Loading indicator -->
        {#if loadingScores}
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              class="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></span>
            Cargando evaluación anterior…
          </div>
        {/if}

        <!-- Criterion cards -->
        <Field.Group>
          {#each data.requirementsList as criterion (criterion.id)}
            <CriterionEvaluationCard
              {criterion}
              bind:open={openRubric[criterion.id]}
              bind:score={$formData[criterion.id]}
            />
          {/each}
        </Field.Group>

        <!-- Progress bar + submit -->
        <div class="flex flex-col gap-3 rounded-lg border p-4">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">Puntaje total ponderado</span>
            <span class="font-bold tabular-nums">{liveTotal.toFixed(1)} / 100</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              style="width: {Math.min(liveTotal, 100)}%"
              class={cn('h-full rounded-full bg-red-500 transition-all duration-300', {
                'bg-amber-500': liveTotal >= 40,
                'bg-blue-500': liveTotal >= 60,
                'bg-emerald-500': liveTotal >= 80,
              })}
            ></div>
          </div>
          <div class="flex justify-end">
            <Form.Button disabled={$submitting || !$formData.projectId} type="submit">
              {$submitting ? 'Guardando…' : 'Guardar Evaluación'}
            </Form.Button>
          </div>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
