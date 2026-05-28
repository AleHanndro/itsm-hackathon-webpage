<script lang="ts">
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import { buttonVariants } from '$lib/components/ui/button.svelte'
  import AlertCircleIcon from '@lucide/svelte/icons/alert-circle'
  import ShieldAlertIcon from '@lucide/svelte/icons/shield-alert'
</script>

<svelte:head>
  <title>Error {page.status}</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-4 text-center">
  {#if page.status === 403}
    <ShieldAlertIcon class="size-24 text-destructive/80" />
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold tracking-tight">Acceso Denegado</h1>
      <p class="mx-auto max-w-md text-xl text-muted-foreground">
        {page.error?.message ?? 'No tienes permiso para ver esta etapa.'}
      </p>
    </div>
  {:else}
    <AlertCircleIcon class="size-24 text-destructive/80" />
    <div class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold tracking-tight">Error {page.status}</h1>
      <p class="mx-auto max-w-md text-xl text-muted-foreground">
        {page.error?.message ?? 'Ha ocurrido un error inesperado.'}
      </p>
    </div>
  {/if}

  <div class="mt-4">
    <a class={buttonVariants({ variant: 'default' })} href={resolve('/dashboard/evento')}>
      Volver al Inicio
    </a>
  </div>
</div>
