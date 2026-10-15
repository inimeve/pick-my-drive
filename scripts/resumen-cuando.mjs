// Genera el resumen A4 de cuándo cambiar mi Focus ST por un BMW (330i Touring G21 o 540i Touring G31) en los próximos
// 4 años: docs/resumenes/cuando-cambiar-focus-2026-10-14.html. Mismo diseño que los de resumen-byd.mjs.
//
// Para cada mes de cambio m (0 = hoy) compara dos formas de pasar los siguientes 24 meses:
//   - con el Focus: lo que pierde de valor más lo que cuesta usarlo (energía, seguro, mantenimiento, neumáticos,
//     ITV e impuesto y averías), sin vender nada;
//   - con el BMW: se vende el Focus y se compra el mismo BMW de la plantilla, pero m meses más viejo y con m × 1.250 km
//     más, a lo que valdría entonces; con 12 meses de garantía del vendedor desde ese día.
// La diferencia entre las dos, dividida entre 24, es lo que cuesta de más cada mes con el BMW. Todo con el motor de la
// app (costes y valor residual) y con la inflación del perfil.
// Uso: node scripts/resumen-cuando.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "vite";

const SALIDA = "docs/resumenes/cuando-cambiar-focus-2026-10-14.html";
/** Meses con el BMW que se comparan con los mismos meses con el Focus */
const USO = 24;
/** Último mes de cambio que se estudia: los próximos 3 años y medio */
const ULTIMO = 42;
/** Lo que se pierde al venderle el Focus a un concesionario en vez de venderlo a un particular (supuesto) */
const DESCUENTO_CONCESIONARIO = 0.08;
const FIN_GARANTIA_FOCUS = 28;
/** Euros al mes que se aceptan como «ya no baja más» al decidir desde qué mes no compensa esperar */
const UMBRAL = 15;
const COCHES = [
  { id: "bmw-330i-g21", corto: "330i G21", color: "#1c69d4" },
  { id: "bmw-540i-g31", corto: "540i G31", color: "#4f5a66" },
];
const COLOR_FOCUS = "#133a7c";
// Wikimedia Commons, «Ford Focus Turnier ST Mk IV IMG 5412» (CC BY-SA 4.0), enlazada: hace falta conexión para verla
const FOTO = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ford_Focus_Turnier_ST_Mk_IV_IMG_5412.jpg/1280px-Ford_Focus_Turnier_ST_Mk_IV_IMG_5412.jpg";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const meses = Array.from({ length: ULTIMO + 1 }, (_, m) => m);
let focus, ventaHoy, serie;
try {
  const { comparativaDePlantilla, contexto } = await vite.ssrLoadModule("/src/estado.ts");
  const { simular } = await vite.ssrLoadModule("/src/engine/simulacion.ts");
  const { valorResidual } = await vite.ssrLoadModule("/src/engine/costes.ts");
  const comp = comparativaDePlantilla("bmw");
  // con todo riesgo todo el tiempo, sin coste de oportunidad y con horizonte para llegar al mes 42 + 24
  const perfil = { ...comp.perfil, horizonteMeses: ULTIMO + USO, aniosTodoRiesgo: 12, oportunidadActiva: false, costesUsoActivos: true };
  const contado = (c) => ({ id: "contado", cocheId: c.id, visible: true, condiciones: { modalidad: "contado", descuento: 0 } });
  focus = comp.coches.find((c) => c.id === "focus-actual");
  ventaHoy = focus.pvp;
  const rf = simular(contado(focus), focus, contexto({ ...comp, perfil }));
  const kmMes = perfil.kmAnuales / 12;
  const valorFocus = (m) => valorResidual(focus, m, perfil);
  // lo que cuesta el Focus los 24 meses que empiezan en el mes m
  const focusVentana = (m) => rf.costeNeto[m + USO] - rf.costeNeto[m];
  serie = COCHES.map(({ id, ...resto }) => {
    const b = comp.coches.find((c) => c.id === id);
    const puntos = meses.map((m) => {
      const precio = valorResidual(b, m, perfil);
      // el mismo coche, m meses más viejo, con m × 1.250 km más y 12 meses de garantía desde que se compra
      const nuevo = { ...b, pvp: precio, edadInicialMeses: b.edadInicialMeses + m, kmIniciales: b.kmIniciales + kmMes * m, garantiaMeses: b.edadInicialMeses + m + 12 };
      const r = simular(contado(nuevo), nuevo, contexto({ ...comp, perfil: { ...perfil, horizonteMeses: USO } }));
      // los costes de uso suben con la inflación de los m meses que faltan para comprarlo; lo que pierde de valor, no
      const d = r.desglose;
      const uso = Object.entries(d).filter(([k]) => k !== "vehiculo").reduce((s, [, v]) => s + v, 0);
      const coste = d.vehiculo + uso * Math.pow(1 + perfil.inflacion, m / 12);
      const diferencia = coste - focusVentana(m);
      return {
        m, precio, poner: precio - valorFocus(m),
        porMes: diferencia / USO,
        porMesConcesionario: (diferencia + DESCUENTO_CONCESIONARIO * valorFocus(m)) / USO,
        costeMes: coste / USO,
      };
    });
    return { ...resto, id, puntos };
  });
  serie.focus = meses.map((m) => ({ m, valor: valorFocus(m), costeMes: focusVentana(m) / USO }));
} finally {
  await vite.close();
}

