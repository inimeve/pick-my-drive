// La comparativa (index.html), en tres actos: tus opciones → el análisis → la conclusión.
import { alCambiar, app, avisar, cambio, nombreCoche, recalcular, reemplazar, urlCoche } from "../app";
import { cocheActualConOferta, MUNICIPIOS, ofertasPorDefecto, plantillaCoche, TERRITORIOS } from "../data";
import { MODALIDADES, nombreModalidad } from "../engine/modalidades";
import type { ModalidadId, PerfilUso } from "../engine/tipos";
import {
  borrarGuardada,
  comparativaDePlantilla,
  comparativaPorDefecto,
  enlaceCompartir,
  guardadas,
  guardarComo,
  PLANTILLAS,
  type PlantillaId,
  type Vista,
} from "../estado";
import { pintarGraficas, pintarVeredicto, seriesDe } from "../ui/analisis";
import { campoCheck, campoDeslizador, campoNumero, campoSelect } from "../ui/campos";
import { MOTORIZACIONES } from "../ui/editor";
import { el, eur, meses, num, pct } from "../ui/formato";
import { colorSerie } from "../ui/graficas";
import { alternar, elegidas, opciones, pintarTablaOpciones } from "../ui/tabla-opciones";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

// --- 1. Tus opciones ---

