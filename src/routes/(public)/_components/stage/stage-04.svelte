<script lang="ts">
  import BriefCaseIcon from '@lucide/svelte/icons/briefcase'

  import StageDialog from './stage-dialog.svelte'

  const stage = {
    desc: 'La etapa de Business Model representa el momento en el que se desarrolla un modelo de negocio viable para la solución. Su propósito es asegurar que la solución es viable y sostenible.',
    icon: BriefCaseIcon,
    order: '04',
    title: 'Business Model',
  }
</script>

<StageDialog {stage}>
  <article class="prose">
    <h1>Business Model (Modelo de Negocio)</h1>

    <section>
      <h2>Descripción</h2>
      <p>
        En esta área se deben presentar los modelos de ingreso para que los concursantes puedan
        conocerlos y aplicarlos en su propuesta de negocio. Se requieren 2 juegos de tarjetas con
        los 21 modelos.
      </p>
    </section>

    <section>
      <h2>Los 21 modelos</h2>

      <article>
        <h3>1. Venta Directa</h3>
        <p>Vendes un producto o servicio una sola vez. Pago único.</p>
        <p><strong>Ejemplo:</strong> Nike vende tenis.</p>
        <h4>Por qué funcionó</h4>
        <p>
          Nike construyó marca + deseo. No solo vende tenis, vende identidad, estatus y rendimiento.
        </p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Diferencíate (diseño, calidad o marca)</li>
          <li>No vendas "producto", vende un beneficio claro</li>
        </ul>
      </article>

      <article>
        <h3>2. Suscripción</h3>
        <p>Pago recurrente (mensual/anual). Ingresos estables.</p>
        <p><strong>Ejemplo:</strong> Netflix.</p>
        <h4>Por qué funcionó</h4>
        <p>Ingresos constantes + contenido exclusivo que hace difícil cancelar.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Ofrece valor continuo (contenido, servicio, acceso)</li>
          <li>Que el cliente "necesite quedarse"</li>
        </ul>
      </article>

      <article>
        <h3>3. Freemium</h3>
        <p>Versión gratis + versión premium de pago. Convierte usuarios gratuitos en clientes.</p>
        <p><strong>Ejemplo:</strong> Spotify.</p>
        <h4>Por qué funcionó</h4>
        <p>Primero engancha gratis → luego limita funciones → el usuario paga por comodidad.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Da algo útil gratis</li>
          <li>Reserva lo mejor para pago</li>
        </ul>
      </article>

      <article>
        <h3>4. Pago por Uso</h3>
        <p>El cliente paga según cuánto utiliza el servicio. Flexible y escalable.</p>
        <p><strong>Ejemplo:</strong> Uber.</p>
        <h4>Por qué funcionó</h4>
        <p>El cliente paga solo cuando lo necesita → baja barrera de entrada.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Ideal para servicios variables</li>
          <li>Cobro por horas, consumo o uso real</li>
        </ul>
      </article>

      <article>
        <h3>5. Comisión</h3>
        <p>Cobras un porcentaje por intermediar. Modelo de marketplace.</p>
        <p><strong>Ejemplo:</strong> Airbnb.</p>
        <h4>Por qué funcionó</h4>
        <p>No necesita propiedades → solo conecta personas.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Crea una plataforma de intermediación</li>
          <li>Conectar proveedores con clientes y cobrar %</li>
        </ul>
      </article>

      <article>
        <h3>6. Publicidad</h3>
        <p>Ingresos por mostrar anuncios. Monetizas atención.</p>
        <p><strong>Ejemplo:</strong> YouTube.</p>
        <h4>Por qué funcionó</h4>
        <p>Tiene millones de usuarios → vende atención.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Necesitas tráfico o audiencia</li>
          <li>Blog, app o contenido con muchos usuarios</li>
        </ul>
      </article>

      <article>
        <h3>7. Licenciamiento</h3>
        <p>
          Permites usar tu marca, tecnología o contenido por un pago. Ingresos sin producir
          directamente.
        </p>
        <p><strong>Ejemplo:</strong> Disney.</p>
        <h4>Por qué funcionó</h4>
        <p>Su propiedad intelectual vale millones → otros pagan por usarla.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Crea algo único (marca, software, diseño)</li>
          <li>Vender derechos de uso</li>
        </ul>
      </article>

      <article>
        <h3>8. Franquicia</h3>
        <p>Otros pagan por usar tu modelo de negocio. Expansión rápida.</p>
        <p><strong>Ejemplo:</strong> McDonald's.</p>
        <h4>Por qué funcionó</h4>
        <p>Sistema replicable + marca fuerte.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Documenta tu negocio</li>
          <li>Hazlo fácil de copiar</li>
        </ul>
      </article>

      <article>
        <h3>9. Membresía</h3>
        <p>Pago por pertenecer a una comunidad o club. Valor por exclusividad.</p>
        <p><strong>Ejemplo:</strong> Costco.</p>
        <h4>Por qué funcionó</h4>
        <p>Cobran por acceso → clientes comprometidos.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Ofrece beneficios exclusivos</li>
          <li>Club VIP, descuentos, contenido</li>
        </ul>
      </article>

      <article>
        <h3>10. Afiliación</h3>
        <p>Ganas comisión por recomendar productos. Marketing digital.</p>
        <p><strong>Ejemplo:</strong> Amazon (programas afiliados).</p>
        <h4>Por qué funcionó</h4>
        <p>Otros venden por ellos → expansión masiva sin costo alto.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Permite que otros promocionen tu producto</li>
          <li>Pagar comisión por venta generada</li>
        </ul>
      </article>

      <article>
        <h3>11. Venta de Datos</h3>
        <p>Monetizas información agregada (legalmente). Basado en análisis de comportamiento.</p>
        <p><strong>Ejemplo:</strong> Google (publicidad segmentada).</p>
        <h4>Por qué funcionó</h4>
        <p>Tiene datos masivos → los usa para publicidad precisa.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Analiza comportamiento (legalmente)</li>
          <li>Insights de clientes para empresas</li>
        </ul>
      </article>

      <article>
        <h3>12. Subasta</h3>
        <p>El precio lo define el mejor postor. Dinámica competitiva.</p>
        <p><strong>Ejemplo:</strong> eBay.</p>
        <h4>Por qué funcionó</h4>
        <p>El mercado define el precio → maximiza ganancias.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Útil para productos únicos o escasos</li>
          <li>Arte, coleccionables</li>
        </ul>
      </article>

      <article>
        <h3>13. Crowdfunding</h3>
        <p>Financiamiento colectivo anticipado. Validación + capital.</p>
        <p><strong>Ejemplo:</strong> Kickstarter.</p>
        <h4>Por qué funcionó</h4>
        <p>Valida ideas antes de producir → reduce riesgo.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Lanza tu idea antes de fabricarla</li>
          <li>Preventas</li>
        </ul>
      </article>

      <article>
        <h3>14. Donaciones</h3>
        <p>Ingresos voluntarios. Basado en comunidad.</p>
        <p><strong>Ejemplo:</strong> Wikipedia.</p>
        <h4>Por qué funcionó</h4>
        <p>Confianza + valor social.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Funciona con comunidades fuertes</li>
          <li>Contenido educativo gratuito</li>
        </ul>
      </article>

      <article>
        <h3>15. Leasing / Renta</h3>
        <p>Alquiler en lugar de venta. Uso temporal.</p>
        <p><strong>Ejemplo:</strong> Hertz.</p>
        <h4>Por qué funcionó</h4>
        <p>La gente no quiere comprar → solo usar.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Ofrece acceso en vez de propiedad</li>
          <li>Renta de equipo</li>
        </ul>
      </article>

      <article>
        <h3>16. Venta Cruzada (Cross-selling)</h3>
        <p>Vendes productos complementarios. Aumenta ticket promedio.</p>
        <p><strong>Ejemplo:</strong> Apple (accesorios).</p>
        <h4>Por qué funcionó</h4>
        <p>Ecosistema → compras más cosas.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Ofrece complementos</li>
          <li>Producto + accesorios</li>
        </ul>
      </article>

      <article>
        <h3>17. Upselling</h3>
        <p>Ofreces versión superior más cara. Mejora margen.</p>
        <p><strong>Ejemplo:</strong> Microsoft (planes premium).</p>
        <h4>Por qué funcionó</h4>
        <p>Clientes ya dentro → fácil vender versión mejor.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Crea niveles: básico / pro / premium</li>
        </ul>
      </article>

      <article>
        <h3>18. Producto + Servicio</h3>
        <p>Vendes producto y mantenimiento adicional. Ingresos recurrentes secundarios.</p>
        <p><strong>Ejemplo:</strong> HP (impresoras + tinta).</p>
        <h4>Por qué funcionó</h4>
        <p>Vende barato el producto → gana en consumibles.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Producto inicial + ingresos recurrentes</li>
          <li>Equipo + mantenimiento</li>
        </ul>
      </article>

      <article>
        <h3>19. Marketplace</h3>
        <p>Plataforma que conecta oferta y demanda. Cobra comisión o tarifa.</p>
        <p><strong>Ejemplo:</strong> Mercado Libre.</p>
        <h4>Por qué funcionó</h4>
        <p>Escala sin inventario → ingresos por comisiones.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Junta compradores y vendedores</li>
          <li>App o web de conexión</li>
        </ul>
      </article>

      <article>
        <h3>20. Patrocinio</h3>
        <p>Una marca paga por asociarse contigo. Basado en visibilidad.</p>
        <p><strong>Ejemplo:</strong> FC Barcelona (patrocinadores).</p>
        <h4>Por qué funcionó</h4>
        <p>Gran visibilidad → marcas pagan por exposición.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Construye audiencia o marca fuerte</li>
          <li>Eventos, redes sociales</li>
        </ul>
      </article>

      <article>
        <h3>21. Pago por Resultado</h3>
        <p>Solo pagas si se logra el objetivo. Bajo riesgo para el cliente.</p>
        <p><strong>Ejemplo:</strong> Agencias de marketing digital.</p>
        <h4>Por qué funcionó</h4>
        <p>Reduce riesgo para el cliente → más confianza.</p>
        <h4>Cómo aplicarlo</h4>
        <ul>
          <li>Cobra solo si cumples el objetivo</li>
          <li>Marketing, ventas, leads</li>
        </ul>
      </article>
    </section>
  </article>
</StageDialog>
