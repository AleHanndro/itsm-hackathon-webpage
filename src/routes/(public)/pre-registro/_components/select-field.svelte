<script generics="T extends Record<string, unknown>, Path extends FormPathLeaves<T>" lang="ts">
  import type { Snippet } from 'svelte'
  import type { FormPath, FormPathLeaves, SuperForm } from 'sveltekit-superforms'

  import * as Form from '$lib/components/ui/form/index'
  import * as NativeSelect from '$lib/components/ui/native-select/index'

  let {
    children,
    form,
    label,
    name,
    options,
    placeholder = 'Selecciona una opción',
  }: {
    children?: Snippet
    form: SuperForm<T>
    label: string
    name: Path
    options: { label: string; value: number | string }[]
    placeholder?: string
  } = $props()

  // svelte-ignore state_referenced_locally
  const { form: formData } = form
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -->
<Form.Field name={name as unknown as FormPath<T>} {form}>
  <Form.Control>
    {#snippet children({ props })}
      <Form.Label>{label}</Form.Label>

      <NativeSelect.Root
        class="w-full"
        required={true}
        bind:value={$formData[name] as never}
        {...props}
      >
        <NativeSelect.Option disabled selected value="">{placeholder}</NativeSelect.Option>
        {#each options as option (option.label)}
          <NativeSelect.Option value={option.value}>{option.label}</NativeSelect.Option>
        {/each}
      </NativeSelect.Root>
    {/snippet}
  </Form.Control>
  {#if children}
    <Form.Description>{@render children()}</Form.Description>
  {/if}
  <Form.FieldErrors />
</Form.Field>
