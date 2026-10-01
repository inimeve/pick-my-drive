import "./estilos.css";
import { FECHA_DATOS, MUNICIPIOS, TERRITORIOS, plantillaCoche, ofertasPorDefecto } from "./data";
import { MODALIDADES, nombreModalidad } from "./engine/modalidades";
import { simular, type Resultado } from "./engine/simulacion";
import type { CocheCandidato, Escenario, ModalidadId, Motorizacion, PerfilUso } from "./engine/tipos";
import { clasificar, veredicto } from "./engine/veredicto";
import {
  borrarGuardada,
  cargar,
  comparativaPorDefecto,
  contexto,
  enlaceCompartir,
  guardadas,
  guardarActual,
  guardarComo,
  type Comparativa,
  type Vista,
} from "./estado";
import { campoCheck, campoDeslizador, campoNumero, campoSelect, campoTexto } from "./ui/campos";
import { el, eur, eurCent, meses, num, pct } from "./ui/formato";
import { colorSerie, graficaCaja, graficaCosteNeto, graficaDesglose, type Serie, type VistaCoste } from "./ui/graficas";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

let comp: Comparativa = await cargar();
let resultados = new Map<string, Resultado>();

const MOTORIZACIONES: { valor: Motorizacion; texto: string }[] = [
  { valor: "gasolina", texto: "Gasolina" },
  { valor: "diesel", texto: "Diésel" },
  { valor: "hibrido", texto: "Híbrido" },
  { valor: "hibrido_enchufable", texto: "Híbrido enchufable" },
  { valor: "electrico", texto: "Eléctrico" },
];

const ORDEN_MODALIDAD: ModalidadId[] = ["contado", "prestamo", "cuota_final", "renting", "suscripcion"];

const cocheDe = (e: Escenario) => comp.coches.find((c) => c.id === e.cocheId);
const nombreCoche = (c: CocheCandidato) => `${c.nombre}${c.estado === "usado" ? " (usado)" : ""}`;
const nombreEscenario = (id: string) => {
  const e = comp.escenarios.find((x) => x.id === id);
  const c = e && cocheDe(e);
  return e && c ? `${nombreCoche(c)} · ${nombreModalidad(e.condiciones.modalidad)}` : id;
};

// --- Cálculo ---

function simularTodo(perfil: PerfilUso): Resultado[] {
  const ctx = contexto({ ...comp, perfil });
  return comp.escenarios.flatMap((e) => {
    const coche = cocheDe(e);
    return e.visible && coche ? [simular(e, coche, ctx)] : [];
  });
}

let pendiente: number | undefined;
function cambio(estructura = false) {
  guardarActual(comp);
  if (estructura) pintarCoches();
  clearTimeout(pendiente);
  pendiente = window.setTimeout(recalcular, 120);
}

function recalcular() {
  resultados = new Map(simularTodo(comp.perfil).map((r) => [r.escenarioId, r]));
  pintarVeredicto();
  pintarVista();
  pintarGraficas();
  pintarTabla();
  pintarCalculosOfertas();
}

// --- Veredicto ---

function pintarVeredicto() {
  const caja = $("veredicto");
  const v = veredicto(comp.perfil, simularTodo, nombreEscenario);
  caja.replaceChildren();
  if (!v) {
    caja.append(el("p", {}, "Activa al menos un escenario para ver el resultado."));
    return;
  }
  const r = resultados.get(v.ganadorId)!;
  const H = comp.perfil.horizonteMeses;
  const total = r.costeNeto[H]!;
  const kmTotales = (comp.perfil.kmAnuales * H) / 12;
  caja.append(
    el(
      "div",
      {},
      el("div", { class: "etiqueta" }, `Lo más barato para ti en ${meses(H)} y ${num(comp.perfil.kmAnuales)} km/año`),
      el("div", { class: "ganador" }, nombreEscenario(v.ganadorId)),
      el("div", { class: "cifra" }, eur(total)),
      el(
        "div",
        { class: "sub" },
        `de coste neto · ${eur(total / H)} al mes · ${eurCent(total / kmTotales)} por km`,
      ),
      v.segundoId
        ? el(
            "p",
            {},
            el("span", { class: "ahorro" }, `${eur(v.ahorro)} menos`),
            ` que la siguiente opción: ${nombreEscenario(v.segundoId)}.`,
          )
        : undefined,
    ),
    el(
      "div",
      {},
      el("div", { class: "etiqueta" }, "Cuándo dejaría de ganar"),
      v.condiciones.length
        ? el("ul", {}, ...v.condiciones.map((c) => el("li", {}, c.texto)))
        : el("p", {}, "Es la mejor opción aunque cambies antes, hagas más o menos km o el coche valga un 15% más o menos al venderlo."),
      el("p", { class: "fuente" }, `Datos por defecto estimados a ${FECHA_DATOS}. Sustitúyelos por tus ofertas reales.`),
    ),
  );
}

