import { ivtmAnual, tocaItv } from "./fiscalidad";
import type {
  Apunte,
  CocheCandidato,
  Inclusiones,
  Municipio,
  PerfilUso,
} from "./tipos";

/** Fracción del valor de nuevo que conserva un coche con `edadMeses` */
export function factorValor(coche: CocheCandidato, edadMeses: number): number {
  const primerAnio = Math.min(edadMeses, 12) / 12;
  const resto = Math.max(0, edadMeses - 12) / 12;
  return (
    Math.pow(1 - coche.depreciacionPrimerAnio, primerAnio) *
    Math.pow(1 - coche.depreciacionAnual, resto)
  );
}

/** Valor residual tras `mesesEnPropiedad`, a partir del precio al que se adquirió */
export function valorResidual(
  coche: CocheCandidato,
  mesesEnPropiedad: number,
  perfil: PerfilUso,
): number {
  const edad0 = coche.edadInicialMeses;
  const factor =
    factorValor(coche, edad0 + mesesEnPropiedad) / factorValor(coche, edad0);
  return coche.pvp * factor * perfil.ajusteValorResidual;
}

/** Coste de energía por km al precio actual */
export function energiaPorKm(coche: CocheCandidato, perfil: PerfilUso): number {
  const e = perfil.energia;
  const kwh =
    e.kwhCasa * e.fraccionCargaCasa + e.kwhPublica * (1 - e.fraccionCargaCasa);
  const litro = coche.motorizacion === "diesel" ? e.diesel : e.gasolina;
  const { litros100 = 0, kwh100 = 0 } = coche.consumo;
  switch (coche.motorizacion) {
    case "electrico":
      return (kwh100 / 100) * kwh;
    case "hibrido_enchufable": {
      const f = coche.consumo.fraccionElectrica ?? 0;
      return f * (kwh100 / 100) * kwh + (1 - f) * (litros100 / 100) * litro;
    }
    default:
      return (litros100 / 100) * litro;
  }
}

const SIN_INCLUSIONES: Inclusiones = {
  seguro: false,
  mantenimiento: false,
  averias: false,
  neumaticos: false,
  impuestos: false,
  itv: false,
};

/**
 * Costes de uso del mes `mes` de la simulación (1..H), con el coche en su
 * mes `mesEnPropiedad` (1..) desde que se adquirió.
 */
export function costesUsoMes(
  coche: CocheCandidato,
  perfil: PerfilUso,
  municipio: Municipio,
  mes: number,
  mesEnPropiedad: number,
  incluye: Inclusiones = SIN_INCLUSIONES,
): Apunte[] {
  const inflacion = Math.pow(1 + perfil.inflacion, (mes - 1) / 12);
  const edadMeses = coche.edadInicialMeses + mesEnPropiedad;
  const edadAnios = (edadMeses - 1) / 12;
  const kmMes = perfil.kmAnuales / 12;
  const km = coche.kmIniciales + kmMes * mesEnPropiedad;
  const apuntes: Apunte[] = [];
  const apunta = (categoria: Apunte["categoria"], importe: number) => {
    if (importe !== 0) apuntes.push({ mes, categoria, importe });
  };

  apunta("energia", kmMes * energiaPorKm(coche, perfil) * inflacion);

  if (!incluye.seguro) {
    const anual =
      edadAnios < perfil.aniosTodoRiesgo
        ? coche.seguroTodoRiesgoAnual
        : coche.seguroTercerosAnual;
    apunta("seguro", (anual / 12) * inflacion);
  }

  if (!incluye.mantenimiento && edadMeses > (coche.mantenimientoIncluidoMeses ?? 0)) {
    // el mantenimiento crece con la edad: más piezas de desgaste
    const crecimiento = 1 + 0.06 * Math.floor(edadAnios);
    apunta("mantenimiento", (coche.mantenimientoAnual / 12) * crecimiento * inflacion);
  }

  const enGarantia = edadMeses <= coche.garantiaMeses && km <= coche.garantiaKm;
  if (!incluye.averias && !enGarantia) {
    const finGarantiaMeses = Math.min(
      coche.garantiaMeses,
      Math.max(0, (coche.garantiaKm - coche.kmIniciales) / kmMes) +
        coche.edadInicialMeses,
    );
    const aniosSinGarantia = Math.floor((edadMeses - finGarantiaMeses) / 12);
    apunta(
      "averias",
      (coche.averiasAnual / 12) * (1 + 0.15 * aniosSinGarantia) * inflacion,
    );
  }

  if (!incluye.neumaticos) {
    apunta(
      "neumaticos",
      (kmMes / coche.neumaticosVidaKm) * coche.neumaticosJuego * inflacion,
    );
  }

  // el impuesto de circulación se paga una vez al año, al inicio de cada año de uso
  if (!incluye.impuestos && (mesEnPropiedad - 1) % 12 === 0) {
    apunta("itv_ivtm", ivtmAnual(coche, municipio, Math.floor(edadAnios)) * inflacion);
  }

  if (!incluye.itv && tocaItv(edadMeses)) {
    apunta("itv_ivtm", perfil.tarifaItv * inflacion);
  }

  return apuntes;
}
