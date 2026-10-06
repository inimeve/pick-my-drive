import type { CocheCandidato, Escenario, OfertaReal } from "../engine/tipos";
import { COCHES, EXCESO, contado, cuotaFinal, renting } from "./coches";

// Plantilla "Opción inteligente". Fuente: docs/research/opcion-inteligente.md, kia-niro.md,
// byd-hibridos.md y ofertas-recibidas.md (consultado 2026-10-06). Un coche por modelo y solo las
// ofertas investigadas: sin condiciones típicas de mercado. Toda financiación va con la entrada
// mínima que permite la financiera. Seguro, mantenimiento, averías y neumáticos son estimaciones.

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

export const COCHES_INTELIGENTE: CocheCandidato[] = [
  {
    id: "niro-hev-drive",
    nombre: "Kia Niro",
    version: "HEV 1.6 GDi 138 CV Drive (Plan de Flotas)",
    estado: "nuevo",
    motorizacion: "hibrido",
    vendedorParticular: false,
    // Total de la oferta de Kia Renting: tarifa 38.100 − 20% − 13% de Plan de Flotas, con IVA y transporte
    pvp: 25778,
    co2: 103,
    cvFiscales: 11.56,
    edadInicialMeses: 0,
    kmIniciales: 0,
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
  {
    ...BYD_PHEV,
    id: "dolphin-g-active",
    nombre: "BYD Dolphin G DM-i",
    version: "Active 176 CV, 7,4 kWh (40 km eléctricos)",
    // Precio al contado de BYD en octubre, antes de la ayuda Auto+ (que se cuenta aparte)
    pvp: 21725,
    co2: 60,
    seguroTodoRiesgoAnual: 600,
    neumaticosJuego: 450,
    // WLTP con batería agotada 4,3 l/100 km más un ~10%
    consumo: { litros100: 4.7, kwh100: 20, fraccionElectrica: 0.4 },
    depreciacionPrimerAnio: 0.3,
    depreciacionAnual: 0.12,
    fuente:
      "BYD España (hasta el 31/10/2026): 21.725 € al contado y 16.675 € financiando con la ayuda Auto+ adelantada (2.250 €) y 2.800 € de descuento por financiar. Depreciación, seguro y consumo real: estimaciones.",
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
    // 5,1 l/100 km en modo híbrido según BYD; una prueba midió 5,6 de media
    consumo: { litros100: 5.4, kwh100: 19, fraccionElectrica: 0.65 },
    depreciacionPrimerAnio: 0.28,
    depreciacionAnual: 0.12,
    fuente:
      "BYD España (hasta el 31/10/2026): contado antes de la ayuda Auto+ de 2.250 €. Depreciación, seguro y consumo real: estimaciones.",
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

const porId = (id: string) => COCHES_INTELIGENTE.find((c) => c.id === id)!;

/** Marca una oferta como sacada de un presupuesto real */
function real(e: Escenario, oferta: OfertaReal): Escenario {
  return { ...e, ofertaReal: oferta };
}

const KIA_ERANDIO: OfertaReal = { origen: "Presupuesto de un concesionario de Kia en Erandio (5-oct-2026)", hasta: "2026-10-31" };
const TOYOTA: OfertaReal = { origen: "Presupuesto de un concesionario de Toyota en Lejona (30-jun-2026)", hasta: "2026-06-30" };
const MAZDA: OfertaReal = { origen: "Presupuesto de un concesionario de Mazda en Bilbao (27-jul-2026)" };
const BYD_BILBAO: OfertaReal = { origen: "Presupuesto de un concesionario de BYD en Bilbao (27-abr-2026)", hasta: "2026-05-12" };
const IDONEO: OfertaReal = { origen: "Propuesta de renting de Idoneo (oct-2026)" };

const ENTRADA_MINIMA = "Entrada mínima: 0 €";

/** Préstamo de BYD con CA Auto Bank: 2.800 € de descuento financiando un mínimo de 15.000 € a 72 meses
 * con 36 de permanencia. Sin entrada se financia el precio entero, por encima de ese mínimo */
function prestamoByd(cocheId: string): Escenario {
  return {
    id: `${cocheId}:prestamo`,
    cocheId,
    visible: true,
    fuente: `BYD con CA Auto Bank (hasta el 31/10/2026): financiar mín. 15.000 € a 72 meses con 36 de permanencia da 2.800 € de descuento. ${ENTRADA_MINIMA} (no hay mínimo de entrada, solo de importe). TIN y comisión no publicados para este préstamo: los del Easy Plan de BYD (6,99%, 3,75%), estimación.`,
    condiciones: {
      modalidad: "prestamo", descuento: 2800, entrada: 0, tin: 0.0699, plazoMeses: 72,
      comisionApertura: 0.0375, comisionCancelacion: 0.01,
    },
  };
}

/** Ofertas investigadas de cada coche, con la financiación flexible (cuota final) a la entrada mínima */
export function ofertasInteligente(): Escenario[] {
  const niro = porId("niro-hev-drive");
  const yaris = porId("yaris-cross");
  const cx30 = porId("cx30-exclusive");
  const dolphin = porId("dolphin-g-active");
  const atto = porId("atto2-dmi-boost");
  return [
    real(contado(niro), KIA_ERANDIO),
    cuotaFinal(niro, {
      descuento: 0, entrada: 0, tin: 0.0795, plazoMeses: 37, cuotaFinal: 16300, comisionApertura: 0.0395,
      kmAnualesContrato: 15000, excesoKm: 0.08,
      fuente: `Kia Flexiplan con Banco Cetelem (oct-2026, hasta el 31/10): la entrada es opcional. ${ENTRADA_MINIMA}. TIN 7,95% y comisión del 3,95% de la oferta de Santander (sep-2026), 37 cuotas y 15.000 km. Valor futuro garantizado estimado: el 63% del precio, como en esa oferta. No se sabe si el precio de flotas admite los descuentos por financiar: se cuentan 0 €. ${EXCESO}`,
    }),
    real(renting(niro, {
      cuota: 390, entrada: 0, plazoMeses: 60, kmAnualesContrato: 15000, excesoKm: 0.07,
      fuente: `Idoneo (oct-2026): 390 € con IVA, la unidad de 2026; la de 2027 sale a 419 € y no pide fianza. Todo incluido (seguro a todo riesgo sin franquicia, mantenimiento, averías, neumáticos, impuestos, ITV y asistencia). Propuesta válida 7 días y sujeta a la aprobación de la financiera. La parte del seguro puede variar cada año según la siniestralidad. Pide fianza, que se devuelve al entregar el coche (importe no publicado). ${EXCESO}: Idoneo da entre 0,03 y 0,10 €/km`,
    }), IDONEO),

    real(contado(yaris), TOYOTA),
    real(cuotaFinal(yaris, {
      descuento: 650, entrada: 0, tin: 0.0775, plazoMeses: 48, cuotaFinal: 15242, comisionApertura: 0.0299,
      kmAnualesContrato: 25000, excesoKm: 0.1,
      fuente: `Toyota Easy: bonificación de 650 €, comisión del 2,99%, 49 cuotas redondeadas a 48 y VFG de 15.241,98 € con 25.000 km al año del presupuesto de Lejona (30-jun-2026, caducado, con 6.000 € de entrada). TIN 7,75% de la campaña de octubre (hasta el 31/10). Toyota no publica entrada mínima ("tú decides cuánto"): se usa 0 €, confírmalo. Sin Toyota Easy Complet (2.195 €). ${EXCESO}`,
    }), TOYOTA),

    real(contado(cx30), MAZDA),
    real(cuotaFinal(cx30, {
      descuento: 1400, entrada: 0, tin: 0.1, plazoMeses: 35, cuotaFinal: 21231, comisionApertura: 0,
      kmAnualesContrato: 10000, excesoKm: 0.08,
      fuente: `Mazda Flexiopción con Santander Consumer (27-jul-2026): 35 cuotas y valor final garantizado de 21.230,64 €, con tres revisiones gratis. ${ENTRADA_MINIMA} (Flexiopción admite no dar entrada; el presupuesto llevaba 10.000 €). TIN ≈10% deducido de la cuota del presupuesto: incluye comisión y servicios, pide la TAE. Km del contrato no publicados: se asumen 10.000. ${EXCESO}`,
    }), MAZDA),

    contado(dolphin),
    prestamoByd(dolphin.id),
    cuotaFinal(dolphin, {
      descuento: 0, entrada: 0, tin: 0.0575, plazoMeses: 36, cuotaFinal: 11100, comisionApertura: 0.0375,
      kmAnualesContrato: 10000, excesoKm: 0.1,
      fuente: `BYD Easy Plan con CA Auto Bank, Dolphin G Active (caducó el 31/07/2026): TIN 5,75%, TAE 7,21%, comisión del 3,75%, 36 cuotas, 10.000 km al año y mínimo de 6.000 € financiados. ${ENTRADA_MINIMA} (la oferta llevaba 5.866,80 €). Su última cuota (12.096 € sobre 23.750 €) se escala al precio de hoy: estimación. Sin el descuento de 2.800 €, que exige 72 meses. 0,10 €/km de exceso del presupuesto de BYD Bilbao.`,
    }),
    renting(dolphin, {
      cuota: 410, entrada: 0, plazoMeses: 60, kmAnualesContrato: 10000, excesoKm: 0.07,
      fuente: `Renting particulares (oct-2026): 339 €/mes sin IVA (410 con IVA); plazo y km sin confirmar. ${EXCESO}`,
    }),

    contado(atto),
    prestamoByd(atto.id),
    real(cuotaFinal(atto, {
      // El presupuesto de abril pedía 31.490 €, 1.500 € más que el precio de octubre
      descuento: -1500, entrada: 0, tin: 0.055, plazoMeses: 48, cuotaFinal: 12792, comisionApertura: 0.0375,
      kmAnualesContrato: 15000, excesoKm: 0.1,
      fuente: `Easy Plan de BYD con CA Auto Bank (27-abr-2026, válida hasta el 12-may: caducada): 31.490 € (1.500 € más que hoy, por eso el descuento negativo), TIN 5,5%, comisión del 3,75%, 48 cuotas, última de 12.792 €, 15.000 km y 0,10 €/km de exceso. ${ENTRADA_MINIMA} (el presupuesto llevaba 5.000 €; el Easy Plan pide solo 6.000 € financiados como mínimo). Sin el seguro de vida opcional.`,
    }), BYD_BILBAO),
    renting(atto, {
      cuota: 450, entrada: 0, plazoMeses: 60, kmAnualesContrato: 10000, excesoKm: 0.07,
      fuente: `Renting particulares (oct-2026): 372 €/mes sin IVA (450 con IVA); plazo y km sin confirmar. ${EXCESO}`,
    }),
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