// --- Perfil de uso ---

function pintarPerfil() {
  const p = comp.perfil;
  const set = <K extends keyof PerfilUso>(k: K) => (v: PerfilUso[K]) => {
    comp.perfil[k] = v;
    cambio();
  };
  const municipios = MUNICIPIOS.filter((m) => m.territorioId === p.territorioId);

  $("perfil").replaceChildren(
    campoDeslizador("Km al año", p.kmAnuales, set("kmAnuales"), {
      min: 5000, max: 50000, paso: 1000, muestra: (v) => `${num(v)} km`,
    }),
    campoDeslizador("Cada cuánto cambias de coche (horizonte)", p.horizonteMeses, set("horizonteMeses"), {
      min: 12, max: 120, paso: 12, muestra: meses,
    }),
    campoSelect(
      "Territorio",
      p.territorioId,
      TERRITORIOS.map((t) => ({ valor: t.id, texto: t.nombre })),
      (v) => {
        comp.perfil.territorioId = v;
        comp.perfil.municipioId = MUNICIPIOS.find((m) => m.territorioId === v)?.id ?? "otro";
        pintarPerfil();
        cambio();
      },
    ),
    campoSelect(
      "Municipio (impuesto de circulación)",
      municipios.some((m) => m.id === p.municipioId) ? p.municipioId : "otro",
      [
        ...municipios.map((m) => ({ valor: m.id, texto: m.nombre })),
        { valor: "otro", texto: "Otro (cuota mínima legal)" },
      ],
      set("municipioId"),
    ),
    el(
      "div",
      { class: "campo" },
      campoCheck("Contar el coste de oportunidad", p.oportunidadActiva, set("oportunidadActiva")),
      campoNumero("Rentabilidad alternativa del dinero", p.tipoOportunidad, set("tipoOportunidad"), {
        porcentaje: true, sufijo: "% anual", ayuda: "Lo que te daría el dinero en un depósito o letras del Tesoro",
      }),
    ),
  );

  const e = (k: keyof PerfilUso["energia"]) => (v: number) => {
    comp.perfil.energia[k] = v;
    cambio();
  };
  $("perfil-avanzado").replaceChildren(
    campoNumero("Gasolina", p.energia.gasolina, e("gasolina"), { paso: 0.01, sufijo: "€/l" }),
    campoNumero("Diésel", p.energia.diesel, e("diesel"), { paso: 0.01, sufijo: "€/l" }),
    campoNumero("Electricidad en casa", p.energia.kwhCasa, e("kwhCasa"), { paso: 0.01, sufijo: "€/kWh" }),
    campoNumero("Carga pública", p.energia.kwhPublica, e("kwhPublica"), { paso: 0.01, sufijo: "€/kWh" }),
    campoDeslizador("Carga que haces en casa", p.energia.fraccionCargaCasa, e("fraccionCargaCasa"), {
      min: 0, max: 1, paso: 0.05, muestra: (v) => pct(v, 0),
    }),
    campoNumero("Inflación de costes de uso", p.inflacion, set("inflacion"), { porcentaje: true, sufijo: "% anual" }),
    campoNumero("Todo riesgo hasta que el coche tenga", p.aniosTodoRiesgo, set("aniosTodoRiesgo"), { sufijo: "años" }),
    campoNumero("Tarifa ITV", p.tarifaItv, set("tarifaItv"), { paso: 1, sufijo: "€" }),
    campoDeslizador("Ajuste del valor residual", p.ajusteValorResidual, set("ajusteValorResidual"), {
      min: 0.7, max: 1.3, paso: 0.05, muestra: (v) => pct(v, 0),
    }),
  );
}

