// La ficha de un coche (coche.html?id=…): sus datos y ofertas editables, sus modalidades cara a cara,
// el análisis y la conclusión solo para él.
import { alCambiar, app, cambio, escenariosDe, nombreCoche, ORDEN_MODALIDAD, recalcular, urlCoche, urlComparativa } from "../app";
import { modalidadesPosibles, ofertasPorDefecto } from "../data";
import { GRUPOS_DESGLOSE, MODALIDADES, nombreModalidad } from "../engine/modalidades";
import { importeGrupo, resumir, type Resumen } from "../engine/resumen";
import type { Resultado } from "../engine/simulacion";
import type { ModalidadId } from "../engine/tipos";
import { signoAyuda } from "../ui/ayuda";
import { pintarGraficas, pintarVeredicto, seriesDe } from "../ui/analisis";
import { editorCoche, MOTORIZACIONES, pintarCalculosOfertas } from "../ui/editor";
import { el, etiquetaOferta, eur, meses, num, pct } from "../ui/formato";
import { colorSerie } from "../ui/graficas";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const cocheId = new URLSearchParams(location.search).get("id") ?? "";
const coche = () => app.comp.coches.find((c) => c.id === cocheId);

function pintarCabecera() {
  const c = coche()!;
  const p = app.comp.perfil;
  document.title = `${nombreCoche(c)} · Pick My Drive`;
  $("titulo").textContent = nombreCoche(c);
  $("subtitulo").textContent =
    `${c.version ? `${c.version} · ` : ""}${MOTORIZACIONES.find((m) => m.valor === c.motorizacion)?.texto} · ${eur(c.pvp)}. ` +
    `Para ${num(p.kmAnuales)} km al año durante ${meses(p.horizonteMeses)} (cámbialo en la comparativa).`;
}

function pintarEditor() {
  const c = coche();
  if (!c) return;
  $("editor").replaceChildren(
    editorCoche(c, {
      eliminado: () => location.replace(urlComparativa()),
      duplicado: (copia) => (location.href = urlCoche(copia.id)),
    }),
  );
}

