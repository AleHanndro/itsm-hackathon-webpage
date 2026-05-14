<script lang="ts">
  import { enhance } from '$app/forms'
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index'

  let {
    action,
    description,
    hiddenInputs = {},
    open = $bindable(false),
    title,
  }: {
    action: string
    description: string
    hiddenInputs?: Record<string, number | string>
    open: boolean
    title: string
  } = $props()
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{title}</AlertDialog.Title>
      <AlertDialog.Description>{description}</AlertDialog.Description>
    </AlertDialog.Header>

    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
      <form
        class="w-full sm:w-auto"
        {action}
        method="POST"
        use:enhance={() => {
          return async ({ update }) => {
            open = false
            await update()
          }
        }}
      >
        {#each Object.entries(hiddenInputs) as [name, value] (name)}
          <input {name} type="hidden" {value} />
        {/each}
        <AlertDialog.Action class="w-full" type="submit">Eliminar</AlertDialog.Action>
      </form>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