// --- Vista: qué escenarios se ven en las gráficas ---

function seriesVisibles(): Serie[] {
  const v = comp.vista;
  const H = comp.perfil.horizonteMeses;
  const huecoCoche = (id: string) => comp.coches.findIndex((c) => c.id === id);
  const series: Serie[] = [];
  const serie = (e: Escenario, hueco: number, nombre: string) => {
    const r = resultados.get(e.id);
    if (r?.aplica) series.push({ id: e.id, nombre, hueco, resultado: r });
  };

  if (v.tipo === "coche") {
    const coche = comp.coches.find((c) => c.id === v.cocheId);
    for (const e of comp.escenarios)
      if (e.cocheId === v.cocheId && coche)
        serie(e, ORDEN_MODALIDAD.indexOf(e.condiciones.modalidad), nombreModalidad(e.condiciones.modalidad));
  } else if (v.tipo === "modalidad") {
    for (const e of comp.escenarios) {
      const c = cocheDe(e);
      if (c && e.condiciones.modalidad === v.modalidad) serie(e, huecoCoche(c.id), nombreCoche(c));
    }
  } else {
    // el mejor escenario de cada coche
    for (const c of comp.coches) {
      const mejor = clasificar(
        comp.escenarios.filter((e) => e.cocheId === c.id).flatMap((e) => resultados.get(e.id) ?? []),
      )[0];
      const e = mejor && comp.escenarios.find((x) => x.id === mejor.escenarioId);
      if (e) serie(e, huecoCoche(c.id), `${nombreCoche(c)} · ${nombreModalidad(e.condiciones.modalidad)}`);
    }
  }
  // ocho colores como máximo: se muestran los ocho más baratos
  return series.sort((a, b) => a.resultado.costeNeto[H]! - b.resultado.costeNeto[H]!).slice(0, 8);
}

function pintarVista() {
  const v = comp.vista;
  const fija = (vista: Vista) => () => {
    comp.vista = vista;
    cambio();
  };
  const boton = (texto: string, activo: boolean, accion: () => void) => {
    const b = el("button", { class: "boton", "aria-pressed": String(activo) }, texto);
    b.addEventListener("click", accion);
    return b;
  };
  const selCoche = el("select", { "aria-label": "Coche" });
  for (const c of comp.coches) selCoche.append(el("option", { value: c.id }, nombreCoche(c)));
  selCoche.value = v.tipo === "coche" ? v.cocheId : (comp.coches[0]?.id ?? "");
  selCoche.addEventListener("change", () => fija({ tipo: "coche", cocheId: selCoche.value })());

  const selModalidad = el("select", { "aria-label": "Modalidad" });
  for (const m of MODALIDADES) {
    const o = el("option", { value: m.id }, m.aplica ? m.nombre : `${m.nombre} (no aplica)`);
    o.disabled = !m.aplica;
    selModalidad.append(o);
  }
  selModalidad.value = v.tipo === "modalidad" ? v.modalidad : "renting";
  selModalidad.addEventListener("change", () =>
    fija({ tipo: "modalidad", modalidad: selModalidad.value as ModalidadId })(),
  );

  $("vista").replaceChildren(
    ...[
      boton("Lo mejor de cada coche", v.tipo === "mejores", fija({ tipo: "mejores" })),
      boton("Un coche, todas las modalidades", v.tipo === "coche", fija({ tipo: "coche", cocheId: selCoche.value })),
      v.tipo === "coche" ? selCoche : undefined,
      boton("Una modalidad, todos los coches", v.tipo === "modalidad", fija({ tipo: "modalidad", modalidad: selModalidad.value as ModalidadId })),
      v.tipo === "modalidad" ? selModalidad : undefined,
    ].filter((x) => x !== undefined),
  );
}

/** Vista de la gráfica de Coste neto: no se guarda con la comparativa */
let vistaCoste: VistaCoste = "continuar";

