<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte'

  import Button from '$lib/components/ui/button.svelte'
  import * as Dialog from '$lib/components/ui/dialog/index'

  import StageCard from './stage-card.svelte'

  const { children, stage }: ComponentProps<typeof StageCard> & { children: Snippet } = $props()
</script>

<Dialog.Root>
  <Dialog.Trigger title="Ver más información de la etapa: {stage.title}">
    {#snippet child({ props })}
      <StageCard {...props} class="cursor-pointer" {stage} />
    {/snippet}
  </Dialog.Trigger>

  <Dialog.Content
    class="flex max-h-[85vh] flex-col overflow-hidden p-0 sm:w-full sm:max-w-(--breakpoint-md)"
  >
    <div class="flex-1 overflow-y-auto p-6 pr-12 md:p-8 md:pr-14">
      {@render children()}
    </div>
    <Dialog.Footer>
      <Dialog.Close>
        {#snippet child({ props })}
          <Button {...props} class="w-full" variant="outline">Cerrar</Button>
        {/snippet}
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
