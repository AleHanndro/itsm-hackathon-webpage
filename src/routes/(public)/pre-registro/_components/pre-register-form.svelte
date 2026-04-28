<script lang="ts">
  import { page } from '$app/state'
  import * as Alert from '$lib/components/ui/alert/index'
  import Button from '$lib/components/ui/button.svelte'
  import * as Form from '$lib/components/ui/form/index'
  import Input from '$lib/components/ui/input.svelte'
  import { engineerings, groups, shirtSizeEnum } from '$lib/schema/pre-registrations'
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert'
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert'
  import { tick } from 'svelte'
  import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms'
  import { zod4Client } from 'sveltekit-superforms/adapters'

  import { genders, newPreRegistrationSchema, type NewPreRegistrationSchema } from '../schema'
  import CheckboxField from './checkbox-field.svelte'
  import SelectField from './select-field.svelte'

  interface SelectOption<T> {
    label: string
    value: T extends readonly (infer U)[] ? U : T
  }

  const { data }: { data: { form: SuperValidated<Infer<NewPreRegistrationSchema>> } } = $props()

  // svelte-ignore state_referenced_locally
  const form = superForm(data.form, {
    onUpdated: async ({ form }) => {
      await tick()
      formContainer?.scrollIntoView({ behavior: 'smooth', block: form.valid ? 'center' : 'start' })
    },
    resetForm: true,
    validators: zod4Client(newPreRegistrationSchema),
  })

  const { delayed, enhance, form: formData, message } = form

  // Options for the select fields
  const groupOptions: SelectOption<typeof groups>[] = groups.map((value) => ({
    label: value,
    value,
  }))

  const sizeOptions: SelectOption<typeof shirtSizeEnum.enumValues>[] = [
    { label: 'Extra Chica (ECH)', value: 'ECH' },
    { label: 'Chica (CH)', value: 'CH' },
    { label: 'Mediana (M)', value: 'M' },
    { label: 'Grande (G)', value: 'G' },
    { label: 'Extra Grande (EG)', value: 'EG' },
    { label: 'Doble Extra Grande (2EG)', value: '2EG' },
    { label: 'Triple Extra Grande (3EG)', value: '3EG' },
    { label: 'Cuádruple Extra Grande (4EG)', value: '4EG' },
  ] as const

  const genderOptions: SelectOption<typeof genders>[] = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'Otro', value: 'otro' },
    { label: 'Prefiero no decirlo', value: 'prefiero no decirlo' },
  ] as const

  const semesterOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${(i + 1).toString()}º Semestre`,
    value: i + 1,
  }))

  const engineeringOptions: SelectOption<typeof engineerings>[] = [
    { label: 'Ingeniería en Sistemas Computacionales', value: 'ISC' },
    { label: 'Ingeniería en Electrónica', value: 'IE' },
    { label: 'Ingeniería en Energías Renovables', value: 'IER' },
    { label: 'Ingeniería en Electromecánica', value: 'IEM' },
    { label: 'Ingeniería Industrial', value: 'II' },
  ]

  const isSuccess = $derived(page.status === 200 && $message)
  let formContainer: HTMLDivElement | undefined = undefined
</script>

<div bind:this={formContainer}>
  {#if isSuccess}
    <div class="flex flex-col items-center justify-center space-y-4 py-8 text-center">
      <CircleCheckIcon class="size-16 text-green-500" />
      <h3 class="font-display text-2xl font-bold text-foreground">¡Registro exitoso!</h3>
      <p class="text-muted-foreground">{$message}</p>

      <Button class="mt-4 w-full" onclick={() => ($message = undefined)} variant="outline">
        Registrar a otra persona
      </Button>
    </div>
  {:else}
    <form class="space-y-6" method="POST" use:enhance>
      {#if page.status >= 400 && $message}
        <Alert.Root variant="destructive">
          <CircleAlertIcon class="size-4" />
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{$message}</Alert.Description>
        </Alert.Root>
      {/if}

      <Form.Field name="name" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Nombre completo</Form.Label>
            <Input
              placeholder="Victor Alejandro Salazar López"
              type="text"
              {...props}
              bind:value={$formData.name}
            />
          {/snippet}
        </Form.Control>
        <Form.Description>
          Por favor, ingresa tu nombre completo para que podamos identificarte durante el evento.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field name="email" {form}>
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Correo electrónico</Form.Label>
            <Input
              placeholder="victor.22070063@itsmotul.edu.mx"
              type="email"
              {...props}
              bind:value={$formData.email}
            />
          {/snippet}
        </Form.Control>
        <Form.Description>
          Ingresa un correo electrónico válido para que podamos enviarte información importante
          sobre el evento.
        </Form.Description>
        <Form.FieldErrors />
      </Form.Field>

      <SelectField
        name="gender"
        {form}
        label="Género"
        options={genderOptions}
        placeholder="Selecciona tu género"
      >
        Selecciona tu género para que podamos tener una mejor idea de la diversidad de los
        participantes en el evento. Esta información se utilizará solo con fines estadísticos.
      </SelectField>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField
          name="semester"
          {form}
          label="Semestre"
          options={semesterOptions}
          placeholder="Selecciona tu semestre"
        />

        <SelectField
          name="group"
          {form}
          label="Grupo"
          options={groupOptions}
          placeholder="Selecciona tu grupo"
        />
      </div>

      <SelectField
        name="engineering"
        {form}
        label="Carrera"
        options={engineeringOptions}
        placeholder="Selecciona tu carrera"
      />

      <SelectField
        name="shirtSize"
        {form}
        label="Talla de playera o blusa"
        options={sizeOptions}
        placeholder="Selecciona tu talla"
      >
        <span class="flex items-start gap-2">
          <TriangleAlertIcon class="mt-0.5 size-4 shrink-0 text-yellow-500 dark:text-yellow-400" /> Las
          playeras y blusas se encuentran sujetas a disponibilidad, por lo que es importante que selecciones
          la talla correcta. Haremos todo lo posible por proporcionar la talla que elijas, pero en caso
          de que no esté disponible, te contactaremos para ofrecerte una alternativa.
        </span>
      </SelectField>

      <!-- Campos de aceptación de términos y condiciones, preinscripción y recepción de correos electrónicos -->
      <div class="space-y-4">
        <CheckboxField
          name="acceptPreregistration"
          {form}
          label="Acepto prerregistrarme al hackatón y que hasta a hacer el pago de $350.00 MXN confirmo mi participación para el evento"
        />
        <CheckboxField
          name="acceptTerms"
          {form}
          label="Acepto los términos y condiciones del hackatón"
        />
        <CheckboxField
          name="wantsAnnouncements"
          description="No te preocupes, solo te enviaremos información importante sobre el evento."
          {form}
          label="Quiero recibir correos electrónicos relacionados con el hackatón"
          required={false}
        />
      </div>

      <Form.Button class="w-full" disabled={$delayed}>
        {#if $delayed}
          Registrando...
        {:else}
          Registrarme
        {/if}
      </Form.Button>
    </form>
  {/if}
</div>
