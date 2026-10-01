// Las tres gráficas del análisis y el veredicto. Las dos páginas tienen los mismos ids en su HTML.
import { app, cocheDe, nombreCoche, nombreEscenario, ORDEN_MODALIDAD, simularTodo } from "../app";
import { FECHA_DATOS } from "../data";
import { nombreModalidad } from "../engine/modalidades";
import type { Escenario } from "../engine/tipos";
import { clasificar, veredicto } from "../engine/veredicto";
import type { Vista } from "../estado";
import { el, eur, eurCent, meses, num } from "./formato";
import { colorSerie, graficaCaja, graficaCosteNeto, graficaDesglose, type Serie, type VistaCoste } from "./graficas";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

/** Ocho colores como máximo */
export const MAX_SERIES = 8;

/** Los escenarios que se dibujan con una vista, cada uno con un color estable para lo que representa */
export function seriesDe(vista: Vista): Serie[] {
  const { comp, resultados } = app;
  const H = comp.perfil.horizonteMeses;
  const huecoCoche = (id: string) => comp.coches.findIndex((c) => c.id === id);
  const series: Serie[] = [];
  const serie = (e: Escenario, hueco: number, nombre: string) => {
    const r = resultados.get(e.id);
    if (r?.aplica) series.push({ id: e.id, nombre, hueco, resultado: r });
  };

  if (vista.tipo === "eleccion") {
    vista.escenarios.forEach((id, i) => {
      const e = comp.escenarios.find((x) => x.id === id);
      if (e) serie(e, i, nombreEscenario(id));
    });
  } else if (vista.tipo === "coche") {
    for (const e of comp.escenarios)
      if (e.cocheId === vista.cocheId)
        serie(e, ORDEN_MODALIDAD.indexOf(e.condiciones.modalidad), nombreModalidad(e.condiciones.modalidad));
  } else if (vista.tipo === "modalidad") {
    for (const e of comp.escenarios) {
      const c = cocheDe(e);
      if (c && e.condiciones.modalidad === vista.modalidad) serie(e, huecoCoche(c.id), nombreCoche(c));
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
  // con más de ocho se muestran los ocho más baratos
  return series.sort((a, b) => a.resultado.costeNeto[H]! - b.resultado.costeNeto[H]!).slice(0, MAX_SERIES);
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

export function pintarGraficas(series: Serie[]) {
  const H = app.comp.perfil.horizonteMeses;
  const boton = (texto: string, vista: VistaCoste) => {
    const b = el("button", { class: "boton", "aria-pressed": String(vistaCoste === vista) }, texto);
    b.addEventListener("click", () => {
      vistaCoste = vista;
      pintarGraficas(series);
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

/** El Veredicto entre los escenarios que pasen el filtro */
export function pintarVeredicto(filtro?: (e: Escenario) => boolean) {
  const { comp, resultados } = app;
  const caja = $("veredicto");
  const v = veredicto(comp.perfil, (p) => simularTodo(p, filtro), nombreEscenario);
  caja.replaceChildren();
  if (!v) {
    caja.append(el("p", {}, "Activa al menos una oferta para ver el resultado."));
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
      el("div", { class: "sub" }, `de coste neto · ${eur(total / H)} al mes · ${eurCent(total / kmTotales)} por km`),
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
