import { describe, expect, it } from "vitest";
import {
  cuotaMensual,
  saldoPendiente,
  tae,
  tinImplicito,
} from "./finanzas";

describe("cuotaMensual", () => {
  it("calcula la cuota de un préstamo francés", () => {
    // 20.000 € al 7% TIN a 60 meses: 396,02 €/mes
    expect(cuotaMensual(20000, 0.07, 60)).toBeCloseTo(396.02, 2);
  });

  it("sin intereses reparte el principal", () => {
    expect(cuotaMensual(12000, 0, 48)).toBe(250);
  });

  it("con cuota final el saldo tras el plazo es la cuota final", () => {
    const c = cuotaMensual(25000, 0.0899, 36, 12000);
    expect(c).toBeLessThan(cuotaMensual(25000, 0.0899, 36));
    expect(saldoPendiente(25000, 0.0899, c, 36)).toBeCloseTo(12000, 4);
  });
});

describe("saldoPendiente", () => {
  it("es el principal al inicio y cero al final", () => {
    const c = cuotaMensual(20000, 0.07, 60);
    expect(saldoPendiente(20000, 0.07, c, 0)).toBe(20000);
    expect(saldoPendiente(20000, 0.07, c, 60)).toBeCloseTo(0, 4);
  });
});

describe("tae", () => {
  it("sin comisiones es el TIN capitalizado mensualmente", () => {
    const c = cuotaMensual(20000, 0.07, 60);
    expect(tae(20000, 0, c, 60)).toBeCloseTo(Math.pow(1 + 0.07 / 12, 12) - 1, 6);
  });

  it("la comisión de apertura sube la TAE", () => {
    const c = cuotaMensual(20000, 0.07, 60);
    expect(tae(20000, 600, c, 60)).toBeGreaterThan(0.08);
  });
});

describe("tinImplicito", () => {
  it("recupera el TIN a partir de la cuota", () => {
    const c = cuotaMensual(25000, 0.0899, 36, 12000);
    expect(tinImplicito(25000, c, 36, 12000)).toBeCloseTo(0.0899, 6);
  });
});
