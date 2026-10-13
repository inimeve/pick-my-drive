import type { CocheCandidato, Escenario, OfertaReal } from "../engine/tipos";
import { contado, cuotaFinal, segunValorGarantizado } from "./coches";

// Model 3 y Model Y de tracción trasera para la plantilla de BYD: configuradores de Tesla España del 14-oct-2026
// (docs/research/tesla.md). Préstamo lineal a 48 meses y a 72 cancelado en el mes 48, y el Tesla Futuro a 48 meses.
// Seguro, mantenimiento, averías, neumáticos y consumo real son estimaciones; el valor a los 4 años, la última cuota
// del Tesla Futuro más un 12 % (docs/adr/0003).

const WEB: OfertaReal = { tipo: "web", origen: "Configurador de Tesla España (14-oct-2026)", hasta: "2026-10-31" };

const AVISO_AUTO_PLUS =
  "La ayuda del Plan Auto+ no va en el precio: llega después por transferencia. Los −1.210 € que Tesla llama \"Plan Auto +\" son el descuento obligatorio del vendedor.";

export const COCHES_TESLA: CocheCandidato[] = [
  {
    id: "model3-rwd",
    nombre: "Tesla Model 3",
    version: "Tracción trasera, 572 km WLTP",
    estado: "nuevo",
    motorizacion: "electrico",
    // 36.990 + 980 de destino − 1.210 de descuento Auto+ − 3.395 del Tesla Bonus
    pvp: 33365,
    co2: 0,
    cvFiscales: 13,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    // WLTP más un ~10% y un ~10% de pérdidas de carga
    consumo: { kwh100: 15.5 },
    garantiaMeses: 48,
    garantiaKm: 80000,
    // última cuota del Tesla Futuro (14.897 €) más el margen: conserva el 50 % a los 4 años
    ...segunValorGarantizado(33365, 14897, 0.134),
    mantenimientoAnual: 200,
    averiasAnual: 220,
    seguroTodoRiesgoAnual: 850,
    seguroTercerosAnual: 430,
    neumaticosJuego: 680,
    neumaticosVidaKm: 30000,
    ayudas: 3375,
    fuente: `Configurador de Tesla España (14-oct-2026, hasta el 31-oct): 33.365 € con destino, matriculación y el Tesla Bonus (3.395 €, entrega antes del 31-mar-2027). Auto+: 3.375 € (fabricado en China). ${AVISO_AUTO_PLUS} Consumo real, seguro y neumáticos: estimaciones; el valor a los 4 años, la última cuota del Tesla Futuro más un 12 %.`,
  },
  {
    id: "modely-rwd",
    nombre: "Tesla Model Y",
    version: "Tracción trasera, 525 km WLTP",
    estado: "nuevo",
    motorizacion: "electrico",
    // 40.990 + 980 de destino − 1.210 de descuento Auto+
    pvp: 40760,
    co2: 0,
    cvFiscales: 13,
    edadInicialMeses: 0,
    kmIniciales: 0,
    vendedorParticular: false,
    consumo: { kwh100: 17.5 },
    garantiaMeses: 48,
    garantiaKm: 80000,
    // última cuota del Tesla Futuro (15.912 €) más el margen: conserva el 43,7 % a los 4 años
    ...segunValorGarantizado(40760, 15912, 0.134),
    mantenimientoAnual: 200,
    averiasAnual: 220,
    seguroTodoRiesgoAnual: 900,
    seguroTercerosAnual: 450,
    neumaticosJuego: 720,
    neumaticosVidaKm: 30000,
    ayudas: 4050,
    fuente: `Configurador de Tesla España (14-oct-2026, hasta el 31-oct): 40.760 € con destino y matriculación; sin Tesla Bonus. Entrega estimada en ene.-feb. 2027. Auto+: 4.050 € (montado en Alemania; autonomiacocheselectricos.es, sin confirmar por Tesla). ${AVISO_AUTO_PLUS} Consumo real, seguro y neumáticos: estimaciones; el valor a los 4 años, la última cuota del Tesla Futuro más un 12 %.`,
  },
];

const porId = (id: string) => COCHES_TESLA.find((c) => c.id === id)!;

/** Préstamo lineal de Caixabank Payments & Consumer, sin comisión de apertura. La cancelación no está publicada:
 * se supone el 1 %, el máximo legal con más de un año pendiente. A 72 meses se cancela en el mes 48 para cubrir los
 * mismos 4 años que los demás. Sin cuota ofertada: la de la web va redondeada al euro y el TIN la reproduce */
