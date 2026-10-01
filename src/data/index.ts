import type { CocheCandidato, Escenario, ModalidadId, PerfilUso } from "../engine/tipos";
import { COCHES, OFERTAS } from "./coches";
import { COCHES_BMW, COCHE_ACTUAL } from "./bmw";
import { ofertasGenericas, type ParametrosMercado } from "./ofertas";

export { MUNICIPIOS, TERRITORIOS } from "./territorios";

export const FECHA_DATOS = "1 de octubre de 2026";

export const PERFIL_POR_DEFECTO: PerfilUso = {
  kmAnuales: 15000,
  horizonteMeses: 60,
  territorioId: "bizkaia",
  municipioId: "bilbao",
  oportunidadActiva: true,
  // Letras del Tesoro a 12 meses (subasta 01-09-2026)
  tipoOportunidad: 0.028,
  // IPC de septiembre 4,9%; proyecciones 2026-2028 de 3,6% a 2,1%
  inflacion: 0.03,
  energia: {
    // Bizkaia, 1-10-2026 (ya con la rebaja fiscal temporal de octubre)
    gasolina: 1.85,
    diesel: 1.93,
    // tarifa de luz para coche eléctrico en horas valle
    kwhCasa: 0.1,
    // mezcla de carga lenta (~0,35) y rápida (~0,55)
    kwhPublica: 0.45,
    fraccionCargaCasa: 0.8,
  },
  aniosTodoRiesgo: 5,
  // ITV en Euskadi 2026: 57-62 € según motorización
  tarifaItv: 60,
  ajusteValorResidual: 1,
};

export const COCHES_POR_DEFECTO: CocheCandidato[] = COCHES;
export const ESCENARIOS_POR_DEFECTO: Escenario[] = OFERTAS;

const MERCADO: ParametrosMercado = {
  tinPrestamo: 0.055,
  comisionAperturaPrestamo: 0.005,
  tinCuotaFinal: 0.075,
  comisionAperturaCuotaFinal: 0.03,
  cuotaFinal48: 0.5,
  rentingMensual: 0.014,
  suscripcionMensual: 0.019,
  comisionCancelacion: 0.01,
  excesoKm: 0.08,
};

/** Ofertas para un coche: las investigadas si las hay y, si no, condiciones típicas de mercado */
export function ofertasPorDefecto(coche: CocheCandidato): Escenario[] {
  const investigadas = OFERTAS.filter((e) => e.cocheId === coche.id);
  const genericas = ofertasGenericas(coche, MERCADO, "Condiciones típicas de mercado (estimación)").map((e) => ({
    ...e,
    id: `${e.id}:${crypto.randomUUID().slice(0, 8)}`,
  }));
  return genericas.map((g) =>
    structuredClone(investigadas.find((i) => i.condiciones.modalidad === g.condiciones.modalidad) ?? g),
  );
}

export function plantillaCoche(): CocheCandidato {
  return {
    id: crypto.randomUUID(),
    nombre: "Nuevo coche",
    version: "",
    estado: "nuevo",
    motorizacion: "gasolina",
    pvp: 30000,
    co2: 130,
    cvFiscales: 12,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { litros100: 6.5, kwh100: 18, fraccionElectrica: 0.5 },
    garantiaMeses: 36,
    garantiaKm: 100000,
    depreciacionPrimerAnio: 0.2,
    depreciacionAnual: 0.1,
    mantenimientoAnual: 380,
    averiasAnual: 350,
    seguroTodoRiesgoAnual: 650,
    seguroTercerosAnual: 374,
    neumaticosJuego: 600,
    neumaticosVidaKm: 40000,
    ayudas: 0,
  };
}

/** Mi coche actual como un candidato más: solo tiene sentido seguir con él, es decir, "contado" */
export function cocheActualConOferta(): { coche: CocheCandidato; escenarios: Escenario[] } {
  return {
    coche: structuredClone(COCHE_ACTUAL),
    escenarios: [
      {
        id: `${COCHE_ACTUAL.id}:contado`,
        cocheId: COCHE_ACTUAL.id,
        visible: true,
        condiciones: { modalidad: "contado", descuento: 0 },
        fuente: "Seguir con el coche: lo que ya pagaste no cuenta, sí lo que sacarías vendiéndolo hoy",
      },
    ],
  };
}

/** Modalidades que tienen sentido para un coche: el actual solo se puede seguir usando ("contado");
 * los de segunda mano, contado o préstamo, que es lo que se ofrece en el mercado; los nuevos, todas */
export function modalidadesPosibles(coche: CocheCandidato): ModalidadId[] {
  if (coche.id === COCHE_ACTUAL.id) return ["contado"];
  if (coche.estado === "usado") return ["contado", "prestamo"];
  return ["contado", "prestamo", "cuota_final", "renting", "suscripcion"];
}

export function ofertasUsado(coche: CocheCandidato): Escenario[] {
  const posibles = modalidadesPosibles(coche);
  return ofertasPorDefecto(coche).filter((e) => posibles.includes(e.condiciones.modalidad));
}

export { COCHES_BMW };
