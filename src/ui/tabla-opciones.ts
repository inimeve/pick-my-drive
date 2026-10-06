// Tabla de opciones de la comparativa: una fila por Escenario activo, con columnas a elegir, filtros y orden.
// Pulsar el coche abre su ficha; pulsar el resto de la fila lo elige para compararlo en las gráficas.
import { app, cambio, nombreCoche, nombreOpcion, ORDEN_MODALIDAD, urlCoche } from "../app";
import { GRUPOS_DESGLOSE, MODALIDADES } from "../engine/modalidades";
import { importeGrupo, resumir, type Resumen } from "../engine/resumen";
import type { Resultado } from "../engine/simulacion";
import type { CocheCandidato, Escenario } from "../engine/tipos";
import { MAX_SERIES } from "./analisis";
import { signoAyuda } from "./ayuda";
import { MOTORIZACIONES } from "./editor";
import { el, etiquetaOferta, eur, eurCent, pct } from "./formato";
import { colorSerie } from "./graficas";

export interface Opcion {
  escenario: Escenario;
  coche: CocheCandidato;
  r: Resultado;
  resumen: Resumen;
}

/** Escenarios activos en el orden en que se definieron (coche y modalidad), nunca por precio: no adelantar la conclusión */
export function opciones(): Opcion[] {
  const { comp, resultados } = app;
  const H = comp.perfil.horizonteMeses;
  return comp.coches.flatMap((coche) =>
    comp.escenarios
      .filter((e) => e.cocheId === coche.id)
      .sort((a, b) => ORDEN_MODALIDAD.indexOf(a.condiciones.modalidad) - ORDEN_MODALIDAD.indexOf(b.condiciones.modalidad))
      .flatMap((escenario) => {
        const r = resultados.get(escenario.id);
        return r?.aplica ? [{ escenario, coche, r, resumen: resumir(r, escenario.condiciones, H) }] : [];
      }),
  );
}

/** Escenarios elegidos para comparar (vacío si la vista no es una elección) */
export const elegidas = () => (app.comp.vista.tipo === "eleccion" ? app.comp.vista.escenarios : []);

export function alternar(id: string) {
  const actuales = elegidas();
  const escenarios = actuales.includes(id)
    ? actuales.filter((x) => x !== id)
    : actuales.length < MAX_SERIES
      ? [...actuales, id]
      : actuales;
  app.comp.vista = escenarios.length ? { tipo: "eleccion", escenarios } : { tipo: "mejores" };
  cambio();
}

interface Columna {
  id: string;
  nombre: string;
  grupo: string;
  /** Valor para ordenar */
  valor: (o: Opcion) => number | string;
  texto: (o: Opcion) => string;
  num?: boolean;
  /** Texto largo que puede partirse en varias líneas */
  nota?: boolean;
}

const motor = (c: CocheCandidato) => MOTORIZACIONES.find((m) => m.valor === c.motorizacion)?.texto ?? "";