function lineal(coche: CocheCandidato, o: { entrada: number; tin: number; plazoMeses: 48 | 72; detalle: string }): Escenario {
  const cancelarEnMes = o.plazoMeses === 72 ? 48 : undefined;
  return {
    id: `${coche.id}:prestamo:lineal-${o.plazoMeses}${cancelarEnMes ? `:cancelado-${cancelarEnMes}` : ""}`,
    cocheId: coche.id,
    visible: true,
    ofertaReal: WEB,
    proveedor: `Tesla, lineal a ${o.plazoMeses} meses${cancelarEnMes ? ` cancelado en el ${cancelarEnMes}` : ""}`,
    fuente: `Préstamo lineal de Caixabank Payments & Consumer en el configurador de Tesla (14-oct-2026, hasta el 31-oct). ${o.detalle} Sin comisión de apertura.${
      cancelarEnMes ? ` En el mes ${cancelarEnMes} se devuelve toda la deuda pendiente con un 1 % de comisión (no publicada: supuesto).` : ""
    }`,
    condiciones: {
      modalidad: "prestamo", descuento: 0, entrada: o.entrada, tin: o.tin, plazoMeses: o.plazoMeses,
      comisionApertura: 0, comisionCancelacion: 0.01, cancelarEnMes,
    },
  };
}

/** Préstamo Tesla Futuro de Open Bank a 48 meses y 15.000 km, sin comisión de apertura. La última cuota sustituye a
 * la 48.ª: aquí la 48.ª se paga normal y la final es la última menos una cuota, así cuadra lo pagado (la primera,
 * por el periodo roto, sale unos 40 € más alta que en la web) */
function futuro(coche: CocheCandidato, o: { entrada: number; tin: number; cuota: number; ultima: number; detalle: string }): Escenario {
  const e = cuotaFinal(coche, {
    descuento: 0, entrada: o.entrada, tin: o.tin, plazoMeses: 48, cuotaFinal: o.ultima - o.cuota,
    comisionApertura: 0, kmAnualesContrato: 15000, excesoKm: 0.1,
    fuente: `Préstamo Tesla Futuro de Open Bank en el configurador de Tesla (14-oct-2026, hasta el 31-oct): ${o.detalle} Sin comisión de apertura. 15.000 km al año; €/km de exceso, daños y cancelación no publicados (supuestos: 0,10 €/km, 300 € y 1 %).`,
  });
  return { ...e, id: `${e.id}:futuro-48`, ofertaReal: WEB, proveedor: "Tesla Futuro, 48 meses" };
}

export function ofertasTesla(): Escenario[] {
  const m3 = porId("model3-rwd");
  const my = porId("modely-rwd");
  const M3 = "Entrada 9.250 €, 24.115 € financiados, TIN 5,75 %, TAE 5,90 %.";
  const MY = "Entrada 9.500 €, 31.260 € financiados, TIN 1,99 %, TAE 2,01 % (promoción no acumulable).";
  return [
    { ...contado(m3), ofertaReal: WEB, proveedor: "Tesla", fuente: m3.fuente },
    lineal(m3, { entrada: 9250, tin: 0.0575, plazoMeses: 48, detalle: `${M3} 48 cuotas de 564 €.` }),
    lineal(m3, { entrada: 9250, tin: 0.0575, plazoMeses: 72, detalle: `${M3} 72 cuotas de 397 €.` }),
    futuro(m3, {
      entrada: 7300, tin: 0.07, cuota: 361, ultima: 14897,
      detalle: "entrada 7.300 €, 26.065 € financiados, primera cuota de 319 €, 46 de 361 € y una última de 14.897 €, TIN 7,00 %, TAE 7,25 %.",
    }),

    { ...contado(my), ofertaReal: WEB, proveedor: "Tesla", fuente: my.fuente },
    lineal(my, { entrada: 9500, tin: 0.0199, plazoMeses: 48, detalle: `${MY} 48 cuotas de 678 €.` }),
    lineal(my, { entrada: 9500, tin: 0.0199, plazoMeses: 72, detalle: `${MY} 72 cuotas de 461 €.` }),
    futuro(my, {
      entrada: 8550, tin: 0.0199, cuota: 388, ultima: 15912,
      detalle: "entrada 8.550 €, 32.210 € financiados, primera cuota de 369 €, 46 de 388 € y una última de 15.912 €, TIN 1,99 %, TAE 2,01 %.",
    }),
  ];
}
