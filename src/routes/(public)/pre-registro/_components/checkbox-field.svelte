<script generics="T extends Record<string, unknown>, Path extends FormPathLeaves<T>" lang="ts">
  import type { Snippet } from 'svelte'
  import type { FormPath, FormPathLeaves, SuperForm } from 'sveltekit-superforms'

  import Checkbox from '$lib/components/ui/checkbox.svelte'
  import * as Form from '$lib/components/ui/form/index'

  let {
    description,
    form,
    label,
    name,
    required = true,
  }: {
    description?: Snippet | string
    form: SuperForm<T>
    label: string
    name: Path
    required?: boolean
  } = $props()

  // svelte-ignore state_referenced_locally
  const { form: formData } = form
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -->
<Form.Field name={name as unknown as FormPath<T>} {form}>
  <Form.Control>
    {#snippet children({ props })}
      <div class="flex items-start gap-3 space-y-0">
        <Checkbox class="mt-1" {required} bind:checked={$formData[name] as never} {...props} />
        <Form.Label class="leading-relaxed">{label}</Form.Label>
      </div>
    {/snippet}
  </Form.Control>
  {#if description}
    <Form.Description>{description}</Form.Description>
  {/if}
  <Form.FieldErrors />
</Form.Field>
