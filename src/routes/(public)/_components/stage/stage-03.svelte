<script lang="ts">
  import CodeIcon from '@lucide/svelte/icons/code'

  import StageDialog from './stage-dialog.svelte'

  const stage = {
    desc: 'La etapa de Solution Development representa el momento en el que se desarrolla una solución viable para el problema. Su propósito es crear un prototipo funcional que pueda ser probado y validado.',
    icon: CodeIcon,
    order: '03',
    title: 'Solution Development',
  }
</script>

<StageDialog {stage}>
  <article class="prose">
    <h1>Solution Development</h1>

    <section>
      <h2>Descripción</h2>
      <p>
        La etapa de Desarrollo de soluciones es el momento en el que una idea comienza a
        transformarse en una solución concreta. A partir del uso de técnicas, se parte de la
        generación de distintas ideas para resolver el problema, explorando varias alternativas.
      </p>
      <p>
        Posteriormente, estas se analizan, se comparan y se van descartando aquellas que no resultan
        viables, hasta quedarse con las opciones más prometedoras. Con las ideas seleccionadas, se
        profundiza en su desarrollo, definiendo cómo funcionarán, qué valor aportan y qué recursos
        se requieren para llevarlas a cabo. Además, se crean prototipos que permiten representar la
        solución de forma más clara.
      </p>
      <p>
        Durante todo este proceso, la solución se evalúa constantemente con base en criterios de
        aceptación previamente definidos. El producto de esta etapa es pasar de varias ideas a una
        bien definida, prototipada y validada.
      </p>
    </section>

    <section>
      <h2>Técnicas principales</h2>

      <article>
        <h3>Brainwriting Pool</h3>
        <p>
          Técnica para generar muchas ideas de manera estructurada, combinando trabajo individual y
          en equipo. A diferencia de la lluvia de ideas tradicional, aquí primero cada persona
          piensa por su cuenta. La meta es generar al menos 100 ideas.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>
            <strong>Generación individual rápida (10 min):</strong> Cada integrante escribe aproximadamente
            10 ideas relacionadas con el problema, sin analizarlas ni juzgarlas.
          </li>
          <li>
            <strong>Ideas malas → ideas buenas (15 min):</strong> Primero cada persona escribe 5 ideas
            absurdas o exageradas, luego las transforma en propuestas más útiles o realistas.
          </li>
          <li>
            <strong>Caja del equipo:</strong> Todas las ideas individuales se juntan en un mismo espacio
            (físico o digital).
          </li>
          <li>
            <strong>Combinar ideas (15 min):</strong> Cada integrante toma dos ideas al azar y las combina
            para crear una nueva propuesta.
          </li>
          <li>
            <strong>Intercambio y análisis grupal (15 min):</strong> El equipo toma ideas de la caja,
            las lee y entre todos las mejoran o generan nuevas.
          </li>
          <li>
            <strong>Conteo de ideas (5 min):</strong> Se cuentan todas las ideas generadas. La meta es
            alcanzar al menos 100.
          </li>
        </ol>
      </article>

      <article>
        <h3>Matriz de ERIC</h3>
        <p>
          Técnica para analizar, depurar y seleccionar ideas después de haber generado muchas
          opciones. Clasifica las ideas en cuatro acciones: eliminar, reducir, incrementar y crear.
          Permite tomar decisiones de manera objetiva y enfocar el proceso en las ideas con mayor
          impacto.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>
            <strong>Revisión y filtrado inicial (10 min):</strong> El equipo elimina rápidamente las ideas
            más débiles, repetidas o poco viables.
          </li>
          <li>
            <strong>Clasificación con ERIC (20 min):</strong> Las ideas restantes se organizan en: Eliminar
            (no aportan valor), Reducir (demasiado complejas), Incrementar (buenas con potencial) y Crear
            (nuevas ideas que surgen de las anteriores).
          </li>
          <li>
            <strong>Votación del equipo (15 min):</strong> Cada integrante distribuye stickers entre las
            ideas que considera mejores.
          </li>
          <li>
            <strong>Semáforo de ideas (15 min):</strong> Verde (avanzar), Amarillo (mejorar), Rojo (descartar).
          </li>
          <li>
            <strong>Selección final:</strong> Se eligen únicamente las ideas en verde (generalmente 2
            o 3) para continuar.
          </li>
        </ol>
      </article>

      <article>
        <h3>Tarjeta de Visión</h3>
        <p>
          Técnica para desarrollar y estructurar claramente una idea seleccionada, convirtiéndola en
          una propuesta bien definida y justificada. Analiza la solución considerando sus
          beneficios, recursos necesarios, posibles riesgos y el impacto que puede generar.
        </p>
        <h4>Cómo se implementa</h4>
        <ol>
          <li>Selección de la idea final más viable o prometedora.</li>
          <li>
            <strong>Llenado de la Tarjeta de Visión (45 min):</strong> qué problema resuelve, cómo funciona,
            ventajas, recursos necesarios, riesgos y beneficios a corto y largo plazo.
          </li>
          <li>Análisis y justificación de cada apartado.</li>
          <li>
            <strong>Comparación con preguntas clave (15 min):</strong> ¿Cuál resuelve mejor el problema?
            ¿Cuál es más fácil de implementar? ¿Cuál tiene mayor impacto?
          </li>
          <li>Selección definitiva basada en criterios, no en opiniones.</li>
        </ol>
      </article>

      <article>
        <h3>Prototipo</h3>
        <p>
          Representación inicial de una solución que permite hacerla visible, entendible y fácil de
          probar antes de desarrollarla por completo. Su objetivo es detectar errores, mejorar la
          idea y comunicarla de forma clara.
        </p>
        <h4>Tipos de prototipo</h4>
        <ul>
          <li><strong>Físico:</strong> usando materiales como cartón, LEGO, etc.</li>
          <li><strong>Dibujado:</strong> bocetos en papel con explicaciones.</li>
          <li><strong>Digital:</strong> pantallas o interfaces (ej. Figma).</li>
        </ul>
        <h4>El prototipo debe permitir entender</h4>
        <ul>
          <li>Qué hace la solución</li>
          <li>Cómo funciona</li>
          <li>Cómo la usaría el usuario</li>
        </ul>
      </article>

      <article>
        <h3>Criterios de Aceptación</h3>
        <p>
          Conjunto de condiciones que funcionan como guía de validación para comprobar si un
          prototipo cumple con lo que se espera de él. Permiten realizar una evaluación objetiva
          dejando de lado opiniones subjetivas, considerando aspectos concretos como la claridad de
          la solución, su funcionalidad, el valor que aporta y su viabilidad.
        </p>
      </article>
    </section>

    <section>
      <h2>Técnicas extras</h2>

      <article>
        <h3>Brainwriting</h3>
        <p>
          Cada persona escribe 3 ideas en 5 minutos y pasa la hoja para que otros las desarrollen.
        </p>
        <h4>Objetivos</h4>
        <ul>
          <li>Generar o desarrollar ideas de forma estructurada y silenciosa</li>
          <li>Captar el potencial creativo de personas más reservadas</li>
          <li>Separar la generación de ideas de su evaluación</li>
          <li>Construir ideas sobre las ideas de otros sin interrupciones</li>
        </ul>
      </article>

      <article>
        <h3>Brainstorming Especial</h3>
        <p>
          Variantes creativas para problemas complejos: brainstorming negativo, figuring storming,
          bodystorming.
        </p>
        <h4>Objetivos</h4>
        <ul>
          <li>Generar gran cantidad de ideas en tiempo limitado</li>
          <li>Ver el problema desde múltiples perspectivas y ángulos</li>
          <li>Superar bloqueos creativos en problemas abstractos o complejos</li>
          <li>Fomentar el intercambio activo y la escucha entre el equipo</li>
        </ul>
      </article>

      <article>
        <h3>Analogías y Benchmarking</h3>
        <p>Buscar soluciones análogas en otros dominios para inspirar ideas disruptivas.</p>
        <h4>Objetivos</h4>
        <ul>
          <li>Generar ideas con efecto WOW comparando soluciones de otros sectores</li>
          <li>Explicar conceptos complejos de forma comprensible con analogías</li>
          <li>Encontrar inspiración en problemas similares ya resueltos fuera del área</li>
          <li>Integrar procesos cognitivos para abordar problemas mal estructurados</li>
        </ul>
      </article>

      <article>
        <h3>Matriz 2×2</h3>
        <p>Clasifica ideas en dos ejes (ej. Valor vs. Esfuerzo, Cool vs. Doable).</p>
        <h4>Objetivos</h4>
        <ul>
          <li>Identificar rápidamente qué ideas tienen mayor potencial</li>
          <li>Obtener una primera visión del nivel de madurez de cada idea</li>
          <li>Priorizar oportunidades estratégicas de innovación</li>
          <li>Apoyar la toma de decisiones entre opciones</li>
        </ul>
      </article>

      <article>
        <h3>Diagrama de Elementos Críticos</h3>
        <p>
          El equipo acuerda los elementos críticos que la solución DEBE resolver para el usuario.
        </p>
        <h4>Objetivos</h4>
        <ul>
          <li>Procesar hallazgos de fases anteriores y filtrar los elementos decisivos</li>
          <li>Preparar la ideación y el prototipado con una base sólida</li>
          <li>Lograr consenso en el equipo sobre qué es esencial</li>
          <li>Derivar preguntas "¿Cómo podríamos…?" orientadas a la solución</li>
        </ul>
      </article>

      <article>
        <h3>Dot Voting</h3>
        <p>
          Cada participante distribuye puntos entre las ideas favoritas para decidir
          democráticamente.
        </p>
        <h4>Objetivos</h4>
        <ul>
          <li>Tomar decisiones conjuntas de forma rápida y transparente</li>
          <li>Simplificar y priorizar opciones evitando la "parálisis por análisis"</li>
          <li>Resolver desacuerdos sin que el poder jerárquico influya</li>
          <li>Involucrar la opinión de todos los participantes</li>
        </ul>
      </article>
    </section>
  </article>
</StageDialog>
