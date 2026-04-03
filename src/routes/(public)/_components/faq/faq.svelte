<script lang="ts">
  import GridContainer from '$lib/components/grid-container.svelte'

  import FaqGroup from './faq-group.svelte'
  import FaqQuestion from './faq-question.svelte'
</script>

<div>
  <GridContainer>
    <span
      class="origin-bottom-right px-2 font-mono text-sm font-bold tracking-widest text-accent-3 uppercase select-none max-sm:px-4"
    >
      Preguntas Frecuentes
    </span>
  </GridContainer>

  <section id="faq" class="line-y mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
    <div class="lg:border-r lg:border-line">
      <h2
        class="line-b/half px-2 font-display text-[2.5rem]/10 font-medium tracking-tighter max-sm:px-4"
      >
        <a href="#faq">Aclaremos tus dudas.</a>
      </h2>

      <p class="mt-4 px-4 text-base/7 text-pretty text-muted-foreground sm:px-2">
        Aquí encontrarás respuestas a las preguntas más comunes sobre el hackatón. Si tienes alguna
        duda o pregunta que no esté respondida aquí, por favor, comunícate con nosotros a través del
        siguiente correo electrónico:
        <a class="font-medium text-accent-3 underline" href="mailto:maria.22070018@itsmotul.edu.mx">
          maria.22070018@itsmotul.edu.mx
        </a>.
      </p>
    </div>

    <div class="line-b grid grid-cols-1 gap-10 lg:border-l lg:border-line">
      <FaqGroup class="border-b border-line" title="Preguntas Generales">
        <FaqQuestion question="¿Tiene algún costo participar?">
          <p>
            Sí, el costo de participación es de <strong>$350 pesos por persona</strong>. Este costo
            cubre el acceso al hackatón, materiales, comidas y souvenirs que se entregarán durante
            el evento.
          </p>
        </FaqQuestion>
      </FaqGroup>
      <FaqGroup title="Sobre los Equipos">
        <FaqQuestion question="¿Cómo se formarán los equipos?">
          <p>
            Los equipos se formarán el primer día del hackatón. En caso de contar con estudiantes de
            otras ingenierías que gusten paticipar, se les asignará un equipo de manera aleatoria,
            de manera que los equipos quedaría de la siguiente manera: 3 estudiantes de Ingeniería
            en Sistemas Computacionales y 2 estudiantes de otras ingenierías. En caso de no contar
            con estudiantes de otras ingenierías, los equipos se formarán de manera aleatoria entre
            estudiantes de Ingeniería en Sistemas Computacionales, pero solo serían de 3 personas.
          </p>
          <p>
            Si deseas formar tu propio equipo, puedes hacerlo siempre y cuando cumplas con los
            requisitos establecidos.
          </p>
        </FaqQuestion>
        <FaqQuestion question="Quiero formar mi equipo, ¿Qué requisitos debe cumplir?">
          <p>
            Si elegiste la opción de formar tu propio equipo o participar en la
            <strong>modalidad Ideatón</strong>, este debe cumplir con los siguientes requisitos
            obligatoriamente para poder participar en el hackatón:
          </p>
          <ol>
            <li>
              El equipo debe estar conformado por 5 integrantes, distribuidos de la siguiente
              manera:
            </li>
            <ul>
              <li>
                3 integrantes deben ser estudiantes de Ingeniería en Sistemas Computacionales.
              </li>
              <li>
                2 integrantes deben ser estudiantes de ingenierías diferentes, por ejemplo, 1
                integrante de Ingeniería Industrial, 1 integrante de Ingeniería Electromecánica.
              </li>
            </ul>
            <li>
              El equipo debe ser mixto, es decir, debe estar conformado tanto por hombres como por
              mujeres.
            </li>
          </ol>
        </FaqQuestion>
        <FaqQuestion
          question="Ya tengo mi equipo, ¿A quién le entrego la lista de integrantes y cuándo?"
        >
          <p>
            Se proporcionará un formulario para que puedas registrar a tu equipo, el cual se
            entregará a través de los canales oficiales del hackatón, como el sitio web o el correo
            institucional. El formulario deberá ser completado con la información de todos los
            integrantes del equipo, incluyendo nombre completo, número de matrícula, carrera y
            correo electrónico.
          </p>
        </FaqQuestion>
      </FaqGroup>
    </div>

    <div class="pointer-events-none relative max-lg:hidden">
      <div
        class="bg-pattern absolute inset-0 -top-10 -right-10.25 [--pattern-fg:var(--color-line)] lg:border-r lg:border-r-(--pattern-fg)"
      ></div>
    </div>

    <div class="grid grid-cols-1 gap-10">
      <FaqGroup title="Sobre el evento">
        <FaqQuestion question="¿Qué necesito llevar?">
          <p>
            Opcionalmente puedes llevar tu cobertor, almohada, pijama o cualquier otro artículo que
            te ayude a descansar durante el evento.
          </p>
        </FaqQuestion>
        <FaqQuestion question="¿Puedo salir durante el evento (ir a mi casa a dormir o bañarme)?">
          <p>
            No, el evento es de 24 horas continuas, por lo que no se permite salir durante el
            evento.
          </p>
        </FaqQuestion>
      </FaqGroup>
    </div>
  </section>
</div>
