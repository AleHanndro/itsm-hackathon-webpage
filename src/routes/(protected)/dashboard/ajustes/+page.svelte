<script lang="ts">
  import * as Card from '$lib/components/ui/card/index'

  import type { PageData } from './$types'

  import ChangePasswordForm from './_components/change-password-form.svelte'

  const { data }: { data: PageData } = $props()
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Ajustes</Card.Title>
    <Card.Description>Cambia tu contraseña y otras configuraciones de tu cuenta.</Card.Description>
  </Card.Header>

  <Card.Content>
    <ChangePasswordForm form={data.form} />
  </Card.Content>
</Card.Root>