const TEXTOS_COSTE: Record<VistaCoste, [string, string]> = {
  continuar: [
    "Coste neto acumulado",
    "Lo que te cuesta llegar a ese mes sin cancelar el contrato: lo pagado más lo que vale o debes del coche. Donde se cruzan dos curvas, cambia cuál conviene.",
  ],
  salir: [
    "Coste neto acumulado",
    "Lo que te habría costado si cancelaras el contrato ese mes: lo pagado más el coste de salir (deuda, penalización por cancelar y exceso de km, menos lo que vale el coche).",
  ],
  desembolso: [
    "Desembolso acumulado",
    "Lo que has puesto de tu bolsillo hasta ese mes (entrada, cuotas, impuestos y gastos de uso), sin descontar lo que vale el coche.",
  ],
};

function pintarModoSalida() {
  const boton = (texto: string, vista: VistaCoste) => {
    const b = el("button", { class: "boton", "aria-pressed": String(vistaCoste === vista) }, texto);
    b.addEventListener("click", () => {
      vistaCoste = vista;
      pintarGraficas();
    });
    return b;
  };
  const [titulo, texto] = TEXTOS_COSTE[vistaCoste];
  $("titulo-coste").textContent = titulo;
  $("texto-coste").textContent = texto;
  $("modo-salida").replaceChildren(
    boton("Sigo hasta el final", "continuar"),
    boton("Salgo antes de tiempo", "salir"),
    boton("Lo que pago", "desembolso"),
  );
}

function pintarGraficas() {
  const series = seriesVisibles();
  const H = comp.perfil.horizonteMeses;
  pintarModoSalida();
  graficaCosteNeto($("g-coste"), series, H, vistaCoste);
  graficaCaja($("g-caja"), series, H, vistaCoste === "desembolso");
  $("texto-caja").textContent =
    vistaCoste === "desembolso"
      ? "Lo que sale de tu bolsillo cada mes, incluido el pago inicial del mes 0."
      : "Lo que sale de tu bolsillo cada mes (sin contar el pago inicial, que va aparte).";
  graficaDesglose($("g-desglose"), series);
  $("pagos-iniciales").replaceChildren(
    el("span", {}, "Pago el primer día (las ayudas llegan después):"),
    ...series.map((s) =>
      el(
        "span",
        { class: "chip" },
        el("span", { class: "punto", style: `background:${colorSerie(s.hueco)}` }),
        `${s.nombre} `,
        el("strong", {}, eur(s.resultado.pagoInicial)),
      ),
    ),
  );
}

// --- Clasificación ---

function pintarTabla() {
  const H = comp.perfil.horizonteMeses;
  const kmTotales = (comp.perfil.kmAnuales * H) / 12;
  const ranking = clasificar([...resultados.values()]);
  const th = (t: string, num = false) => el("th", num ? { class: "num" } : {}, t);
  const td = (t: string, num = false) => el("td", num ? { class: "num" } : {}, t);
  const filas = ranking.map((r, k) => {
    const e = comp.escenarios.find((x) => x.id === r.escenarioId)!;
    const c = cocheDe(e)!;
    const total = r.costeNeto[H]!;
    const cuotaMedia = r.caja.slice(1).reduce((s, v) => s + v, 0) / H;
    return el(
      "tr",
      k === 0 ? { class: "primero" } : {},
      td(String(k + 1), true),
      td(nombreCoche(c)),
      td(nombreModalidad(e.condiciones.modalidad)),
      td(eur(total), true),
      td(eur(total / H), true),
      td(eurCent(total / kmTotales), true),
      td(eur(r.pagoInicial), true),
      td(eur(cuotaMedia), true),
      td(r.financiacion ? pct(r.financiacion.tae) : "—", true),
      el("td", { class: "nota" }, r.avisos.join(" ")),
    );
  });
  $("clasificacion").replaceChildren(
    el(
      "thead",
      {},
      el(
        "tr",
        {},
        th("#", true), th("Coche"), th("Modalidad"), th("Coste neto", true), th("Al mes", true),
        th("Por km", true), th("Pago inicial", true), th("Pago medio/mes", true), th("TAE", true), th("Notas"),
      ),
    ),
    el("tbody", {}, ...filas),
  );
}

