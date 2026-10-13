// Genera docs/resumenes/atto2-2026-10-13.html: las opciones del BYD Atto 2 DM-i Boost en una página A4.
// El coste neto sale del motor de la app con la plantilla "BYD Atto 2 y Dolphin G frente a quedarme mi CX-30";
// el resto, de las ofertas (docs/research/ofertas-recibidas.md y financiacion-flexible.md).
// Uso: node scripts/resumen-atto2.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "vite";

const SALIDA = "docs/resumenes/atto2-2026-10-13.html";
const AYUDA = 2250;
const MATRICULACION = 875;
// Foto del configurador de BYD (Midnight Blue, el color de serie), enlazada: hace falta conexión para verla
const FOTO = "https://www.byd.com/material/byd-site/configuration/byd-atto2-dm-i/pc/exterior/midnightblue/01.webp";

/** Lo que la app no guarda tal cual: TIN y TAE impresos y la última cuota exacta. Las lineales son estimaciones:
 * la TAE es la calculada, con la comisión financiada y sin cancelar */
const OFERTAS = {
  "atto2-dmi-boost:contado": { nombre: "Contado", origen: "Concesionario", valida: "28-oct" },
  "atto2-dmi-boost:cuota_final:concesionario-a": { nombre: "Easy Plan A", origen: "Concesionario", valida: "20-oct", tin: 5.99, tae: 7.42, ultima: 13415.83 },
  "atto2-dmi-boost:cuota_final:concesionario-b": { nombre: "Easy Plan B", origen: "Concesionario", valida: "20-oct", tin: 8.99, tae: 10.69, ultima: 13416.29 },
  "atto2-dmi-boost:cuota_final:concesionario-c": { nombre: "Easy Plan C", origen: "Concesionario", valida: "20-oct", tin: 5.99, tae: 7.51, ultima: 13416.05 },
  "atto2-dmi-boost:cuota_final:web-minima": { nombre: "Easy Plan, entrada mín.", origen: "Web de BYD", valida: "31-oct", tin: 6.99, tae: 8.84, ultima: 13416.2 },
  "atto2-dmi-boost:cuota_final:web-maxima": { nombre: "Easy Plan, entrada máx.", origen: "Web de BYD", valida: "31-oct", tin: 6.99, tae: 8.53, ultima: 13415.81 },
  "atto2-dmi-boost:prestamo:lineal-599": { nombre: "Lineal 5,99 %", origen: "Estimación", tin: 5.99, tae: 7.54 },
  "atto2-dmi-boost:prestamo:lineal-899": { nombre: "Lineal −2.000 € al 8,99 %", origen: "Estimación", tin: 8.99, tae: 10.84 },
  "atto2-dmi-boost:prestamo:lineal-599-minima": { nombre: "Lineal 5,99 %, entrada mín.", origen: "Estimación", tin: 5.99, tae: 7.54 },
  "atto2-dmi-boost:prestamo:lineal-899-minima": { nombre: "Lineal −2.000 €, entrada mín.", origen: "Estimación", tin: 8.99, tae: 10.84 },
};

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
let filas;
let perfil;
let valorFinal;
let energia;
try {
  const { comparativaDePlantilla, contexto } = await vite.ssrLoadModule("/src/estado.ts");
  const { simular } = await vite.ssrLoadModule("/src/engine/simulacion.ts");
  const { saldoPendiente } = await vite.ssrLoadModule("/src/engine/finanzas.ts");
  const { energiaPorKm } = await vite.ssrLoadModule("/src/engine/costes.ts");
  const comp = comparativaDePlantilla("byd-cx30");
  // todas las opciones son el mismo coche: energía, seguro y mantenimiento son iguales y no cambian la comparación
  // sin coste de oportunidad: el coste neto es solo lo pagado menos lo que vale el coche al final
  perfil = { ...comp.perfil, costesUsoActivos: false, oportunidadActiva: false };
  const ctx = contexto({ ...comp, perfil });
  const coche = comp.coches.find((c) => c.id === "atto2-dmi-boost");
  // energía: el 15 % de los km en eléctrico, todo cargado fuera de casa; el resto con gasolina
  const e = comp.perfil.energia;
  const porKm = energiaPorKm(
    { ...coche, consumo: { ...coche.consumo, fraccionElectrica: 0.15 } },
    { ...comp.perfil, energia: { ...e, fraccionCargaCasa: 0 } },
  );
  energia = { porKm, km: comp.perfil.kmAnuales, litros: coche.consumo.litros100, kwh: coche.consumo.kwh100, gasolina: e.gasolina, kwhPublica: e.kwhPublica };
  filas = Object.entries(OFERTAS).map(([id, o]) => {
    const e = comp.escenarios.find((x) => x.id === id);
    if (!e) throw new Error(`Falta el escenario ${id}`);
    const c = e.condiciones;
    const r = simular(e, coche, ctx);
    const precio = coche.pvp - c.descuento;
    if (c.modalidad === "contado") {
      valorFinal = precio - r.desglose.vehiculo;
      return { ...o, precio, primerDia: precio, pagadoQuedar: precio - AYUDA, costeNeto: r.costeNeto[perfil.horizonteMeses] };
    }
    if (c.modalidad === "prestamo") {
      // lineal cancelada en el mes 48: la deuda pendiente más la comisión de cancelación
      const f = r.financiacion;
      const pendiente = saldoPendiente(f.principal, f.tin, f.cuota, c.cancelarEnMes);
      const cancelar = pendiente * (1 + c.comisionCancelacion);
      return {
        ...o,
        precio,
        primerDia: c.entrada,
        cuota: c.cuotaOfertada,
        plazo: c.cancelarEnMes,
        deLas: c.plazoMeses,
        cancelar,
        pagadoQuedar: c.entrada + c.cuotaOfertada * c.cancelarEnMes + cancelar - AYUDA,
        costeNeto: r.costeNeto[perfil.horizonteMeses],
      };
    }
    const web = o.origen === "Web de BYD";
    // en la web el Auto+ ya va descontado de lo financiado: la entrada de la app lo lleva sumado, como la matriculación
    const entrada = web ? c.entrada - AYUDA - MATRICULACION : c.entrada;
    const comision = c.comisionFinanciada ? 0 : (precio - c.entrada) * c.comisionApertura;
    const primerDia = entrada + comision + (web ? MATRICULACION : 0);
    const cuotas = c.cuotaOfertada * c.plazoMeses;
    const neto = web ? 0 : AYUDA;
    return {
      ...o,
      precio,
      entrada,
      primerDia,
      cuota: c.cuotaOfertada,
      plazo: c.plazoMeses,
      pagadoDevolver: primerDia + cuotas - neto,
      pagadoQuedar: primerDia + cuotas + o.ultima - neto,
      costeNeto: r.costeNeto[perfil.horizonteMeses],
    };
  });
} finally {
  await vite.close();
}

