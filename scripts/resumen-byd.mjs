// Genera el resumen A4 de las formas de pago de cada BYD de la plantilla "BYD Atto 2 y Dolphin G frente a quedarme
// mi CX-30": docs/resumenes/atto2-2026-10-13.html y dolphin-g-2026-10-13.html. El coste neto sale del motor de la app;
// el resto, de las ofertas (docs/research/ofertas-recibidas.md y financiacion-flexible.md).
// También el de quedarme mi CX-30 (cx30-2026-10-13.html) y los de los Tesla Model 3 y Model Y (model3-2026-10-14.html y
// modely-2026-10-14.html, de docs/research/tesla.md), con el mismo diseño.
// Y, de la plantilla "BMW de segunda mano y mi Focus", los de quedarme mi Focus ST (focus-st-2026-10-14.html) y de pasar
// a un 330i Touring G21 o a un 540i Touring G31 (bmw-330i-g21-2026-10-14.html y bmw-540i-g31-2026-10-14.html).
// Uso: node scripts/resumen-byd.mjs [atto2|dolphin|cx30|model3|modely|focus|g21|g31]  (sin argumento, todos)
import { writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "vite";

const AYUDA = 2250;
const MATRICULACION = 875;

/** Lo que la app no guarda tal cual: TIN y TAE impresos y la última cuota exacta. Las lineales son estimaciones:
 * la TAE es la calculada, con la comisión financiada y sin cancelar */
const lineales = (id) => ({
  [`${id}:prestamo:lineal-599`]: { nombre: "Lineal 5,99 %", origen: "Estimación", tin: 5.99, tae: 7.54 },
  [`${id}:prestamo:lineal-899`]: { nombre: "Lineal −2.000 € al 8,99 %", origen: "Estimación", tin: 8.99, tae: 10.84 },
  [`${id}:prestamo:lineal-599-minima`]: { nombre: "Lineal 5,99 %, entrada mín.", origen: "Estimación", tin: 5.99, tae: 7.54 },
  [`${id}:prestamo:lineal-899-minima`]: { nombre: "Lineal −2.000 €, entrada mín.", origen: "Estimación", tin: 8.99, tae: 10.84 },
});

const NOTA_AUTO_PLUS = "Precio con IVA, matriculación y pre-entrega (875 €, que la web no incluye), sin restar el Plan Auto+ (2.250 €, pendiente de BOE: si no se aprueba o no corresponde, el coche cuesta 2.250 € más). Los totales pagados ya restan la ayuda. En la web la adelanta CA Auto Bank y ya va descontada de lo financiado (por eso su primer día es menor); en el concesionario se tramita aparte y BYD la adelanta 6 meses sin intereses. Si no se concede, hay que devolverla o pagarla en 6 meses.";

const COCHES = {
  atto2: {
    id: "atto2-dmi-boost",
    salida: "docs/resumenes/atto2-2026-10-13.html",
    titulo: "Atto 2 DM-i Boost",
    tamTitulo: "22pt",
    pestana: "BYD Atto 2: opciones",
    // Foto del configurador de BYD en el color de serie, enlazada: hace falta conexión para verla
    foto: "https://www.byd.com/material/byd-site/configuration/byd-atto2-dm-i/pc/exterior/midnightblue/01.webp",
    encuadre: "no-repeat 50% 58% / 130%",
    alt: "BYD Atto 2 en Midnight Blue",
    // el azul del Midnight Blue de la foto
    color: "#1d5f86",
    ficha: [
      ["Potencia", "212 CV (156 kW)"],
      ["Batería", "18 kWh · 90 km eléctricos"],
      ["Consumo", "1,8 l/100 km ponderado"],
      ["Maletero", "425 / 1.335 l"],
    ],
    ofertas: {
      "atto2-dmi-boost:contado": { nombre: "Contado", origen: "Concesionario", valida: "28-oct" },
      "atto2-dmi-boost:cuota_final:concesionario-a": { nombre: "Easy Plan A", origen: "Concesionario", valida: "20-oct", tin: 5.99, tae: 7.42, ultima: 13415.83 },
      "atto2-dmi-boost:cuota_final:concesionario-b": { nombre: "Easy Plan B", origen: "Concesionario", valida: "20-oct", tin: 8.99, tae: 10.69, ultima: 13416.29 },
      "atto2-dmi-boost:cuota_final:concesionario-c": { nombre: "Easy Plan C", origen: "Concesionario", valida: "20-oct", tin: 5.99, tae: 7.51, ultima: 13416.05 },
      "atto2-dmi-boost:cuota_final:web-minima": { nombre: "Easy Plan, entrada mín.", origen: "Web de BYD", valida: "31-oct", tin: 6.99, tae: 8.84, ultima: 13416.2 },
      "atto2-dmi-boost:cuota_final:web-maxima": { nombre: "Easy Plan, entrada máx.", origen: "Web de BYD", valida: "31-oct", tin: 6.99, tae: 8.53, ultima: 13415.81 },
      ...lineales("atto2-dmi-boost"),
    },
    notaPrecio: `${NOTA_AUTO_PLUS} <strong>* Cuotas del concesionario sin el seguro de vida opcional</strong> que llevan sus simulaciones (817 € en A, 726 € en B y 989 € en C, financiado): con él son de 208,31 €, 196,71 € y 303,84 €. Se quita para comparar con la web, que no lo lleva. La TAE es la impresa, con el seguro.`,
    origenLineal: "el TIN y el descuento de las opciones A y B",
    garantizado: "los 13.416 € del Valor Mínimo Garantizado del Easy Plan",
  notaCostes: "Seguro a todo riesgo, mantenimiento y neumáticos estimados, con un 3 % de inflación al año. Sin ITV en estos 4 años (es nuevo) y con la bonificación del 75 % del impuesto de circulación de Bilbao para enchufables. Garantía de 6 años: sin averías.",
    easyPlan: [
      "48 cuotas y una última (Valor Mínimo Garantizado) a los 49 meses.",
      "Al final: devolverlo, quedárselo pagando la última o cambiarlo.",
      "15.000 km al año incluidos; 0,10 €/km de más si se devuelve.",
      "Comisión: 3,75 % financiada o 3,99 % al firmar (web).",
      "B: 2.000 € menos con TIN 8,99 %; tiene duración mínima.",
      "Entrada en la web: de 277 € a 12.482 € (el 45 % del precio).",
    ],
    fuentes: "Fuentes: presupuesto y simulaciones de CA Auto Bank del concesionario BYD de Barakaldo y configurador de BYD España, del 13-oct-2026 (salvo la entrada mínima de la web, del 6-oct, con las mismas condiciones). Foto: configurador de BYD. Cálculos de pick-my-drive.",
  },
  dolphin: {
    id: "dolphin-g-comfort",
    salida: "docs/resumenes/dolphin-g-2026-10-13.html",
    titulo: "Dolphin G DM-i Comfort",
    // más largo: a 22 pt ocupa dos líneas y no cabe la ficha
    tamTitulo: "17.5pt",
    pestana: "BYD Dolphin G: opciones",
    foto: "https://www.byd.com/material/byd-site/configuration/dolphin-g/pc/exterior/orangesunset/comfort/01.webp",
    encuadre: "no-repeat 52% 62% / cover",
    // el fondo de cielo de la foto se funde con el gris de la portada por la derecha y por abajo
    fundido: true,
    alt: "BYD Dolphin G en Orange Sunset",
    // el naranja del Orange Sunset de la foto, oscurecido para que se lea como texto
    color: "#c2501b",
    ficha: [
      ["Potencia", "212 CV (156 kW)"],
      ["Batería", "18,3 kWh · 105 km eléctricos"],
      ["Consumo", "1,4 l/100 km ponderado"],
      ["Maletero", "425 / 1.225 l"],
    ],
    ofertas: {
      "dolphin-g-comfort:contado": { nombre: "Contado", origen: "Concesionario", valida: "28-oct" },
      // las opciones A, B y C del Atto 2 adaptadas: estimaciones, TAE calculada sin seguro de vida
      "dolphin-g-comfort:cuota_final:concesionario-a-estimada": { nombre: "Easy Plan A", origen: "Estimación", tin: 5.99, tae: 7.39, ultima: 12176.84 },
      "dolphin-g-comfort:cuota_final:concesionario-b-estimada": { nombre: "Easy Plan B", origen: "Estimación", tin: 8.99, tae: 10.63, ultima: 12176.84 },
      "dolphin-g-comfort:cuota_final:concesionario-c-estimada": { nombre: "Easy Plan C", origen: "Estimación", tin: 5.99, tae: 7.49, ultima: 12176.84 },
      "dolphin-g-comfort:cuota_final:web-minima": { nombre: "Easy Plan, entrada mín.", origen: "Web de BYD", valida: "31-oct", tin: 6.99, tae: 8.84, ultima: 12176.84 },
      "dolphin-g-comfort:cuota_final:web-maxima": { nombre: "Easy Plan, entrada máx.", origen: "Web de BYD", valida: "31-oct", tin: 6.99, tae: 8.54, ultima: 12176.84 },
      ...lineales("dolphin-g-comfort"),
    },
    notaPrecio: `${NOTA_AUTO_PLUS} <strong>Easy Plan A, B y C (estimación):</strong> el concesionario solo ha dado el precio al contado, así que son las opciones que dio para el Atto 2 adaptadas al Dolphin: la misma entrada, TIN, descuento y comisión del 3,75 % financiada, sin seguro de vida, y la última cuota de la web (el Valor Mínimo Garantizado no depende de la entrada). Sus cuotas y TAE, como las de la web con entrada mínima, están calculadas con la fórmula que reproduce al céntimo las reales.`,
    origenLineal: "el TIN y el descuento que el concesionario dio para el Atto 2 (opciones A y B)",
    garantizado: "los 12.177 € del Valor Mínimo Garantizado del Easy Plan",
  notaCostes: "Seguro a todo riesgo, mantenimiento y neumáticos estimados, con un 3 % de inflación al año. Sin ITV en estos 4 años (es nuevo) y con la bonificación del 75 % del impuesto de circulación de Bilbao para enchufables. Garantía de 6 años: sin averías.",
    easyPlan: [
      "48 cuotas y una última (Valor Mínimo Garantizado) a los 49 meses.",
      "Al final: devolverlo, quedárselo pagando la última o cambiarlo.",
      "15.000 km al año incluidos; 0,10 €/km de más si se devuelve.",
      "Comisión: 3,75 % financiada o 3,99 % al firmar (web).",
      "B: 2.000 € menos con TIN 8,99 %; tiene duración mínima.",
      "Entrada en la web: de 255 € a 11.486 € (el 45 % del precio).",
    ],
    fuentes: "Fuentes: presupuesto de contado del concesionario BYD de Barakaldo y configurador de BYD España, del 13-oct-2026. Foto: configurador de BYD. Cálculos de pick-my-drive.",
  },
};

const notaGasolina = (e) =>
  `${e.km.toLocaleString("es-ES", { useGrouping: "always" })} km al año, todo con gasolina (${e.litros.toLocaleString("es-ES")} l/100 km reales, a ${e.gasolina.toLocaleString("es-ES")} €/l). A precios de hoy (Bizkaia, 1-oct-2026).`;

COCHES.cx30 = {
  valor: "con la pérdida del 17 % al año de la tabla de Mazda sobre lo que vale hoy, 18.193 €; sin cuota final nueva, no hay valor garantizado con el que compararlo",
  id: "cx30-actual",
  salida: "docs/resumenes/cx30-2026-10-13.html",
  marca: "Mazda",
  titulo: "CX-30 2.0 e-Skyactiv G",
  tamTitulo: "19pt",
  subtitulo: "Quedármelo · 13 de octubre de 2026",
  pestana: "Mazda CX-30: quedármelo",
  ayuda: 0,
  // Configurador de Mazda: un CX-30 Makoto, con llantas de 18", en Soul Red Crystal
  foto: "https://cgi.cdn.mazda.media/compressed/cf1da74ec7730df1bc6c32b6562c9588f2da237450a7d58b7e2c063924ec7a18/MERGED/6/36.jpg",
  encuadre: "no-repeat 46% 58% / 108%",
  fundido: true,
  alt: "Mazda CX-30 en Soul Red Crystal",
  // el rojo del Soul Red Crystal, oscurecido para que se lea como texto
  color: "#a3192b",
  ficha: [
    ["Motor", "2.0 microhíbrido (ECO)"],
    ["Año y km", "2023 · unos 45.000 km"],
    ["Consumo", "6,8 l/100 km reales"],
    ["Maletero", "430 l"],
  ],
  ofertas: {
    "cx30-actual:contado": { nombre: "Al contado", sub: "Cuota final de la FlexiOpción", etiqueta: "cuota final" },
    "cx30-actual:prestamo:48": { nombre: "Préstamo a 48 meses", sub: "Banco · estimación", etiqueta: "banco", tin: 5.5 },
    "cx30-actual:prestamo:72:cancelado-48": { nombre: "Préstamo a 72 meses", sub: "Banco · estimación · cancelado en el 48", etiqueta: "banco", tin: 5.5 },
  },
  notaPrecio: "Precio: la cuota final de la FlexiOpción que queda por pagar para quedarse el coche. Hoy vale menos: 18.193 € según la tabla de gastos de Mazda (jul-2026). Sin ayudas.",
  notaFinanciacion: "<strong>Préstamo (estimación):</strong> préstamo personal de un banco por los 21.700 €, sin entrada, con condiciones típicas de mercado (TIN 5,5 % y comisión de apertura del 0,5 % al firmar; comparadores, sep-2026): no es una oferta. El de 72 meses se cancela en el mes 48 con un 1 % de comisión, para cubrir los mismos 4 años. La TAE es calculada.",
  notaEnergia: notaGasolina,
  notaCostes: "Mantenimiento, neumáticos y seguro de la tabla de gastos de Mazda, con un 3 % de inflación al año; el mantenimiento sube con la edad. Seguro a todo riesgo hasta que el coche cumple 7 años, así que todo el periodo. ITV a los 4 y a los 6 años. Garantía supuesta de 6 años o 150.000 km: averías solo el último año (hay que confirmar la real).",
  tituloPie: "A tener en cuenta",
  easyPlan: [
    "La cuota final (21.700 €) es más de lo que vale hoy el coche (18.193 €).",
    "Año y km aproximados: 2023, unos 45.000 km.",
    "Valor a los 4 años: con la pérdida del 17 % al año de la tabla de Mazda.",
    "Préstamo sin entrada: con entrada, los intereses bajan.",
  ],
  fuentes: "Fuentes: cuota final de la FlexiOpción; tabla de gastos de Mazda del concesionario de Bilbao (jul-2026); préstamo con condiciones típicas de mercado (comparadores, sep-2026). Foto: configurador de Mazda (CX-30 Makoto en Soul Red Crystal). Cálculos de pick-my-drive.",
};

/** Lo común a los dos Tesla: los mismos préstamos de la web (docs/research/tesla.md) */
function tesla(o) {
  const origen = { origen: "Web de Tesla", valida: "31-oct" };
  const { id, futuro, lineal, ayuda } = o;
  return {
    marca: "Tesla",
    tamTitulo: "19pt",
    subtitulo: "Formas de pago · 14 de octubre de 2026",
    fundido: true,
    ofertas: {
      [`${id}:contado`]: { nombre: "Contado", ...origen },
      [`${id}:prestamo:lineal-48`]: { nombre: "Lineal a 48 meses", ...origen, tin: lineal.tin, tae: lineal.tae },
      [`${id}:prestamo:lineal-72:cancelado-48`]: { nombre: "Lineal a 72 meses", ...origen, tin: lineal.tin, tae: lineal.tae },
      // la última cuota sustituye a la 48.ª: se pagan la 1.ª, 46 iguales y la última en el mes 48
      [`${id}:cuota_final:futuro-48`]: { nombre: "Tesla Futuro", ...origen, ...futuro, mesUltima: 48 },
    },
    notaCostes: "Seguro a todo riesgo, mantenimiento y neumáticos estimados, con un 3 % de inflación al año. Sin ITV en estos 4 años (es nuevo) y con la bonificación del 95 % del impuesto de circulación de Bilbao para eléctricos. Garantía de 4 años u 80.000 km: sin averías con 60.000 km.",
    notaEnergia: (e) => `${e.km.toLocaleString("es-ES", { useGrouping: "always" })} km al año, todo cargado fuera de casa (${e.kwh.toLocaleString("es-ES")} kWh/100 km reales, a ${e.kwhPublica.toLocaleString("es-ES")} €/kWh), como en los BYD. En los Supercargadores de Tesla sale a 0,28-0,45 €/kWh según la hora; en casa, en horas valle, a unos 0,10. A precios de hoy (Bizkaia, 1-oct-2026).`,
    notaFinanciacion: `<strong>Lineal:</strong> Caixabank Payments & Consumer, sin comisión de apertura, con la entrada que propone la web (${lineal.entrada}). Las cuotas están calculadas con el TIN: la web las redondea al euro. El de 72 meses se cancela en el mes 48 con un 1 % de comisión (no publicada: supuesto), para cubrir los mismos 4 años. <strong>Tesla Futuro:</strong> Open Bank, sin comisión de apertura, 15.000 km al año. Paga la 1.ª cuota (más baja por los días hasta el primer pago) y 46 iguales; la última, en el mes 48, sustituye a la 48.ª. El exceso de km, los daños al devolverlo y la cancelación no están publicados.`,
    // el motor resta la deducción foral del 5 % del precio (base máxima 40.000 €) por comprar un eléctrico nuevo
    notaAyuda: `, menos la ayuda (${ayuda.toLocaleString("es-ES", { useGrouping: "always" })} €) y la deducción del 5 % del IRPF de Bizkaia por eléctrico nuevo (${o.deduccion}, en la renta del año siguiente; no está restada en lo pagado)`,
    tituloPie: "Cómo funciona el Tesla Futuro",
    fuentes: `Fuentes: configurador de Tesla España, 14-oct-2026 (ofertas hasta el 31-oct)${o.fuenteAyuda ?? ""}. Foto: tesla.com. Cálculos de pick-my-drive.`,
    ayuda,
    garantizado: `los ${futuro.ultima.toLocaleString("es-ES", { useGrouping: "always" })} € de la última cuota del Tesla Futuro`,
    ...o.resto,
  };
}

COCHES.model3 = tesla({
  id: "model3-rwd",
  ayuda: 3375,
  deduccion: "1.668 €",
  lineal: { tin: 5.75, tae: 5.9, entrada: "9.250 €" },
  futuro: { tin: 7, tae: 7.25, primera: 319, ultima: 14897 },
  resto: {
    id: "model3-rwd",
    salida: "docs/resumenes/model3-2026-10-14.html",
    titulo: "Model 3 Tracción trasera",
    pestana: "Tesla Model 3: opciones",
    // Foto de estudio de tesla.com, enlazada: hace falta conexión para verla
    foto: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-3-Toggle-Standard-Desktop-APAC.jpg",
    encuadre: "no-repeat 50% 62% / 330%",
    alt: "Tesla Model 3 en Blanco Perla",
    // el rojo de Tesla, oscurecido para que se lea como texto (el coche de la foto es blanco)
    color: "#b8141c",
    ficha: [
      ["Autonomía", "572 km WLTP"],
      ["0-100 km/h", "6,2 s"],
      ["Consumo", "15,5 kWh/100 km reales (est.)"],
      ["Garantía", "4 años · batería 8 años"],
    ],
    notaPrecio: "Precio de compra de la web: 36.990 € + 980 € de destino y documentación − 1.210 € de descuento del Plan Auto+ (el que la ley obliga a hacer al vendedor) − 3.395 € del Tesla Bonus, que solo vale si se entrega antes del 31-mar-2027. Incluye IVA, transporte y matriculación. La ayuda del Plan Auto+ (3.375 €) no va en el precio: la paga el Estado después, por transferencia. Los totales pagados ya la restan; si no se concede, el coche cuesta 3.375 € más.",
    easyPlan: [
      "1.ª cuota de 319 €, 46 de 361 € y la última a los 48 meses.",
      "Al final: devolverlo, quedárselo pagando la última o cambiarlo.",
      "15.000 km al año; también 10.000 (355 €, última de 15.221 €) o 20.000.",
      "Sin comisión de apertura. Entrada propuesta: 7.300 €.",
      "TIN 7,00 %: más caro que el lineal (5,75 %), que bajó el 12-oct.",
      "Última cuota: el 44,6 % del precio.",
    ],
  },
});

COCHES.modely = tesla({
  id: "modely-rwd",
  ayuda: 4050,
  deduccion: "2.000 €, el máximo",
  fuenteAyuda: "; Plan Auto+ del Model Y: autonomiacocheselectricos.es",
  lineal: { tin: 1.99, tae: 2.01, entrada: "9.500 €" },
  futuro: { tin: 1.99, tae: 2.01, primera: 369, ultima: 15912 },
  resto: {
    id: "modely-rwd",
    salida: "docs/resumenes/modely-2026-10-14.html",
    titulo: "Model Y Tracción trasera",
    pestana: "Tesla Model Y: opciones",
    foto: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Toggle-Standard-Desktop-EU.jpg",
    encuadre: "no-repeat 50% 66% / 290%",
    alt: "Tesla Model Y en Blanco Perla",
    // el azul de los botones de Tesla (el coche de la foto es blanco)
    color: "#3e6ae1",
    ficha: [
      ["Autonomía", "525 km WLTP"],
      ["0-100 km/h", "7,2 s"],
      ["Remolque", "1.600 kg"],
      ["Garantía", "4 años · batería 8 años"],
    ],
    notaPrecio: "Precio de compra de la web: 40.990 € + 980 € de destino y documentación − 1.210 € de descuento del Plan Auto+ (el que la ley obliga a hacer al vendedor); sin Tesla Bonus. Incluye IVA, transporte y matriculación. Entrega estimada: ene.-feb. 2027. La ayuda del Plan Auto+ (4.050 €, por estar montado en Alemania; sin confirmar por Tesla) no va en el precio: la paga el Estado después, por transferencia. Los totales pagados ya la restan; si no se concede, el coche cuesta 4.050 € más.",
    easyPlan: [
      "1.ª cuota de 369 €, 46 de 388 € y la última a los 48 meses.",
      "Al final: devolverlo, quedárselo pagando la última o cambiarlo.",
      "15.000 km al año; también 10.000 (380 €, última de 16.310 €) o 20.000.",
      "Sin comisión de apertura. Entrada propuesta: 8.550 €.",
      "TIN 1,99 %, como el lineal: promoción no acumulable, entrega antes del 31-mar-2027.",
      "Última cuota: el 39,0 % del precio.",
    ],
  },
});

/** Las hojas de la plantilla de BMW llevan, además, todo lo de los tres coches sumado */
const COMPARAR_BMW = { focus: "Focus ST", g21: "330i G21", g31: "540i G31" };

COCHES.focus = {
  plantilla: "bmw",
  comparar: COMPARAR_BMW,
  tituloComparar: "el Focus frente a los dos BMW",
  valor: "con la pérdida del 10 % al año supuesta sobre lo que vale hoy, 28.000 €",
  id: "focus-actual",
  salida: "docs/resumenes/focus-st-2026-10-14.html",
  marca: "Ford",
  titulo: "Focus ST Sportbreak",
  tamTitulo: "19pt",
  subtitulo: "Quedármelo · 14 de octubre de 2026",
  pestana: "Ford Focus ST: quedármelo",
  ayuda: 0,
  // Wikimedia Commons, «Ford Focus Turnier ST Mk IV IMG 5412» (CC BY-SA 4.0), enlazada: hace falta conexión para verla
  foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ford_Focus_Turnier_ST_Mk_IV_IMG_5412.jpg/1280px-Ford_Focus_Turnier_ST_Mk_IV_IMG_5412.jpg",
  encuadre: "no-repeat 50% 60% / cover",
  fundido: true,
  alt: "Ford Focus ST Sportbreak negro",
  // el azul del óvalo de Ford (el coche de la foto es negro)
  color: "#133a7c",
  ficha: [
    ["Motor", "2.3 EcoBoost · 280 CV"],
    ["Año y km", "ene-2025 · unos 17.000 km"],
    ["Consumo", "8,5 l/100 km reales"],
    ["Mantenimiento", "incluido hasta ene-2029"],
  ],
  ofertas: {
    "focus-actual:contado": { nombre: "Quedármelo", sub: "Ya es mío · sin pagar nada", etiqueta: "ya es mío", sinPago: true },
  },
  notaPrecio: "Precio: lo que sacaría vendiéndolo hoy, unos 28.000 € (el 75 % de los 37.000 € que costó, a los 20 meses; estimación: hay que tasarlo). Lo ya pagado no cuenta: quedármelo es renunciar a esos 28.000 €. No hay nada que financiar.",
  notaFinanciacion: "<strong>Sin cuotas:</strong> el coche ya es mío. Su coste a 4 años es lo que pierde de valor, más la energía y lo de tenerlo, que van arriba.",
  notaEnergia: notaGasolina,
  notaCostes: "Seguro a todo riesgo los 4 años, neumáticos (Pilot Sport 4S de 19\") y averías estimados, con un 3 % de inflación al año. Mantenimiento incluido hasta enero de 2029: solo cuentan los últimos 21 meses del periodo. ITV a los 4 años e impuesto de circulación de Bilbao. Garantía hasta los 4 años del coche (enero de 2029): averías solo desde entonces, los últimos 21 meses.",
  tituloPie: "A tener en cuenta",
  easyPlan: [
    "Valor de venta estimado: una tasación real puede moverlo mucho.",
    "Garantía y mantenimiento incluidos hasta enero de 2029; después, 21 meses a mi cargo.",
    "Valor a los 4 años: con una pérdida del 10 % al año (supuesto).",
    "Es el más nuevo de los tres: el que menos averías debería dar.",
  ],
  fuentes: "Fuentes: ficha de km77 (CO2 y neumáticos), Spritmonitor y auto motor und sport (consumo); valor de venta y costes estimados. Foto: Wikimedia Commons (CC BY-SA 4.0). Cálculos de pick-my-drive.",
};

/** Lo común a los dos BMW: usados de profesional, al contado o con un préstamo de banco a 72 meses cancelado en el 48 */
function bmw(o) {
  return {
    plantilla: "bmw",
    comparar: COMPARAR_BMW,
    tituloComparar: "el Focus frente a los dos BMW",
    marca: "BMW",
    tamTitulo: "19pt",
    subtitulo: "Formas de pago · 14 de octubre de 2026",
    ayuda: 0,
    fundido: true,
    ofertas: {
      [`${o.id}:contado`]: { nombre: "Al contado", sub: "Usado de profesional · estimación", etiqueta: "estimación" },
      [`${o.id}:prestamo:72:cancelado-48`]: { nombre: "Préstamo a 72 meses", sub: "Banco · estimación · cancelado en el 48", etiqueta: "banco", tin: 5.5 },
      // no va en la tabla: el Focus vendido como entrada y el préstamo solo por la diferencia
      [`${o.id}:prestamo:72:cancelado-48:con-focus`]: { nombre: "Préstamo por la diferencia", etiqueta: "con el Focus", cambio: true, tin: 5.5 },
    },
    notaFinanciacion: `<strong>Préstamo (estimación):</strong> préstamo personal de un banco por todo el precio, sin entrada, con condiciones típicas de mercado (TIN 5,5 % y comisión de apertura del 0,5 % al firmar; comparadores, sep-2026): no es una oferta. Se cancela en el mes 48 con un 1 % de comisión, para cubrir los mismos 4 años que el Focus. La TAE es calculada. Vendiendo el Focus, el préstamo es solo por la diferencia: abajo.`,
    notaEnergia: notaGasolina,
    tituloPie: "A tener en cuenta",
    fuentes: "Fuentes: docs/research/bmw-usados.md (medianas de anuncios en España, oct-2026; consumos de Spritmonitor; CV fiscales del BOE); préstamo con condiciones típicas de mercado (comparadores, sep-2026). Foto: Wikimedia Commons. Cálculos de pick-my-drive.",
    ...o,
  };
}

COCHES.g21 = bmw({
  id: "bmw-330i-g21",
  valor: "con la pérdida del 9 % al año supuesta para este coche",
  salida: "docs/resumenes/bmw-330i-g21-2026-10-14.html",
  titulo: "330i Touring G21",
  pestana: "BMW 330i Touring G21: opciones",
  // Wikimedia Commons, «BMW 330i Touring M Sport (G21) – f 04082025» (CC BY-SA 3.0 de)
  foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/BMW_330i_Touring_M_Sport_%28G21%29_%E2%80%93_f_04082025.jpg/1280px-BMW_330i_Touring_M_Sport_%28G21%29_%E2%80%93_f_04082025.jpg",
  encuadre: "no-repeat 50% 60% / cover",
  alt: "BMW 330i Touring G21 M Sport blanco",
  // el azul de BMW (el coche de la foto es blanco)
  color: "#1c69d4",
  ficha: [
    ["Motor", "2.0 B48 · 258 CV"],
    ["Año y km", "2020 · unos 80.000 km"],
    ["Consumo", "7,3 l/100 km reales"],
    ["Maletero", "500 / 1.510 l"],
  ],
  notaPrecio: "Precio: la mediana de los anuncios de 330i Touring G21 pre-LCI en España (de 30.900 a 33.990 € con 51.000-145.000 km), comprado a un profesional con 12 meses de garantía, sin ITP. Sin ayudas.",
  notaCostes: "Seguro a todo riesgo los 4 años, mantenimiento, neumáticos y averías estimados, con un 3 % de inflación al año; el mantenimiento y las averías suben con la edad. ITV e impuesto de circulación de Bilbao (13,31 CV fiscales). Garantía de 12 meses del vendedor: averías desde el 2.º año.",
  easyPlan: [
    "Año y km de un anuncio típico: el coche concreto puede variar mucho.",
    "B48: motor fiable; el G21 tiene más defectos de ejes que la media en la ITV alemana.",
    "Valor a los 4 años: con una pérdida del 9 % al año (supuesto).",
    "Garantía del vendedor de 12 meses: se puede ampliar pagando.",
  ],
});

COCHES.g31 = bmw({
  id: "bmw-540i-g31",
  valor: "con la pérdida del 10 % al año supuesta para este coche",
  salida: "docs/resumenes/bmw-540i-g31-2026-10-14.html",
  titulo: "540i Touring G31",
  pestana: "BMW 540i Touring G31: opciones",
  // Wikimedia Commons, «BMW 540i xDrive Touring (G31, 2017) (54832938640)» (CC0)
  foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/BMW_540i_xDrive_Touring_%28G31%2C_2017%29_%2854832938640%29.jpg/1280px-BMW_540i_xDrive_Touring_%28G31%2C_2017%29_%2854832938640%29.jpg",
  encuadre: "no-repeat 50% 65% / cover",
  alt: "BMW 540i xDrive Touring G31 gris",
  // el gris del coche de la foto, oscurecido para que se lea como texto y no se confunda con los azules del Focus y el G21
  color: "#4f5a66",
  ficha: [
    ["Motor", "3.0 B58 · 340 CV"],
    ["Año y km", "2019 · unos 85.000 km"],
    ["Consumo", "10,4 l/100 km reales"],
    ["Maletero", "570 / 1.700 l"],
  ],
  notaPrecio: "Precio: lo que proponen los anuncios de 540i Touring G31 pre-LCI en España (de 28.900 a 39.500 € según los km), comprado a un profesional con 12 meses de garantía, sin ITP. Sin ayudas.",
  notaCostes: "Seguro a todo riesgo los 4 años, mantenimiento, neumáticos y averías estimados, con un 3 % de inflación al año; el mantenimiento y las averías suben con la edad. ITV e impuesto de circulación de Bilbao (19,97 CV fiscales). Garantía de 12 meses del vendedor: averías desde el 2.º año.",
  easyPlan: [
    "Año y km de un anuncio típico: el coche concreto puede variar mucho.",
    "B58: motor fiable; el G31 tiene el doble de defectos graves que la media en la ITV alemana.",
    "Valor a los 4 años: con una pérdida del 10 % al año (supuesto).",
    "El que más gasta: 10,4 l/100 km reales, casi 2 más que el Focus.",
  ],
});

/** Cómo se adapta cada plantilla a los resúmenes de 4 años */
const PLANTILLA = {
  "byd-cx30": (comp) => comp,
  // a 4 años como los demás resúmenes y con todo riesgo los 4 años en los tres coches; los dos BMW, al contado o con
  // el préstamo de banco del CX-30 a 72 meses cancelado en el 48, sin entrada o con el Focus vendido como entrada
  bmw: (comp) => {
    const venta = comp.coches.find((c) => c.id === "focus-actual").pvp;
    const prestamo = (cocheId, entrada) => ({
      id: `${cocheId}:prestamo:72:cancelado-48${entrada ? ":con-focus" : ""}`, cocheId, visible: true, proveedor: "banco",
      fuente: `Préstamo de banco ${entrada ? "por lo que falta tras vender el Focus" : "sin entrada"} a 72 meses, cancelado en el 48 con un 1 % de comisión (condiciones típicas de mercado)`,
      condiciones: {
        modalidad: "prestamo", descuento: 0, entrada, tin: 0.055, plazoMeses: 72,
        comisionApertura: 0.005, comisionCancelacion: 0.01, cancelarEnMes: 48,
      },
    });
    return {
      ...comp,
      perfil: { ...comp.perfil, horizonteMeses: 48, aniosTodoRiesgo: 12 },
      escenarios: [
        ...comp.escenarios,
        ...["bmw-330i-g21", "bmw-540i-g31"].flatMap((cocheId) => [
          { id: `${cocheId}:contado`, cocheId, visible: true, condiciones: { modalidad: "contado", descuento: 0 }, fuente: "Al contado" },
          prestamo(cocheId, 0),
          prestamo(cocheId, venta),
        ]),
      ],
    };
  },
};

const elegidos = process.argv[2] ? [process.argv[2]] : Object.keys(COCHES);
for (const k of elegidos) if (!COCHES[k]) throw new Error(`Coche desconocido: ${k} (${Object.keys(COCHES).join(", ")})`);

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const eur = (v, dec = 0) =>
  v === undefined ? "—" : `${v.toLocaleString("es-ES", { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: "always" })} €`;
const datos = {};
try {
  const { comparativaDePlantilla, contexto } = await vite.ssrLoadModule("/src/estado.ts");
  const { simular } = await vite.ssrLoadModule("/src/engine/simulacion.ts");
  const { saldoPendiente } = await vite.ssrLoadModule("/src/engine/finanzas.ts");
  const { energiaPorKm } = await vite.ssrLoadModule("/src/engine/costes.ts");
  // también los coches con los que se compara cada hoja
  const calcular = [...new Set(elegidos.flatMap((k) => [k, ...Object.keys(COCHES[k].comparar ?? {})]))];
  for (const k of calcular) {
  const cfg = COCHES[k];
  const comp = PLANTILLA[cfg.plantilla ?? "byd-cx30"](comparativaDePlantilla(cfg.plantilla ?? "byd-cx30"));
  // todas las opciones son el mismo coche: energía, seguro y mantenimiento son iguales y no cambian la comparación
  // sin coste de oportunidad: el coste neto es solo lo pagado menos lo que vale el coche al final
  const perfil = { ...comp.perfil, costesUsoActivos: false, oportunidadActiva: false };
  const ctx = contexto({ ...comp, perfil });
  let valorFinal;
  const ayuda = cfg.ayuda ?? AYUDA;
  const coche = comp.coches.find((c) => c.id === cfg.id);
  // energía: todo cargado fuera de casa; en los enchufables, el 15 % de los km en eléctrico y el resto con gasolina
  const e = comp.perfil.energia;
  const enchufable = coche.motorizacion === "hibrido_enchufable";
  const porKm = energiaPorKm(
    enchufable ? { ...coche, consumo: { ...coche.consumo, fraccionElectrica: 0.15 } } : coche,
    { ...comp.perfil, energia: { ...e, fraccionCargaCasa: 0 } },
  );
  const energia = { porKm, km: comp.perfil.kmAnuales, litros: coche.consumo.litros100, kwh: coche.consumo.kwh100, gasolina: e.gasolina, kwhPublica: e.kwhPublica };
  const filas = Object.entries(cfg.ofertas).map(([id, o]) => {
    const e = comp.escenarios.find((x) => x.id === id);
    if (!e) throw new Error(`Falta el escenario ${id}`);
    const c = e.condiciones;
    const r = simular(e, coche, ctx);
    const precio = coche.pvp - c.descuento;
    if (c.modalidad === "contado") {
      valorFinal = precio - r.desglose.vehiculo;
      // el coche que ya tengo: no se paga nada, se renuncia a venderlo
      if (o.sinPago)
        return { ...o, precio, primerDia: 0, pagado48: 0, nota48: "ya es tuyo", pagadoQuedar: 0, costeNeto: r.costeNeto[perfil.horizonteMeses] };
      return {
        ...o, precio, primerDia: precio,
        pagado48: precio - ayuda, nota48: "es tuyo",
        pagadoQuedar: precio - ayuda, costeNeto: r.costeNeto[perfil.horizonteMeses],
      };
    }
    if (c.modalidad === "prestamo") {
      // préstamo: si se cancela antes de tiempo, la deuda pendiente más la comisión de cancelación
      const f = r.financiacion;
      const meses = c.cancelarEnMes ?? c.plazoMeses;
      const pendiente = c.cancelarEnMes ? saldoPendiente(f.principal, f.tin, f.cuota, c.cancelarEnMes) : 0;
      const cancelar = pendiente ? pendiente * (1 + c.comisionCancelacion) : undefined;
      const primerDia = c.entrada + (c.comisionFinanciada ? 0 : (precio - c.entrada) * c.comisionApertura);
      return {
        ...o,
        tae: o.tae ?? f.tae * 100,
        precio,
        entrada: c.entrada,
        primerDia,
        cuota: f.cuota,
        plazo: meses,
        deLas: c.cancelarEnMes ? c.plazoMeses : undefined,
        cancelar,
        pagado48: primerDia + f.cuota * meses - ayuda,
        nota48: pendiente ? `debes ${eur(pendiente)}` : "es tuyo",
        pagadoQuedar: primerDia + f.cuota * meses + (cancelar ?? 0) - ayuda,
        costeNeto: r.costeNeto[perfil.horizonteMeses],
      };
    }
    if (o.primera) {
      // Tesla Futuro: sin comisión; la 1.ª cuota distinta, 46 iguales y la última en el mes 48 en lugar de la 48.ª
      const cuota = Math.round(r.financiacion.cuota);
      const hasta48 = c.entrada + o.primera + cuota * (c.plazoMeses - 2) - ayuda;
      return {
        ...o, precio, entrada: c.entrada, primerDia: c.entrada, cuota, plazo: c.plazoMeses - 1,
        pagado48: hasta48, nota48: "si lo devuelves", pagadoQuedar: hasta48 + o.ultima,
        costeNeto: r.costeNeto[perfil.horizonteMeses],
      };
    }
    const web = o.origen === "Web de BYD";
    // en la web el Auto+ ya va descontado de lo financiado: la entrada de la app lo lleva sumado, como la matriculación
    const entrada = web ? c.entrada - AYUDA - MATRICULACION : c.entrada;
    const comision = c.comisionFinanciada ? 0 : (precio - c.entrada) * c.comisionApertura;
    const primerDia = entrada + comision + (web ? MATRICULACION : 0);
    const cuotas = c.cuotaOfertada * c.plazoMeses;
    const neto = web ? 0 : ayuda;
    return {
      ...o,
      precio,
      entrada,
      primerDia,
      cuota: c.cuotaOfertada,
      plazo: c.plazoMeses,
      pagado48: primerDia + cuotas - neto,
      nota48: "si lo devuelves",
      pagadoQuedar: primerDia + cuotas + o.ultima - neto,
      costeNeto: r.costeNeto[perfil.horizonteMeses],
    };
  });
  // costes de tenerlo 4 años: los del contado con los costes de uso activados (iguales en todas las opciones)
  const conUso = simular(comp.escenarios.find((x) => x.id === `${cfg.id}:contado`), coche, contexto({ ...comp, perfil: { ...perfil, costesUsoActivos: true } })).desglose;
  const costes = ["seguro", "mantenimiento", "neumaticos", "itv_ivtm", "averias"].map((c) => conUso[c] ?? 0);
  // el cambio del Focus por este coche va en su propio bloque, no en la tabla
  datos[k] = { cfg, filas: filas.filter((f) => !f.cambio), cambio: filas.find((f) => f.cambio), perfil, valorFinal, energia, costes };
  }
} finally {
  await vite.close();
}

const pct = (v) => `${v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
const concesionario = (f) => f.origen === "Concesionario";
const etiquetaOrigen = (f) => f.etiqueta ?? { Concesionario: "concesionario", "Web de BYD": "web", "Web de Tesla": "web", Estimación: "estimación" }[f.origen];
const procedencia = (f) => f.sub ?? (f.valida ? `${f.origen} · hasta ${f.valida}` : "Estimación");
/** Todo lo de una opción a 4 años: coste neto, energía y tenerlo */
const sumado = (d, f) => f.costeNeto + d.energia.porKm * d.energia.km * 4 + d.costes.reduce((x, y) => x + y, 0);

/** Si vendo el Focus y compro este coche: al contado pagando la diferencia o con un préstamo solo por ella */
function bloqueCambio({ cfg, filas, cambio, energia, costes }) {
  const focus = datos.focus;
  const venta = cambio.entrada;
  const contado = filas.find((f) => !f.cuota);
  const yo = { energia, costes };
  const usoDeMas = sumado(yo, { costeNeto: 0 }) - sumado(focus, { costeNeto: 0 });
  const cols = [
    { nombre: "Pagando la diferencia", bolsillo: contado.precio - venta, total: contado.precio - venta, deMas: sumado(yo, contado) - sumado(focus, focus.filas[0]) },
    {
      nombre: "Préstamo por la diferencia",
      bolsillo: cambio.primerDia - venta,
      cuotas: `${cambio.plazo} × ${eur(cambio.cuota, 2)}<span class="sub">de ${cambio.deLas} cuotas · TIN ${pct(cambio.tin)}</span>`,
      cancelar: cambio.cancelar,
      total: cambio.pagadoQuedar - venta,
      deMas: sumado(yo, cambio) - sumado(focus, focus.filas[0]),
    },
  ];
  const fila = (titulo, celda, clase = "") => `<tr${clase ? ` class="${clase}"` : ""}><th scope="row">${titulo}</th>${cols.map((c) => `<td>${celda(c)}</td>`).join("")}</tr>`;
  const signo = (v) => `${v >= 0 ? "+" : "−"}${eur(Math.abs(v))}`;
  return `
  <h2>Si vendo el Focus y compro este ${cfg.marca}</h2>
  <table class="cambio">
    <thead><tr><th scope="col"></th>${cols.map((c) => `<th scope="col">${c.nombre}</th>`).join("")}</tr></thead>
    <tbody>
      ${fila("Vendo el Focus por", () => eur(venta))}
      ${fila(`Pongo de mi bolsillo el primer día<span class="sub">el ${cfg.titulo.split(" ")[0]} cuesta ${eur(contado.precio)}</span>`, (c) => `${eur(c.bolsillo)}${c.cuotas ? '<span class="sub">comisión de apertura</span>' : ""}`)}
      ${fila("Cuotas", (c) => c.cuotas ?? "—")}
      ${fila("Cancelar en el mes 48", (c) => eur(c.cancelar))}
      ${fila("Pongo en total en 4 años", (c) => eur(c.total))}
      ${fila("Energía y tenerlo, de más que con el Focus", () => signo(usoDeMas))}
      ${fila("Más que quedarme el Focus, a 4 años", (c) => signo(c.deMas), "fuerte")}
      ${fila("Al mes, de media", (c) => signo(c.deMas / 48), "fuerte")}
    </tbody>
  </table>
  <p class="nota">Se vende el Focus por lo que se estima que vale hoy (${eur(venta)}): a un concesionario o como parte del pago suelen dar menos; cada 1.000 € menos son 1.000 € más en las dos columnas. «Más que quedarme el Focus» suma lo que pierde de valor el ${cfg.titulo.split(" ")[0]} frente a lo que perdería el Focus, los intereses y la diferencia de energía y de tenerlo. Pagando la diferencia cuesta lo mismo que «Al contado» de la tabla: el dinero del Focus es dinero igual que el de los ahorros.</p>`;
}

function pagina({ cfg, filas, cambio, perfil, valorFinal, energia, costes }) {
const maximo = Math.ceil(Math.max(...filas.map((f) => f.costeNeto)) / 5000) * 5000;

// todo sumado a 4 años: coste neto, energía y tenerlo, de cada opción de los coches que se comparan
const sumadas = Object.entries(cfg.comparar ?? {}).flatMap(([k, corto]) => {
  const d = datos[k];
  const energia4 = d.energia.porKm * d.energia.km * 4;
  const tenerlo = d.costes.reduce((x, y) => x + y, 0);
  return d.filas.map((f) => ({ etq: `${corto} · ${f.nombre.toLowerCase()}`, propia: d.cfg === cfg, color: d.cfg.color, partes: [f.costeNeto, energia4, tenerlo] }));
});
const maximoSumado = Math.ceil(Math.max(0, ...sumadas.map((f) => f.partes.reduce((x, y) => x + y, 0))) / 5000) * 5000;
const barrasSumadas = sumadas
  .map((f) => {
    const total = f.partes.reduce((x, y) => x + y, 0);
    return `<div class="barra-fila${f.propia ? " propia" : ""}" title="${f.etq}: ${eur(total)}">
      <span class="barra-etq">${f.etq}</span>
      <span class="barra-pista"><span class="pila" style="width:${(total / maximoSumado) * 100}%; --color:${f.color}">${f.partes.map((v, i) => `<span class="trozo t${i}" style="flex:${v}"></span>`).join("")}</span><span class="barra-val">${eur(total)}</span></span>
    </div>`;
  })
  .join("");


const tabla = filas
  .map(
    (f) => `<tr>
      <th scope="row">${f.nombre}<span class="sub">${procedencia(f)}</span></th>
      <td>${eur(f.precio)}</td>
      <td>${eur(f.primerDia)}</td>
      <td>${f.cuota ? `${f.plazo} × ${eur(f.cuota, f.primera ? 0 : 2)}${concesionario(f) ? "*" : ""}${f.deLas ? `<span class="sub">de ${f.deLas} cuotas</span>` : ""}${f.primera ? `<span class="sub">la 1.ª, de ${eur(f.primera)}</span>` : ""}` : "—"}</td>
      <td>${f.ultima ? `${eur(f.ultima)}<span class="sub">mes ${f.mesUltima ?? 49}</span>` : f.cancelar ? `${eur(f.cancelar)}<span class="sub">cancelar, mes 48</span>` : "—"}</td>
      <td>${f.tin ? `${pct(f.tin)}<span class="sub">TAE ${pct(f.tae)}</span>` : "—"}</td>
      <td>${eur(f.pagado48)}<span class="sub">${f.nota48}</span></td>
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

return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${cfg.pestana}</title>
<style>
  @page { size: A4; margin: 0; }
  :root {
    color-scheme: light;
    --tinta: #0b0b0b;
    --tinta-2: #52514e;
    --tinta-3: #7a7974;
    --linea: #e4e3df;
    --portada: #f3f3f3;
    --coche: ${cfg.color};
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
  .foto { background: url("${cfg.foto}") ${cfg.encuadre}; }
  .foto.fundido {
    -webkit-mask-image: linear-gradient(to right, #000 80%, transparent 100%), linear-gradient(to bottom, #000 82%, transparent 100%);
    -webkit-mask-composite: source-in;
    mask-image: linear-gradient(to right, #000 80%, transparent 100%), linear-gradient(to bottom, #000 82%, transparent 100%);
    mask-composite: intersect;
  }
  .titulo { padding: 2mm 13mm 2mm 0; display: flex; flex-direction: column; justify-content: center; gap: 1mm; }
  .marca { font-size: 8pt; letter-spacing: 0.3em; color: var(--coche); font-weight: 700; }
  .titulo h1 { font-size: ${cfg.tamTitulo}; line-height: 1.05; letter-spacing: -0.02em; }
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
  tbody th { font-weight: 600; padding: 0.7mm 0.9mm 0.7mm 0; white-space: nowrap; }
  tbody td { text-align: right; padding: 0.7mm 0.9mm; white-space: nowrap; }
  tbody tr { border-bottom: 0.5pt solid var(--linea); }
  .fuerte { font-weight: 650; }
  .sub { display: block; font-weight: 400; font-size: 6.6pt; color: var(--tinta-3); }
  .nota { font-size: 6.6pt; line-height: 1.3; color: var(--tinta-2); }
  .nota p + p { margin-top: 1mm; }
  .barras { display: grid; gap: 0.2mm; font-size: 7.6pt; }
  .barra-fila { display: grid; grid-template-columns: 66mm 1fr; align-items: center; gap: 3mm; }
  .barra-etq { white-space: nowrap; }
  .barra-etq { text-align: right; color: var(--tinta-2); }
  .barra-pista { display: flex; align-items: center; gap: 2mm; }
  .barra { height: 2.3mm; background: var(--coche); border-radius: 0 4px 4px 0; }
  .barra-val { font-weight: 650; font-variant-numeric: tabular-nums; }${sumadas.length ? `
  .pila { display: flex; height: 2.3mm; border-radius: 0 4px 4px 0; overflow: hidden; }
  .trozo.t0 { background: var(--color); }
  .trozo.t1 { background: color-mix(in srgb, var(--color) 55%, #fff); }
  .trozo.t2 { background: color-mix(in srgb, var(--color) 25%, #fff); }
  .barra-fila:not(.propia) .barra-etq { color: var(--tinta-3); }
  .barra-fila.propia .barra-etq { color: var(--tinta); font-weight: 600; }
  .leyenda { display: flex; gap: 4mm; font-size: 6.8pt; color: var(--tinta-2); }
  table.cambio { width: auto; min-width: 120mm; }
  table.cambio thead th { text-align: right; }
  table.cambio tbody th { font-weight: 400; }
  table.cambio td { min-width: 34mm; }
  table.cambio tr.fuerte th, table.cambio tr.fuerte td { font-weight: 650; color: var(--coche); }
  .leyenda i { display: inline-block; width: 3mm; height: 2.3mm; margin-right: 1mm; vertical-align: -0.3mm; background: var(--coche); }` : ""}
  .energia { display: grid; grid-template-columns: 32mm 1fr; column-gap: 4mm; row-gap: 1.2mm; align-items: center; background: var(--portada); margin: -2.6mm -13mm 0; padding: 2mm 13mm 2.5mm; border-top: 0.5pt solid var(--linea); }
  .energia h2 { line-height: 1.2; }
  .energia .nota { grid-column: 1 / -1; }
  .cifras { display: flex; gap: 5mm; align-items: baseline; }
  .cifras b { display: block; font-size: 11pt; color: var(--coche); font-variant-numeric: tabular-nums; }
  .cifras span { font-size: 6.8pt; color: var(--tinta-2); }
  .cifras .total { padding-left: 5mm; border-left: 0.5pt solid var(--linea); }
  .pie { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; padding-top: 1.5mm; border-top: 0.5pt solid var(--linea); }
  .pie ul { margin: 1mm 0 0; padding-left: 4mm; font-size: 6.8pt; line-height: 1.2; }
  .pie li + li { margin-top: 0.1mm; }
</style>
</head>
<body>
<main class="hoja">
  <header class="portada">
    <div class="foto${cfg.fundido ? " fundido" : ""}" role="img" aria-label="${cfg.alt}"></div>
    <div class="titulo">
      <p class="marca">${cfg.marca ?? "BYD"}</p>
      <h1>${cfg.titulo}</h1>
      <p class="fecha">${cfg.subtitulo ?? "Formas de pago · 13 de octubre de 2026"}</p>
      <dl class="ficha">${cfg.ficha.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
    </div>
  </header>

  <section class="energia">
    <h2>Energía</h2>
    <div class="cifras">
      <div><b>${(energia.porKm * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })}&nbsp;€</b><span>cada 100 km</span></div>
      <div><b>${eur((energia.porKm * energia.km) / 12)}</b><span>al mes</span></div>
      <div><b>${eur(energia.porKm * energia.km)}</b><span>al año</span></div>
      <div class="total"><b>${eur(energia.porKm * energia.km * 4)}</b><span>en 4 años</span></div>
    </div>
    <h2>Tenerlo 4 años</h2>
    <div class="cifras">
      ${["Seguro", "Mantenimiento", "Neumáticos", "ITV e impuesto", "Averías"].map((t, i) => `<div><b>${eur(costes[i])}</b><span>${t}</span></div>`).join("")}
      <div class="total"><b>${eur(costes.reduce((x, y) => x + y, 0))}</b><span>en total</span></div>
    </div>
    <p class="nota"><strong>Energía:</strong> ${cfg.notaEnergia ? cfg.notaEnergia(energia) : `${energia.km.toLocaleString("es-ES", { useGrouping: "always" })} km al año: el 15 % en eléctrico, con todo cargado fuera de casa (${energia.kwh} kWh/100 km a ${energia.kwhPublica.toLocaleString("es-ES")} €/kWh), y el 85 % con gasolina (${energia.litros.toLocaleString("es-ES")} l/100 km reales con la batería vacía, a ${energia.gasolina.toLocaleString("es-ES")} €/l). A precios de hoy (Bizkaia, 1-oct-2026).`} <strong>Tenerlo:</strong> ${cfg.notaCostes} Ni la energía ni estos costes están sumados al coste neto: son iguales en todas las opciones.</p>
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
          <th scope="col">Pagado hasta<br>el mes 48</th>
          <th scope="col">Pagado si te<br>lo quedas</th>
          <th scope="col" class="fuerte">Coste neto<br>a 4 años</th>
        </tr>
      </thead>
      <tbody>${tabla}</tbody>
    </table>
  </div>
  <p class="nota">${cfg.notaPrecio}</p>
  <p class="nota">${cfg.notaFinanciacion ?? `<strong>Lineal (estimación):</strong> financiación lineal de CA Auto Bank, que el concesionario no ha ofrecido todavía. La promoción de BYD pide financiar al menos 15.000 € a 72 meses o más, con 36 de permanencia. Se usan ${cfg.origenLineal}, la comisión del 3,75 % financiada y una cancelación en el mes 48 con un 1 % de comisión, para cubrir los mismos 4 años. La de entrada mínima financia todo menos el 1 %. La TAE es calculada. Falta confirmar el TIN, si hay descuento en lineal y si cancelar obliga a devolverlo.`}</p>

  <h2>Coste neto a 4 años</h2>
  <div class="barras" role="img" aria-label="Coste neto a 4 años de cada opción">${barras}</div>${sumadas.length ? `

  <h2>Todo sumado a 4 años: ${cfg.tituloComparar}</h2>
  <div class="barras" role="img" aria-label="Coste neto, energía y tenerlo, sumados a 4 años, de cada opción de cada coche">${barrasSumadas}</div>
  <p class="leyenda"><span><i></i>Coste neto</span><span><i style="opacity:.6"></i>Energía</span><span><i style="opacity:.3"></i>Tenerlo (seguro, mantenimiento, neumáticos, ITV e impuesto, averías)</span></p>
  <p class="nota">Aquí sí se suman la energía y lo de tenerlo, porque cambian de un coche a otro. Cada coche con su color; en negrita, las opciones de esta hoja. Quedarse el Focus no cuesta dinero el primer día, pero sí lo que deja de valer: renunciar a venderlo hoy.</p>` : ""}${cambio ? bloqueCambio({ cfg, filas, cambio, energia, costes }) : ""}

  <footer class="pie">
    <div>
      <h2>${cfg.tituloPie ?? "Cómo funciona el Easy Plan"}</h2>
      <ul>${cfg.easyPlan.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>
    <div class="nota">
      <p><strong>Coste neto a 4 años:</strong> lo pagado durante 48 meses, menos lo que valdría el coche al final (unos ${eur(Math.round(valorFinal / 100) * 100)}, ${cfg.valor ?? `el ${Math.round((valorFinal / filas[0].precio) * 100)} % del precio: ${cfg.garantizado} más un 12 %, porque las financieras lo fijan algo por debajo de lo que esperan; el mismo criterio en todos los coches`})${cfg.ayuda === 0 ? "" : cfg.notaAyuda ?? ", menos la ayuda"}. No cuenta lo que habría rendido el dinero ni incluye energía, seguro, mantenimiento ni impuestos, que son iguales en todas las opciones. Con ${perfil.kmAnuales.toLocaleString("es-ES", { useGrouping: "always" })} km al año, sin exceso de km.</p>
      <p>${cfg.fuentes}</p>
    </div>
  </footer>
</main>
</body>
</html>
`;
}

mkdirSync("docs/resumenes", { recursive: true });
for (const k of elegidos) {
  const d = datos[k];
  writeFileSync(d.cfg.salida, pagina(d));
  console.log(`Escrito ${d.cfg.salida}`);
  for (const f of [...d.filas, ...(d.cambio ? [d.cambio] : [])]) console.log("  ", f.nombre.padEnd(30), (f.origen ?? f.etiqueta).padEnd(14), Math.round(f.primerDia), Math.round(f.pagado48), Math.round(f.pagadoQuedar), Math.round(f.costeNeto));
}
