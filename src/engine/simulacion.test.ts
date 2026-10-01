import { describe, expect, it } from "vitest";
import { valorResidual } from "./costes";
import { matriculacionIncluida } from "./fiscalidad";
import { simular, type Contexto } from "./simulacion";
import type { CocheCandidato, Condiciones, Escenario } from "./tipos";

/** Coche sin costes de uso, para aislar la parte financiera */
const coche: CocheCandidato = {
  id: "c",
  nombre: "Test",
  version: "",
  estado: "nuevo",
  motorizacion: "gasolina",
  pvp: 30000,
  co2: 140,
  cvFiscales: 13,
  edadInicialMeses: 0,
  kmIniciales: 0,
  vendedorParticular: false,
  consumo: { litros100: 0 },
  garantiaMeses: 1000,
  garantiaKm: 1e9,
  depreciacionPrimerAnio: 0.2,
  depreciacionAnual: 0.12,
  mantenimientoAnual: 0,
  averiasAnual: 0,
  seguroTodoRiesgoAnual: 0,
  seguroTercerosAnual: 0,
  neumaticosJuego: 0,
  neumaticosVidaKm: 40000,
  ayudas: 0,
};

const ctx: Contexto = {
  perfil: {
    kmAnuales: 15000,
    horizonteMeses: 60,
    territorioId: "t",
    municipioId: "m",
    oportunidadActiva: false,
    tipoOportunidad: 0.03,
    inflacion: 0,
    energia: { gasolina: 1.5, diesel: 1.4, kwhCasa: 0.1, kwhPublica: 0.5, fraccionCargaCasa: 1 },
    aniosTodoRiesgo: 5,
    tarifaItv: 0,
    ajusteValorResidual: 1,
  },
  territorio: { id: "t", nombre: "T", itp: 0.04 },
  municipio: {
    id: "m",
    nombre: "M",
    territorioId: "t",
    ivtm: [],
    bonificacionIvtm: {},
  },
};

const esc = (condiciones: Condiciones): Escenario => ({
  id: condiciones.modalidad,
  cocheId: "c",
  condiciones,
  visible: true,
});

const contado = esc({ modalidad: "contado", descuento: 0 });

const prestamo = (tin: number, cancelacion = 0) =>
  esc({
    modalidad: "prestamo",
    descuento: 0,
    entrada: 5000,
    tin,
    plazoMeses: 84,
    comisionApertura: 0,
    comisionCancelacion: cancelacion,
  });

describe("contado", () => {
  it("el Coste neto al final es lo pagado menos el Valor residual", () => {
    const r = simular(contado, coche, ctx);
    const valor = valorResidual(coche, 60, ctx.perfil);
    expect(r.costeNeto[60]).toBeCloseTo(30000 - valor, 6);
    expect(r.caja[0]).toBe(30000);
  });

  it("desglosa el impuesto de matriculación y la depreciación", () => {
    const r = simular(contado, coche, ctx);
    const imp = matriculacionIncluida(coche);
    expect(r.desglose.impuestos).toBeCloseTo(imp, 6);
    const suma = Object.values(r.desglose).reduce((s, v) => s + (v ?? 0), 0);
    expect(suma).toBeCloseTo(r.costeNeto[60]!, 6);
  });
});

describe("préstamo", () => {
  it("al 0% sin comisiones cuesta lo mismo que al contado en todos los meses", () => {
    const a = simular(contado, coche, ctx);
    const b = simular(prestamo(0), coche, ctx);
    b.costeNeto.forEach((v, m) => expect(v).toBeCloseTo(a.costeNeto[m]!, 6));
  });

  it("con Coste de oportunidad, financiar al 0% sale más barato que pagar al contado", () => {
    const conOportunidad = { ...ctx, perfil: { ...ctx.perfil, oportunidadActiva: true } };
    const a = simular(contado, coche, conOportunidad);
    const b = simular(prestamo(0), coche, conOportunidad);
    expect(b.costeNeto[60]!).toBeLessThan(a.costeNeto[60]!);
  });

  it("los intereses y la cancelación anticipada encarecen el Coste neto", () => {
    const a = simular(contado, coche, ctx);
    const b = simular(prestamo(0.08, 0.01), coche, ctx);
    const diferencia = b.costeNeto[60]! - a.costeNeto[60]!;
    expect(diferencia).toBeCloseTo((b.desglose.intereses ?? 0) + (b.desglose.comisiones ?? 0), 6);
    expect(b.desglose.comisiones).toBeGreaterThan(0);
    expect(b.desglose.principal ?? 0).toBeCloseTo(0, 6);
  });

  it("la caja del primer mes es la entrada", () => {
    expect(simular(prestamo(0.08), coche, ctx).caja[0]).toBeCloseTo(5000, 6);
  });
});