const eur = (v, dec = 0) =>
  v === undefined ? "—" : `${v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: "always" })} €`;
const pct = (v) => `${v.toLocaleString("es-ES", { minimumFractionDigits: 2 })} %`;
const concesionario = (f) => f.origen === "Concesionario";
const etiquetaOrigen = (f) => ({ Concesionario: "concesionario", "Web de BYD": "web", Estimación: "estimación" })[f.origen];
const procedencia = (f) => (f.valida ? `${f.origen} · hasta ${f.valida}` : "Estimación");
const maximo = Math.ceil(Math.max(...filas.map((f) => f.costeNeto)) / 5000) * 5000;

const FICHA = [
  ["Potencia", "212 CV (156 kW)"],
  ["Batería", "18 kWh · 90 km eléctricos"],
  ["Consumo", "1,8 l/100 km ponderado"],
  ["Maletero", "425 / 1.335 l"],
];
const EASY_PLAN = [
  "48 cuotas y una última (Valor Mínimo Garantizado) a los 49 meses.",
  "Al final: devolverlo, quedárselo pagando la última o cambiarlo.",
  "15.000 km al año incluidos; 0,10 €/km de más si se devuelve.",
  "Comisión: 3,75 % financiada o 3,99 % al firmar (web).",
  "B: 2.000 € menos con TIN 8,99 %; tiene duración mínima.",
  "Entrada en la web: de 277 € a 12.482 € (el 45 % del precio).",
];

