import type { CocheCandidato, Escenario, Inclusiones } from "../engine/tipos";
import { TODO_INCLUIDO } from "./ofertas";

// Fuente: docs/research/coches.md y fiscalidad-y-finanzas.md (consultado 2026-10-01).
// El consumo real es el WLTP más un ~10% (y un ~10% de pérdidas de carga en eléctricos).
// La depreciación se ajusta a los valores residuales estimados a 3 y 5 años de coches.md §7.3.

/** Ajusta la curva de depreciación a los valores retenidos a 3 y 5 años */
function curva(a3: number, a5: number) {
  const anual = 1 - Math.sqrt(a5 / a3);
  const primerAnio = 1 - a3 / Math.pow(1 - anual, 2);
  return {
    depreciacionPrimerAnio: Math.round(primerAnio * 1000) / 1000,
    depreciacionAnual: Math.round(anual * 1000) / 1000,
  };
}

const SIN_LIMITE_KM = 999999;

export const COCHES: CocheCandidato[] = [
  {
    id: "cx30",
    nombre: "Mazda CX-30",
    version: "2.5 e-Skyactiv G 140 CV Centre-Line",
    estado: "nuevo",
    motorizacion: "gasolina",
    pvp: 29020,
    co2: 135,
    cvFiscales: 15.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { litros100: 6.6 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    ...curva(0.7, 0.58),
    mantenimientoAnual: 380,
    averiasAnual: 350,
    seguroTodoRiesgoAnual: 650,
    seguroTercerosAnual: 374,
    neumaticosJuego: 630,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente: "Mazda España (precio contado con descuentos oficiales, sep-2026). Microhíbrido: cuenta como gasolina, sin bonificación de IVTM.",
  },
  {
    id: "cx30-usado",
    nombre: "Mazda CX-30",
    version: "2.0 e-Skyactiv G 2023, unos 45.000 km",
    estado: "usado",
    motorizacion: "gasolina",
    pvp: 23500,
    co2: 135,
    cvFiscales: 13.3,
    edadInicialMeses: 36,
    kmIniciales: 45000,
    vendedorParticular: false,
    consumo: { litros100: 6.8 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    depreciacionPrimerAnio: 0.155,
    depreciacionAnual: 0.09,
    mantenimientoAnual: 400,
    averiasAnual: 350,
    seguroTodoRiesgoAnual: 560,
    seguroTercerosAnual: 374,
    neumaticosJuego: 630,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente: "Anuncios de profesionales en coches.net y similares: 21.900-25.000 € (sep-2026). Comprado a concesionario: sin ITP.",
  },
  {
    id: "atto2",
    nombre: "BYD Atto 2",
    version: "Comfort 64,8 kWh 204 CV",
    estado: "nuevo",
    motorizacion: "electrico",
    pvp: 32500,
    co2: 0,
    cvFiscales: 11.5,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { kwh100: 20.5 },
    garantiaMeses: 72,
    garantiaKm: 150000,
    ...curva(0.45, 0.32),
    mantenimientoAnual: 220,
    averiasAnual: 200,
    seguroTodoRiesgoAnual: 720,
    seguroTercerosAnual: 400,
    neumaticosJuego: 520,
    neumaticosVidaKm: 30000,
    ayudas: 3375,
    fuente: "BYD España: 31.740 € sin transporte; se suman ~760 € de transporte (estimación). Auto+: 3.375 € (eléctrico, menos de 35.000 € sin impuestos, fabricado fuera de la UE).",
  },
  {
    id: "model3",
    nombre: "Tesla Model 3",
    version: "Tracción trasera (Standard)",
    estado: "nuevo",
    motorizacion: "electrico",
    pvp: 37970,
    co2: 0,
    cvFiscales: 13,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { kwh100: 16 },
    garantiaMeses: 48,
    garantiaKm: 80000,
    ...curva(0.6, 0.45),
    mantenimientoAnual: 200,
    averiasAnual: 220,
    seguroTodoRiesgoAnual: 850,
    seguroTercerosAnual: 430,
    neumaticosJuego: 680,
    neumaticosVidaKm: 30000,
    ayudas: 3375,
    fuente: "Tesla España, precio con destino (el bonus que lo dejaba en 33.365 € caducó el 30/09/2026). Auto+: 3.375 €.",
  },
  {
    id: "model3-usado",
    nombre: "Tesla Model 3",
    version: "Tracción trasera 2023, unos 50.000 km",
    estado: "usado",
    motorizacion: "electrico",
    pvp: 31500,
    co2: 0,
    cvFiscales: 13,
    edadInicialMeses: 36,
    kmIniciales: 50000,
    vendedorParticular: false,
    consumo: { kwh100: 16.5 },
    garantiaMeses: 48,
    garantiaKm: 80000,
    depreciacionPrimerAnio: 0.2,
    depreciacionAnual: 0.134,
    mantenimientoAnual: 220,
    averiasAnual: 250,
    seguroTodoRiesgoAnual: 760,
    seguroTercerosAnual: 430,
    neumaticosJuego: 680,
    neumaticosVidaKm: 30000,
    ayudas: 0,
    fuente: "Anuncios de profesionales: 28.400-34.000 € (sep-2026). Sin Auto+ (solo para coches matriculados desde 2025).",
  },
  {
    id: "formentor",
    nombre: "Cupra Formentor",
    version: "1.5 eTSI 150 CV DSG",
    estado: "nuevo",
    motorizacion: "gasolina",
    pvp: 35392,
    co2: 135,
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { litros100: 6.6 },
    garantiaMeses: 36,
    garantiaKm: SIN_LIMITE_KM,
    ...curva(0.62, 0.5),
    mantenimientoAnual: 380,
    averiasAnual: 350,
    seguroTodoRiesgoAnual: 700,
    seguroTercerosAnual: 374,
    neumaticosJuego: 750,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente: "Cupra España (sep-2026). Microhíbrido con etiqueta ECO: cuenta como gasolina, sin bonificación de IVTM. CO₂ estimado.",
  },
  {
    id: "formentor-phev",
    nombre: "Cupra Formentor e-Hybrid",
    version: "e-Hybrid 204 CV, 19,7 kWh",
    estado: "nuevo",
    motorizacion: "hibrido_enchufable",
    pvp: 40836,
    co2: 35,
    cvFiscales: 11.2,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { litros100: 6.0, kwh100: 19.5, fraccionElectrica: 0.6 },
    garantiaMeses: 36,
    garantiaKm: SIN_LIMITE_KM,
    ...curva(0.59, 0.45),
    mantenimientoAnual: 400,
    averiasAnual: 400,
    seguroTodoRiesgoAnual: 760,
    seguroTercerosAnual: 400,
    neumaticosJuego: 750,
    neumaticosVidaKm: 35000,
    ayudas: 3375,
    fuente: "Cupra España, versión Beyond Core (sep-2026). Auto+: 3.375 € (la financiación de Cupra la descuenta en el mes 12). El 60% de km en eléctrico supone cargar en casa casi a diario.",
  },
  {
    id: "chr",
    nombre: "Toyota C-HR",
    version: "140H Advance",
    estado: "nuevo",
    motorizacion: "hibrido",
    pvp: 31725,
    co2: 108,
    cvFiscales: 12.5,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { litros100: 5.3 },
    garantiaMeses: 120,
    garantiaKm: 200000,
    ...curva(0.68, 0.57),
    mantenimientoAnual: 380,
    averiasAnual: 300,
    seguroTodoRiesgoAnual: 650,
    seguroTercerosAnual: 374,
    neumaticosJuego: 640,
    neumaticosVidaKm: 40000,
    ayudas: 0,
    fuente: "Toyota España (oferta hasta el 31/10/2026). Garantía de 3 años ampliable con Toyota Relax hasta 15 años si haces las revisiones en la red oficial; aquí se asumen 10 años.",
  },
];

const BANCO = "Préstamo bancario típico: TIN 5,5%, comisión de apertura 0,5% (comparadores, sep-2026)";
const SIN_INCLUIR_NEUMATICOS: Inclusiones = { ...TODO_INCLUIDO, neumaticos: false };

export function prestamo(coche: CocheCandidato): Escenario {
  return {
    id: `${coche.id}:prestamo`,
    cocheId: coche.id,
    visible: true,
    fuente: BANCO,
    condiciones: {
      modalidad: "prestamo",
      descuento: 0,
      entrada: Math.round((coche.pvp * 0.2) / 500) * 500,
      tin: 0.055,
      plazoMeses: 60,
      comisionApertura: 0.005,
      comisionCancelacion: 0.01,
    },
  };
}

export function contado(coche: CocheCandidato): Escenario {
  return { id: `${coche.id}:contado`, cocheId: coche.id, visible: true, condiciones: { modalidad: "contado", descuento: 0 } };
}

interface CuotaFinal {
  descuento: number;
  entrada: number;
  tin: number;
  plazoMeses: number;
  cuotaFinal: number;
  comisionApertura: number;
  kmAnualesContrato: number;
  excesoKm: number;
  /** Cuota mensual de la oferta, si se conoce: el TIN se deduce de ella */
  cuotaOfertada?: number;
  fuente: string;
}

export function cuotaFinal(coche: CocheCandidato, o: CuotaFinal): Escenario {
  const { fuente, ...c } = o;
  return {
    id: `${coche.id}:cuota_final`,
    cocheId: coche.id,
    visible: true,
    fuente,
    condiciones: { modalidad: "cuota_final", ...c, comisionCancelacion: 0.01, daniosDevolucion: 300, salida: "devolver" },
  };
}

interface Uso {
  cuota: number;
  entrada: number;
  plazoMeses: number;
  kmAnualesContrato: number;
  excesoKm: number;
  incluye?: Inclusiones;
  fuente: string;
}

export function renting(coche: CocheCandidato, o: Uso): Escenario {
  const { fuente, incluye = TODO_INCLUIDO, ...c } = o;
  return {
    id: `${coche.id}:renting`,
    cocheId: coche.id,
    visible: true,
    fuente,
    condiciones: { modalidad: "renting", ...c, daniosDevolucion: 300, penalizacionCancelacion: 0.5, incluye: { ...incluye } },
  };
}

export function suscripcion(coche: CocheCandidato, o: Uso): Escenario {
  const { fuente, incluye = TODO_INCLUIDO, ...c } = o;
  return {
    id: `${coche.id}:suscripcion`,
    cocheId: coche.id,
    visible: true,
    fuente,
    condiciones: { modalidad: "suscripcion", ...c, daniosDevolucion: 0, penalizacionCancelacion: 1, incluye: { ...incluye } },
  };
}

const coche = (id: string) => COCHES.find((c) => c.id === id)!;
export const EXCESO = "€/km de exceso no publicado: estimación";
export const BIPI = "Bipi (sep-2026): 800 km/mes, 0,12 €/km de exceso, permanencia de 3 meses";

/** Ofertas investigadas; donde no hay oferta publicada se usa una estimación marcada */
export const OFERTAS: Escenario[] = [
  contado(coche("cx30")),
  prestamo(coche("cx30")),
  cuotaFinal(coche("cx30"), {
    descuento: 1400, entrada: 6821, tin: 0.0599, plazoMeses: 36, cuotaFinal: 16958, comisionApertura: 0.03,
    kmAnualesContrato: 10000, excesoKm: 0.08,
    fuente: `Mazda FlexiOpción (caducó el 30/09/2026; descuento por financiar estimado). ${EXCESO}`,
  }),
  renting(coche("cx30"), {
    cuota: 405, entrada: 0, plazoMeses: 36, kmAnualesContrato: 10000, excesoKm: 0.07,
    fuente: `Ayvens renting particulares (sep-2026). ${EXCESO}`,
  }),

  contado(coche("cx30-usado")),
  prestamo(coche("cx30-usado")),

  contado(coche("atto2")),
  prestamo(coche("atto2")),
  cuotaFinal(coche("atto2"), {
    descuento: 0, entrada: 9033, tin: 0.0699, plazoMeses: 36, cuotaFinal: 16652, comisionApertura: 0.0375,
    kmAnualesContrato: 10000, excesoKm: 0.08,
    fuente: `BYD Easy Plan (hasta el 03/11/2026; TIN publicado para la versión Active). ${EXCESO}`,
  }),
  renting(coche("atto2"), {
    cuota: 455, entrada: 0, plazoMeses: 60, kmAnualesContrato: 15000, excesoKm: 0.07,
    fuente: "Sin oferta de renting publicada para el Atto 2: estimación (1,4% del precio al mes, como los demás)",
  }),

  contado(coche("model3")),
  prestamo(coche("model3")),
  cuotaFinal(coche("model3"), {
    descuento: 0, entrada: 7250, tin: 0.0224, plazoMeses: 60, cuotaFinal: 14312, comisionApertura: 0,
    kmAnualesContrato: 10000, excesoKm: 0.08,
    fuente: `Tesla Future (promoción de mayo de 2026, puede no estar vigente). ${EXCESO}`,
  }),
  renting(coche("model3"), {
    cuota: 672, entrada: 0, plazoMeses: 60, kmAnualesContrato: 10000, excesoKm: 0.07,
    fuente: `Anuncio de renting en coches.net, proveedor sin identificar (sep-2026). ${EXCESO}`,
  }),

  contado(coche("model3-usado")),
  prestamo(coche("model3-usado")),

  contado(coche("formentor")),
  prestamo(coche("formentor")),
  cuotaFinal(coche("formentor"), {
    descuento: 850, entrada: 7694, tin: 0.0695, plazoMeses: 48, cuotaFinal: 23290, comisionApertura: 0.035,
    kmAnualesContrato: 10000, excesoKm: 0.08,
    fuente: `Cupra Flex (caducó el 30/09/2026). ${EXCESO}`,
  }),
  renting(coche("formentor"), {
    cuota: 425, entrada: 0, plazoMeses: 48, kmAnualesContrato: 10000, excesoKm: 0.07,
    fuente: `Volkswagen Renting (caducó el 31/08/2026). ${EXCESO}`,
  }),
  suscripcion(coche("formentor"), {
    cuota: 655, entrada: 0, plazoMeses: 3, kmAnualesContrato: 9600, excesoKm: 0.12, fuente: BIPI,
  }),

  contado(coche("formentor-phev")),
  prestamo(coche("formentor-phev")),
  cuotaFinal(coche("formentor-phev"), {
    descuento: 850, entrada: 7815, tin: 0.0745, plazoMeses: 48, cuotaFinal: 26283, comisionApertura: 0.0395,
    kmAnualesContrato: 10000, excesoKm: 0.08,
    fuente: `Cupra Flex e-Hybrid (caducó el 30/09/2026). ${EXCESO}`,
  }),
  renting(coche("formentor-phev"), {
    cuota: 509, entrada: 0, plazoMeses: 60, kmAnualesContrato: 10000, excesoKm: 0.07,
    fuente: `Renting particulares (sep-2026). ${EXCESO}`,
  }),

  contado(coche("chr")),
  prestamo(coche("chr")),
  cuotaFinal(coche("chr"), {
    descuento: 2925, entrada: 10931, tin: 0.0775, plazoMeses: 48, cuotaFinal: 17436, comisionApertura: 0.0299,
    kmAnualesContrato: 15000, excesoKm: 0.1,
    fuente: "Toyota Easy (hasta el 31/10/2026; 49 cuotas redondeadas a 48). Km del contrato no publicados: se asumen 15.000; 0,10 €/km según un foro",
  }),
  renting(coche("chr"), {
    cuota: 350, entrada: 4583, plazoMeses: 48, kmAnualesContrato: 10000, excesoKm: 0.07, incluye: SIN_INCLUIR_NEUMATICOS,
    fuente: `Toyota Easy Renting (hasta el 31/10/2026). Neumáticos no confirmados como incluidos. ${EXCESO}`,
  }),
  suscripcion(coche("chr"), {
    cuota: 625, entrada: 0, plazoMeses: 3, kmAnualesContrato: 9600, excesoKm: 0.12, fuente: BIPI,
  }),
];
