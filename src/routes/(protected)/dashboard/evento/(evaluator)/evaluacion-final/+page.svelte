<script lang="ts">
  import * as Card from '$lib/components/ui/card/index'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import * as NativeSelect from '$lib/components/ui/native-select/index'
  import { superForm } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import type { PageServerData } from './$types'

  import { finalEvaluationSchema } from './schema'

  const { data }: { data: PageServerData } = $props()

  // svelte-ignore state_referenced_locally
  const form = superForm(data.form, {
    validators: zod4Client(finalEvaluationSchema),
  })

  const { enhance, form: formData, message, submitting } = form
</script>

<div class="space-y-6 p-4">
  <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 class="text-2xl font-semibold tracking-tight">Evaluación Final</h1>
      <p class="mt-0.5 text-sm text-muted-foreground">
        Califica a los equipos que han llegado a la evaluación final del evento.
      </p>
    </div>
  </div>

  <Card.Root>
    <Card.Header>
      <Card.Title>Formulario de Evaluación</Card.Title>
      <Card.Description
        >Asigna una calificación de 0 a 100 en cada rubro requerido.</Card.Description
      >
    </Card.Header>
    <Card.Content>
      {#if $message?.type === 'success'}
        <div
          class="mb-6 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
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
      <form class="flex flex-col gap-6" method="POST" use:enhance>
        <Form.Field name="projectId" {form}>
          <Form.Control>
            {#snippet children({ props })}
              <Form.Label>Equipo / Proyecto</Form.Label>
              <NativeSelect.Root bind:value={$formData.projectId} {...props}>
                <NativeSelect.Option disabled value=""
                  >Selecciona un equipo para evaluar</NativeSelect.Option
                >
                {#each data.eligibleProjects as project (project.name)}
                  <NativeSelect.Option value={project.id?.toString()}>
                    {project.teamName} - {project.name}
                  </NativeSelect.Option>
                {:else}
                  <NativeSelect.Option disabled value=""
                    >No hay equipos elegibles disponibles</NativeSelect.Option
                  >
                {/each}
              </NativeSelect.Root>
            {/snippet}
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>

        <div class="grid gap-4 md:grid-cols-2">
          {#each data.requirementsList as req (req.id)}
            <Form.Field name={req.id} {form}>
              <Form.Control>
                {#snippet children({ props })}
                  <Form.Label>{req.name} ({req.weight}%)</Form.Label>
                  <Input
                    max="100"
                    min="0"
                    type="number"
                    {...props}
                    bind:value={$formData[req.id]}
                  />
                {/snippet}
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          {/each}
        </div>

        <div class="flex justify-end">
          <Form.Button disabled={$submitting} type="submit">
            {$submitting ? 'Guardando...' : 'Guardar Evaluación'}
          </Form.Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
