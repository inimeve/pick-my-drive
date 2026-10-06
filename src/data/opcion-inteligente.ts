import type { CocheCandidato, Escenario, OfertaReal } from "../engine/tipos";
import { BIPI, COCHES, EXCESO, OFERTAS, contado, cuotaFinal, prestamo, renting, suscripcion } from "./coches";

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

const CX30_CENTRE_LINE = COCHES.find((c) => c.id === "cx30")!;

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
    ...NIRO_HEV,
    id: "niro-hev-drive",
    nombre: "Kia Niro",
    version: "HEV 1.6 GDi 138 CV Drive (Plan de Flotas)",
    estado: "nuevo",
    // Total de la oferta de Kia Renting: tarifa 38.100 − 20% − 13% de Plan de Flotas, con IVA y transporte
    pvp: 25778,
    edadInicialMeses: 0,
    kmIniciales: 0,
    // WLTP mixto 4,6 más un ~10%
    consumo: { litros100: 5.1 },
    depreciacionPrimerAnio: 0.227,
    depreciacionAnual: 0.09,
    fuente:
      "Oferta de un concesionario de Kia (5-oct-2026): 25.778 € con el Plan de Flotas de Kia Renting (−33% sobre tarifa). Ese plan es para flotas: confirma que un particular puede comprar a ese precio.",
  },
  {
    ...NIRO_HEV,
    id: "niro-hev-emotion",
    nombre: "Kia Niro",
    version: "HEV 1.6 GDi 138 CV Emotion",
    estado: "nuevo",
    // Precio al contado de la simulación de Kia Finance: incluye transporte, 990 € de pre-entrega y 3 años de mantenimiento
    pvp: 35592,
    edadInicialMeses: 0,
    kmIniciales: 0,
    co2: 114,
    // WLTP mixto 5,0 más un ~10%
    consumo: { litros100: 5.5 },
    // Kia Maintenance: 3 años o 45.000 km
    mantenimientoIncluidoMeses: 36,
    // Neumáticos 225/45 R18
    neumaticosJuego: 650,
    depreciacionPrimerAnio: 0.227,
    depreciacionAnual: 0.09,
    fuente:
      "Oferta de un concesionario de Kia en Santander (24-sep-2026, válida hasta fin de mes: caducada). Contado 35.591,67 € sin las promociones por financiar (−2.117,50 € con IVA). Incluye 3 años de mantenimiento.",
  },
  {
    estado: "nuevo",
    motorizacion: "hibrido",
    vendedorParticular: false,
    id: "yaris-cross",
    nombre: "Toyota Yaris Cross",
    version: "Hybrid 130 e-CVT Style",
    pvp: 28189,
    co2: 105,
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    // WLTP 4,7 más un ~10%
    consumo: { litros100: 5.2 },
    // Como el C-HR de coches.ts: 3 años ampliables con Toyota Relax, aquí 10
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
      "Oferta de Toyota (Lejona, 30-jun-2026, válida hasta fin de mes: caducada). Precio sin la bonificación de Toyota Financial Services (650 €) ni los servicios (2.195 €). CV fiscales calculados con 80,5 × 97,6 mm sin verificar.",
  },
  {
    estado: "nuevo",
    motorizacion: "gasolina",
    vendedorParticular: false,
    id: "cx30-exclusive",
    nombre: "Mazda CX-30",
    version: "2027 2.5 e-Skyactiv G 140 CV automático Exclusive-line",
    // Total de la oferta con Flexiopción (33.520 €) más los 1.400 € de la campaña Flexiopción
    pvp: 34920,
    co2: 135,
    cvFiscales: 15.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
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
  CX30_CENTRE_LINE,
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

const porId = (id: string) => COCHES_KIA.find((c) => c.id === id)!;
const nuevo = porId("niro-hev");

/** Marca una oferta como sacada de un presupuesto real */
function real(e: Escenario, oferta: OfertaReal): Escenario {
  return { ...e, ofertaReal: oferta };
}

const KIA_SANTANDER: OfertaReal = { origen: "Presupuesto de un concesionario de Kia en Santander (24-sep-2026)", hasta: "2026-09-30" };
const KIA_ERANDIO: OfertaReal = { origen: "Presupuesto de un concesionario de Kia en Erandio (5-oct-2026)", hasta: "2026-10-31" };
const TOYOTA: OfertaReal = { origen: "Presupuesto de un concesionario de Toyota en Lejona (30-jun-2026)", hasta: "2026-06-30" };
const MAZDA: OfertaReal = { origen: "Presupuesto de un concesionario de Mazda en Bilbao (27-jul-2026)" };
const IDONEO: OfertaReal = { origen: "Propuesta de renting de Idoneo (oct-2026)" };

const drive = () => porId("niro-hev-drive");
const emotion = () => porId("niro-hev-emotion");

/** Ofertas concretas de concesionarios de Kia (sep y oct de 2026) */
function ofertasNiroRecibidas(): Escenario[] {
  return [
    real(contado(drive()), KIA_ERANDIO),
    prestamo(drive()),
    real(renting(drive(), {
      cuota: 390, entrada: 0, plazoMeses: 60, kmAnualesContrato: 15000, excesoKm: 0.07,
      fuente: `Idoneo (oct-2026): 390 € con IVA, la unidad de 2026; la de 2027 sale a 419 € y no pide fianza. Todo incluido (seguro a todo riesgo sin franquicia, mantenimiento, averías, neumáticos, impuestos, ITV y asistencia). Propuesta válida 7 días y sujeta a la aprobación de la financiera. La parte del seguro puede variar cada año según la siniestralidad. Pide fianza, que se devuelve al entregar el coche (importe no publicado). ${EXCESO}: Idoneo da entre 0,03 y 0,10 €/km`,
    }), IDONEO),

    real(contado(emotion()), KIA_SANTANDER),
    real({
      id: `${emotion().id}:prestamo`,
      cocheId: emotion().id,
      visible: true,
      fuente:
        "Kia Finance con Banco Cetelem, 60 meses (24-sep-2026, caducada): 800 € + IVA de descuento por financiar, TIN 7,95%, comisión del 3,95% y entrada del 20%. Sin el seguro opcional de pagos (1.559 €), que la cuota impresa (611,80 €) sí incluye.",
      condiciones: {
        modalidad: "prestamo", descuento: 968, entrada: 6925, tin: 0.0795, plazoMeses: 60,
        comisionApertura: 0.0395, comisionCancelacion: 0.01,
      },
    }, KIA_SANTANDER),
    real(cuotaFinal(emotion(), {
      descuento: 2117.5, entrada: 6695, tin: 0.0795, plazoMeses: 37, cuotaFinal: 21187, comisionApertura: 0.0395,
      kmAnualesContrato: 15000, excesoKm: 0.08,
      fuente: `Flexiplan de Kia con Banco Cetelem (24-sep-2026, caducada): 3 promociones por financiar (2.117,50 € con IVA), entrada del 20%, TIN 7,95%, 37 cuotas, valor futuro garantizado de 21.186,77 € y 15.000 km al año. Sin el seguro opcional de pagos (822 €), que la cuota impresa (374,86 €) sí incluye. ${EXCESO}`,
    }), KIA_SANTANDER),
  ];
}

/** Ofertas del Niro nuevo: las investigadas y, donde no hay, condiciones típicas de mercado */
export function ofertasKia(): Escenario[] {
  return [
    ...ofertasNiroRecibidas(),
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
    real(cuotaFinal(porId("atto2-dmi-boost"), {
      // El presupuesto de abril pedía 31.490 €, 1.500 € más que el precio de octubre
      descuento: -1500, entrada: 5000, tin: 0.055, plazoMeses: 48, cuotaFinal: 12792, comisionApertura: 0.0375,
      kmAnualesContrato: 15000, excesoKm: 0.1,
      fuente:
        "Easy Plan de BYD con CA Auto Bank (27-abr-2026, válida hasta el 12-may: caducada): 31.490 € (1.500 € más que hoy, por eso el descuento negativo), entrada 5.000 €, TIN 5,5%, comisión del 3,75%, 48 cuotas, última de 12.792 €, 15.000 km y 0,10 €/km de exceso. Sin el seguro de vida opcional (1.212 €), que la cuota impresa (430,63 €) sí incluye.",
    }), { origen: "Presupuesto de un concesionario de BYD en Bilbao (27-abr-2026)", hasta: "2026-05-12" }),
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

/** Ofertas de Toyota y Mazda */
export function ofertasToyotaMazda(): Escenario[] {
  const yaris = porId("yaris-cross");
  const exclusive = porId("cx30-exclusive");
  const centreLine = porId("cx30");
  return [
    real(contado(yaris), TOYOTA),
    prestamo(yaris),
    real(cuotaFinal(yaris, {
      descuento: 650, entrada: 6000, tin: 0.075, plazoMeses: 48, cuotaFinal: 15242, comisionApertura: 0.0299,
      kmAnualesContrato: 25000, excesoKm: 0.1,
      fuente: `Toyota Easy (30-jun-2026, caducada): entrada de 6.000 €, bonificación de 650 €, TIN 7,5%, 49 cuotas redondeadas a 48 y VFG de 15.241,98 €, con 25.000 km al año. Sin Toyota Easy Complet (2.195 € de mantenimiento, ampliación de garantía y seguro): la cuota impresa (319,44 €) lo incluye. ${EXCESO}`,
    }), TOYOTA),

    real(contado(exclusive), MAZDA),
    prestamo(exclusive),
    real(cuotaFinal(exclusive, {
      descuento: 1400, entrada: 10000, tin: 0.1, plazoMeses: 35, cuotaFinal: 21231, comisionApertura: 0,
      cuotaOfertada: 257.54, kmAnualesContrato: 10000, excesoKm: 0.08,
      fuente: `Mazda Flexiopción (27-jul-2026): entrada de 10.000 €, 35 cuotas de 257,54 € y valor final garantizado de 21.230,64 €, con tres revisiones gratis. El TIN sale de la cuota (≈10%) e incluye cualquier comisión o servicio que lleve dentro: pide la TAE. Km del contrato no publicados: se asumen 10.000. ${EXCESO}`,
    }), MAZDA),

    // El Centre-Line se compara con su renting de Idoneo; el resto, como en coches.ts
    ...OFERTAS.filter((e) => e.cocheId === centreLine.id && e.condiciones.modalidad !== "renting"),
    real(renting(centreLine, {
      cuota: 402, entrada: 0, plazoMeses: 36, kmAnualesContrato: 15000, excesoKm: 0.07,
      fuente: `Idoneo (oct-2026): CX-30 Centre-Line de 2025, 402 € con IVA. Todo incluido (seguro a todo riesgo sin franquicia, mantenimiento, averías, neumáticos, impuestos, ITV y asistencia). Propuesta válida 7 días y sujeta a la aprobación de la financiera. La parte del seguro puede variar cada año según la siniestralidad. Pide fianza, que se devuelve al entregar el coche (importe no publicado). ${EXCESO}: Idoneo da entre 0,03 y 0,10 €/km`,
    }), IDONEO),
  ];
}
