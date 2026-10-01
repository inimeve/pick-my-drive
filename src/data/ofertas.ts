import type { CocheCandidato, Escenario, Inclusiones } from "../engine/tipos";

export const TODO_INCLUIDO: Inclusiones = {
  seguro: true,
  mantenimiento: true,
  averias: true,
  neumaticos: true,
  impuestos: true,
  itv: true,
};

/** Condiciones típicas de mercado para un coche sin oferta investigada */
export interface ParametrosMercado {
  tinPrestamo: number;
  comisionAperturaPrestamo: number;
  tinCuotaFinal: number;
  comisionAperturaCuotaFinal: number;
  /** Cuota final como fracción del PVP a 48 meses */
  cuotaFinal48: number;
  /** Cuota de renting a 60 meses como fracción del PVP */
  rentingMensual: number;
  /** Cuota de suscripción como fracción del PVP */
  suscripcionMensual: number;
  comisionCancelacion: number;
  excesoKm: number;
}

export function ofertasGenericas(
  coche: CocheCandidato,
  m: ParametrosMercado,
  fuente: string,
): Escenario[] {
  const id = (sufijo: string) => `${coche.id}:${sufijo}`;
  const entrada = Math.round((coche.pvp * 0.2) / 500) * 500;
  const base = { cocheId: coche.id, visible: true, fuente };
  return [
    { ...base, id: id("contado"), condiciones: { modalidad: "contado", descuento: 0 } },
    {
      ...base,
      id: id("prestamo"),
      condiciones: {
        modalidad: "prestamo",
        descuento: 0,
        entrada,
        tin: m.tinPrestamo,
        plazoMeses: 60,
        comisionApertura: m.comisionAperturaPrestamo,
        comisionCancelacion: m.comisionCancelacion,
      },
    },
    {
      ...base,
      id: id("cuota_final"),
      condiciones: {
        modalidad: "cuota_final",
        descuento: 0,
        entrada,
        tin: m.tinCuotaFinal,
        plazoMeses: 48,
        cuotaFinal: Math.round((coche.pvp * m.cuotaFinal48) / 100) * 100,
        comisionApertura: m.comisionAperturaCuotaFinal,
        comisionCancelacion: m.comisionCancelacion,
        kmAnualesContrato: 15000,
        excesoKm: m.excesoKm,
        daniosDevolucion: 300,
        salida: "devolver",
      },
    },
    {
      ...base,
      id: id("renting"),
      condiciones: {
        modalidad: "renting",
        cuota: Math.round(coche.pvp * m.rentingMensual),
        entrada: 0,
        plazoMeses: 60,
        kmAnualesContrato: 15000,
        excesoKm: m.excesoKm,
        daniosDevolucion: 300,
        penalizacionCancelacion: 0.5,
        incluye: { ...TODO_INCLUIDO },
      },
    },
    {
      ...base,
      id: id("suscripcion"),
      condiciones: {
        modalidad: "suscripcion",
        cuota: Math.round(coche.pvp * m.suscripcionMensual),
        entrada: 0,
        plazoMeses: 3,
        kmAnualesContrato: 15000,
        excesoKm: m.excesoKm,
        daniosDevolucion: 0,
        penalizacionCancelacion: 1,
        incluye: { ...TODO_INCLUIDO },
      },
    },
  ];
}
