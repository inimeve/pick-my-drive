import { cuotaMensual } from "../engine/finanzas";
import type { CocheCandidato, Escenario, OfertaReal } from "../engine/tipos";
import { BANCO, COCHES, contado, cuotaFinal, segunValorGarantizado } from "./coches";

// Plantilla "BYD Atto 2 y Dolphin G frente a mi CX-30": los presupuestos del concesionario de BYD de
// Barakaldo y el Easy Plan de los configuradores de BYD, los dos del 13-oct-2026 (docs/research/ofertas-recibidas.md,
// byd-hibridos.md y financiacion-flexible.md), y quedarme mi CX-30 pagando su cuota final con un préstamo.
// Seguro, mantenimiento, averías y neumáticos son estimaciones; el valor a los 4 años, el garantizado del Easy Plan
// más un 12 % (docs/adr/0003).

const CONCESIONARIO: OfertaReal = { tipo: "presupuesto", origen: "Presupuesto del concesionario de BYD de Barakaldo (13-oct-2026)", hasta: "2026-10-28" };
// CA Auto Bank da siete días a sus simulaciones
const CONCESIONARIO_EASY_PLAN: OfertaReal = { ...CONCESIONARIO, hasta: "2026-10-20" };
const WEB: OfertaReal = { tipo: "web", origen: "Configurador de BYD España (13-oct-2026)", hasta: "2026-10-31" };

/** Matriculación y pre-entrega del concesionario: el configurador no las incluye */
const MATRICULACION = 875;
/** Plan Auto+ de un PHEV. En la web lo adelanta CA Auto Bank y baja lo financiado; en el concesionario lo
 * tramito yo y BYD lo adelanta seis meses sin intereses. Se cuenta aparte, como ayuda */
const AUTO_PLUS = 2250;
const AVISO_AUTO_PLUS =
  "El Plan Auto+ (2.250 €) está pendiente de BOE: si no se aprueba o no me corresponde, el coche cuesta 2.250 € más.";

