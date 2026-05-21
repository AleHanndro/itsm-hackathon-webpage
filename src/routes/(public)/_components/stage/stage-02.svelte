<script lang="ts">
  import MapPinIcon from '@lucide/svelte/icons/map-pin'

  import StageDialog from './stage-dialog.svelte'

  const stage = {
    desc: 'La etapa de Problem Exploration representa el momento en el que se profundiza en el problema para entenderlo a fondo. Su propósito es identificar las necesidades y expectativas del usuario, así como las restricciones y limitaciones del contexto.',
    icon: MapPinIcon,
    order: '02',
    title: 'Problem Exploration',
  }
</script>

<StageDialog {stage}>
  <article class="prose">
    <h1>Problem Exploration</h1>

    <section>
      <h2>Descripción</h2>
      <p>
        La etapa de Problem Exploration representa el momento en el que el problema previamente
        delimitado deja de ser una idea general y comienza a analizarse a profundidad desde la
        perspectiva del usuario y su contexto.
      </p>
      <p>
        A diferencia del Scoping, donde se establece qué problema se va a trabajar, en esta fase el
        objetivo es comprender cómo se manifiesta el problema en la realidad, identificando
        comportamientos, experiencias y factores que lo afectan.
      </p>
      <p>
        La exploración del problema permite evitar suposiciones, enfocándose en información
        observable y en la experiencia del usuario. Esto asegura que las siguientes etapas del
        proceso se basen en un entendimiento sólido y no en ideas ambiguas.
      </p>
      <p>
        En este proyecto, la Problem Exploration se desarrolla bajo un enfoque centrado en el
        usuario, donde se analizan sus acciones, emociones y entorno, con el fin de construir una
        visión clara del problema antes de definir soluciones.
      </p>
    </section>

    <section>
      <h2>Técnicas utilizadas</h2>

      <article>
        <h3>Context Mapping</h3>
        <p>
          Herramienta que permite analizar el entorno en el que ocurre el problema, identificando
          los factores, actores y situaciones que influyen en su desarrollo. Su función es
          comprender el problema dentro de un contexto real, evitando interpretaciones aisladas o
          fuera de la realidad del usuario.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se identifica el entorno donde ocurre el problema</li>
          <li>Se reconocen los actores involucrados</li>
          <li>Se analizan las situaciones en las que se presenta</li>
          <li>Se establecen relaciones entre los elementos</li>
          <li>Se evita proponer soluciones en esta etapa</li>
        </ol>
      </article>

      <article>
        <h3>Empathy Map</h3>
        <p>
          Herramienta que permite comprender la experiencia del usuario a partir de sus
          pensamientos, acciones y emociones. Su función es identificar cómo el usuario percibe el
          problema y qué impacto tiene en su comportamiento.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se define un usuario específico</li>
          <li>Se identifican lo que dice, piensa, hace y siente</li>
          <li>Se reconocen frustraciones (pains)</li>
          <li>Se identifican necesidades (needs)</li>
          <li>Se evita asumir sin evidencia</li>
        </ol>
      </article>

      <article>
        <h3>Persona &amp; User Profile</h3>
        <p>
          Herramienta que permite construir un perfil representativo del usuario basado en la
          información observada. Su función es sintetizar las características del usuario para
          facilitar la comprensión del problema desde su perspectiva.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se define un perfil de usuario (nombre, edad, contexto)</li>
          <li>Se identifican objetivos del usuario</li>
          <li>Se reconocen frustraciones</li>
          <li>Se describen comportamientos</li>
          <li>Se basa en información real, no en suposiciones</li>
        </ol>
      </article>

      <article>
        <h3>Customer Journey Map</h3>
        <p>
          Herramienta que permite visualizar el recorrido del usuario dentro del problema,
          identificando las etapas, acciones y puntos críticos. Su función es detectar en qué
          momento ocurre el problema y cómo afecta al usuario.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se identifican las etapas del recorrido del usuario</li>
          <li>Se describen las acciones en cada etapa</li>
          <li>Se analizan las emociones del usuario</li>
          <li>Se detectan puntos de dolor (pain points)</li>
          <li>Se evita simplificar el proceso</li>
        </ol>
      </article>

      <article>
        <h3>How Might We (HMW Question)</h3>
        <p>
          Herramienta que permite transformar el problema en una pregunta clara que guíe el
          desarrollo de soluciones. Su función es sintetizar la comprensión del problema en una
          forma enfocada y accionable.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Se parte del problema identificado</li>
          <li>Se formula una pregunta con "¿Cómo podríamos...?"</li>
          <li>Se incluye al usuario dentro de la pregunta</li>
          <li>Se evita incluir soluciones</li>
          <li>Se busca claridad y enfoque</li>
        </ol>
      </article>
    </section>

    <section>
      <h2>Enfoque de Problem Exploration</h2>
      <p>
        En lugar de definir superficialmente el problema o proponer soluciones, esta etapa se centra
        en comprenderlo a profundidad desde la perspectiva del usuario y su entorno.
      </p>
    </section>

    <section>
      <h2>Resultado de la etapa</h2>
      <p>
        Como resultado se obtiene una comprensión clara del problema, considerando el contexto en el
        que ocurre, la experiencia del usuario y los factores que lo afectan. Este resultado permite
        avanzar a la siguiente etapa con una base sólida, asegurando que el problema esté
        correctamente entendido antes de plantear soluciones.
      </p>
    </section>
  </article>
</StageDialog>