function columnas(): Columna[] {
  const H = app.comp.perfil.horizonteMeses;
  const km = (app.comp.perfil.kmAnuales * H) / 12;
  const euros = (id: string, nombre: string, grupo: string, f: (o: Opcion) => number): Columna => ({
    id, nombre, grupo, valor: f, texto: (o) => eur(f(o)), num: true,
  });
  return [
    {
      id: "modalidad", nombre: "Cómo lo consigues", grupo: "Lo básico",
      valor: (o) => ORDEN_MODALIDAD.indexOf(o.escenario.condiciones.modalidad),
      texto: (o) => nombreOpcion(o.escenario),
    },
    { id: "tuyo", nombre: "¿Es tuyo?", grupo: "Lo básico", valor: (o) => (o.resumen.tuyo ? 0 : 1), texto: (o) => (o.resumen.tuyo ? "Sí" : "No, lo devuelves") },
    { id: "motor", nombre: "Motor", grupo: "Lo básico", valor: (o) => motor(o.coche), texto: (o) => motor(o.coche) },
    euros("pvp", "Precio del coche", "Lo básico", (o) => o.coche.pvp),
    euros("hoy", "El primer día", "Lo que pagas", (o) => o.resumen.pagoInicial),
    euros("mes", "Media al mes", "Lo que pagas", (o) => o.resumen.mediaMes),
    euros("pagado", "Pagado en total", "Lo que pagas", (o) => o.resumen.pagado),
    euros("final", "Recuperas al final", "Al final", (o) => -o.resumen.alFinal),
    euros("real", "Coste real", "Al final", (o) => o.resumen.costeNeto),
    euros("realMes", "Coste real al mes", "Al final", (o) => o.resumen.costeNeto / H),
    {
      id: "km", nombre: "Coste real por km", grupo: "Al final", num: true,
      valor: (o) => o.resumen.costeNeto / km, texto: (o) => eurCent(o.resumen.costeNeto / km),
    },
    ...GRUPOS_DESGLOSE.map((g) => euros(`g-${g.id}`, g.nombre, "En qué se va el dinero", (o) => importeGrupo(o.r, g.id))),
    {
      id: "tae", nombre: "TAE", grupo: "Financiación", num: true,
      valor: (o) => o.r.financiacion?.tae ?? -1, texto: (o) => (o.r.financiacion ? pct(o.r.financiacion.tae) : "—"),
    },
    {
      id: "cuota", nombre: "Cuota del contrato", grupo: "Financiación", num: true,
      valor: (o) => o.resumen.cuota ?? -1, texto: (o) => (o.resumen.cuota === undefined ? "—" : eur(o.resumen.cuota)),
    },
    { id: "avisos", nombre: "Avisos", grupo: "Otros", nota: true, valor: (o) => o.r.avisos.length, texto: (o) => o.r.avisos.join(" ") },
  ];
}

// Preferencias de la tabla: de quien la mira, no de la comparativa (no se comparten en el enlace)
const CLAVE = "pick-my-drive:tabla";
const prefs = {
  columnas: ["modalidad", "tuyo", "hoy", "mes"],
  filtro: { coche: "", modalidad: "", tuyo: "", soloElegidas: false },
  orden: null as { id: string; sube: boolean } | null,
};
try {
  Object.assign(prefs, JSON.parse(localStorage.getItem(CLAVE) ?? "{}"));
} catch {
  // sin almacenamiento: valores por defecto
}
function guardarPrefs() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(prefs));
  } catch {
    // da igual: solo es comodidad
  }
}