// --- Coches y ofertas ---

function pintarCoches() {
  $("coches").replaceChildren(...comp.coches.map(editorCoche));
}

function editorCoche(c: CocheCandidato): HTMLElement {
  const set = <K extends keyof CocheCandidato>(k: K) => (v: CocheCandidato[K]) => {
    c[k] = v;
    cambio();
  };
  const consumo = (k: keyof CocheCandidato["consumo"]) => (v: number) => {
    c.consumo[k] = v;
    cambio();
  };
  const electrico = c.motorizacion === "electrico" || c.motorizacion === "hibrido_enchufable";
  const termico = c.motorizacion !== "electrico";

  const ofertas = comp.escenarios.filter((e) => e.cocheId === c.id);
  const faltan = ORDEN_MODALIDAD.filter((m) => !ofertas.some((e) => e.condiciones.modalidad === m));

  const acciones = el("div", { class: "botonera" });
  for (const m of faltan) {
    const b = el("button", { class: "boton" }, `+ ${nombreModalidad(m)}`);
    b.addEventListener("click", () => {
      const nueva = ofertasPorDefecto(c).find((e) => e.condiciones.modalidad === m);
      if (nueva) comp.escenarios.push(nueva);
      cambio(true);
    });
    acciones.append(b);
  }
  const duplicar = el("button", { class: "boton" }, "Duplicar coche");
  duplicar.addEventListener("click", () => {
    const copia: CocheCandidato = { ...structuredClone(c), id: crypto.randomUUID(), nombre: `${c.nombre} (copia)` };
    comp.coches.push(copia);
    for (const e of comp.escenarios.filter((x) => x.cocheId === c.id))
      comp.escenarios.push({ ...structuredClone(e), id: crypto.randomUUID(), cocheId: copia.id });
    cambio(true);
  });
  const borrar = el("button", { class: "boton boton-peligro" }, "Eliminar coche");
  borrar.addEventListener("click", () => {
    comp.coches = comp.coches.filter((x) => x.id !== c.id);
    comp.escenarios = comp.escenarios.filter((e) => e.cocheId !== c.id);
    if (comp.vista.tipo === "coche" && comp.vista.cocheId === c.id) comp.vista = { tipo: "mejores" };
    cambio(true);
  });

  const hueco = comp.coches.indexOf(c);
  return el(
    "details",
    { class: "coche" },
    el(
      "summary",
      {},
      el("span", { class: "punto", style: `background:${colorSerie(hueco)}` }),
      el("strong", {}, nombreCoche(c)),
      el("span", { class: "resumen" }, `${c.version} · ${MOTORIZACIONES.find((m) => m.valor === c.motorizacion)?.texto} · ${eur(c.pvp)}`),
    ),
    el(
      "div",
      { class: "cuerpo" },
      grupo(
        "El coche",
        campoTexto("Nombre", c.nombre, set("nombre")),
        campoTexto("Versión", c.version, set("version")),
        campoSelect("Estado", c.estado, [{ valor: "nuevo", texto: "Nuevo" }, { valor: "usado", texto: "Usado" }], (v) => {
          c.estado = v;
          cambio(true);
        }),
        campoSelect("Motorización", c.motorizacion, MOTORIZACIONES, (v) => {
          c.motorizacion = v;
          cambio(true);
        }),
        campoNumero("Precio final (PVP)", c.pvp, set("pvp"), { paso: 100, sufijo: "€", ayuda: "Con IVA, transporte e impuesto de matriculación" }),
        campoNumero("Emisiones CO₂ WLTP", c.co2, set("co2"), { sufijo: "g/km" }),
        campoNumero("CV fiscales", c.cvFiscales, set("cvFiscales"), { paso: 0.01 }),
        c.estado === "usado" ? campoNumero("Edad al comprarlo", c.edadInicialMeses / 12, (v) => set("edadInicialMeses")(Math.round(v * 12)), { paso: 0.5, sufijo: "años" }) : undefined,
        c.estado === "usado" ? campoNumero("Km al comprarlo", c.kmIniciales, set("kmIniciales"), { paso: 1000, sufijo: "km" }) : undefined,
        c.estado === "usado" ? campoCheck("Lo vende un particular (paga ITP)", c.vendedorParticular, set("vendedorParticular")) : undefined,
        campoNumero("Ayudas a la compra", c.ayudas, set("ayudas"), { paso: 100, sufijo: "€", ayuda: "MOVES, deducciones de IRPF… Solo cuentan si el coche es tuyo" }),
      ),
      grupo(
        "Consumo real",
        termico ? campoNumero(c.motorizacion === "hibrido_enchufable" ? "Gasolina con batería vacía" : "Combustible", c.consumo.litros100 ?? 0, consumo("litros100"), { paso: 0.1, sufijo: "l/100 km" }) : undefined,
        electrico ? campoNumero("Electricidad", c.consumo.kwh100 ?? 0, consumo("kwh100"), { paso: 0.1, sufijo: "kWh/100 km" }) : undefined,
        c.motorizacion === "hibrido_enchufable"
          ? campoNumero("Km en modo eléctrico", c.consumo.fraccionElectrica ?? 0, consumo("fraccionElectrica"), { porcentaje: true, paso: 5, sufijo: "%" })
          : undefined,
      ),
      grupo(
        "Valor y garantía",
        campoNumero("Pierde el primer año", c.depreciacionPrimerAnio, set("depreciacionPrimerAnio"), { porcentaje: true, sufijo: "%" }),
        campoNumero("Pierde cada año siguiente", c.depreciacionAnual, set("depreciacionAnual"), { porcentaje: true, sufijo: "%" }),
        campoNumero("Garantía (edad del coche)", c.garantiaMeses / 12, (v) => set("garantiaMeses")(Math.round(v * 12)), { paso: 1, sufijo: "años" }),
        campoNumero("Garantía (km)", c.garantiaKm, set("garantiaKm"), { paso: 10000, sufijo: "km" }),
      ),
      grupo(
        "Costes de uso (hoy, por año)",
        campoNumero("Seguro a todo riesgo", c.seguroTodoRiesgoAnual, set("seguroTodoRiesgoAnual"), { paso: 10, sufijo: "€/año" }),
        campoNumero("Seguro a terceros ampliado", c.seguroTercerosAnual, set("seguroTercerosAnual"), { paso: 10, sufijo: "€/año" }),
        campoNumero("Mantenimiento", c.mantenimientoAnual, set("mantenimientoAnual"), { paso: 10, sufijo: "€/año" }),
        campoNumero("Averías sin garantía", c.averiasAnual, set("averiasAnual"), { paso: 10, sufijo: "€/año" }),
        campoNumero("Juego de neumáticos", c.neumaticosJuego, set("neumaticosJuego"), { paso: 10, sufijo: "€" }),
        campoNumero("Duración neumáticos", c.neumaticosVidaKm, set("neumaticosVidaKm"), { paso: 1000, sufijo: "km" }),
      ),
      c.fuente ? el("p", { class: "fuente" }, `Fuente: ${c.fuente}`) : undefined,
      el("div", { class: "grupo" }, el("h3", {}, "Ofertas"), el("div", { class: "ofertas" }, ...ofertas.map(editorOferta))),
      acciones,
      el("div", { class: "botonera" }, duplicar, borrar),
    ),
  );
}