const eur = (v, dec = 0) => `${v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: "always" })} €`;
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
// el mes 0 es octubre de 2026
const fecha = (m) => `${MES[(9 + m) % 12]}-${2026 + Math.floor((9 + m) / 12)}`;

/** El primer mes desde el que esperar más ya no baja el coste de más al mes en más de ${UMBRAL} €, y el mínimo que se alcanza */
function mesDulce(puntos) {
  const minimoDesde = (m) => Math.min(...puntos.filter((p) => p.m >= m).map((p) => p.porMes));
  const p = puntos.find((q) => q.porMes - minimoDesde(q.m) <= UMBRAL);
  return { ...p, minimo: minimoDesde(p.m) };
}
const dulces = serie.map((s) => mesDulce(s.puntos));

/** Gráfica de líneas en SVG: x en meses de cambio, y en euros al mes */
function grafica({ lineas, ymax, paso, alto, marca }) {
  const W = 184, H = alto, L = 10, R = 8, T = 3, B = 7;
  const x = (m) => L + (m / ULTIMO) * (W - L - R);
  const y = (v) => T + (1 - v / ymax) * (H - T - B);
  const ejeY = Array.from({ length: Math.floor(ymax / paso) + 1 }, (_, i) => i * paso)
    .map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#e4e3df" stroke-width="0.25"/><text x="${L - 1.5}" y="${y(v) + 0.9}" text-anchor="end">${v}</text>`)
    .join("");
  const ejeX = [0, 6, 12, 18, 24, 30, 36, 42]
    .map((m) => `<text x="${x(m)}" y="${H - 1.5}" text-anchor="middle">${fecha(m)}</text>`)
    .join("");
  const rayas = lineas
    .map((l) => `<polyline fill="none" stroke="${l.color}" stroke-width="${l.fina ? 0.45 : 0.8}"${l.fina ? ' stroke-dasharray="1.4 1"' : ""} points="${l.puntos.map((p) => `${x(p.m).toFixed(2)},${y(p.v).toFixed(2)}`).join(" ")}"/>`)
    .join("");
  const fin = marca
    ? `<line x1="${x(FIN_GARANTIA_FOCUS)}" x2="${x(FIN_GARANTIA_FOCUS)}" y1="${T}" y2="${H - B}" stroke="#a3192b" stroke-width="0.35" stroke-dasharray="1 0.8"/><text x="${x(FIN_GARANTIA_FOCUS) + 1}" y="${T + 3}" fill="#a3192b" class="marca-g">acaba la garantía del Focus</text>`
    : "";
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${lineas.map((l) => l.nombre).join(", ")}">${ejeY}${ejeX}${fin}${rayas}</svg>`;
}

