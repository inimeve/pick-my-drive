/** Cuota mensual de un préstamo francés, con una cuota final opcional pagada junto a la última cuota */
export function cuotaMensual(
  principal: number,
  tin: number,
  meses: number,
  cuotaFinal = 0,
): number {
  const i = tin / 12;
  if (i === 0) return (principal - cuotaFinal) / meses;
  const descuentoFinal = cuotaFinal / Math.pow(1 + i, meses);
  return ((principal - descuentoFinal) * i) / (1 - Math.pow(1 + i, -meses));
}

/** Deuda pendiente tras pagar `pagadas` cuotas (incluye la cuota final hasta que se paga) */
export function saldoPendiente(
  principal: number,
  tin: number,
  cuota: number,
  pagadas: number,
): number {
  const i = tin / 12;
  let saldo = principal;
  for (let k = 0; k < pagadas; k++) saldo = saldo * (1 + i) - cuota;
  return Math.max(0, saldo);
}

/** Tasa interna de retorno mensual de unos flujos indexados por mes (bisección) */
export function tirMensual(flujos: number[]): number {
  const vpn = (r: number) =>
    flujos.reduce((s, f, t) => s + f / Math.pow(1 + r, t), 0);
  let lo = -0.99;
  let hi = 1;
  if (vpn(lo) * vpn(hi) > 0) return NaN;
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (vpn(lo) * vpn(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

/**
 * TAE de una financiación: lo que realmente cuesta el dinero recibido,
 * contando comisiones de apertura y la cuota final.
 */
export function tae(
  principal: number,
  comisionApertura: number,
  cuota: number,
  meses: number,
  cuotaFinal = 0,
): number {
  const flujos = [principal - comisionApertura];
  for (let t = 1; t <= meses; t++)
    flujos.push(-cuota - (t === meses ? cuotaFinal : 0));
  return Math.pow(1 + tirMensual(flujos), 12) - 1;
}

/** TIN que hace que la cuota ofertada amortice el principal y la cuota final */
export function tinImplicito(
  principal: number,
  cuota: number,
  meses: number,
  cuotaFinal = 0,
): number {
  const flujos = [principal];
  for (let t = 1; t <= meses; t++)
    flujos.push(-cuota - (t === meses ? cuotaFinal : 0));
  return tirMensual(flujos) * 12;
}