function grupo(titulo: string, ...campos: (HTMLElement | undefined)[]) {
  return el("div", { class: "grupo" }, el("h3", {}, titulo), el("div", { class: "rejilla-campos" }, ...campos));
}

function editorOferta(e: Escenario): HTMLElement {
  const c = e.condiciones;
  const set = (k: string) => (v: unknown) => {
    (c as unknown as Record<string, unknown>)[k] = v;
    cambio();
  };
  const campos: (HTMLElement | undefined)[] = [];
  const n = (etiqueta: string, k: string, o: Parameters<typeof campoNumero>[3] = {}) =>
    campos.push(campoNumero(etiqueta, (c as unknown as Record<string, number>)[k] ?? 0, set(k), o));

  switch (c.modalidad) {
    case "contado":
      n("Descuento", "descuento", { paso: 100, sufijo: "€" });
      break;
    case "prestamo":
    case "cuota_final":
      n("Descuento", "descuento", { paso: 100, sufijo: "€", ayuda: "Muchas marcas descuentan más si financias con ellas" });
      n("Entrada", "entrada", { paso: 500, sufijo: "€" });
      n("TIN", "tin", { porcentaje: true, sufijo: "%" });
      n("Plazo", "plazoMeses", { sufijo: "meses" });
      if (c.modalidad === "cuota_final") n("Cuota final", "cuotaFinal", { paso: 100, sufijo: "€" });
      n("Comisión de apertura", "comisionApertura", { porcentaje: true, sufijo: "%" });
      n("Comisión de cancelación", "comisionCancelacion", { porcentaje: true, sufijo: "%" });
      campos.push(
        campoNumero("Cuota ofertada (opcional)", c.cuotaOfertada ?? 0, (v) => set("cuotaOfertada")(v > 0 ? v : undefined), {
          paso: 1, sufijo: "€/mes", ayuda: "Si la oferta te da la cuota, ponla aquí y se deduce el TIN real",
        }),
      );
      if (c.modalidad === "cuota_final") {
        n("Km/año del contrato", "kmAnualesContrato", { paso: 1000, sufijo: "km" });
        n("Exceso de km", "excesoKm", { paso: 0.01, sufijo: "€/km" });
        n("Daños al devolver", "daniosDevolucion", { paso: 50, sufijo: "€" });
        campos.push(
          campoSelect("Al final", c.salida, [
            { valor: "devolver", texto: "Devolver o cambiar" },
            { valor: "quedarse", texto: "Quedármelo" },
          ], set("salida")),
        );
      }
      break;
    case "renting":
    case "suscripcion":
      n("Cuota", "cuota", { paso: 1, sufijo: "€/mes" });
      n(c.modalidad === "renting" ? "Entrada" : "Alta", "entrada", { paso: 100, sufijo: "€" });
      n(c.modalidad === "renting" ? "Plazo" : "Permanencia mínima", "plazoMeses", { sufijo: "meses" });
      n("Km/año incluidos", "kmAnualesContrato", { paso: 1000, sufijo: "km" });
      n("Exceso de km", "excesoKm", { paso: 0.01, sufijo: "€/km" });
      n("Penalización si cancelas", "penalizacionCancelacion", { porcentaje: true, sufijo: "% cuotas restantes", paso: 5 });
      n("Daños al devolver", "daniosDevolucion", { paso: 50, sufijo: "€" });
      for (const [k, t] of [
        ["seguro", "Incluye seguro"], ["mantenimiento", "Incluye mantenimiento"], ["averias", "Incluye averías"],
        ["neumaticos", "Incluye neumáticos"], ["impuestos", "Incluye impuestos"], ["itv", "Incluye ITV"],
      ] as const)
        campos.push(campoCheck(t, c.incluye[k], (v) => { c.incluye[k] = v; cambio(); }));
      break;
  }

  const quitar = el("button", { class: "boton boton-sutil" }, "Quitar");
  quitar.addEventListener("click", () => {
    comp.escenarios = comp.escenarios.filter((x) => x.id !== e.id);
    cambio(true);
  });

  return el(
    "div",
    { class: "oferta" },
    el(
      "div",
      { class: "oferta-cabecera" },
      el("strong", {}, nombreModalidad(c.modalidad)),
      el("span", { class: "oferta-calculo", "data-calculo": e.id }),
      el("span", { class: "botonera" }, campoCheck("En la comparativa", e.visible, (v) => { e.visible = v; cambio(); }), quitar),
    ),
    el("div", { class: "rejilla-campos" }, ...campos),
    e.fuente ? el("p", { class: "fuente" }, `Fuente: ${e.fuente}`) : undefined,
  );
}