const diferencia = grafica({
  ymax: 400, paso: 100, alto: 44, marca: true,
  lineas: serie.flatMap((s) => [
    { nombre: `${s.corto}, vendiendo el Focus a un particular`, color: s.color, puntos: s.puntos.map((p) => ({ m: p.m, v: p.porMes })) },
    { nombre: `${s.corto}, vendiéndolo a un concesionario`, color: s.color, fina: true, puntos: s.puntos.map((p) => ({ m: p.m, v: p.porMesConcesionario })) },
  ]),
});
const maximoCoste = Math.ceil(Math.max(...serie.flatMap((s) => s.puntos.map((p) => p.costeMes)), ...serie.focus.map((p) => p.costeMes)) / 200) * 200;
const costes = grafica({
  ymax: maximoCoste, paso: 200, alto: 34,
  lineas: [
    { nombre: "Focus", color: COLOR_FOCUS, puntos: serie.focus.map((p) => ({ m: p.m, v: p.costeMes })) },
    ...serie.map((s) => ({ nombre: s.corto, color: s.color, puntos: s.puntos.map((p) => ({ m: p.m, v: p.costeMes })) })),
  ],
});

const FILAS = [...new Set([0, 12, 18, 24, FIN_GARANTIA_FOCUS, 36, 42, ...dulces.map((d) => d.m)])].sort((a, b) => a - b);
const tabla = FILAS.map((m) => {
  const dulce = serie.map((_, i) => dulces[i].m);
  const celdas = serie
    .map((s) => {
      const p = s.puntos[m];
      return `<td>${eur(p.precio)}</td><td>${eur(p.poner)}</td><td class="fuerte">+${eur(p.porMes)}</td>`;
    })
    .join("");
  const hito = m === FIN_GARANTIA_FOCUS ? "acaba la garantía del Focus" : m === 0 ? "hoy" : "";
  const marcas = dulce.includes(m) ? " class=\"dulce\"" : "";
  return `<tr${marcas}><th scope="row">${fecha(m)} <span class="sub">mes ${m}${hito ? ` · ${hito}` : ""}</span></th><td>${eur(serie.focus[m].valor)}</td>${celdas}</tr>`;
}).join("");

const frases = serie
  .map((s, i) => {
    const hoy = s.puntos[0].porMes;
    const d = dulces[i];
    return `<li><strong>${s.corto}:</strong> si cambias hoy, cada mes con el BMW cuesta <strong>${eur(hoy)} más</strong> que con el Focus. Esperando a <strong>${fecha(d.m)}</strong> baja a <strong>${eur(d.porMes)}</strong>; esperar más ya solo lo bajaría, como mucho, a ${eur(d.minimo)}.</li>`;
  })
  .join("");
