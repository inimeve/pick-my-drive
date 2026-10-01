import { describe, expect, it } from "vitest";
import type { Resultado } from "./simulacion";
import type { PerfilUso } from "./tipos";
import { clasificar, veredicto } from "./veredicto";

const resultado = (escenarioId: string, costeNeto: number[]): Resultado => ({
  escenarioId,
  aplica: true,
  costeNeto,
  costeNetoSinPenalizacion: costeNeto,
  caja: [],
  pagoInicial: 0,
  desglose: {},
  avisos: [],
});

const perfil = { horizonteMeses: 24, kmAnuales: 15000, ajusteValorResidual: 1 } as PerfilUso;

describe("clasificar", () => {
  it("ordena por Coste neto final y descarta los que no aplican", () => {
    const r = clasificar([
      resultado("a", [0, 300]),
      { ...resultado("leasing", []), aplica: false },
      resultado("b", [0, 200]),
    ]);
    expect(r.map((x) => x.escenarioId)).toEqual(["b", "a"]);
  });
});

describe("veredicto", () => {
  // "renting" es más barato hasta el mes 17; "compra" gana al final
  const lineal = (inicio: number, pendiente: number) =>
    Array.from({ length: 25 }, (_, m) => inicio + pendiente * m);
  const simularTodo = (p: PerfilUso) => [
    resultado("compra", lineal(5000, 300 + (p.kmAnuales - 15000) / 100)),
    resultado("renting", lineal(0, 600)),
  ];

  it("indica el ganador, el ahorro y cuándo ganaría otro", () => {
    const v = veredicto(perfil, simularTodo, (id) => id)!;
    expect(v.ganadorId).toBe("compra");
    expect(v.ahorro).toBeCloseTo(600 * 24 - (5000 + 300 * 24), 6);
    const tiempo = v.condiciones.find((c) => c.tipo === "tiempo")!;
    expect(tiempo.escenarioId).toBe("renting");
    expect(tiempo.texto).toContain("mes 17");
  });

  it("encuentra el umbral de km en que cambia el ganador", () => {
    const v = veredicto(perfil, simularTodo, (id) => id)!;
    const km = v.condiciones.find((c) => c.tipo === "km")!;
    expect(km.escenarioId).toBe("renting");
    expect(km.texto).toContain("o más");
  });
});
