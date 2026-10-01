import type { Resultado } from "./simulacion";
import type { PerfilUso } from "./tipos";

export interface Condicion {
  tipo: "tiempo" | "km" | "valor_residual";
  /** Escenario que pasaría a ganar */
  escenarioId: string;
  texto: string;
}

export interface Veredicto {
  ganadorId: string;
  segundoId?: string;
  /** Lo que ahorra el ganador frente al segundo al final del Horizonte */
  ahorro: number;
  condiciones: Condicion[];
}

/** Resultados que aplican, de menor a mayor Coste neto al final del Horizonte */
export function clasificar(resultados: Resultado[]): Resultado[] {
  return resultados
    .filter((r) => r.aplica)
    .sort((a, b) => final(a) - final(b));
}

const final = (r: Resultado) => r.costeNeto[r.costeNeto.length - 1]!;

function ganadorEn(resultados: Resultado[], m: number): Resultado | undefined {
  let mejor: Resultado | undefined;
  for (const r of resultados)
    if (r.aplica && (!mejor || r.costeNeto[m]! < mejor.costeNeto[m]!)) mejor = r;
  return mejor;
}

export function veredicto(
  perfil: PerfilUso,
  simularTodo: (perfil: PerfilUso) => Resultado[],
  nombre: (escenarioId: string) => string,
): Veredicto | undefined {
  const resultados = simularTodo(perfil);
  const ranking = clasificar(resultados);
  const ganador = ranking[0];
  if (!ganador) return undefined;
  const segundo = ranking[1];
  const condiciones: Condicion[] = [];

  // tiempo: último mes (antes del final) en el que ganaba otro Escenario
  const H = perfil.horizonteMeses;
  for (let m = H - 1; m >= 12; m--) {
    const otro = ganadorEn(resultados, m);
    if (otro && otro.escenarioId !== ganador.escenarioId) {
      condiciones.push({
        tipo: "tiempo",
        escenarioId: otro.escenarioId,
        texto: `Si cambias de coche antes del mes ${m + 1}, gana ${nombre(otro.escenarioId)}.`,
      });
      break;
    }
  }

  // km: umbrales más cercanos por arriba y por abajo en los que cambia el ganador
  const paso = 1000;
  for (const sentido of [-1, 1]) {
    for (let km = perfil.kmAnuales + sentido * paso; km >= 5000 && km <= 40000; km += sentido * paso) {
      const otro = clasificar(simularTodo({ ...perfil, kmAnuales: km }))[0];
      if (otro && otro.escenarioId !== ganador.escenarioId) {
        const miles = (km / 1000).toLocaleString("es-ES");
        condiciones.push({
          tipo: "km",
          escenarioId: otro.escenarioId,
          texto:
            sentido > 0
              ? `Si haces ${miles}.000 km al año o más, gana ${nombre(otro.escenarioId)}.`
              : `Si haces ${miles}.000 km al año o menos, gana ${nombre(otro.escenarioId)}.`,
        });
        break;
      }
    }
  }

  // valor residual: el dato más incierto
  for (const ajuste of [0.85, 1.15]) {
    const otro = clasificar(
      simularTodo({ ...perfil, ajusteValorResidual: perfil.ajusteValorResidual * ajuste }),
    )[0];
    if (otro && otro.escenarioId !== ganador.escenarioId)
      condiciones.push({
        tipo: "valor_residual",
        escenarioId: otro.escenarioId,
        texto: `Si los coches valen un ${ajuste < 1 ? "15% menos" : "15% más"} de lo estimado al venderlos, gana ${nombre(otro.escenarioId)}.`,
      });
  }

  return {
    ganadorId: ganador.escenarioId,
    segundoId: segundo?.escenarioId,
    ahorro: segundo ? final(segundo) - final(ganador) : 0,
    condiciones,
  };
}