function pintarPerfil() {
  const p = app.comp.perfil;
  const set = <K extends keyof PerfilUso>(k: K) => (v: PerfilUso[K]) => {
    app.comp.perfil[k] = v;
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
        app.comp.perfil.territorioId = v;
        app.comp.perfil.municipioId = MUNICIPIOS.find((m) => m.territorioId === v)?.id ?? "otro";
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
    app.comp.perfil.energia[k] = v;
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

/** Los coches de la comparativa: cada uno se edita en su ficha */
function pintarCoches() {
  const { comp } = app;
  $("coches").replaceChildren(
    ...comp.coches.map((c, hueco) => {
      const ofertas = comp.escenarios.filter((e) => e.cocheId === c.id);
      return el(
        "a",
        { class: "coche-enlace", href: urlCoche(c.id) },
        el("span", { class: "punto", style: `background:${colorSerie(hueco)}` }),
        el("strong", {}, nombreCoche(c)),
        el(
          "span",
          { class: "resumen" },
          `${MOTORIZACIONES.find((m) => m.valor === c.motorizacion)?.texto} · ${eur(c.pvp)} · `,
          ofertas.length ? ofertas.map((e) => nombreModalidad(e.condiciones.modalidad)).join(", ") : "sin ofertas",
        ),
        el("span", { class: "ir" }, "Ver y editar →"),
      );
    }),
  );
}

$("btn-anadir-coche").addEventListener("click", () => {
  const nuevo = plantillaCoche();
  app.comp.coches.push(nuevo);
  app.comp.escenarios.push(...ofertasPorDefecto(nuevo));
  cambio();
  location.href = urlCoche(nuevo.id);
});

$("btn-coche-actual").addEventListener("click", () => {
  if (app.comp.coches.some((c) => c.id === cocheActualConOferta().coche.id)) {
    avisar("Tu coche actual ya está en la comparativa");
    return;
  }
  const { coche, escenarios } = cocheActualConOferta();
  app.comp.coches.push(coche);
  app.comp.escenarios.push(...escenarios);
  cambio(true);
});

// --- 2. El análisis ---

/** Encima de las gráficas: las opciones elegidas en la tabla o, si no hay, qué vista se dibuja */
function pintarQueSeCompara() {
  const v = app.comp.vista;
  const fija = (vista: Vista) => () => {
    app.comp.vista = vista;
    cambio();
  };
  const boton = (texto: string, activo: boolean, accion: () => void) => {
    const b = el("button", { class: "boton", "aria-pressed": String(activo) }, texto);
    b.addEventListener("click", accion);
    return b;
  };

  const ids = elegidas();
  if (ids.length) {
    const porId = new Map(opciones().map((o) => [o.escenario.id, o]));
    const quitar = el("button", { class: "boton boton-sutil" }, "Quitar la elección");
    quitar.addEventListener("click", fija({ tipo: "mejores" }));
    $("que-se-compara").replaceChildren(
      el("p", {}, `Comparando las ${ids.length} opciones que has elegido en la tabla:`),
      el(
        "div",
        { class: "chips" },
        ...ids.flatMap((id, i) => {
          const o = porId.get(id);
          if (!o) return [];
          const x = el("button", { class: "quitar", "aria-label": "Quitar de la comparación" }, "×");
          x.addEventListener("click", () => alternar(id));
          return [
            el(
              "span",
              { class: "chip" },
              el("span", { class: "punto", style: `background:${colorSerie(i)}` }),
              `${nombreCoche(o.coche)} · ${nombreModalidad(o.escenario.condiciones.modalidad)} `,
              x,
            ),
          ];
        }),
        quitar,
      ),
    );
    return;
  }

  const selCoche = el("select", { "aria-label": "Coche" });
  for (const c of app.comp.coches) selCoche.append(el("option", { value: c.id }, nombreCoche(c)));
  selCoche.value = v.tipo === "coche" ? v.cocheId : (app.comp.coches[0]?.id ?? "");
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

  $("que-se-compara").replaceChildren(
    el("p", {}, "Elige opciones en la tabla de arriba para compararlas aquí. Mientras tanto, las gráficas muestran:"),
    el(
      "div",
      { class: "filtros", role: "group", "aria-label": "Qué escenarios ver" },
      ...[
        boton("Lo mejor de cada coche", v.tipo === "mejores", fija({ tipo: "mejores" })),
        boton("Un coche, todas las modalidades", v.tipo === "coche", fija({ tipo: "coche", cocheId: selCoche.value })),
        v.tipo === "coche" ? selCoche : undefined,
        boton("Una modalidad, todos los coches", v.tipo === "modalidad", fija({ tipo: "modalidad", modalidad: selModalidad.value as ModalidadId })),
        v.tipo === "modalidad" ? selModalidad : undefined,
      ].filter((x) => x !== undefined),
    ),
  );
}

// --- 3. La conclusión ---

function pintarConclusion() {
  const ids = elegidas();
  $("texto-conclusion").textContent = ids.length
    ? `Entre las ${ids.length} opciones que has elegido, esto es lo que más te conviene y cuándo dejaría de ser así.`
    : "Entre todas las opciones, esto es lo que más te conviene y cuándo dejaría de ser así.";
  pintarVeredicto(ids.length ? (e) => ids.includes(e.id) : undefined);
}

// --- Cabecera ---

function pintarGuardadas() {
  const sel = $<HTMLSelectElement>("sel-guardadas");
  const nombres = Object.keys(guardadas());
  sel.replaceChildren(
    el("option", { value: "" }, nombres.length ? "Mis comparativas…" : "Sin comparativas guardadas"),
    el("optgroup", { label: "Plantillas" }, ...PLANTILLAS.map((p) => el("option", { value: `plantilla:${p.id}` }, p.nombre))),
    ...(nombres.length ? [el("optgroup", { label: "Guardadas" }, ...nombres.map((n) => el("option", { value: n }, n)))] : []),
  );
  if (nombres.length) sel.append(el("option", { value: "__borrar" }, "Borrar la última abierta"));
}

let ultimaAbierta: string | undefined;

$("btn-compartir").addEventListener("click", async () => {
  const url = await enlaceCompartir(app.comp);
  try {
    await navigator.clipboard.writeText(url);
    avisar("Enlace copiado: quien lo abra verá esta misma comparativa");
  } catch {
    history.replaceState(null, "", url);
    avisar("Enlace en la barra de direcciones, listo para copiar");
  }
});

$("btn-guardar").addEventListener("click", () => {
  const nombre = prompt("Nombre para esta comparativa", ultimaAbierta ?? "Mi comparativa");
  if (!nombre) return;
  guardarComo(nombre, app.comp);
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
  } else if (sel.value.startsWith("plantilla:")) {
    reemplazar(comparativaDePlantilla(sel.value.slice("plantilla:".length) as PlantillaId));
    ultimaAbierta = undefined;
    todo();
  } else if (sel.value) {
    const c = guardadas()[sel.value];
    if (c) {
      reemplazar(structuredClone(c));
      ultimaAbierta = sel.value;
      todo();
    }
  }
  pintarGuardadas();
});

$("btn-restablecer").addEventListener("click", () => {
  if (!confirm("¿Volver a los coches y valores por defecto? Perderás los cambios no guardados.")) return;
  reemplazar(comparativaPorDefecto());
  todo();
});

// --- Arranque ---

alCambiar({
  recalculado: () => {
    pintarTablaOpciones($("opciones"));
    pintarQueSeCompara();
    pintarGraficas(seriesDe(app.comp.vista));
    pintarConclusion();
  },
  estructura: pintarCoches,
});

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  recalcular();
  pintarCoches();
});

function todo() {
  pintarPerfil();
  pintarCoches();
  pintarModalidades();
  pintarGuardadas();
  recalcular();
}

todo();
