import type { CocheCandidato, Escenario } from "../engine/tipos";
import { BIPI, COCHES, EXCESO, contado, cuotaFinal, prestamo, renting, suscripcion } from "./coches";

// Fuente: docs/research/kia-niro.md y byd-hibridos.md (consultado 2026-10-05). Los datos salen de
// resúmenes del buscador, no de las webs: el precio de contado y la financiación del Niro son
// estimaciones. Seguro, mantenimiento, averías y duración de neumáticos son estimaciones.

/** Mismo motor 1.6 GDi híbrido en la generación 2022-2025 y en la 2026 */
const NIRO_HEV = {
  motorizacion: "hibrido",
  co2: 103,
  cvFiscales: 11.56,
  vendedorParticular: false,
  // 7 años o 150.000 km desde la matriculación
  garantiaMeses: 84,
  garantiaKm: 150000,
  mantenimientoAnual: 380,
  averiasAnual: 300,
  seguroTodoRiesgoAnual: 650,
  seguroTercerosAnual: 374,
  neumaticosJuego: 450,
  neumaticosVidaKm: 40000,
  ayudas: 0,
} as const;

/** Costes comunes de los BYD híbridos enchufables: 6 años o 150.000 km de garantía */
const BYD_PHEV = {
  estado: "nuevo",
  motorizacion: "hibrido_enchufable",
  vendedorParticular: false,
  edadInicialMeses: 0,
  kmIniciales: 0,
  // 1,5 l de 4 cilindros: se asume el tramo de otros 1,5 l (sin verificar)
  cvFiscales: 11.2,
  garantiaMeses: 72,
  garantiaKm: 150000,
  mantenimientoAnual: 300,
  averiasAnual: 300,
  seguroTercerosAnual: 374,
  neumaticosVidaKm: 35000,
  // Plan Auto+ de un PHEV: 2.250 €, que BYD adelanta con la financiación
  ayudas: 2250,
} as const;

const FUENTE_DOLPHIN =
  "BYD España (campaña hasta oct-2026). Contado = precio con campañas y Plan Auto+ más los 2.250 € de la ayuda, que se cuenta aparte. Depreciación, seguro y consumo real: estimaciones.";
const FUENTE_ATTO =
  "BYD España (hasta el 31/10/2026): contado antes de la ayuda Auto+ de 2.250 €. Depreciación, seguro y consumo real: estimaciones.";

// Versión con batería pequeña (7,4-7,8 kWh, 40 km eléctricos) y versión con batería grande (18 kWh)
const BATERIA_PEQUENA = { fraccionElectrica: 0.4 } as const;
const BATERIA_GRANDE = { fraccionElectrica: 0.65 } as const;

