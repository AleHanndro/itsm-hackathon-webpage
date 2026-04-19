<script lang="ts">
  import type { Snippet } from 'svelte'

  import GridContainer from '$lib/components/grid-container.svelte'

  interface InfoProps {
    children: Snippet
    className: string
    title: string
  }
</script>

{#snippet info({ children, className, title }: InfoProps)}
  <section class={['border-line', className]}>
    <h2
      class="border-b border-line px-2 font-display text-[2.5rem]/10 font-medium tracking-tighter text-balance max-sm:px-4"
    >
      {title}
    </h2>
    <p
      class="mt-6 border-t border-line p-2 text-pretty text-muted-foreground max-sm:p-4 md:mt-10 [&>strong]:font-display [&>strong]:font-medium [&>strong]:text-accent"
    >
      {@render children()}
    </p>
  </section>
{/snippet}

{#snippet event()}
  Este evento es impulsado por la coordinación de innovación de la
  <strong>Ingeniería en Sistemas Computacionales</strong> y cualquier estudiante inscrito en el
  Instituto Tecnológico Superior de Motul puede formar un equipo y participar libremente.
  <br /><br />
  Los equipos deben ser interdisciplinarios, al menos dos ingenierías y promover la participación igualitaria
  sin distinción de género entre los miembros del equipo.
{/snippet}

{#snippet dynamic()}
  Los equipos tendrán exactamente un día para pasar de una idea abstracta a una idea viable y a un
  modelo de negocio validado. Habrá <strong>Coffee breaks</strong> y talleres relámpago previo al
  evento para asegurar que tu proyecto llegue a la meta.
  <br /><br />
  En la ISC sabemos que 24 horas puede ser muy pesado anímicamente, por eso tendremos actividades de socialización
  y recreación para que la convivencia sea también memorable.
{/snippet}

<div>
  <GridContainer>
    <span
      class="origin-bottom-right px-2 font-mono text-sm font-bold tracking-widest text-accent uppercase select-none max-sm:px-4"
    >
      Información del evento
    </span>
  </GridContainer>

  <GridContainer class="mt-4 grid grid-cols-1 gap-10 max-md:gap-5 md:grid-cols-2">
    {@render info({
      children: event,
      className: 'md:border-r',
      title: '¿Quiénes pueden participar?',
    })}

    {@render info({
      children: dynamic,
      className: 'md:border-l md:before:hidden md:after:hidden max-md:border-t',
      title: 'Reto 24h.',
    })}
  </GridContainer>
</div>
