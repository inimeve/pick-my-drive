import type { CocheCandidato, Escenario, OfertaReal } from "../engine/tipos";
import { COCHES, EXCESO, contado, cuotaFinal, renting } from "./coches";

// Plantilla "Opción inteligente": un coche por modelo y solo las ofertas sacadas de la investigación
// (docs/research/financiacion-flexible.md, ofertas-recibidas.md, kia-niro.md y byd-hibridos.md). Sin préstamos ni suscripciones
// de condiciones típicas de mercado. Seguro, mantenimiento, averías y neumáticos son estimaciones.

export const COCHES_OPCION_INTELIGENTE: CocheCandidato[] = [
  {
    id: "niro-hev-drive",
    nombre: "Kia Niro",
    version: "HEV 1.6 GDi 138 CV Drive",
    estado: "nuevo",
    motorizacion: "hibrido",
    // Total de la oferta de Kia Renting: tarifa 38.100 − 20% − 13% de Plan de Flotas, con IVA y transporte
    pvp: 25778,
    co2: 103,
    cvFiscales: 11.56,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // WLTP mixto 4,6 más un ~10%
    consumo: { litros100: 5.1 },
    // 7 años o 150.000 km desde la matriculación
    garantiaMeses: 84,
    garantiaKm: 150000,
    depreciacionPrimerAnio: 0.227,
    depreciacionAnual: 0.09,
    mantenimientoAnual: 380,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 650,
    seguroTercerosAnual: 374,
    neumaticosJuego: 450,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente:
      "Oferta de un concesionario de Kia (5-oct-2026): 25.778 € con el Plan de Flotas de Kia Renting (−33% sobre tarifa). Ese plan es para flotas: confirma que un particular puede comprar a ese precio.",
  },
  {
    id: "yaris-cross",
    nombre: "Toyota Yaris Cross",
    version: "Hybrid 130 e-CVT Style",
    estado: "nuevo",
    motorizacion: "hibrido",
    // Contado del configurador de Toyota (6-oct-2026)
    pvp: 28550,
    co2: 105,
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // WLTP 4,7 más un ~10%
    consumo: { litros100: 5.2 },
    // 3 años ampliables con Toyota Relax, aquí 10
    garantiaMeses: 120,
    garantiaKm: 200000,
    depreciacionPrimerAnio: 0.189,
    depreciacionAnual: 0.084,
    mantenimientoAnual: 380,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 620,
    seguroTercerosAnual: 374,
    // 215/50 R18
    neumaticosJuego: 560,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente:
      "Configurador de Toyota España (6-oct-2026, válido hasta el 31-oct): 28.550 € al contado, 27.950 € financiando con Toyota Easy. CV fiscales calculados con 80,5 × 97,6 mm sin verificar.",
  },
  {
    id: "cx30-exclusive",
    nombre: "Mazda CX-30",
    version: "2027 2.5 e-Skyactiv G 140 CV automático Exclusive-line",
    estado: "nuevo",
    motorizacion: "gasolina",
    // Total de la oferta con Flexiopción (33.520 €) más los 1.400 € de la campaña Flexiopción
    pvp: 34920,
    co2: 135,
    cvFiscales: 15.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { litros100: 6.8 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    depreciacionPrimerAnio: 0.155,
    depreciacionAnual: 0.09,
    mantenimientoAnual: 380,
    averiasAnual: 350,
    seguroTodoRiesgoAnual: 700,
    seguroTercerosAnual: 374,
    // 18"
    neumaticosJuego: 700,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente:
      "Oferta de Mazda en Bilbao (27-jul-2026). Contado = 33.520 € con Flexiopción + 1.400 € que se pierden al no financiar (supuesto: los 600 € de fidelización y los 2.000 € adicionales no dependen de financiar). CO₂ del cambio manual: estimación.",
  },
  {
    id: "dolphin-g-boost",
    nombre: "BYD Dolphin G DM-i",
    version: "Boost 212 CV, 18,3 kWh (105 km eléctricos)",
    estado: "nuevo",
    motorizacion: "hibrido_enchufable",
    // Contado del configurador de BYD (24.120 €, ya con el Auto+) más los 2.250 € de la ayuda
    pvp: 26370,
    co2: 32,
    // 1,5 l de 4 cilindros: se asume el tramo de otros 1,5 l (sin verificar)
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // WLTP con batería agotada 4,5 l/100 km más un ~10%; 65% de km en eléctrico con la batería grande
    consumo: { litros100: 5.0, kwh100: 19, fraccionElectrica: 0.65 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    depreciacionPrimerAnio: 0.3,
    depreciacionAnual: 0.12,
    mantenimientoAnual: 300,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 620,
    seguroTercerosAnual: 374,
    neumaticosJuego: 450,
    neumaticosVidaKm: 35000,
    // Plan Auto+ de un PHEV: 2.250 €, que BYD adelanta con la financiación
    ayudas: 2250,
    fuente:
      "Configurador de BYD España (6-oct-2026, hasta el 31-oct): 24.120 € con el Plan Auto+; aquí se suman los 2.250 € de la ayuda, que se cuenta aparte. Depreciación, seguro y consumo real: estimaciones.",
  },
  {
    id: "atto2-dmi-boost",
    nombre: "BYD Atto 2 DM-i",
    version: "Boost 212 CV, 18 kWh (90 km eléctricos)",
    estado: "nuevo",
    motorizacion: "hibrido_enchufable",
    pvp: 29990,
    co2: 41,
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // 5,1 l/100 km en modo híbrido según BYD; una prueba midió 5,6 de media
    consumo: { litros100: 5.4, kwh100: 19, fraccionElectrica: 0.65 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    depreciacionPrimerAnio: 0.28,
    depreciacionAnual: 0.12,
    mantenimientoAnual: 300,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 720,
    seguroTercerosAnual: 374,
    neumaticosJuego: 520,
    neumaticosVidaKm: 35000,
    ayudas: 2250,
    fuente:
      "Configurador de BYD España (6-oct-2026, hasta el 31-oct): 27.740 € con el Plan Auto+; aquí se suman los 2.250 € de la ayuda, que se cuenta aparte. Depreciación, seguro y consumo real: estimaciones.",
  },
];

/** Mi coche actual: un CX-30 2.0 e-Skyactiv G. Año y km son los del usado típico de la investigación
 * (coches.md §1b); el valor y los costes son los de la tabla de gastos que dio Mazda */
export function cocheActualCx30(): CocheCandidato {
  const base = COCHES.find((c) => c.id === "cx30-usado")!;
  return {
    ...structuredClone(base),
    id: "cx30-actual",
    nombre: "Mazda CX-30 (el que ya tengo)",
    // Valor de partida de la tabla de Mazda
    pvp: 18193,
    depreciacionPrimerAnio: 0.17,
    depreciacionAnual: 0.17,
    mantenimientoAnual: 330,
    // Pastillas y discos, amortiguadores y batería de la tabla, repartidos en 6 años
    averiasAnual: 330,
    seguroTodoRiesgoAnual: 600,
    neumaticosJuego: 800,
    fuente:
      "Valor (18.193 €), 17% de pérdida al año, mantenimiento de 330 €, neumáticos de 800 € y seguro de 600 € de la tabla de gastos de Mazda. Año y km (2023, 45.000) son del CX-30 usado típico: ajústalos a los tuyos. Lo ya pagado no cuenta.",
  };
}

/** Mi CX-30: solo se puede seguir con él */
export function cocheActualCx30ConOferta(): { coche: CocheCandidato; escenarios: Escenario[] } {
  const coche = cocheActualCx30();
  return {
    coche,
    escenarios: [
      {
        id: `${coche.id}:contado`,
        cocheId: coche.id,
        visible: true,
        condiciones: { modalidad: "contado", descuento: 0 },
        fuente: "Seguir con el coche: lo que ya pagaste no cuenta, sí lo que sacarías vendiéndolo hoy",
      },
    ],
  };
}

const porId = (id: string) => COCHES_OPCION_INTELIGENTE.find((c) => c.id === id)!;

/** Marca una oferta como sacada de un presupuesto real */
function real(e: Escenario, oferta: OfertaReal): Escenario {
  return { ...e, ofertaReal: oferta };
}

const KIA_ERANDIO: OfertaReal = { origen: "Presupuesto de un concesionario de Kia en Erandio (5-oct-2026)", hasta: "2026-10-31" };
const MAZDA: OfertaReal = { origen: "Presupuesto de un concesionario de Mazda en Bilbao (27-jul-2026)" };
const IDONEO: OfertaReal = { origen: "Propuesta de renting de Idoneo (oct-2026)" };
const TOYOTA_WEB: OfertaReal = { origen: "Configurador de Toyota España (6-oct-2026)", hasta: "2026-10-31" };
const MAZDA_WEB: OfertaReal = { origen: "Calculadora FlexiOpción del configurador de Mazda España (6-oct-2026)", hasta: "2026-10-31" };
const BYD_WEB: OfertaReal = { origen: "Configurador de BYD España (6-oct-2026)", hasta: "2026-10-31" };

const IDONEO_CONDICIONES =
  "Todo incluido (seguro a todo riesgo sin franquicia, mantenimiento, averías, neumáticos, impuestos, ITV y asistencia). Propuesta válida 7 días y sujeta a la aprobación de la financiera. La parte del seguro puede variar cada año según la siniestralidad.";

/** Plan Auto+ que BYD adelanta en la financiación: baja lo financiado, así que se suma a la entrada
 * (la ayuda se cuenta aparte, como ingreso) */
const ADELANTO_AUTO_PLUS = 2250;

const BYD_RENTING =
  "BYD Renting con Arval (configurador de BYD, 6-oct-2026, hasta fin de mes): 60 meses, 15.000 km al año y sin pago inicial. Incluye seguro a todo riesgo, mantenimiento, reparaciones, neumáticos ilimitados, impuestos, ITV y asistencia. Km adicional 0,12 €; el km no recorrido se devuelve a 0,05 €.";

/** Financiación con Valor Mínimo Garantizado de BYD (CA Auto Bank) con la entrada mínima y 15.000 km al año:
 * cuota y última cuota de la calculadora del configurador para cada número de cuotas */
const PLAZOS_BYD = [36, 48, 60] as const;
type PlazoByd = (typeof PLAZOS_BYD)[number];
interface CuotasByd { cuota: string; ultima: number; tae: string }
const DOLPHIN: Record<PlazoByd, CuotasByd> = {
  36: { cuota: "410,66", ultima: 13112.96, tae: "9,23" },
  48: { cuota: "363,45", ultima: 11562.02, tae: "8,84" },
  60: { cuota: "333,66", ultima: 10011.13, tae: "8,61" },
};
const ATTO: Record<PlazoByd, CuotasByd> = {
  36: { cuota: "463,26", ultima: 15443.96, tae: "9,22" },
  48: { cuota: "415,86", ultima: 13416.2, tae: "8,84" },
  60: { cuota: "381,15", ultima: 11700.09, tae: "8,60" },
};

function flexibleByd(coche: CocheCandidato, precio: string, entrada: number, comision: string, plazo: PlazoByd, o: CuotasByd): Escenario {
  const e = cuotaFinal(coche, {
    descuento: 0, entrada: entrada + ADELANTO_AUTO_PLUS, tin: 0.0699, plazoMeses: plazo, cuotaFinal: Math.round(o.ultima),
    comisionApertura: 0.0399, kmAnualesContrato: 15000, excesoKm: 0.1,
    fuente: `Financiación con Valor Mínimo Garantizado de CA Auto Bank con entrada mínima (configurador de BYD, 6-oct-2026, hasta el 31-oct): ${precio} € financiando, entrada ${entrada} €, TIN 6,99%, TAE ${o.tae}%, comisión del 3,99% al contado (${comision} €), ${plazo} cuotas de ${o.cuota} € y última de ${o.ultima.toLocaleString("es-ES", { minimumFractionDigits: 2 })} €, 15.000 km al año. La entrada lleva sumado el adelanto del Plan Auto+ (2.250 €). Exceso de km: 0,10 €/km del presupuesto de abril.`,
  });
  return real({ ...e, id: `${e.id}:${plazo}` }, BYD_WEB);
}

/** Ofertas investigadas de los coches de la plantilla, sin estimaciones de mercado. Las financiaciones
 * flexibles son las de los configuradores de cada marca con la entrada mínima que aceptan */
export function ofertasOpcionInteligente(): Escenario[] {
  const niro = porId("niro-hev-drive");
  const yaris = porId("yaris-cross");
  const cx30 = porId("cx30-exclusive");
  const dolphin = porId("dolphin-g-boost");
  const atto = porId("atto2-dmi-boost");
  return [
    real(contado(niro), KIA_ERANDIO),
    real(renting(niro, {
      cuota: 390, entrada: 0, plazoMeses: 60, kmAnualesContrato: 15000, excesoKm: 0.07,
      fuente: `Idoneo (oct-2026): 390 € con IVA, la unidad de 2026; la de 2027 sale a 419 € y no pide fianza. ${IDONEO_CONDICIONES} Pide fianza, que se devuelve al entregar el coche (importe no publicado). ${EXCESO}: Idoneo da entre 0,03 y 0,10 €/km`,
    }), IDONEO),

    real(contado(yaris), TOYOTA_WEB),
    real(cuotaFinal(yaris, {
      descuento: 600, entrada: 0, tin: 0.0775, plazoMeses: 48, cuotaFinal: 15417, comisionApertura: 0.0299,
      kmAnualesContrato: 25000, excesoKm: 0.1,
      fuente: `Toyota Easy con entrada mínima (configurador, 6-oct-2026, hasta el 31-oct): 27.950 € financiando, entrada 0 €, TIN 7,75%, TAE 9,19%, comisión del 2,99% (financiada en la oferta), 48 cuotas de 426,14 € y VFG de 15.416,78 € a los 49 meses. Km del contrato no publicados: se usan los 25.000 del presupuesto de junio. ${EXCESO}`,
    }), TOYOTA_WEB),

    real(contado(cx30), MAZDA),
    real(cuotaFinal(cx30, {
      descuento: 1950, entrada: 0, tin: 0.0975, plazoMeses: 35, cuotaFinal: 19812, comisionApertura: 0,
      kmAnualesContrato: 20000, excesoKm: 0.08,
      fuente: `FlexiOpción con entrada mínima (calculadora de Mazda, 6-oct-2026, hasta el 31-oct): 32.970 € financiando, entrada 0 €, TIN 9,75%, TAE 10,24%, sin comisión, 36 meses (1 cuota de 711,63 €, 34 de 598,37 € y una última de 19.812,40 €) con 20.000 km al año (máx. 60.000), el tramo siguiente a 10.000. Incluye los tres primeros mantenimientos. Con Openbank. El contado (34.920 €) es el del presupuesto de julio. ${EXCESO}`,
    }), MAZDA_WEB),

    real(contado(dolphin), BYD_WEB),
    ...PLAZOS_BYD.map((p) => flexibleByd(dolphin, "24.120", 241, "952,77", p, DOLPHIN[p])),
    real(renting(dolphin, {
      cuota: 487.8, entrada: 0, plazoMeses: 60, kmAnualesContrato: 15000, excesoKm: 0.12,
      fuente: `${BYD_RENTING} Cuota: 487,80 € con IVA.`,
    }), BYD_WEB),

    real(contado(atto), BYD_WEB),
    ...PLAZOS_BYD.map((p) => flexibleByd(atto, "27.740", 277, "1.095,77", p, ATTO[p])),
    real(renting(atto, {
      cuota: 489.78, entrada: 0, plazoMeses: 60, kmAnualesContrato: 15000, excesoKm: 0.12,
      fuente: `${BYD_RENTING} Cuota: 489,78 € con IVA.`,
    }), BYD_WEB),
  ];
}
