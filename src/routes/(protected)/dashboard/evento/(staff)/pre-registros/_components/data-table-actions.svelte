<script lang="ts">
  import Button from '$lib/components/ui/button.svelte'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index'
  import EllipsisIcon from '@lucide/svelte/icons/ellipsis'
  import { getContext } from 'svelte'

  import type { PreRegistrations } from './columns'

  import { TABLE_STATE_KEY, type TableState } from './table-state.svelte'

  let { data }: { data: PreRegistrations } = $props()

  const table = getContext<TableState>(TABLE_STATE_KEY)
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} class="relative size-8 p-0" size="icon" variant="ghost">
        <span class="sr-only">Abrir Menú</span>
        <EllipsisIcon />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Acciones</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(data.id.toString())}>
        Copiar ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <!-- Dialog opener -->
    <DropdownMenu.Item onclick={() => table.openDetails(data)}>Ver Detalles</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
