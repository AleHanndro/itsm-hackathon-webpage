<script lang="ts">
  import CpuIcon from '@lucide/svelte/icons/cpu'

  import StageDialog from './stage-dialog.svelte'

  const stage = {
    desc: 'La etapa de Validation & Testing representa el momento en el que se valida y prueba la solución. Su propósito es asegurar que la solución cumple con los criterios de aceptación y es viable.',
    icon: CpuIcon,
    order: '05',
    title: 'Validation & Testing',
  }
</script>

<StageDialog {stage}>
  <article class="prose">
    <h1>Validation & Testing</h1>

    <section>
      <h2>Descripción</h2>
      <p>
        El propósito principal es comprobar si las ideas desarrolladas en las fases anteriores
        realmente tienen sentido en un contexto real. Después de haber definido un problema,
        propuesto una solución y estructurado un modelo de negocio, es común que los equipos
        trabajen con muchas suposiciones que aún no han sido verificadas.
      </p>
      <p>
        A diferencia de otras fases donde se fomenta la creatividad y la generación de soluciones,
        en la validación se busca adoptar una postura crítica. Aquí no se trata de mejorar la idea
        ni de desarrollarla más, sino de entender qué partes de ella no están comprobadas y
        representan un riesgo.
      </p>
      <p>
        La validación transforma una idea en un planteamiento más sólido, ya que obliga a los
        participantes a justificarla con evidencia y no solo con intuición.
      </p>
    </section>

    <section>
      <h2>Técnicas aplicadas</h2>

      <article>
        <h3>Fase 1 — Identificación de Supuestos (Assumption Mapper)</h3>
        <p>
          Los participantes parten de su idea y su usuario objetivo para escribir distintas
          suposiciones relacionadas con su proyecto. Estas suposiciones representan creencias que
          consideran verdaderas, pero que aún no han sido comprobadas. Posteriormente, se comparten
          y agrupan en el pizarrón para organizar la información y encontrar patrones.
        </p>
        <p>Se incorporaron preguntas clave para evaluar cada supuesto de forma estructurada:</p>
        <ul>
          <li>¿Es fácil o difícil de probar?</li>
          <li>¿Puede comprobarse en el corto plazo?</li>
          <li>¿Qué tan crítico es para el funcionamiento del proyecto?</li>
        </ul>
        <p>
          Como resultado, cada equipo seleccionó un número reducido de supuestos prioritarios sobre
          los cuales trabajar en la siguiente fase.
        </p>
      </article>

      <article>
        <h3>Fase 2 — Diseño de Experimentos (Experiment Picker &amp; Cards)</h3>
        <p>
          Los participantes toman los supuestos críticos previamente identificados y definen cómo
          podrían comprobarlos en la práctica. El enfoque prioriza la simplicidad y rapidez,
          promoviendo métodos accesibles como encuestas, entrevistas o pruebas con prototipos
          básicos.
        </p>
        <p>Cada experimento fue acompañado de:</p>
        <ul>
          <li>
            <strong>Hipótesis:</strong> convierte una suposición en una afirmación medible, estableciendo
            un resultado esperado evaluable de forma objetiva.
          </li>
          <li>
            <strong>Métrica:</strong> define el indicador que se utilizará para determinar si el experimento
            fue exitoso o no.
          </li>
        </ul>
      </article>

      <article>
        <h3>Fase 3 — Validation Canvas</h3>
        <p>
          Herramienta que permite organizar toda la información generada en un solo esquema visual.
          Integra los elementos clave del proceso de validación y facilita la comprensión del
          proceso completo.
        </p>
        <h4>Elementos del Canvas</h4>
        <ul>
          <li>Suposición</li>
          <li>Hipótesis</li>
          <li>Experimento</li>
          <li>Métrica</li>
          <li>Resultado esperado</li>
        </ul>
      </article>
    </section>

    <section>
      <h2>Resultado de la etapa</h2>
      <p>
        Un <strong>Validation Canvas</strong> completo que resume todo el proceso de validación y sirve
        como base para la siguiente fase del rally, enfocada en la presentación del proyecto. La idea
        queda transformada en un planteamiento sólido justificado con evidencia.
      </p>
    </section>
  </article>
</StageDialog>
