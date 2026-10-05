import type { CocheCandidato, Escenario } from "../engine/tipos";
import { BIPI, EXCESO, contado, cuotaFinal, prestamo, renting, suscripcion } from "./coches";

// Fuente: docs/research/kia-niro.md (consultado 2026-10-05). Los datos salen de resúmenes del
// buscador, no de las webs (bloqueadas): el precio de contado y la financiación son estimaciones.
// Seguro, mantenimiento, averías y duración de neumáticos son los de los otros híbridos de coches.ts.

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
    id: "niro-hev-usado",
    nombre: "Kia Niro",
    version: "1.6 GDi HEV 141 CV 2023, unos 55.000 km",
    estado: "usado",
    pvp: 22000,
    edadInicialMeses: 36,
    kmIniciales: 55000,
    consumo: { litros100: 4.9 },
    depreciacionPrimerAnio: 0.155,
    depreciacionAnual: 0.09,
    fuente:
      "Anuncios de profesionales de 2023: 18.900-26.490 € (oct-2026). Precio y km son una estimación. Comprado a concesionario: sin ITP.",
  },
];

const nuevo = COCHES_KIA[0]!;

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
