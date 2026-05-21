<script lang="ts">
  import PresentationIcon from '@lucide/svelte/icons/presentation'

  import StageDialog from './stage-dialog.svelte'

  const stage = {
    desc: 'La etapa de Pitch Design representa el momento en el que se diseña una presentación convincente para la solución. Su propósito es asegurar que la solución es viable y sostenible.',
    icon: PresentationIcon,
    order: '06',
    title: 'Pitch Design',
  }
</script>

<StageDialog {stage}>
  <article class="prose">
    <h1>Pitch Design</h1>

    <section>
      <h2>Descripción</h2>
      <p>
        En el marco de Business Design, el pitch no se define como un simple resumen o una
        improvisación, sino como una presentación breve y persuasiva diseñada específicamente para
        generar una reacción en un tomador de decisiones.
      </p>
      <p>
        Es la fase donde se utiliza el pensamiento estratégico para diseñar una propuesta de valor
        completa, asegurando que el mensaje sea claro, contundente y memorable ante un jurado.
      </p>
    </section>

    <section>
      <h2>Implementación de Técnicas</h2>

      <article>
        <h3>Pitching Canvas</h3>
        <p>
          Herramienta visual que estructura la narrativa en cuatro pilares. Su función es obligar al
          equipo a sintetizar la información para evitar discursos desordenados.
        </p>
        <h4>Los cuatro pilares</h4>
        <ol>
          <li>El problema validado</li>
          <li>La evidencia recolectada</li>
          <li>El modelo de valor</li>
          <li>Los próximos pasos específicos</li>
        </ol>
      </article>

      <article>
        <h3>Preguntas Críticas</h3>
        <p>
          Sustituyen a los largos checklists de revisión para evitar el sobreanálisis. El equipo
          debe ser capaz de responder cada una de manera directa:
        </p>
        <ul>
          <li>¿Qué riesgo están eliminando?</li>
          <li>¿Qué evidencia real poseen?</li>
          <li>¿Qué recursos necesitan?</li>
          <li>¿Cuál es la acción específica a realizar?</li>
        </ul>
      </article>

      <article>
        <h3>Evaluación y Dry-run</h3>
        <p>
          Se realiza un ensayo simulado bajo condiciones reales para identificar el obstáculo
          principal del proyecto. Permite al equipo detectar debilidades en su narrativa antes de la
          presentación final ante el jurado.
        </p>
      </article>
    </section>

    <section>
      <h2>Criterios de Aceptación</h2>
      <p>
        Para que un pitch sea considerado exitoso, debe cumplir con cinco criterios mínimos
        obligatorios:
      </p>
      <ol>
        <li>Un problema validado con datos y no solo opiniones</li>
        <li>Una solución con lógica directa al problema</li>
        <li>Un modelo de negocio explicable en máximo dos oraciones</li>
        <li>Evidencia tangible o prototipo</li>
        <li>Pasos concretos realizables durante el hackathon</li>
      </ol>
    </section>

    <section>
      <h2>Resultado esperado</h2>
      <p>
        Un equipo con total claridad operativa, capaz de captar la atención del jurado en los <strong
          >tres minutos críticos</strong
        > de su presentación y de defender su proyecto con evidencia real obtenida mediante entrevistas
        u observaciones directas.
      </p>
    </section>
  </article>
</StageDialog>