/** Actualiza la cuota y la TAE calculadas sin reconstruir los formularios (para no perder el foco) */
function pintarCalculosOfertas() {
  const H = comp.perfil.horizonteMeses;
  document.querySelectorAll<HTMLElement>("[data-calculo]").forEach((span) => {
    const r = resultados.get(span.dataset.calculo!);
    if (!r) {
      span.textContent = "Fuera de la comparativa";
      return;
    }
    const partes: (string | Node)[] = [];
    if (r.financiacion) {
      const f = r.financiacion;
      partes.push("Cuota ", el("strong", {}, eurCent(f.cuota)), ` · TIN ${pct(f.tin)} · TAE `, el("strong", {}, pct(f.tae)), " · ");
    }
    partes.push("Coste neto ", el("strong", {}, eur(r.costeNeto[H]!)));
    span.replaceChildren(...partes);
  });
}

// --- Modalidades ---

function pintarModalidades() {
  $("modalidades").replaceChildren(
    ...MODALIDADES.map((m) =>
      el(
        "div",
        { class: m.aplica ? "modalidad" : "modalidad no-aplica" },
        el("h3", {}, m.nombre, m.aplica ? undefined : el("span", { class: "etiqueta-no-aplica" }, "No aplica a particulares")),
        el("p", {}, m.resumen),
        el("p", { class: "propiedad" }, `El coche: ${m.propiedad.toLowerCase()}.`),
        m.porQueNoAplica ? el("p", {}, m.porQueNoAplica) : undefined,
      ),
    ),
  );
}

