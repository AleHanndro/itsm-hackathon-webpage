<script lang="ts">
  import SquareCheckIcon from '@lucide/svelte/icons/square-check'

  import StageDialog from './stage-dialog.svelte'

  const stage = {
    desc: 'La etapa de Scoping representa el momento en el que una idea general deja de ser ambigua y se transforma en un problema claramente definido. Su propósito no es analizar a profundidad ni proponer soluciones, sino establecer con claridad qué problema vale la pena explorar.',
    icon: SquareCheckIcon,
    order: '01',
    title: 'Scoping',
  }
</script>

<StageDialog {stage}>
  <article class="prose">
    <h1>Scoping</h1>

    <section>
      <h2>Descripción</h2>
      <p>
        La etapa de Scoping representa el momento en el que una idea general deja de ser ambigua y
        se transforma en un problema claramente definido. Esta fase ocurre antes de la Problem
        Exploration, y su propósito no es analizar a profundidad ni proponer soluciones, sino
        establecer con claridad qué problema vale la pena explorar.
      </p>
      <p>
        Un scoping efectivo permite construir una base sólida para las etapas posteriores, evitando
        errores desde el inicio. En esta etapa se define el problema, su contexto y sus límites,
        asegurando que el proceso continúe de manera estructurada y enfocada.
      </p>
      <p>
        En este proyecto, el scoping se desarrolla bajo un enfoque de delimitación estratégica,
        donde cada elemento responde a la necesidad de claridad: identificar el problema correcto,
        entender su entorno y establecer alcances precisos que guíen la exploración posterior.
      </p>
    </section>

    <section>
      <h2>Técnicas utilizadas</h2>

      <article>
        <h3>Los 5 Porqués</h3>
        <p>
          Herramienta que permite profundizar en la comprensión del problema sin llegar aún a un
          análisis completo. A través de preguntas consecutivas, se construye una línea lógica que
          ayuda a identificar posibles causas raíz y evitar definiciones superficiales.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se parte de un problema general</li>
          <li>Se realizan preguntas consecutivas ("¿por qué?")</li>
          <li>Cada respuesta debe tener coherencia lógica</li>
          <li>Se busca una posible causa raíz</li>
          <li>Se evita caer en respuestas vagas o repetitivas</li>
        </ol>
      </article>

      <article>
        <h3>Diagrama de Contexto</h3>
        <p>
          Herramienta que permite visualizar el entorno del problema de manera general,
          identificando el sistema principal y los elementos externos que interactúan con él. Su
          función es delimitar el alcance sin entrar en detalles internos, los cuales corresponden a
          la etapa de Problem Exploration.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se define el sistema central</li>
          <li>Se identifican actores y sistemas externos</li>
          <li>Se representan relaciones generales</li>
          <li>No se incluyen detalles internos</li>
          <li>Se establecen límites y exclusiones claras</li>
        </ol>
      </article>
    </section>

    <section>
      <h2>Enfoque del Scoping</h2>
      <p>
        En lugar de buscar soluciones, esta etapa se centra en asegurar que el problema esté
        correctamente definido antes de avanzar.
      </p>
      <ul>
        <li>Se delimita el problema</li>
        <li>Se identifica el contexto</li>
        <li>Se reconocen los actores involucrados</li>
        <li>Se establecen alcances y exclusiones</li>
        <li>Se prioriza la claridad sobre la complejidad</li>
      </ul>
    </section>

    <section>
      <h2>Resultado de la etapa</h2>
      <p>
        Como resultado se obtiene un <strong>Project Scope Statement</strong>: documento que resume
        el problema definido, el enfoque del proyecto, los actores involucrados y los límites
        establecidos.
      </p>
    </section>
  </article>
</StageDialog>
