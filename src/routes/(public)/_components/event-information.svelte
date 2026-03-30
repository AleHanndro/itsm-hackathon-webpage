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
  <GridContainer class={['border-line', className]}>
    <section>
      <h2
        class="border-b border-line px-2 font-display text-[2.5rem]/10 font-medium tracking-tighter max-sm:px-4"
      >
        {title}
      </h2>
      <p
        class="mt-6 border-t border-line px-2 text-balance text-muted-foreground max-sm:px-4 md:mt-10"
      >
        {@render children()}
      </p>
    </section>
  </GridContainer>
{/snippet}

{#snippet event()}
  Este evento es impulsado por el departamento de <code
    class="font-display font-medium text-accent"
  >
    Ingeniería en Sistemas Computacionales
  </code>, sin embargo, cualquier estudiante inscrito en las ingenierías del Instituto Tecnológico
  Superior de Motul puede formar un equipo y participar.
{/snippet}

{#snippet dynamic()}
  Los equipos tendrán exactamente un día para pasar de una idea abstracta a una idea viable y a un
  modelo de negocio validado. Habrá <code class="font-display font-medium text-accent">
    Coffee breaks
  </code> y talleres relámpago previo al evento para asegurar que tu proyecto llegue a la meta.
{/snippet}

<div>
  <GridContainer>
    <span
      class="origin-bottom-right px-2 font-mono text-sm font-bold tracking-widest text-accent uppercase select-none max-sm:px-4"
    >
      Información del evento
    </span>
  </GridContainer>

  <div class="mt-4 grid grid-cols-1 gap-10 max-md:gap-5 md:grid-cols-2">
    {@render info({
      children: event,
      className: 'md:border-r',
      title: '¿Quiénes pueden participar?',
    })}

    {@render info({
      children: dynamic,
      className: 'md:border-l md:before:hidden md:after:hidden',
      title: 'Reto 24h.',
    })}
  </div>
</div>