const primero = Math.min(...dulces.map((d) => d.m));
const ultimo = Math.max(...dulces.map((d) => d.m));
// lo que añade vender el Focus a un concesionario, en el mes dulce de cada BMW
const extraConcesionario = serie.map((s, i) => s.puntos[dulces[i].m].porMesConcesionario - s.puntos[dulces[i].m].porMes);
const conclusionComun = `<li><strong>En los dos, lo mejor es cambiar entre ${fecha(primero)} y ${fecha(ultimo)}</strong>, justo antes de que el Focus empiece a dar gastos: antes cuesta más al mes y después ya no se ahorra más. Si te compra el Focus un concesionario (${(DESCUENTO_CONCESIONARIO * 100).toLocaleString("es-ES")} % menos), el BMW sale unos ${eur(Math.min(...extraConcesionario))} al mes más caro en esos meses.</li>`;
const focusHoy = serie.focus[0].costeMes;
const focusFin = serie.focus[FIN_GARANTIA_FOCUS].costeMes;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cuándo cambiar el Focus por un BMW</title>
<style>
  @page { size: A4; margin: 0; }
  :root {
    color-scheme: light;
    --tinta: #0b0b0b;
    --tinta-2: #52514e;
    --tinta-3: #7a7974;
    --linea: #e4e3df;
    --portada: #f3f3f3;
    --coche: ${COLOR_FOCUS};
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
    gap: 2.2mm;
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
  .portada { margin: 0 -13mm; display: grid; grid-template-columns: 1.35fr 1fr; background: var(--portada); height: 42mm; }
  .foto {
    background: url("${FOTO}") no-repeat 50% 60% / cover;
    -webkit-mask-image: linear-gradient(to right, #000 80%, transparent 100%), linear-gradient(to bottom, #000 82%, transparent 100%);
    -webkit-mask-composite: source-in;
    mask-image: linear-gradient(to right, #000 80%, transparent 100%), linear-gradient(to bottom, #000 82%, transparent 100%);
    mask-composite: intersect;
  }
  .titulo { padding: 2mm 13mm 2mm 0; display: flex; flex-direction: column; justify-content: center; gap: 1mm; }
  .marca { font-size: 8pt; letter-spacing: 0.3em; color: var(--coche); font-weight: 700; }
  .titulo h1 { font-size: 17.5pt; line-height: 1.05; letter-spacing: -0.02em; }
  .fecha { color: var(--tinta-2); }
  .ficha { margin: 1.5mm 0 0; display: grid; grid-template-columns: max-content 1fr; gap: 0.6mm 3mm; font-size: 8pt; }
  .ficha dt { color: var(--tinta-3); }
  .ficha dd { margin: 0; }
  table { width: 100%; border-collapse: collapse; font-size: 7.8pt; font-variant-numeric: tabular-nums; }
  thead th {
    text-align: right; font-weight: 600; color: var(--tinta-2); font-size: 7pt;
    padding: 0 0.9mm 1.2mm; border-bottom: 0.75pt solid var(--tinta); white-space: nowrap; vertical-align: bottom;
  }
  thead th:first-child, tbody th { text-align: left; padding-left: 0; }
  thead th.grupo { text-align: center; border-bottom: 0.5pt solid var(--linea); padding-bottom: 0.6mm; }
  tbody th { font-weight: 600; padding: 0.6mm 0.9mm 0.6mm 0; white-space: nowrap; }
  tbody td { text-align: right; padding: 0.6mm 0.9mm; white-space: nowrap; }
  tbody tr { border-bottom: 0.5pt solid var(--linea); }
  tbody tr.dulce { background: #f3f7ee; }
  .fuerte { font-weight: 650; }
  .sub { font-weight: 400; font-size: 6.6pt; color: var(--tinta-3); }
  .nota { font-size: 6.6pt; line-height: 1.3; color: var(--tinta-2); }
  .nota p + p { margin-top: 1mm; }
  .conclusion { background: var(--portada); margin: 0 -13mm; padding: 2.2mm 13mm; border-bottom: 0.5pt solid var(--linea); }
  .conclusion ul { margin: 1mm 0 0; padding-left: 4mm; font-size: 8pt; line-height: 1.3; }
  .conclusion li + li { margin-top: 0.8mm; }
  svg { display: block; font: 3.1px system-ui, sans-serif; fill: var(--tinta-3); }
  svg .marca-g { font-size: 3px; }
  .leyenda { display: flex; flex-wrap: wrap; gap: 1mm 4mm; font-size: 6.8pt; color: var(--tinta-2); }
  .leyenda i { display: inline-block; width: 4mm; height: 0; margin-right: 1mm; vertical-align: 0.6mm; border-top: 0.8mm solid; }
  .leyenda i.fina { border-top: 0.45mm dashed; }
  .pie { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; padding-top: 1.5mm; border-top: 0.5pt solid var(--linea); }
  .pie ul { margin: 1mm 0 0; padding-left: 4mm; font-size: 6.8pt; line-height: 1.2; }
  .pie li + li { margin-top: 0.1mm; }
</style>
</head>
<body>
<main class="hoja">
  <header class="portada">
    <div class="foto" role="img" aria-label="Ford Focus ST Sportbreak negro"></div>
    <div class="titulo">
      <p class="marca">FORD → BMW</p>
      <h1>¿Cuándo cambiar el Focus?</h1>
      <p class="fecha">Próximos 4 años · 14 de octubre de 2026</p>
      <dl class="ficha">
        <dt>El Focus vale</dt><dd>hoy, unos ${eur(ventaHoy)}</dd>
        <dt>Su garantía</dt><dd>hasta ene-2029 (mes ${FIN_GARANTIA_FOCUS})</dd>
        <dt>Se compara</dt><dd>${USO} meses con cada coche</dd>
        <dt>Pagado</dt><dd>al contado (la diferencia)</dd>
      </dl>
    </div>
  </header>

  <section class="conclusion">
    <h2>Lo que sale</h2>
    <ul>${frases}${conclusionComun}</ul>
  </section>

  <h2>Euros de más al mes con el BMW que con el Focus, según cuándo cambies</h2>
  <div class="grafica">${diferencia}</div>
  <p class="leyenda">${serie.map((s) => `<span><i style="border-color:${s.color}"></i>${s.corto}</span>`).join("")}<span><i class="fina" style="border-color:#7a7974"></i>vendiendo el Focus a un concesionario (${(DESCUENTO_CONCESIONARIO * 100).toLocaleString("es-ES")} % menos)</span></p>

  <h2>Cuánto cuesta cada coche al mes durante los ${USO} meses siguientes</h2>
  <div class="grafica">${costes}</div>
  <p class="leyenda"><span><i style="border-color:${COLOR_FOCUS}"></i>Focus ST</span>${serie.map((s) => `<span><i style="border-color:${s.color}"></i>${s.corto}</span>`).join("")}<span>Euros al mes: lo que pierde de valor más energía y tenerlo</span></p>

  <h2>Mes a mes</h2>
  <div class="tabla-envoltorio">
    <table>
      <thead>
        <tr><th></th><th></th>${serie.map((s) => `<th scope="colgroup" colspan="3" class="grupo">${s.corto}</th>`).join("")}</tr>
        <tr>
          <th scope="col">Si cambias en</th>
          <th scope="col">El Focus vale</th>
          ${serie.map(() => `<th scope="col">Precio</th><th scope="col">Pones tú</th><th scope="col" class="fuerte">Más al mes</th>`).join("")}
        </tr>
      </thead>
      <tbody>${tabla}</tbody>
    </table>
  </div>
  <p class="nota">En verde, el mes desde el que esperar más ya no baja el coste de más al mes en más de ${UMBRAL} € (cada coche tiene el suyo). «Pones tú» es el precio del BMW menos lo que da el Focus. «Más al mes» es el coste de usar el BMW ${USO} meses menos el de usar el Focus esos mismos meses, dividido entre ${USO}.</p>

  <footer class="pie">
    <div>
      <h2>Por qué baja y se queda plano</h2>
      <ul>
        <li>El Focus cuesta ${eur(focusHoy)} al mes hoy y ${eur(focusFin)} al mes si lo mantienes hasta el mes ${FIN_GARANTIA_FOCUS}: cuando acaba la garantía, hay averías y el mantenimiento deja de estar incluido.</li>
        <li>El BMW entra siempre con 12 meses de garantía del vendedor; el Focus, desde el mes ${FIN_GARANTIA_FOCUS}, sin ella.</li>
        <li>Lo que pierde de valor cada año, en euros, baja con la edad en los tres coches.</li>
        <li>El 540i nunca sale barato: gasta 10,4 l/100 km (el Focus, 8,5) y su mantenimiento estimado es el mayor.</li>
      </ul>
    </div>
    <div class="nota">
      <p><strong>Cómo se calcula:</strong> el BMW que compras en el mes m es el mismo de la plantilla (G21: 2020, 80.000 km; G31: 2019, 85.000 km), m meses más viejo, con 1.250 km más por cada mes, a lo que valdría entonces con la curva de depreciación del coche. El Focus se vende a lo que valdría ese mes (la de la plantilla, un 10 % al año; hay que tasarlo). Costes de uso con seguro a todo riesgo y la inflación del 3 % al año; ITV e impuesto de Bilbao. Un cambio, sin gastos de gestoría ni de transferencia. Con 15.000 km al año.</p>
      <p>Fuentes: docs/research/bmw-usados.md (anuncios de oct-2026, consumos de Spritmonitor, CV fiscales del BOE); datos del Focus de la plantilla. Foto: Wikimedia Commons (CC BY-SA 4.0). Cálculos de pick-my-drive.</p>
    </div>
  </footer>
</main>
</body>
</html>
`;

mkdirSync("docs/resumenes", { recursive: true });
writeFileSync(SALIDA, html);
console.log(`Escrito ${SALIDA}`);
for (const [i, s] of serie.entries()) console.log("  ", s.corto, "hoy", Math.round(s.puntos[0].porMes), "mes dulce", dulces[i].m, Math.round(dulces[i].porMes), "mínimo", Math.round(dulces[i].minimo));
console.log("   Focus al mes: hoy", Math.round(focusHoy), "mes 28", Math.round(focusFin));
