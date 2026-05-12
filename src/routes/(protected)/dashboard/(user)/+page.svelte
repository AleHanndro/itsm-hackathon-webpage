<script lang="ts">
  import type { LayoutData } from './$types'

  const { data }: { data: LayoutData } = $props()
</script>

<h1>
  Bienvenido {data.user.name}
</h1>

<div class="flex h-full flex-col items-center justify-center">
  <h1>
    {!data.approved ? 'Acceso denegado' : 'Evento no iniciado'}
  </h1>
  <p>
    {!data.approved
      ? 'Tu prerregistro aún no ha sido aprobado. Por favor, espera a que el equipo de organización revise tu solicitud.'
      : 'El evento aún no ha comenzado. La fecha de inicio está programada para el 29 de mayo de 2026, a las 09:00 A.M.'}
  </p>
</div>
