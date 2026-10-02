// Editor de un Coche candidato y sus ofertas. Vive en la ficha del coche (coche.html).
import { app, cambio, escenariosDe } from "../app";
import { modalidadesPosibles, ofertasPorDefecto } from "../data";
import { nombreModalidad } from "../engine/modalidades";
import type { CocheCandidato, Escenario, Motorizacion } from "../engine/tipos";
import { campoCheck, campoNumero, campoSelect, campoTexto } from "./campos";
import { el, eur, eurCent, pct } from "./formato";

export const MOTORIZACIONES: { valor: Motorizacion; texto: string }[] = [
  { valor: "gasolina", texto: "Gasolina" },
  { valor: "diesel", texto: "Diésel" },
  { valor: "hibrido", texto: "Híbrido" },
  { valor: "hibrido_enchufable", texto: "Híbrido enchufable" },
  { valor: "electrico", texto: "Eléctrico" },
];

export interface AccionesCoche {
  /** Tras eliminarlo (la ficha vuelve a la comparativa) */
  eliminado?: () => void;
  /** Tras duplicarlo (la ficha abre la copia) */
  duplicado?: (copia: CocheCandidato) => void;
}

export function editorCoche(c: CocheCandidato, al: AccionesCoche = {}): HTMLElement {
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

  const { comp } = app;
  const ofertas = escenariosDe(c.id);
  const faltan = modalidadesPosibles(c).filter((m) => !ofertas.some((e) => e.condiciones.modalidad === m));

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
    al.duplicado?.(copia);
  });
  const borrar = el("button", { class: "boton boton-peligro" }, "Eliminar coche");
  borrar.addEventListener("click", () => {
    comp.coches = comp.coches.filter((x) => x.id !== c.id);
    comp.escenarios = comp.escenarios.filter((e) => e.cocheId !== c.id);
    if (comp.vista.tipo === "coche" && comp.vista.cocheId === c.id) comp.vista = { tipo: "mejores" };
    if (comp.vista.tipo === "eleccion") {
      const quedan = new Set(comp.escenarios.map((e) => e.id));
      comp.vista = { tipo: "eleccion", escenarios: comp.vista.escenarios.filter((id) => quedan.has(id)) };
    }
    cambio(true);
    al.eliminado?.();
  });

  return el(
    "div",
    { class: "editor-coche" },
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
        campoNumero("Mantenimiento ya pagado (edad del coche)", (c.mantenimientoIncluidoMeses ?? 0) / 12, (v) => set("mantenimientoIncluidoMeses")(Math.round(v * 12)), {
          min: 0,
          paso: 1,
          sufijo: "años",
          ayuda: "Hasta que el coche cumple esta edad no pagas mantenimiento, por ejemplo si lo incluyó el vendedor en el precio",
        }),
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
  const { comp } = app;
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
export function pintarCalculosOfertas() {
  const { comp, resultados } = app;
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