// --- Cabecera ---

function avisar(texto: string) {
  const a = $("aviso");
  a.textContent = texto;
  a.classList.add("visible");
  setTimeout(() => a.classList.remove("visible"), 2200);
}

function pintarGuardadas() {
  const sel = $<HTMLSelectElement>("sel-guardadas");
  const nombres = Object.keys(guardadas());
  sel.replaceChildren(
    el("option", { value: "" }, nombres.length ? "Mis comparativas…" : "Sin comparativas guardadas"),
    ...nombres.map((n) => el("option", { value: n }, n)),
  );
  if (nombres.length) sel.append(el("option", { value: "__borrar" }, "Borrar la última abierta"));
}

let ultimaAbierta: string | undefined;

$("btn-compartir").addEventListener("click", async () => {
  const url = await enlaceCompartir(comp);
  history.replaceState(null, "", url);
  try {
    await navigator.clipboard.writeText(url);
    avisar("Enlace copiado: quien lo abra verá esta misma comparativa");
  } catch {
    avisar("Enlace en la barra de direcciones, listo para copiar");
  }
});

$("btn-guardar").addEventListener("click", () => {
  const nombre = prompt("Nombre para esta comparativa", ultimaAbierta ?? "Mi comparativa");
  if (!nombre) return;
  guardarComo(nombre, comp);
  ultimaAbierta = nombre;
  pintarGuardadas();
  avisar(`Guardada como «${nombre}» en este navegador`);
});

$<HTMLSelectElement>("sel-guardadas").addEventListener("change", (ev) => {
  const sel = ev.target as HTMLSelectElement;
  if (sel.value === "__borrar") {
    if (ultimaAbierta) {
      borrarGuardada(ultimaAbierta);
      avisar(`«${ultimaAbierta}» borrada`);
      ultimaAbierta = undefined;
    }
  } else if (sel.value) {
    const c = guardadas()[sel.value];
    if (c) {
      comp = structuredClone(c);
      ultimaAbierta = sel.value;
      todo();
    }
  }
  pintarGuardadas();
});

$("btn-restablecer").addEventListener("click", () => {
  if (!confirm("¿Volver a los coches y valores por defecto? Perderás los cambios no guardados.")) return;
  comp = comparativaPorDefecto();
  history.replaceState(null, "", location.pathname);
  todo();
});

$("btn-anadir-coche").addEventListener("click", () => {
  const nuevo = plantillaCoche();
  comp.coches.push(nuevo);
  comp.escenarios.push(...ofertasPorDefecto(nuevo));
  cambio(true);
  const ultimo = $("coches").lastElementChild as HTMLDetailsElement | null;
  if (ultimo) {
    ultimo.open = true;
    ultimo.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  pintarGraficas();
  pintarCoches();
});

function todo() {
  guardarActual(comp);
  pintarPerfil();
  pintarCoches();
  pintarModalidades();
  pintarGuardadas();
  recalcular();
}

todo();