export const COCHES_KIA: CocheCandidato[] = [
  {
    ...NIRO_HEV,
    id: "niro-hev",
    nombre: "Kia Niro",
    version: "HEV 1.6 GDi 138 CV Concept",
    estado: "nuevo",
    // Tarifa 34.750 − 7.150 de descuento comercial − 1.790 sin explicar (financiando: −1.400 más)
    pvp: 25810,
    edadInicialMeses: 0,
    kmIniciales: 0,
    // WLTP 4,5 más un ~10%
    consumo: { litros100: 5.0 },
    depreciacionPrimerAnio: 0.227,
    depreciacionAnual: 0.09,
    fuente:
      "Kia España (campaña de oct-2026, sin fecha de fin): 24.410 € financiando. El contado, 25.810 €, es una estimación: 1.790 € del descuento no se explican en ninguna fuente.",
  },
  {
    ...BYD_PHEV,
    id: "dolphin-g-active",
    nombre: "BYD Dolphin G DM-i",
    version: "Active 176 CV, 7,4 kWh (40 km eléctricos)",
    pvp: 23750,
    co2: 60,
    seguroTodoRiesgoAnual: 600,
    neumaticosJuego: 450,
    // WLTP con batería agotada 4,3 l/100 km más un ~10%
    consumo: { litros100: 4.7, kwh100: 20, ...BATERIA_PEQUENA },
    depreciacionPrimerAnio: 0.3,
    depreciacionAnual: 0.12,
    fuente: FUENTE_DOLPHIN,
  },
  {
    ...BYD_PHEV,
    id: "dolphin-g-boost",
    nombre: "BYD Dolphin G DM-i",
    version: "Boost 212 CV, 18,3 kWh (105 km eléctricos)",
    pvp: 26426,
    co2: 32,
    seguroTodoRiesgoAnual: 620,
    neumaticosJuego: 450,
    // WLTP con batería agotada 4,5 l/100 km más un ~10%
    consumo: { litros100: 5.0, kwh100: 19, ...BATERIA_GRANDE },
    depreciacionPrimerAnio: 0.3,
    depreciacionAnual: 0.12,
    fuente: FUENTE_DOLPHIN,
  },
  {
    ...BYD_PHEV,
    id: "dolphin-g-comfort",
    nombre: "BYD Dolphin G DM-i",
    version: "Comfort 212 CV, 18,3 kWh, llantas de 18\"",
    pvp: 27896,
    co2: 32,
    seguroTodoRiesgoAnual: 640,
    neumaticosJuego: 600,
    consumo: { litros100: 5.0, kwh100: 19, ...BATERIA_GRANDE },
    depreciacionPrimerAnio: 0.3,
    depreciacionAnual: 0.12,
    fuente: FUENTE_DOLPHIN,
  },
  {
    ...BYD_PHEV,
    id: "dolphin-g-sport",
    nombre: "BYD Dolphin G DM-i",
    version: "Sport 212 CV, 18,3 kWh, llantas de 18\"",
    pvp: 28876,
    co2: 32,
    seguroTodoRiesgoAnual: 650,
    neumaticosJuego: 600,
    consumo: { litros100: 5.0, kwh100: 19, ...BATERIA_GRANDE },
    depreciacionPrimerAnio: 0.3,
    depreciacionAnual: 0.12,
    fuente: FUENTE_DOLPHIN,
  },
  {
    ...BYD_PHEV,
    id: "atto2-dmi-active",
    nombre: "BYD Atto 2 DM-i",
    version: "Active 166 CV, 7,8 kWh (40 km eléctricos)",
    pvp: 25990,
    co2: 69,
    seguroTodoRiesgoAnual: 680,
    neumaticosJuego: 480,
    // 5,1 l/100 km en modo híbrido según BYD; una prueba midió 5,6 de media
    consumo: { litros100: 5.4, kwh100: 20, ...BATERIA_PEQUENA },
    depreciacionPrimerAnio: 0.28,
    depreciacionAnual: 0.12,
    fuente: FUENTE_ATTO,
  },
  {
    ...BYD_PHEV,
    id: "atto2-dmi-boost",
    nombre: "BYD Atto 2 DM-i",
    version: "Boost 212 CV, 18 kWh (90 km eléctricos)",
    pvp: 29990,
    co2: 41,
    seguroTodoRiesgoAnual: 720,
    neumaticosJuego: 520,
    consumo: { litros100: 5.4, kwh100: 19, ...BATERIA_GRANDE },
    depreciacionPrimerAnio: 0.28,
    depreciacionAnual: 0.12,
    fuente: FUENTE_ATTO,
  },
];

/** Mi coche actual: un CX-30 2.0 e-Skyactiv G de 2023. Año y km son los del usado típico de la
 * investigación (coches.md §1b): ajústalos a los tuyos y pon en el precio lo que te darían hoy */
export function cocheActualCx30(): CocheCandidato {
  const base = COCHES.find((c) => c.id === "cx30-usado")!;
  return {
    ...structuredClone(base),
    id: "cx30-actual",
    nombre: "Mazda CX-30 (el que ya tengo)",
    fuente:
      "Datos de un CX-30 2.0 de 2023 con unos 45.000 km (anuncios de profesionales: 21.900-25.000 €). Lo ya pagado no cuenta: el precio es lo que sacarías vendiéndolo hoy. Ajústalo a tu coche.",
  };
}

const porId = (id: string) => COCHES_KIA.find((c) => c.id === id)!;
const nuevo = porId("niro-hev");