export function pintarTablaOpciones(caja: HTMLElement) {
  const todas = opciones();
  const cols = columnas();
  const activas = cols.filter((c) => prefs.columnas.includes(c.id));
  const elegidasIds = elegidas();
  const f = prefs.filtro;
  const repinta = () => {
    guardarPrefs();
    pintarTablaOpciones(caja);
  };

  let filas = todas.filter(
    (o) =>
      (!f.coche || o.coche.id === f.coche) &&
      (!f.modalidad || o.escenario.condiciones.modalidad === f.modalidad) &&
      (!f.tuyo || String(o.resumen.tuyo) === f.tuyo) &&
      (!f.soloElegidas || elegidasIds.includes(o.escenario.id)),
  );
  const orden = prefs.orden;
  const porOrden = orden && [...cols, columnaCoche].find((c) => c.id === orden.id);
  if (orden && porOrden)
    filas = [...filas].sort((a, b) => {
      const [x, y] = [porOrden.valor(a), porOrden.valor(b)];
      return (x < y ? -1 : x > y ? 1 : 0) * (orden.sube ? 1 : -1);
    });

  const filtro = (etiqueta: string, valor: string, opcionesSel: [string, string][], cambia: (v: string) => void) => {
    const s = el("select", {}, ...opcionesSel.map(([v, t]) => el("option", { value: v }, t)));
    s.value = valor;
    s.addEventListener("change", () => {
      cambia(s.value);
      repinta();
    });
    return el("label", { class: "filtro" }, etiqueta, s);
  };
  const solo = el("input", { type: "checkbox" });
  solo.checked = f.soloElegidas;
  solo.addEventListener("change", () => {
    f.soloElegidas = solo.checked;
    repinta();
  });

  const menuAbierto = caja.querySelector<HTMLDetailsElement>(".selector-columnas")?.open ?? false;
  const selectorColumnas = el(
    "details",
    { class: "selector-columnas" },
    el("summary", { class: "boton" }, `Columnas (${activas.length})`),
    el(
      "div",
      { class: "menu-columnas" },
      ...[...new Set(cols.map((c) => c.grupo))].map((g) =>
        el(
          "fieldset",
          {},
          el("legend", {}, g),
          ...cols
            .filter((c) => c.grupo === g)
            .map((c) => {
              const cb = el("input", { type: "checkbox" });
              cb.checked = prefs.columnas.includes(c.id);
              cb.addEventListener("change", () => {
                prefs.columnas = cb.checked
                  ? cols.filter((x) => x.id === c.id || prefs.columnas.includes(x.id)).map((x) => x.id)
                  : prefs.columnas.filter((x) => x !== c.id);
                repinta();
              });
              return el("label", {}, cb, ` ${c.nombre}`);
            }),
        ),
      ),
    ),
  );
  selectorColumnas.open = menuAbierto;

  const cabecera = (c: Columna) => {
    const b = el("button", { class: "ordenar" }, c.nombre, orden?.id === c.id ? (orden.sube ? " ▲" : " ▼") : "");
    b.addEventListener("click", () => {
      // ascendente, descendente y vuelta al orden original
      prefs.orden = orden?.id !== c.id ? { id: c.id, sube: true } : orden.sube ? { id: c.id, sube: false } : null;
      repinta();
    });
    return el("th", c.num ? { class: "num" } : {}, b, signoAyuda(c.id, c.nombre));
  };

  const fila = (o: Opcion) => {
    const id = o.escenario.id;
    const i = elegidasIds.indexOf(id);
    const llena = i < 0 && elegidasIds.length >= MAX_SERIES;
    const cb = el("input", { type: "checkbox", "aria-label": `Comparar ${nombreCoche(o.coche)}, ${nombreOpcion(o.escenario)}` });
    cb.checked = i >= 0;
    cb.disabled = llena;
    const ficha = el("a", { class: "enlace-coche", href: urlCoche(o.coche.id) }, nombreCoche(o.coche));
    ficha.addEventListener("click", (ev) => ev.stopPropagation());
    const tr = el(
      "tr",
      {
        class: i >= 0 ? "elegida" : llena ? "llena" : "",
        title: llena ? `Puedes comparar ${MAX_SERIES} opciones como mucho` : "Pulsa para elegirla y compararla",
      },
      el("td", { class: "comparar" }, cb, i >= 0 ? el("span", { class: "punto", style: `background:${colorSerie(i)}` }) : undefined),
      el("td", {}, ficha, etiquetaOferta(o.escenario)),
      ...activas.map((c) => el("td", c.num ? { class: "num" } : c.nota ? { class: "nota" } : {}, c.texto(o))),
    );
    tr.addEventListener("click", () => !llena && alternar(id));
    return tr;
  };

  caja.replaceChildren(
    el(
      "div",
      { class: "barra-tabla" },
      filtro("Coche", f.coche, [["", "Todos"], ...app.comp.coches.map((c): [string, string] => [c.id, nombreCoche(c)])], (v) => (f.coche = v)),
      filtro(
        "Modalidad",
        f.modalidad,
        [["", "Todas"], ...MODALIDADES.filter((m) => m.aplica).map((m): [string, string] => [m.id, m.nombre])],
        (v) => (f.modalidad = v),
      ),
      filtro("¿Es tuyo?", f.tuyo, [["", "Da igual"], ["true", "Sí"], ["false", "No"]], (v) => (f.tuyo = v)),
      el("label", { class: "filtro filtro-check" }, solo, "Solo las elegidas"),
      selectorColumnas,
    ),
    el(
      "p",
      { class: "ayuda" },
      `${filas.length} de ${todas.length} opciones. Pulsa el nombre del coche para abrir su ficha, o cualquier otra parte de la fila para elegirla y compararla abajo (hasta ${MAX_SERIES}).`,
    ),
    el(
      "div",
      { class: "tabla-scroll" },
      el(
        "table",
        { class: "tabla tabla-opciones" },
        el("thead", {}, el("tr", {}, el("th", {}, "Comparar"), cabecera(columnaCoche), ...activas.map(cabecera))),
        el("tbody", {}, ...filas.map(fila)),
      ),
    ),
  );
}

const columnaCoche: Columna = { id: "coche", nombre: "Coche", grupo: "", valor: (o) => nombreCoche(o.coche), texto: () => "" };