export const COCHES_BYD_BARAKALDO: CocheCandidato[] = [
  {
    id: "atto2-dmi-boost",
    nombre: "BYD Atto 2 DM-i",
    version: "Boost 212 CV, 18 kWh (90 km eléctricos)",
    estado: "nuevo",
    motorizacion: "hibrido_enchufable",
    // 31.200 − 1.210 de campañas + 875 de matriculación, sin restar el Auto+
    pvp: 30865,
    // el descuento por financiar de la opción B no cambia lo que vale el coche
    valorMercado: 30865,
    co2: 41,
    // 1,5 l de 4 cilindros: se asume el tramo de otros 1,5 l (sin verificar)
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // 5,1 l/100 km en modo híbrido según BYD; una prueba midió 5,6 de media
    consumo: { litros100: 5.4, kwh100: 19, fraccionElectrica: 0.65 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    // valor garantizado del Easy Plan (13.416 €) más el margen: conserva el 48,7 % a los 4 años
    ...segunValorGarantizado(30865, 13416, 0.12),
    mantenimientoAnual: 300,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 720,
    seguroTercerosAnual: 374,
    neumaticosJuego: 520,
    neumaticosVidaKm: 35000,
    ayudas: AUTO_PLUS,
    fuente: `Presupuesto del concesionario de Barakaldo (13-oct-2026): 30.865 € con matriculación y pre-entrega (875 €), igual que el configurador (27.740 € con el Auto+). ${AVISO_AUTO_PLUS} Seguro y consumo real: estimaciones; el valor a los 4 años, el garantizado del Easy Plan más un 12 %.`,
  },
  {
    id: "dolphin-g-comfort",
    nombre: "BYD Dolphin G DM-i",
    version: "Comfort 212 CV, 18,3 kWh (105 km eléctricos)",
    estado: "nuevo",
    motorizacion: "hibrido_enchufable",
    // 29.700 − 1.925 de campañas + 875 de matriculación, sin restar el Auto+
    pvp: 28650,
    // un descuento por financiar no cambia lo que vale el coche
    valorMercado: 28650,
    co2: 32,
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // WLTP con batería agotada 4,5 l/100 km más un ~10%; 65% de km en eléctrico con la batería grande
    consumo: { litros100: 5.0, kwh100: 19, fraccionElectrica: 0.65 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    // valor garantizado del Easy Plan (12.177 €) más el margen: conserva el 47,6 % a los 4 años
    ...segunValorGarantizado(28650, 12177, 0.12),
    mantenimientoAnual: 300,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 640,
    seguroTercerosAnual: 374,
    // 215/50 R18: algo más caros que los del Boost (estimación)
    neumaticosJuego: 560,
    neumaticosVidaKm: 35000,
    ayudas: AUTO_PLUS,
    fuente: `Presupuesto del concesionario de Barakaldo (13-oct-2026): 28.650 € con matriculación y pre-entrega (875 €), igual que el configurador (25.525 € con el Auto+). ${AVISO_AUTO_PLUS} Seguro, neumáticos y consumo real: estimaciones; el valor a los 4 años, el garantizado del Easy Plan más un 12 %.`,
  },
];

const porId = (id: string) => COCHES_BYD_BARAKALDO.find((c) => c.id === id)!;

/** Easy Plan de CA Auto Bank: 48 cuotas y una última, el Valor Mínimo Garantizado, a los 49 meses; 15.000 km al año */
function easyPlan(
  coche: CocheCandidato,
  o: { clave: string; proveedor: string; oferta: OfertaReal; descuento: number; entrada: number; tin: number; cuotaFinal: number; comisionApertura: number; comisionFinanciada?: boolean; cuotaOfertada?: number; fuente: string },
): Escenario {
  const e = cuotaFinal(coche, {
    descuento: o.descuento, entrada: o.entrada, tin: o.tin, plazoMeses: 48, cuotaFinal: o.cuotaFinal,
    comisionApertura: o.comisionApertura, comisionFinanciada: o.comisionFinanciada, cuotaOfertada: o.cuotaOfertada, kmAnualesContrato: 15000, excesoKm: 0.1,
    fuente: `${o.fuente} 15.000 km al año, 0,10 €/km de exceso.`,
  });
  return { ...e, id: `${e.id}:${o.clave}`, ofertaReal: o.oferta, proveedor: o.proveedor };
}

/** Las simulaciones del concesionario financian la comisión de apertura (3,75 %) y un seguro de vida opcional.
 * El seguro no se carga: la cuota está calculada sin él, con las mismas fórmulas que reproducen al céntimo las
 * impresas (la última cuota se paga un mes después de la 48.ª, así que el TIN que se ve es algo distinto) */
function concesionario(
  coche: CocheCandidato,
  o: { clave: string; proveedor: string; descuento: number; entrada: number; tin: number; cuotaFinal: number; cuota: number; detalle: string },
): Escenario {
  return easyPlan(coche, {
    ...o,
    oferta: CONCESIONARIO_EASY_PLAN,
    comisionApertura: 0.0375,
    comisionFinanciada: true,
    cuotaOfertada: o.cuota,
    fuente: `Easy Plan de CA Auto Bank, simulación del concesionario de Barakaldo (13-oct-2026). ${o.detalle} Comisión de apertura del 3,75 % financiada. Sin el seguro de vida opcional que lleva la simulación: cuota de ${o.cuota.toLocaleString("es-ES")} € calculada sin él. ${AVISO_AUTO_PLUS}`,
  });
}

/** Easy Plan del configurador: el precio ya resta el Auto+ que adelanta CA Auto Bank, así que la ayuda y la
 * matriculación se suman a la entrada para llegar a lo financiado; la comisión del 3,99 % se paga al contado.
 * La cuota es la de la web: la última se paga un mes después de la 48.ª, y el cálculo propio sale algo más bajo */
function web(coche: CocheCandidato, o: { clave: string; proveedor: string; entrada: number; cuota: number; cuotaFinal: number; detalle: string }): Escenario {
  return easyPlan(coche, {
    clave: o.clave,
    proveedor: o.proveedor,
    oferta: WEB,
    descuento: 0,
    entrada: o.entrada + AUTO_PLUS + MATRICULACION,
    tin: 0.0699,
    cuotaFinal: o.cuotaFinal,
    comisionApertura: 0.0399,
    cuotaOfertada: o.cuota,
    fuente: `Easy Plan de CA Auto Bank en el configurador de BYD (13-oct-2026, hasta el 31-oct): ${o.detalle} TIN 6,99 %, comisión del 3,99 % al contado. La entrada lleva sumados el adelanto del Plan Auto+ (2.250 €) y la matriculación (875 €), que la web no incluye.`,
  });
}

/** Cuota del Easy Plan: 48 cuotas iguales y la última un mes después de la 48.ª, como en las simulaciones de CA Auto
 * Bank (así se reproducen al céntimo) */
function cuotaEasyPlan(credito: number, tin: number, ultima: number): number {
  const i = tin / 12;
  return Math.round(((credito - ultima / Math.pow(1 + i, 49)) * i) / (1 - Math.pow(1 + i, -48)) * 100) / 100;
}

/** Las opciones A, B y C que el concesionario dio para el Atto 2, adaptadas a otro coche: ESTIMACIÓN. Misma entrada,
 * TIN, descuento y comisión del 3,75 % financiada, sin seguro de vida; la última cuota es el Valor Mínimo Garantizado
 * de la web, que no depende de la entrada */
function concesionarioEstimado(
  coche: CocheCandidato,
  o: { clave: string; descuento: number; entrada: number; tin: number; cuotaFinal: number; detalle: string },
): Escenario {
  const cuota = cuotaEasyPlan((coche.pvp - o.descuento - o.entrada) * 1.0375, o.tin, o.cuotaFinal);
  const e = cuotaFinal(coche, {
    descuento: o.descuento, entrada: o.entrada, tin: o.tin, plazoMeses: 48, cuotaFinal: Math.round(o.cuotaFinal),
    comisionApertura: 0.0375, comisionFinanciada: true, cuotaOfertada: cuota, kmAnualesContrato: 15000, excesoKm: 0.1,
    fuente: `Estimación: el concesionario solo dio el precio al contado de este coche. ${o.detalle} Comisión del 3,75 % financiada, sin seguro de vida; última cuota de ${o.cuotaFinal.toLocaleString("es-ES")} €, la de la web. Cuota calculada: ${cuota.toLocaleString("es-ES")} €. 15.000 km al año, 0,10 €/km de exceso. ${AVISO_AUTO_PLUS}`,
  });
  return { ...e, id: `${e.id}:concesionario-${o.clave}-estimada`, proveedor: `estimación: concesionario, ${o.clave.toUpperCase()}` };
}

/** Financiación lineal de CA Auto Bank en el concesionario: ESTIMACIÓN, no la han ofrecido. La promoción de BYD pide
 * financiar al menos 15.000 € a 72 meses o más, con 36 de permanencia; el TIN y el descuento son los de las
 * opciones A y B del Easy Plan del Atto 2, y la comisión del 3,75 % va financiada como en ellas. Se cancela en el mes 48
 * (1 % de comisión, el máximo legal con más de un año pendiente) para cubrir los mismos 4 años que el Easy Plan */
function lineal(
  coche: CocheCandidato,
  o: { clave: string; proveedor: string; descuento: number; tin: number; minima: boolean; detalle: string },
): Escenario {
  const precio = coche.pvp - o.descuento;
  // entrada mínima: el 1 % del precio, como la del Easy Plan de la web (supuesto)
  const entrada = o.minima ? Math.round(precio * 0.01) : precio - 15000;
  const cuota = Math.round(cuotaMensual((precio - entrada) * 1.0375, o.tin, 72) * 100) / 100;
  // la cuota redondeada al céntimo, como en una oferta
  return {
    id: `${coche.id}:prestamo:lineal-${o.clave}`,
    cocheId: coche.id,
    visible: true,
    proveedor: o.proveedor,
    fuente: `Estimación: financiación lineal de CA Auto Bank, que el concesionario no ha ofrecido todavía. ${o.detalle} Entrada de ${entrada.toLocaleString("es-ES")} €, ${(precio - entrada).toLocaleString("es-ES")} € financiados a 72 meses con la comisión del 3,75 % financiada: cuota de ${cuota.toLocaleString("es-ES")} €. Se cancela en el mes 48 con un 1 % de comisión. Falta confirmar el TIN, si hay descuento por financiar en lineal y si cancelar obliga a devolverlo. ${AVISO_AUTO_PLUS}`,
    condiciones: {
      modalidad: "prestamo", descuento: o.descuento, entrada, tin: o.tin, plazoMeses: 72,
      comisionApertura: 0.0375, comisionFinanciada: true, comisionCancelacion: 0.01, cuotaOfertada: cuota, cancelarEnMes: 48,
    },
  };
}

export function ofertasBydBarakaldo(): Escenario[] {
  const atto = porId("atto2-dmi-boost");
  const dolphin = porId("dolphin-g-comfort");
  return [
    { ...contado(atto), ofertaReal: CONCESIONARIO, proveedor: "concesionario", fuente: `Presupuesto del concesionario de Barakaldo (13-oct-2026, hasta el 28-oct). ${AVISO_AUTO_PLUS}` },
    concesionario(atto, {
      clave: "concesionario-a", proveedor: "concesionario, A: 5,99 %", descuento: 0, entrada: 13000, tin: 0.0599, cuotaFinal: 13416, cuota: 188.4,
      detalle: "Opción A: entrada 13.000 €, TIN 5,99 %, TAE 7,42 %, última cuota 13.415,83 €.",
    }),
    concesionario(atto, {
      clave: "concesionario-b", proveedor: "concesionario, B: −2.000 € al 8,99 %", descuento: 2000, entrada: 13000, tin: 0.0899, cuotaFinal: 13416, cuota: 177.97,
      detalle: "Opción B: 2.000 € menos por financiar (28.865 €), entrada 13.000 €, TIN 8,99 %, TAE 10,69 %, última cuota 13.416,29 €. Si la financiera pone parte del descuento hay una duración mínima: cancelar antes obliga a devolverlo (importe y plazo sin confirmar).",
    }),
    concesionario(atto, {
      clave: "concesionario-c", proveedor: "concesionario, C: entrada 9.250 €", descuento: 0, entrada: 9250, tin: 0.0599, cuotaFinal: 13416, cuota: 279.75,
      detalle: "Opción C: entrada 9.250 €, TIN 5,99 %, TAE 7,51 %, última cuota 13.416,05 €.",
    }),
    web(atto, {
      clave: "web-minima", proveedor: "web de BYD, entrada mínima", entrada: 277, cuota: 415.86, cuotaFinal: 13416,
      detalle: "entrada mínima de 277 €, 48 cuotas de 415,86 € y una última de 13.416,20 €, TAE 8,84 % (6-oct, mismas condiciones el 13-oct).",
    }),
    web(atto, {
      clave: "web-maxima", proveedor: "web de BYD, entrada máxima", entrada: 12482, cuota: 123.66, cuotaFinal: 13416,
      detalle: "entrada máxima (45 %) de 12.482 €, 48 cuotas de 123,66 € y una última de 13.415,81 €, TAE 8,53 %.",
    }),
    lineal(atto, {
      clave: "599", proveedor: "estimación: lineal 5,99 %", descuento: 0, tin: 0.0599, minima: false,
      detalle: "TIN 5,99 % (el de la opción A), sin descuento, financiando el mínimo de 15.000 €.",
    }),
    lineal(atto, {
      clave: "899", proveedor: "estimación: lineal −2.000 € al 8,99 %", descuento: 2000, tin: 0.0899, minima: false,
      detalle: "TIN 8,99 % y 2.000 € de descuento (los de la opción B), financiando el mínimo de 15.000 €.",
    }),
    lineal(atto, {
      clave: "599-minima", proveedor: "estimación: lineal 5,99 %, entrada mínima", descuento: 0, tin: 0.0599, minima: true,
      detalle: "TIN 5,99 % (el de la opción A), sin descuento, con la entrada mínima.",
    }),
    lineal(atto, {
      clave: "899-minima", proveedor: "estimación: lineal −2.000 € al 8,99 %, entrada mínima", descuento: 2000, tin: 0.0899, minima: true,
      detalle: "TIN 8,99 % y 2.000 € de descuento (los de la opción B), con la entrada mínima.",
    }),

    { ...contado(dolphin), ofertaReal: CONCESIONARIO, proveedor: "concesionario", fuente: `Presupuesto del concesionario de Barakaldo (13-oct-2026, hasta el 28-oct). ${AVISO_AUTO_PLUS}` },
    web(dolphin, {
      clave: "web-minima", proveedor: "web de BYD, entrada mínima", entrada: 255, cuota: 385.68, cuotaFinal: 12177,
      detalle: "entrada mínima de 255 € y una última cuota de 12.176,84 € (la misma que con la entrada máxima). Cuota de 385,68 € calculada con la fórmula que reproduce al céntimo las de la web.",
    }),
    web(dolphin, {
      clave: "web-maxima", proveedor: "web de BYD, entrada máxima", entrada: 11486, cuota: 116.79, cuotaFinal: 12177,
      detalle: "entrada máxima (45 %) de 11.486 €, 48 cuotas de 116,79 € y una última de 12.176,84 €, TAE 8,54 %.",
    }),
    concesionarioEstimado(dolphin, {
      clave: "a", descuento: 0, entrada: 13000, tin: 0.0599, cuotaFinal: 12176.84,
      detalle: "Como la opción A del Atto 2: entrada 13.000 €, TIN 5,99 %.",
    }),
    concesionarioEstimado(dolphin, {
      clave: "b", descuento: 2000, entrada: 13000, tin: 0.0899, cuotaFinal: 12176.84,
      detalle: "Como la opción B del Atto 2: 2.000 € menos por financiar, entrada 13.000 €, TIN 8,99 %.",
    }),
    concesionarioEstimado(dolphin, {
      clave: "c", descuento: 0, entrada: 9250, tin: 0.0599, cuotaFinal: 12176.84,
      detalle: "Como la opción C del Atto 2: entrada 9.250 €, TIN 5,99 %.",
    }),
    lineal(dolphin, {
      clave: "599", proveedor: "estimación: lineal 5,99 %", descuento: 0, tin: 0.0599, minima: false,
      detalle: "TIN 5,99 % (el de la opción A del Atto 2), sin descuento, financiando el mínimo de 15.000 €.",
    }),
    lineal(dolphin, {
      clave: "899", proveedor: "estimación: lineal −2.000 € al 8,99 %", descuento: 2000, tin: 0.0899, minima: false,
      detalle: "TIN 8,99 % y 2.000 € de descuento (los de la opción B del Atto 2), financiando el mínimo de 15.000 €.",
    }),
    lineal(dolphin, {
      clave: "599-minima", proveedor: "estimación: lineal 5,99 %, entrada mínima", descuento: 0, tin: 0.0599, minima: true,
      detalle: "TIN 5,99 % (el de la opción A del Atto 2), sin descuento, con la entrada mínima.",
    }),
    lineal(dolphin, {
      clave: "899-minima", proveedor: "estimación: lineal −2.000 € al 8,99 %, entrada mínima", descuento: 2000, tin: 0.0899, minima: true,
      detalle: "TIN 8,99 % y 2.000 € de descuento (los de la opción B del Atto 2), con la entrada mínima.",
    }),
  ];
}

/** Lo que me queda por pagar de la FlexiOpción de mi CX-30: si no lo pago, lo devuelvo */
const CUOTA_FINAL_CX30 = 21700;

/** Mi CX-30 2.0 e-Skyactiv G, quedándomelo: pago la cuota final de la FlexiOpción aunque vale menos.
 * Año y km son los del usado típico de la investigación (coches.md §1b); el valor y los costes, los de la
 * tabla de gastos que dio Mazda */
export function cocheActualCx30(): CocheCandidato {
  const base = COCHES.find((c) => c.id === "cx30-usado")!;
  return {
    ...structuredClone(base),
    id: "cx30-actual",
    nombre: "Mazda CX-30 (el que ya tengo)",
    pvp: CUOTA_FINAL_CX30,
    // Valor de partida de la tabla de Mazda
    valorMercado: 18193,
    depreciacionPrimerAnio: 0.17,
    depreciacionAnual: 0.17,
    mantenimientoAnual: 330,
    // Pastillas y discos, amortiguadores y batería de la tabla, repartidos en 6 años
    averiasAnual: 330,
    seguroTodoRiesgoAnual: 600,
    neumaticosJuego: 800,
    fuente:
      "Quedármelo cuesta la cuota final de la FlexiOpción (21.700 €); devolverlo, nada. Vale menos: 18.193 €, con un 17% de pérdida al año, según la tabla de gastos de Mazda (jul-2026), que también da el mantenimiento (330 €), los neumáticos (800 €) y el seguro (600 €). Año y km (2023, 45.000) son del CX-30 usado típico: ajústalos a los tuyos.",
  };
}

/** Quedarme mi CX-30 pagando la cuota final: al contado o con un préstamo del banco por todo el importe, a 48 meses
 * o a 72 cancelándolo en el mes 48 (para cubrir los mismos 4 años) */
export function cocheActualCx30ConPrestamo(): { coche: CocheCandidato; escenarios: Escenario[] } {
  const coche = cocheActualCx30();
  const prestamo = (plazoMeses: number, cancelarEnMes?: number): Escenario => ({
    id: `${coche.id}:prestamo:${plazoMeses}${cancelarEnMes ? `:cancelado-${cancelarEnMes}` : ""}`,
    cocheId: coche.id,
    visible: true,
    proveedor: "banco",
    fuente: `${BANCO}. Sin entrada: se piden prestados los 21.700 € de la cuota final a ${plazoMeses} meses.${
      cancelarEnMes ? ` En el mes ${cancelarEnMes} se devuelve toda la deuda pendiente, con un 1% de comisión de cancelación (supuesto: los bancos cobran hasta el 1% si quedan más de 12 meses).` : ""
    }`,
    condiciones: {
      modalidad: "prestamo", descuento: 0, entrada: 0, tin: 0.055, plazoMeses,
      comisionApertura: 0.005, comisionCancelacion: 0.01, cancelarEnMes,
    },
  });
  return {
    coche,
    escenarios: [
      {
        id: `${coche.id}:contado`,
        cocheId: coche.id,
        visible: true,
        condiciones: { modalidad: "contado", descuento: 0 },
        fuente: "Pagar la cuota final de la FlexiOpción (21.700 €) de una vez",
      },
      prestamo(48),
      prestamo(72, 48),
    ],
  };
}