/** Ofertas del Niro nuevo: las investigadas y, donde no hay, condiciones típicas de mercado */
export function ofertasKia(): Escenario[] {
  return [
    contado(nuevo),
    prestamo(nuevo),
    cuotaFinal(nuevo, {
      descuento: 1400, entrada: 8100, tin: 0.0795, plazoMeses: 36, cuotaFinal: 16600, comisionApertura: 0.03,
      kmAnualesContrato: 10000, excesoKm: 0.08,
      fuente: `Proporciones de un ejemplo de Kia sin verificar (TIN 7,95%, entrada 31%, cuota final 64%). Comisión y km no publicados. ${EXCESO}`,
    }),
    renting(nuevo, {
      cuota: 351, entrada: 0, plazoMeses: 60, kmAnualesContrato: 10000, excesoKm: 0.07,
      fuente: `Ayvens renting particulares (oct-2026; otro resultado da 362 €). ${EXCESO}`,
    }),
    suscripcion(nuevo, {
      cuota: 575, entrada: 0, plazoMeses: 3, kmAnualesContrato: 9600, excesoKm: 0.12,
      fuente: `${BIPI}. Anuncio sin fecha: puede ser de la generación anterior`,
    }),
  ];
}

/** Financiación de BYD con CA Auto Bank: mínimo 15.000 €, 72 meses y 36 de permanencia, que da
 * 2.800 € de descuento. TIN y comisión no publicados: los del Easy Plan de BYD (BEV) */
function financiacionByd(cocheId: string, entrada: number): Escenario {
  return {
    id: `${cocheId}:prestamo`,
    cocheId,
    visible: true,
    fuente:
      "BYD con CA Auto Bank (hasta el 31/10/2026): financiar mín. 15.000 € a 72 meses con 36 de permanencia da 2.800 € de descuento. TIN y comisión no publicados: se usan los del Easy Plan de BYD (estimación).",
    condiciones: {
      modalidad: "prestamo", descuento: 2800, entrada, tin: 0.0699, plazoMeses: 72,
      comisionApertura: 0.0375, comisionCancelacion: 0.01,
    },
  };
}

function rentingByd(cocheId: string, cuota: number, fuente: string): Escenario {
  return renting(porId(cocheId), { cuota, entrada: 0, plazoMeses: 60, kmAnualesContrato: 10000, excesoKm: 0.07, fuente: `${fuente} ${EXCESO}` });
}

const RENTING_DOLPHIN = "Renting particulares (oct-2026): 339 €/mes sin IVA el Active y 429 € el siguiente, con IVA 410 y 519 €; plazo y km sin confirmar.";
const RENTING_ATTO = "Renting particulares (oct-2026): 344 €/mes sin IVA el Active y 372 € el Boost (450 € con IVA); plazo y km sin confirmar.";
const RENTING_ESTIMADO = "Sin oferta publicada: el del Boost más el 1,4% mensual de la diferencia de precio (estimación).";

/** Ofertas de los BYD híbridos enchufables */
export function ofertasByd(): Escenario[] {
  return [
    contado(porId("dolphin-g-active")),
    financiacionByd("dolphin-g-active", 4000),
    rentingByd("dolphin-g-active", 410, RENTING_DOLPHIN),

    contado(porId("dolphin-g-boost")),
    financiacionByd("dolphin-g-boost", 5500),
    rentingByd("dolphin-g-boost", 519, RENTING_DOLPHIN),

    contado(porId("dolphin-g-comfort")),
    financiacionByd("dolphin-g-comfort", 6000),
    rentingByd("dolphin-g-comfort", 540, RENTING_ESTIMADO),

    contado(porId("dolphin-g-sport")),
    financiacionByd("dolphin-g-sport", 6000),
    rentingByd("dolphin-g-sport", 553, RENTING_ESTIMADO),

    contado(porId("atto2-dmi-active")),
    financiacionByd("atto2-dmi-active", 4500),
    rentingByd("atto2-dmi-active", 416, RENTING_ATTO),

    contado(porId("atto2-dmi-boost")),
    financiacionByd("atto2-dmi-boost", 6500),
    rentingByd("atto2-dmi-boost", 450, RENTING_ATTO),
  ];
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
