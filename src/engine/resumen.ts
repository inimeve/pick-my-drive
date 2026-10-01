import { GRUPOS_DESGLOSE } from "./modalidades";
import type { Resultado } from "./simulacion";
import type { Condiciones } from "./tipos";

/** Las cifras de un Escenario al final del Horizonte, contadas como las entiende alguien sin formación financiera */
export interface Resumen {
  /** Lo que se paga el primer día */
  pagoInicial: number;
  /** Media de lo que sale del bolsillo cada mes después del primer día */
  mediaMes: number;
  /** Todo lo puesto de bolsillo hasta el final del Horizonte */
  pagado: number;
  /** Lo que habría rendido el dinero dedicado al coche (0 si no se cuenta) */
  oportunidad: number;
  /** Lo que se recupera (negativo) o se paga (positivo) al salir: venta del coche menos deuda, o exceso de km y daños */
  alFinal: number;
  /** Coste neto al final: pagado + alFinal + oportunidad */
  costeNeto: number;
  /** El coche es tuyo al final del Horizonte y lo puedes vender */
  tuyo: boolean;
  /** Cuota mensual del préstamo o del contrato de uso, si la hay */
  cuota?: number;
}

export function resumir(r: Resultado, c: Condiciones, horizonteMeses: number): Resumen {
  const H = horizonteMeses;
  const pagado = r.desembolsoAcumulado[H]!;
  const oportunidad = r.desglose.oportunidad ?? 0;
  const costeNeto = r.costeNeto[H]!;
  return {
    pagoInicial: r.pagoInicial,
    mediaMes: r.caja.slice(1, H + 1).reduce((s, v) => s + v, 0) / H,
    pagado,
    oportunidad,
    alFinal: costeNeto - pagado - oportunidad,
    costeNeto,
    tuyo:
      c.modalidad === "contado" ||
      c.modalidad === "prestamo" ||
      (c.modalidad === "cuota_final" && c.salida === "quedarse"),
    cuota:
      r.financiacion?.cuota ?? (c.modalidad === "renting" || c.modalidad === "suscripcion" ? c.cuota : undefined),
  };
}

/** Importe de un grupo del desglose al final del Horizonte */
export function importeGrupo(r: Resultado, grupoId: string): number {
  const g = GRUPOS_DESGLOSE.find((x) => x.id === grupoId);
  return g ? g.categorias.reduce((s, c) => s + (r.desglose[c] ?? 0), 0) : 0;
}
