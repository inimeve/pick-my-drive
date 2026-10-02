import { describe, expect, it } from "vitest";
import { importeGrupo, resumir } from "./resumen";
import type { Resultado } from "./simulacion";
import type { CondicionesCuotaFinal } from "./tipos";

// compra de 12.000 € con 100 €/mes de uso durante 2 meses; al final el coche vale 9.000 € y el dinero habría rendido 50 €
const compra: Resultado = {
  escenarioId: "compra",
  aplica: true,
  costeNeto: [0, 0, 12000 + 200 - 9000 + 50],
  costeNetoSinPenalizacion: [],
  caja: [12000, 100, 100],
  desembolsoAcumulado: [12000, 12100, 12200],
  pagoInicial: 12000,
  desglose: { vehiculo: 3000, mantenimiento: 150, neumaticos: 50, oportunidad: 50 },
  avisos: [],
};

describe("resumir", () => {
  const r = resumir(compra, { modalidad: "contado", descuento: 0 }, 2);

  it("cuadra las cuentas: pagado menos lo que recuperas más lo que dejas de ganar", () => {
    expect(r.pagado).toBe(12200);
    expect(r.alFinal).toBe(-9000);
    expect(r.oportunidad).toBe(50);
    expect(r.pagado + r.alFinal + r.oportunidad).toBe(r.costeNeto);
  });

  it("la media al mes no cuenta el pago del primer día", () => {
    expect(r.pagoInicial).toBe(12000);
    expect(r.mediaMes).toBe(100);
  });

  it("con cuota final el coche solo es tuyo si te lo quedas", () => {
    const c = { modalidad: "cuota_final", salida: "devolver" } as CondicionesCuotaFinal;
    expect(resumir(compra, c, 2).tuyo).toBe(false);
    expect(resumir(compra, { ...c, salida: "quedarse" }, 2).tuyo).toBe(true);
  });
});

describe("importeGrupo", () => {
  it("suma las categorías del grupo", () => {
    expect(importeGrupo(compra, "mantenimiento")).toBe(200);
    expect(importeGrupo(compra, "no-existe")).toBe(0);
  });
});
