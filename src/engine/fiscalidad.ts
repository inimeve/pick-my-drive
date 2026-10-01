import type { CocheCandidato, Municipio, Territorio } from "./tipos";

export const IVA = 0.21;

/** Tipo del impuesto de matriculación según emisiones WLTP (art. 70 Ley 38/1992) */
export function tipoMatriculacion(co2: number, territorio?: Territorio): number {
  if (co2 <= 120) return 0;
  const ajuste = territorio?.ajusteMatriculacion ?? 0;
  if (co2 < 160) return 0.0475 + ajuste;
  if (co2 < 200) return 0.0975 + ajuste;
  return territorio?.matriculacionMas200 ?? 0.1475 + ajuste;
}

/** Parte del PVP de un coche nuevo que es impuesto de matriculación (base = precio sin IVA) */
export function matriculacionIncluida(coche: CocheCandidato, territorio?: Territorio): number {
  if (coche.estado !== "nuevo") return 0;
  const tipo = tipoMatriculacion(coche.co2, territorio);
  const base = coche.pvp / (1 + IVA + tipo);
  return base * tipo;
}

/** Tipo de ITP para un usado comprado a un particular */
export function tipoItp(coche: CocheCandidato, territorio: Territorio): number {
  if (coche.motorizacion === "electrico" && territorio.itpElectrico !== undefined)
    return territorio.itpElectrico;
  if (coche.cvFiscales > 15 && territorio.itpMas15Cv !== undefined) return territorio.itpMas15Cv;
  return territorio.itp;
}

/** Deducción de IRPF por comprar un coche nuevo, según el Territorio */
export function deduccionIrpf(coche: CocheCandidato, territorio: Territorio, precio: number): number {
  const d = territorio.deduccionIrpf;
  if (!d || coche.estado !== "nuevo" || !d.motorizaciones.includes(coche.motorizacion)) return 0;
  const base = Math.min(precio - (d.restaAyudas ? coche.ayudas : 0), d.baseMaxima);
  return Math.max(0, base) * d.porcentaje;
}

/** IVTM del año en que el coche cumple `edadAnios` (para bonificaciones con duración) */
export function ivtmAnual(coche: CocheCandidato, municipio: Municipio, edadAnios = 0): number {
  let cuota = 0;
  for (const tramo of municipio.ivtm) if (coche.cvFiscales >= tramo.desdeCv) cuota = tramo.cuota;
  const b = municipio.bonificacionIvtm[coche.motorizacion];
  const bonifica = b && (b.anios === undefined || edadAnios < b.anios);
  return cuota * (1 - (bonifica ? b.porcentaje : 0));
}

/** ITV que toca pasar al cumplir `edadMeses`: a los 4 años, cada 2 hasta los 10 y después anual */
export function tocaItv(edadMeses: number): boolean {
  if (edadMeses <= 0 || edadMeses % 12 !== 0) return false;
  const anios = edadMeses / 12;
  if (anios < 4) return false;
  if (anios <= 10) return anios % 2 === 0;
  return true;
}