describe("renting", () => {
  const renting = (plazoMeses: number) =>
    esc({
      modalidad: "renting",
      cuota: 400,
      entrada: 2000,
      plazoMeses,
      kmAnualesContrato: 10000,
      excesoKm: 0.06,
      daniosDevolucion: 300,
      penalizacionCancelacion: 0.5,
      incluye: { seguro: true, mantenimiento: true, averias: true, neumaticos: true, impuestos: true, itv: true },
    });

  it("con plazo igual al Horizonte suma entrada, cuotas, exceso de km y daños", () => {
    const r = simular(renting(60), coche, ctx);
    const exceso = 5000 * 5 * 0.06;
    expect(r.costeNeto[60]).toBeCloseTo(2000 + 400 * 60 + exceso + 300, 6);
  });

  it("salir antes de tiempo penaliza la mitad de las cuotas restantes", () => {
    const r = simular(renting(60), coche, ctx);
    const exceso = (5000 / 12) * 24 * 0.06;
    expect(r.costeNeto[24]).toBeCloseTo(2000 + 400 * 24 + 0.5 * 400 * 36 + exceso + 300, 6);
  });

  it("sin penalización, la curva no incluye las cuotas restantes y coincide al final del Horizonte", () => {
    const r = simular(renting(60), coche, ctx);
    const exceso = (5000 / 12) * 24 * 0.06;
    expect(r.costeNetoSinPenalizacion[0]).toBeCloseTo(2000, 6);
    expect(r.costeNetoSinPenalizacion[24]).toBeCloseTo(2000 + 400 * 24 + exceso + 300, 6);
    expect(r.costeNetoSinPenalizacion[60]).toBeCloseTo(r.costeNeto[60]!, 6);
  });

  it("la renovación se contrata hasta el final del Horizonte, sin penalización", () => {
    const r = simular(renting(48), coche, ctx);
    const exceso = 5000 * 5 * 0.06;
    expect(r.costeNeto[60]).toBeCloseTo(2000 * 2 + 400 * 60 + exceso + 300 * 2, 6);
  });

  it("se renueva al acabar el contrato si el Horizonte es más largo", () => {
    const r = simular(renting(36), coche, { ...ctx, perfil: { ...ctx.perfil, horizonteMeses: 72 } });
    expect(r.caja[36]).toBeGreaterThan(2000);
    expect(r.avisos.length).toBe(1);
  });
});

describe("financiación con cuota final", () => {
  const cuotaFinal = (salida: "devolver" | "quedarse", final = 14000) =>
    esc({
      modalidad: "cuota_final",
      descuento: 0,
      entrada: 5000,
      tin: 0.0899,
      plazoMeses: 48,
      cuotaFinal: final,
      comisionApertura: 0.03,
      comisionCancelacion: 0.01,
      kmAnualesContrato: 15000,
      excesoKm: 0.08,
      daniosDevolucion: 0,
      salida,
    });

  it("al devolver con el coche valiendo menos que la cuota final, se pierde solo lo pagado", () => {
    const h48 = { ...ctx, perfil: { ...ctx.perfil, horizonteMeses: 48 } };
    const r = simular(cuotaFinal("devolver", 18000), coche, h48);
    const valor = valorResidual(coche, 48, h48.perfil);
    expect(valor).toBeLessThan(18000);
    const f = r.financiacion!;
    const pagado = 5000 + f.principal * 0.03 + f.cuota * 48;
    expect(r.costeNeto[48]).toBeCloseTo(pagado, 4);
  });

  it("si el coche vale más que la cuota final, se vende y se recupera la diferencia", () => {
    const h48 = { ...ctx, perfil: { ...ctx.perfil, horizonteMeses: 48 } };
    const r = simular(cuotaFinal("devolver", 14000), coche, h48);
    const valor = valorResidual(coche, 48, h48.perfil);
    const f = r.financiacion!;
    const pagado = 5000 + f.principal * 0.03 + f.cuota * 48;
    expect(r.costeNeto[48]).toBeCloseTo(pagado - (valor - 14000), 4);
  });

  it("quedarse el coche equivale a comprarlo pagando la cuota final", () => {
    const h48 = { ...ctx, perfil: { ...ctx.perfil, horizonteMeses: 48 } };
    const r = simular(cuotaFinal("quedarse"), coche, h48);
    const valor = valorResidual(coche, 48, h48.perfil);
    const f = r.financiacion!;
    const pagado = 5000 + f.principal * 0.03 + f.cuota * 48 + 14000;
    expect(r.costeNeto[48]).toBeCloseTo(pagado - valor, 4);
  });

  it("la TAE es mayor que el TIN por la comisión de apertura", () => {
    const r = simular(cuotaFinal("devolver"), coche, ctx);
    expect(r.financiacion!.tae).toBeGreaterThan(0.0899);
  });
});

describe("leasing", () => {
  it("no aplica a particulares y explica por qué", () => {
    const r = simular(esc({ modalidad: "leasing" }), coche, ctx);
    expect(r.aplica).toBe(false);
    expect(r.motivoNoAplica).toMatch(/particular/);
  });
});

describe("usado de particular", () => {
  it("paga ITP del Territorio y tasa de transferencia", () => {
    const usado = { ...coche, estado: "usado" as const, vendedorParticular: true, pvp: 20000, edadInicialMeses: 36 };
    const r = simular(contado, usado, ctx);
    expect(r.desglose.impuestos).toBeCloseTo(20000 * 0.04 + 55.7, 6);
  });
});
