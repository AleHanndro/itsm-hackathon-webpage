<script lang="ts">
  import * as Card from '$lib/components/ui/card/index'

  import type { PageProps } from './$types'

  import Footer from '../_components/footer.svelte'
  import PreRegisterForm from './_components/pre-register-form.svelte'

  const { data }: PageProps = $props()
</script>

<svelte:head>
  <title>Prerregistro - Hackatón ITSM</title>
</svelte:head>

<Card.Root class="mx-auto mt-16 w-full max-w-md">
  <Card.Header>
    <Card.Title>Formulario de Prerregistro</Card.Title>
    <Card.Description>
      Para participar en el hackatón, es necesario prerregistrarse. Esto nos ayudará a organizar
      mejor el evento y asegurarnos de que todos los participantes tengan una experiencia increíble.
    </Card.Description>
  </Card.Header>

  <Card.Content>
    <PreRegisterForm {data} />
  </Card.Content>
</Card.Root>

<Footer />