const tabla = filas
  .map(
    (f) => `<tr>
      <th scope="row">${f.nombre}<span class="sub">${procedencia(f)}</span></th>
      <td>${eur(f.precio)}</td>
      <td>${eur(f.primerDia)}</td>
      <td>${f.cuota ? `${f.plazo} × ${eur(f.cuota, 2)}${concesionario(f) ? "*" : ""}${f.deLas ? `<span class="sub">de ${f.deLas} cuotas</span>` : ""}` : "—"}</td>
      <td>${f.ultima ? `${eur(f.ultima)}<span class="sub">mes 49</span>` : f.cancelar ? `${eur(f.cancelar)}<span class="sub">cancelar, mes 48</span>` : "—"}</td>
      <td>${f.tin ? `${pct(f.tin)}<span class="sub">TAE ${pct(f.tae)}</span>` : "—"}</td>
      <td>${eur(f.pagadoDevolver)}</td>
      <td>${eur(f.pagadoQuedar)}</td>
      <td class="fuerte">${eur(f.costeNeto)}</td>
    </tr>`,
  )
  .join("");

const barras = filas
  .map(
    (f) => `<div class="barra-fila" title="${f.nombre}: ${eur(f.costeNeto)}">
      <span class="barra-etq">${f.nombre} · ${etiquetaOrigen(f)}</span>
      <span class="barra-pista"><span class="barra" style="width:${(f.costeNeto / maximo) * 100}%"></span><span class="barra-val">${eur(f.costeNeto)}</span></span>
    </div>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BYD Atto 2: opciones</title>
<style>
  @page { size: A4; margin: 0; }
  :root {
    color-scheme: light;
    --tinta: #0b0b0b;
    --tinta-2: #52514e;
    --tinta-3: #7a7974;
    --linea: #e4e3df;
    --portada: #f3f3f3;
    /* el azul del Midnight Blue de la foto */
    --coche: #1d5f86;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: #e9e8e4; }
  body {
    font: 8.5pt/1.35 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--tinta);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  h1, h2, p { margin: 0; }
  .hoja {
    width: 210mm;
    height: 297mm;
    margin: 10mm auto;
    padding: 0 13mm 8mm;
    background: #fff;
    box-shadow: 0 1px 4px rgb(0 0 0 / 0.12);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2.6mm;
  }
  @media print {
    html, body { background: #fff; }
    .hoja { margin: 0; box-shadow: none; }
  }
  @media screen and (max-width: 220mm) {
    .hoja { width: auto; height: auto; margin: 0; padding: 0 16px 16px; box-shadow: none; }
    .portada { margin: 0 -16px; grid-template-columns: 1fr; height: auto; }
    .foto { height: 50vw; }
    .titulo { padding: 16px; }
    .tabla-envoltorio { overflow-x: auto; }
  }
  h2 {
    font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.07em;
    color: var(--tinta-2); font-weight: 600;
  }
  .portada { margin: 0 -13mm; display: grid; grid-template-columns: 1.35fr 1fr; background: var(--portada); height: 50mm; }
  .foto { background: url("${FOTO}") no-repeat 50% 58% / 130%; }
  .titulo { padding: 4mm 13mm 4mm 0; display: flex; flex-direction: column; justify-content: center; gap: 1.5mm; }
  .marca { font-size: 8pt; letter-spacing: 0.3em; color: var(--coche); font-weight: 700; }
  .titulo h1 { font-size: 22pt; line-height: 1.05; letter-spacing: -0.02em; }
  .fecha { color: var(--tinta-2); }
  .ficha { margin: 3mm 0 0; display: grid; grid-template-columns: max-content 1fr; gap: 0.6mm 3mm; font-size: 8pt; }
  .ficha dt { color: var(--tinta-3); }
  .ficha dd { margin: 0; }
  table { width: 100%; border-collapse: collapse; font-size: 7.8pt; font-variant-numeric: tabular-nums; }
  thead th {
    text-align: right; font-weight: 600; color: var(--tinta-2); font-size: 7pt;
    padding: 0 0.9mm 1.2mm; border-bottom: 0.75pt solid var(--tinta); white-space: nowrap; vertical-align: bottom;
  }
  thead th:first-child, tbody th { text-align: left; padding-left: 0; }
  tbody th { font-weight: 600; padding: 0.7mm 0.9mm 0.7mm 0; white-space: nowrap; }
  tbody td { text-align: right; padding: 0.7mm 0.9mm; white-space: nowrap; }
  tbody tr { border-bottom: 0.5pt solid var(--linea); }
  .fuerte { font-weight: 650; }
  .sub { display: block; font-weight: 400; font-size: 7pt; color: var(--tinta-3); }
  .nota { font-size: 6.6pt; line-height: 1.3; color: var(--tinta-2); }
  .nota p + p { margin-top: 1mm; }
  .barras { display: grid; gap: 0.6mm; }
  .barra-fila { display: grid; grid-template-columns: 66mm 1fr; align-items: center; gap: 3mm; }
  .barra-etq { white-space: nowrap; }
  .barra-etq { text-align: right; color: var(--tinta-2); }
  .barra-pista { display: flex; align-items: center; gap: 2mm; }
  .barra { height: 2.5mm; background: var(--coche); border-radius: 0 4px 4px 0; }
  .barra-val { font-weight: 650; font-variant-numeric: tabular-nums; }
  .energia { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 6mm; row-gap: 1mm; align-items: center; background: var(--portada); margin: -2.6mm -13mm 0; padding: 2mm 13mm 3mm; border-top: 0.5pt solid var(--linea); }
  .energia h2 { grid-column: 1 / -1; }
  .cifras { display: flex; gap: 6mm; }
  .cifras b { display: block; font-size: 12pt; color: var(--coche); font-variant-numeric: tabular-nums; }
  .cifras span { font-size: 7pt; color: var(--tinta-2); }
  .pie { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; padding-top: 1.5mm; border-top: 0.5pt solid var(--linea); }
  .pie ul { margin: 1mm 0 0; padding-left: 4mm; font-size: 7pt; line-height: 1.25; }
  .pie li + li { margin-top: 0.3mm; }
</style>
</head>
<body>
<main class="hoja">
  <header class="portada">
    <div class="foto" role="img" aria-label="BYD Atto 2 en Midnight Blue"></div>
    <div class="titulo">
      <p class="marca">BYD</p>
      <h1>Atto 2 DM-i Boost</h1>
      <p class="fecha">Formas de pago · 13 de octubre de 2026</p>
      <dl class="ficha">${FICHA.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
    </div>
  </header>

  <section class="energia">
    <h2>Energía (igual en todas las opciones)</h2>
    <div class="cifras">
      <div><b>${(energia.porKm * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })}&nbsp;€</b><span>cada 100 km</span></div>
      <div><b>${eur((energia.porKm * energia.km) / 12)}</b><span>al mes</span></div>
      <div><b>${eur(energia.porKm * energia.km)}</b><span>al año</span></div>
      <div><b>${eur(energia.porKm * energia.km * 4)}</b><span>en 4 años</span></div>
    </div>
    <p class="nota">${energia.km.toLocaleString("es-ES", { useGrouping: "always" })} km al año: el 15 % en eléctrico, con todo cargado fuera de casa (${energia.kwh} kWh/100 km a ${energia.kwhPublica.toLocaleString("es-ES")} €/kWh), y el 85 % con gasolina (${energia.litros.toLocaleString("es-ES")} l/100 km reales con la batería vacía, a ${energia.gasolina.toLocaleString("es-ES")} €/l). A precios de hoy (Bizkaia, 1-oct-2026); no está sumada al coste neto.</p>
  </section>

  <h2>Las opciones</h2>
  <div class="tabla-envoltorio">
    <table>
      <thead>
        <tr>
          <th scope="col">Opción</th>
          <th scope="col">Precio</th>
          <th scope="col">El primer día</th>
          <th scope="col">Cuotas</th>
          <th scope="col">Última cuota<br>o cancelación</th>
          <th scope="col">TIN</th>
          <th scope="col">Pagado si lo<br>devuelves</th>
          <th scope="col">Pagado si te<br>lo quedas</th>
          <th scope="col" class="fuerte">Coste neto<br>a 4 años</th>
        </tr>
      </thead>
      <tbody>${tabla}</tbody>
    </table>
  </div>
  <p class="nota">Precio con IVA, matriculación y pre-entrega (875 €, que la web no incluye), sin restar el Plan Auto+ (2.250 €, pendiente de BOE: si no se aprueba o no corresponde, el coche cuesta 2.250 € más). Los totales pagados ya restan la ayuda. <strong>* Cuotas del concesionario sin el seguro de vida opcional</strong> que llevan sus simulaciones (817 € en A, 726 € en B y 989 € en C, financiado): con él son de 208,31 €, 196,71 € y 303,84 €. Se quita para comparar con la web, que no lo lleva. La TAE es la impresa, con el seguro.</p>
  <p class="nota"><strong>Lineal (estimación):</strong> financiación lineal de CA Auto Bank, que el concesionario no ha ofrecido todavía. La promoción de BYD pide financiar al menos 15.000 € a 72 meses o más, con 36 de permanencia. Se usan el TIN y el descuento de las opciones A y B, la comisión del 3,75 % financiada y una cancelación en el mes 48 con un 1 % de comisión, para cubrir los mismos 4 años. La de entrada mínima financia todo menos el 1 %. La TAE es calculada. Falta confirmar el TIN, si hay descuento en lineal y si cancelar obliga a devolverlo.</p>

  <h2>Coste neto a 4 años</h2>
  <div class="barras" role="img" aria-label="Coste neto a 4 años de cada opción">${barras}</div>

  <footer class="pie">
    <div>
      <h2>Cómo funciona el Easy Plan</h2>
      <ul>${EASY_PLAN.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>
    <div class="nota">
      <p><strong>Coste neto a 4 años:</strong> lo pagado durante 48 meses, menos lo que valdría el coche al final (unos ${eur(Math.round(valorFinal / 100) * 100)}), menos la ayuda. No cuenta lo que habría rendido el dinero ni incluye energía, seguro, mantenimiento ni impuestos, que son iguales en todas las opciones. Con ${perfil.kmAnuales.toLocaleString("es-ES", { useGrouping: "always" })} km al año, sin exceso de km.</p>
      <p>Fuentes: presupuesto y simulaciones de CA Auto Bank del concesionario BYD de Barakaldo y configurador de BYD España, del 13-oct-2026 (salvo la entrada mínima de la web, del 6-oct, con las mismas condiciones). Foto: configurador de BYD. Cálculos de pick-my-drive.</p>
    </div>
  </footer>
</main>
</body>
</html>
`;

mkdirSync("docs/resumenes", { recursive: true });
writeFileSync(SALIDA, html);
console.log(`Escrito ${SALIDA}`);
for (const f of filas) console.log(f.nombre.padEnd(28), f.origen.padEnd(14), Math.round(f.primerDia), Math.round(f.pagadoDevolver ?? 0), Math.round(f.pagadoQuedar), Math.round(f.costeNeto));