/** Las modalidades del coche en columnas, con las mismas cuentas para cada una */
function pintarCaraACara() {
  const c = coche()!;
  const { comp, resultados } = app;
  const H = comp.perfil.horizonteMeses;
  const columnas = escenariosDe(c.id).flatMap((e) => {
    const r = resultados.get(e.id);
    return r?.aplica ? [{ e, r, s: resumir(r, e.condiciones, H) }] : [];
  });
  type Col = { r: Resultado; s: Resumen };

  // modalidades posibles para este coche que aún no tiene: columna vacía para añadir la oferta típica
  const suyas = escenariosDe(c.id);
  const faltan = modalidadesPosibles(c).filter((m) => !columnas.some((x) => x.e.condiciones.modalidad === m));
  const vacia = (m: ModalidadId) => {
    if (suyas.some((e) => e.condiciones.modalidad === m))
      return el("p", { class: "ayuda" }, "Desactivada: marca «En la comparativa» en su oferta, arriba.");
    const b = el("button", { class: "boton" }, "+ Añadir oferta típica");
    b.addEventListener("click", () => {
      const nueva = ofertasPorDefecto(c).find((e) => e.condiciones.modalidad === m);
      if (nueva) comp.escenarios.push(nueva);
      cambio(true);
    });
    return el("div", {}, el("p", { class: "ayuda" }, "Sin oferta todavía."), b);
  };

  const oportunidad = comp.perfil.oportunidadActiva;
  type Fila = [string, (x: Col) => string, string | undefined, string?];
  const filas: (Fila | string)[] = [
    "Cómo es",
    ["¿Es tuyo al final?", ({ s }) => (s.tuyo ? "Sí, lo puedes vender" : "No, lo devuelves"), undefined, "tuyo"],
    ["Cuota del contrato", ({ s }) => (s.cuota === undefined ? "—" : `${eur(s.cuota)}/mes`), undefined, "cuota"],
    ["TAE", ({ r }) => (r.financiacion ? pct(r.financiacion.tae) : "—"), undefined, "tae"],
    "Lo que pagas",
    ["El primer día", ({ s }) => eur(s.pagoInicial), undefined, "hoy"],
    ["Media al mes", ({ s }) => eur(s.mediaMes), undefined, "mes"],
    ["Pagado en total", ({ s }) => eur(s.pagado), undefined, "pagado"],
    "Las cuentas",
    [
      "− Recuperas al final",
      ({ s }) => (Math.round(s.alFinal) < 0 ? eur(-s.alFinal) : Math.round(s.alFinal) > 0 ? `pagas ${eur(s.alFinal)}` : "Nada"),
      undefined,
      "final",
    ],
    ...(oportunidad ? [["+ Dejas de ganar", ({ s }: Col) => eur(s.oportunidad), undefined, "oportunidad"] as Fila] : []),
    ["= Coste real", ({ s }) => eur(s.costeNeto), "total", "real"],
    ["Coste real al mes", ({ s }) => eur(s.costeNeto / H), undefined, "realMes"],
    "En qué se va el dinero",
    ...GRUPOS_DESGLOSE.filter((g) => columnas.some(({ r }) => Math.round(importeGrupo(r, g.id)) !== 0)).map(
      (g): Fila => [g.nombre, ({ r }) => eur(importeGrupo(r, g.id)), undefined, `g-${g.id}`],
    ),
  ];
  const resumen = (m: ModalidadId) => MODALIDADES.find((x) => x.id === m)!.resumen;
  const ancho = columnas.length + faltan.length + 1;

  $("cara-a-cara").replaceChildren(
    el(
      "div",
      { class: "tabla-scroll" },
      el(
        "table",
        { class: "tabla cara-a-cara" },
        el(
          "thead",
          {},
          el(
            "tr",
            {},
            el("th", {}),
            ...columnas.map(({ e }) =>
              el(
                "th",
                { class: "num" },
                el("span", { class: "punto", style: `background:${colorSerie(ORDEN_MODALIDAD.indexOf(e.condiciones.modalidad))}` }),
                ` ${nombreModalidad(e.condiciones.modalidad)}`,
                etiquetaOferta(e),
                el("div", { class: "ayuda" }, resumen(e.condiciones.modalidad)),
              ),
            ),
            ...faltan.map((m) =>
              el("th", { class: "num falta" }, nombreModalidad(m), el("div", { class: "ayuda" }, resumen(m)), vacia(m)),
            ),
          ),
        ),
        el(
          "tbody",
          {},
          ...filas.map((f) =>
            typeof f === "string"
              ? el("tr", { class: "grupo-filas" }, el("th", { colspan: String(ancho) }, f))
              : el(
                  "tr",
                  f[2] ? { class: f[2] } : {},
                  el("th", {}, f[0], f[3] && signoAyuda(f[3], f[0])),
                  ...columnas.map((x) => el("td", { class: "num" }, f[1](x))),
                  ...faltan.map(() => el("td", { class: "falta" })),
                ),
          ),
        ),
      ),
    ),
    ...(() => {
      const avisos = columnas.flatMap(({ e, r }) => r.avisos.map((a) => `${nombreModalidad(e.condiciones.modalidad)}: ${a}`));
      return avisos.length ? [el("ul", { class: "avisos" }, ...avisos.map((a) => el("li", {}, a)))] : [];
    })(),
  );
}

if (!coche()) {
  // el enlace apunta a un coche que ya no está en la comparativa
  location.replace(urlComparativa());
} else {
  alCambiar({
    recalculado: () => {
      if (!coche()) return;
      pintarCabecera();
      pintarCaraACara();
      pintarCalculosOfertas();
      pintarGraficas(seriesDe({ tipo: "coche", cocheId }));
      pintarVeredicto((e) => e.cocheId === cocheId);
    },
    estructura: pintarEditor,
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", recalcular);
  pintarEditor();
  recalcular();
}
