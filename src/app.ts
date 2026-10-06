// Estado y cálculo compartidos por las dos páginas: la comparativa (index.html) y la ficha de un coche (coche.html).
// La comparativa se guarda en el navegador en cada cambio, así que ir de una página a otra no pierde nada.
import { nombreModalidad } from "./engine/modalidades";
import { simular, type Resultado } from "./engine/simulacion";
import type { CocheCandidato, Escenario, ModalidadId, PerfilUso } from "./engine/tipos";
import { cargar, contexto, guardarActual, type Comparativa } from "./estado";

export const app: { comp: Comparativa; resultados: Map<string, Resultado> } = {
  comp: await cargar(),
  resultados: new Map(),
};

// La comparativa de un enlace compartido se guarda en el navegador y se quita de la URL: así volver atrás
// desde una ficha no la recarga encima de los cambios hechos después
if (location.hash.startsWith("#c=")) {
  guardarActual(app.comp);
  history.replaceState(null, "", location.pathname + location.search);
}

export const ORDEN_MODALIDAD: ModalidadId[] = ["contado", "prestamo", "cuota_final", "renting", "suscripcion"];

export const cocheDe = (e: Escenario) => app.comp.coches.find((c) => c.id === e.cocheId);
export const nombreCoche = (c: CocheCandidato) => `${c.nombre}${c.estado === "usado" ? " (usado)" : ""}`;
/** Nombre de la modalidad de un escenario; si su coche tiene otro de la misma modalidad, con el plazo */
export const nombreOpcion = (e: Escenario) => {
  const c = e.condiciones;
  const plazo = (x: Escenario) => ("plazoMeses" in x.condiciones ? x.condiciones.plazoMeses : undefined);
  const hermanas = app.comp.escenarios.filter(
    (x) => x.id !== e.id && x.cocheId === e.cocheId && x.condiciones.modalidad === c.modalidad,
  );
  let nombre = nombreModalidad(c.modalidad);
  if (hermanas.length && "plazoMeses" in c) nombre += ` a ${c.plazoMeses} meses`;
  if (c.modalidad === "prestamo" && c.cancelarEnMes !== undefined && c.cancelarEnMes < c.plazoMeses)
    nombre += `, cancelado en el mes ${c.cancelarEnMes}`;
  if (e.proveedor && hermanas.some((x) => plazo(x) === plazo(e))) nombre += ` (${e.proveedor})`;
  return nombre;
};
export const nombreEscenario = (id: string) => {
  const e = app.comp.escenarios.find((x) => x.id === id);
  const c = e && cocheDe(e);
  return e && c ? `${nombreCoche(c)} · ${nombreOpcion(e)}` : id;
};

/** Escenarios activos de un coche, en el orden de las modalidades */
export const escenariosDe = (cocheId: string) =>
  app.comp.escenarios
    .filter((e) => e.cocheId === cocheId)
    .sort((a, b) => ORDEN_MODALIDAD.indexOf(a.condiciones.modalidad) - ORDEN_MODALIDAD.indexOf(b.condiciones.modalidad));

/** Simula los escenarios activos (o solo los que pasen el filtro) con un perfil de uso */
export function simularTodo(perfil: PerfilUso, filtro: (e: Escenario) => boolean = () => true): Resultado[] {
  const ctx = contexto({ ...app.comp, perfil });
  return app.comp.escenarios.flatMap((e) => {
    const coche = cocheDe(e);
    return e.visible && coche && filtro(e) ? [simular(e, coche, ctx)] : [];
  });
}

let pintores = { recalculado: () => {}, estructura: () => {} };

/** Cada página dice qué repintar tras recalcular y tras añadir o quitar coches u ofertas */
export function alCambiar(p: typeof pintores) {
  pintores = p;
}

export function recalcular() {
  app.resultados = new Map(simularTodo(app.comp.perfil).map((r) => [r.escenarioId, r]));
  pintores.recalculado();
}

let pendiente: number | undefined;
/** Guarda y recalcula; con `estructura` también repinta los editores (se han añadido o quitado coches u ofertas) */
export function cambio(estructura = false) {
  guardarActual(app.comp);
  if (estructura) pintores.estructura();
  clearTimeout(pendiente);
  pendiente = window.setTimeout(recalcular, 120);
}

export function reemplazar(c: Comparativa) {
  app.comp = c;
  guardarActual(c);
}

export function avisar(texto: string) {
  const a = document.getElementById("aviso");
  if (!a) return;
  a.textContent = texto;
  a.classList.add("visible");
  setTimeout(() => a.classList.remove("visible"), 2200);
}

/** Enlace a la ficha de un coche, o de vuelta a la comparativa */
export const urlCoche = (cocheId: string) => `coche.html?id=${encodeURIComponent(cocheId)}`;
export const urlComparativa = () => "./";
