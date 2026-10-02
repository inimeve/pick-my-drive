// Signo de interrogación junto a un concepto: al pasar el ratón, enfocarlo o pulsarlo, la explicación
// aparece en un panel fijo en la esquina inferior izquierda (no se corta dentro de las tablas con scroll).
import { el } from "./formato";

/** Qué es cada concepto de las tablas. Las claves son las de las columnas (`g-…` para el desglose) */
export const DEFINICIONES: Record<string, string> = {
  pvp: "El precio del coche, antes de los descuentos de cada oferta.",
  tuyo: "Si al acabar el Horizonte el coche es tuyo y lo puedes vender (contado, préstamo, o cuota final quedándotelo). En renting y suscripción lo devuelves.",
  cuota: "Lo que pagas cada mes al banco o a la empresa del contrato. En el préstamo y la cuota final es solo el dinero prestado más sus intereses; en renting y suscripción incluye además lo que cubra el contrato.",
  tae: "El coste anual real de la financiación: suma el interés y las comisiones, y sirve para comparar préstamos entre sí. Cuanto más alta, más cara.",
  hoy: "Lo que sale de tu bolsillo el día de la compra o la firma: el coche entero al contado, o la entrada y las comisiones. Ya restadas las ayudas.",
  mes: "Todo lo que pagas después del primer día, repartido entre los meses del Horizonte: cuotas, energía, seguro, mantenimiento, impuestos y pagos puntuales como la cuota final.",
  pagado: "Todo lo que pones de tu bolsillo hasta el final del Horizonte. Resta lo que cobras si vendes el coche a mitad de camino (por ejemplo, al renovar una financiación con cuota final).",
  final: "Lo que te queda al salir del contrato al final del Horizonte: el valor al que vendes el coche menos la deuda que aún debes. Si pone «pagas», es que debes más de lo que vale, o hay exceso de km o daños. En renting y suscripción no recuperas nada.",
  oportunidad: "Lo que habría rendido ese dinero si, en vez de gastarlo en el coche, lo hubieras invertido al tipo que fijas en el Perfil de uso. Cuanto antes lo pagas, más cuenta.",
  real: "Lo que de verdad te cuesta tener el coche durante el Horizonte: lo que pagas, menos lo que recuperas al final, más lo que dejas de ganar.",
  realMes: "El coste real repartido entre los meses del Horizonte.",
  km: "El coste real dividido entre los kilómetros que haces durante el Horizonte.",
  avisos: "Supuestos que hace el cálculo en esta oferta (por ejemplo, que el contrato se renueva con un coche igual).",
  "g-depreciacion": "Lo que pierde de valor el coche mientras lo tienes: lo que pagas por él menos lo que te dan al venderlo, con las ayudas ya restadas. Es el gran coste de tener un coche en propiedad.",
  "g-contrato": "Las cuotas del renting o de la suscripción, más lo que pagas al devolver el coche por exceso de km o daños.",
  "g-financiacion": "Los intereses del préstamo y sus comisiones de apertura o cancelación.",
  "g-impuestos": "Impuestos y tasas del coche: matriculación o transferencia en la compra, circulación (IVTM) y la ITV. En renting y suscripción van dentro de la cuota.",
  "g-energia": "Gasolina, diésel o electricidad para los km que haces al año.",
  "g-seguro": "El seguro del coche: a todo riesgo los primeros años y a terceros después. En renting y suscripción va dentro de la cuota.",
  "g-mantenimiento": "Revisiones, averías y neumáticos. En renting y suscripción puede ir dentro de la cuota, según lo que cubra el contrato.",
  "g-oportunidad": "Lo que habría rendido ese dinero si, en vez de gastarlo en el coche, lo hubieras invertido al tipo que fijas en el Perfil de uso. Cuanto antes lo pagas, más cuenta.",
};

let panel: HTMLElement | undefined;

function elPanel(): HTMLElement {
  if (!panel) {
    panel = el("div", { id: "panel-ayuda", class: "panel-ayuda", role: "status", hidden: "" });
    document.body.append(panel);
    document.addEventListener("keydown", (ev) => ev.key === "Escape" && ocultar());
    // en pantallas táctiles no hay "salir": se cierra al tocar fuera del signo
    document.addEventListener("click", ocultar);
  }
  return panel;
}

function mostrar(texto: string) {
  const p = elPanel();
  p.textContent = texto;
  p.hidden = false;
}

function ocultar() {
  if (panel) panel.hidden = true;
}

/** Un «?» con la explicación del concepto; undefined si no hay definición para esa clave */
export function signoAyuda(clave: string, nombre: string): HTMLElement | undefined {
  const texto = DEFINICIONES[clave];
  if (!texto) return undefined;
  const b = el("button", { type: "button", class: "signo-ayuda", "aria-label": `Qué es: ${nombre}` }, "?");
  b.addEventListener("mouseenter", () => mostrar(texto));
  b.addEventListener("focus", () => mostrar(texto));
  b.addEventListener("mouseleave", ocultar);
  b.addEventListener("blur", ocultar);
  b.addEventListener("click", (ev) => {
    // que no ordene la columna ni elija la fila; en pantallas táctiles es lo que abre la explicación
    ev.stopPropagation();
    mostrar(texto);
  });
  return b;
}
