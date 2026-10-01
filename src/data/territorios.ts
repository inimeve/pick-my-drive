import type { DeduccionIrpf, Municipio, Territorio, TramoIvtm } from "../engine/tipos";

// Fuente: docs/research/fiscalidad-y-finanzas.md (consultado 2026-10-01)

/** Deducción estatal del 15% por coche eléctrico o enchufable nuevo (régimen común, compras de 2026) */
const DEDUCCION_ESTATAL: DeduccionIrpf = {
  porcentaje: 0.15,
  baseMaxima: 20000,
  motorizaciones: ["electrico", "hibrido_enchufable"],
  restaAyudas: true,
};

const comun = (t: Omit<Territorio, "deduccionIrpf">): Territorio => ({
  ...t,
  deduccionIrpf: DEDUCCION_ESTATAL,
});

const HACIENDA_2026 = "Hacienda, Tributación Autonómica. Medidas 2026 (cap. I y IV)";

export const TERRITORIOS: Territorio[] = [
  {
    id: "bizkaia",
    nombre: "Bizkaia",
    itp: 0.04,
    deduccionIrpf: { porcentaje: 0.05, baseMaxima: 40000, motorizaciones: ["electrico"], restaAyudas: false },
    notas: "Deducción foral del 5% en IRPF por eléctrico nuevo (10% si achatarras), NF 2/2025. La deducción estatal del 15% no aplica.",
    fuente: "Hacienda Foral de Bizkaia (NF 1/2011, NF 2/2025)",
  },
  { id: "gipuzkoa", nombre: "Gipuzkoa", itp: 0.04, notas: "Deducción foral de IRPF por eléctrico no investigada.", fuente: "Hacienda Foral de Gipuzkoa" },
  { id: "alava", nombre: "Álava", itp: 0.04, notas: "ITP no verificado en fuente primaria. Deducción foral de IRPF no investigada.", fuente: "Fuente secundaria" },
  { id: "navarra", nombre: "Navarra", itp: 0.04, notas: "Exentos de ITP los turismos de 10 años o más (guía de 2022). Deducción foral de IRPF no investigada.", fuente: "Hacienda Foral de Navarra" },
  comun({ id: "andalucia", nombre: "Andalucía", itp: 0.04, itpMas15Cv: 0.08, itpElectrico: 0.01, fuente: HACIENDA_2026 }),
  comun({ id: "aragon", nombre: "Aragón", itp: 0.04, notas: "Cuota fija para usados de más de 10 años.", fuente: HACIENDA_2026 }),
  comun({ id: "asturias", nombre: "Asturias", itp: 0.04, itpMas15Cv: 0.08, matriculacionMas200: 0.16, fuente: HACIENDA_2026 }),
  comun({ id: "baleares", nombre: "Illes Balears", itp: 0.04, itpMas15Cv: 0.08, itpElectrico: 0, matriculacionMas200: 0.16, fuente: HACIENDA_2026 }),
  comun({ id: "canarias", nombre: "Canarias", itp: 0.055, ajusteMatriculacion: -0.01, notas: "Cuota fija para turismos usados según antigüedad y cilindrada.", fuente: HACIENDA_2026 }),
  comun({ id: "cantabria", nombre: "Cantabria", itp: 0.06, matriculacionMas200: 0.15, notas: "Cuotas fijas para turismos usados.", fuente: HACIENDA_2026 }),
  comun({ id: "castilla_la_mancha", nombre: "Castilla-La Mancha", itp: 0.06, fuente: HACIENDA_2026 }),
  comun({ id: "castilla_y_leon", nombre: "Castilla y León", itp: 0.05, itpMas15Cv: 0.08, fuente: HACIENDA_2026 }),
  comun({ id: "cataluna", nombre: "Cataluña", itp: 0.05, itpElectrico: 0, matriculacionMas200: 0.16, notas: "Usados de 10 años o más y menos de 40.000 € no autoliquidan.", fuente: HACIENDA_2026 }),
  comun({ id: "valencia", nombre: "Comunitat Valenciana", itp: 0.06, matriculacionMas200: 0.16, notas: "8% si tiene 5 años o menos y más de 2.000 cc o vale 20.000 € o más; cuotas fijas si tiene más de 5 años y vale menos de 20.000 €.", fuente: HACIENDA_2026 }),
  comun({ id: "extremadura", nombre: "Extremadura", itp: 0.06, fuente: HACIENDA_2026 }),
  comun({ id: "galicia", nombre: "Galicia", itp: 0.03, itpElectrico: 0, notas: "Cuota fija para usados de 15 años o más.", fuente: HACIENDA_2026 }),
  comun({ id: "madrid", nombre: "Madrid", itp: 0.04, fuente: HACIENDA_2026 }),
  comun({ id: "murcia", nombre: "Región de Murcia", itp: 0.04, matriculacionMas200: 0.159, notas: "Cuota fija para usados de más de 12 años.", fuente: HACIENDA_2026 }),
  comun({ id: "rioja", nombre: "La Rioja", itp: 0.04, fuente: HACIENDA_2026 }),
];

/** Cuotas mínimas estatales de IVTM (art. 95 TRLRHL) */
const MINIMOS = [12.62, 34.08, 71.94, 89.61, 112.0];
const DESDE = [0, 8, 12, 16, 20];

/** Tramos de un municipio que aplica un coeficiente sobre los mínimos estatales */
const porCoeficiente = (cuota12a16: number): TramoIvtm[] =>
  MINIMOS.map((m, k) => ({ desdeCv: DESDE[k]!, cuota: Math.round((m * cuota12a16) / MINIMOS[2]! * 100) / 100 }));

const GUIAFISCAL = "guiafiscal.es (tramo de 12-15,99 CV); resto de tramos estimados por coeficiente";

export const MUNICIPIOS: Municipio[] = [
  {
    id: "bilbao",
    nombre: "Bilbao",
    territorioId: "bizkaia",
    ivtm: [
      { desdeCv: 0, cuota: 26.05 },
      { desdeCv: 8, cuota: 71.45 },
      { desdeCv: 12, cuota: 153.25 },
      { desdeCv: 14, cuota: 216.95 },
      { desdeCv: 16, cuota: 282.7 },
      { desdeCv: 20, cuota: 361.7 },
    ],
    bonificacionIvtm: {
      electrico: { porcentaje: 0.95 },
      hibrido: { porcentaje: 0.75, anios: 5 },
      hibrido_enchufable: { porcentaje: 0.75, anios: 5 },
    },
    fuente: "Ayuntamiento de Bilbao, Ordenanza Fiscal nº 2 (2026)",
  },
  {
    id: "donostia",
    nombre: "Donostia / San Sebastián",
    territorioId: "gipuzkoa",
    ivtm: [
      ...porCoeficiente(156.56).slice(0, 3),
      { desdeCv: 14, cuota: 226.31 },
      ...porCoeficiente(226.31).slice(3),
    ],
    bonificacionIvtm: { electrico: { porcentaje: 0.95, anios: 3 }, hibrido: { porcentaje: 0.75 }, hibrido_enchufable: { porcentaje: 0.75 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "vitoria",
    nombre: "Vitoria-Gasteiz",
    territorioId: "alava",
    ivtm: porCoeficiente(169.27),
    bonificacionIvtm: { electrico: { porcentaje: 0.9, anios: 6 }, hibrido: { porcentaje: 0.5, anios: 6 }, hibrido_enchufable: { porcentaje: 0.5, anios: 6 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "pamplona",
    nombre: "Pamplona / Iruña",
    territorioId: "navarra",
    ivtm: porCoeficiente(141.38),
    bonificacionIvtm: { electrico: { porcentaje: 0.5 }, hibrido: { porcentaje: 0.25 }, hibrido_enchufable: { porcentaje: 0.25 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "madrid",
    nombre: "Madrid",
    territorioId: "madrid",
    ivtm: porCoeficiente(129),
    bonificacionIvtm: { electrico: { porcentaje: 0.75 }, hibrido_enchufable: { porcentaje: 0.75 }, hibrido: { porcentaje: 0.75, anios: 6 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "barcelona",
    nombre: "Barcelona",
    territorioId: "cataluna",
    ivtm: porCoeficiente(143.88),
    bonificacionIvtm: { electrico: { porcentaje: 0.75, anios: 5 }, hibrido: { porcentaje: 0.5, anios: 5 }, hibrido_enchufable: { porcentaje: 0.5, anios: 5 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "valencia",
    nombre: "València",
    territorioId: "valencia",
    ivtm: porCoeficiente(128.05),
    bonificacionIvtm: { electrico: { porcentaje: 0.75 }, hibrido: { porcentaje: 0.75 }, hibrido_enchufable: { porcentaje: 0.75 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "sevilla",
    nombre: "Sevilla",
    territorioId: "andalucia",
    ivtm: porCoeficiente(130.93),
    bonificacionIvtm: { electrico: { porcentaje: 0.75, anios: 5 }, hibrido: { porcentaje: 0.75, anios: 5 }, hibrido_enchufable: { porcentaje: 0.75, anios: 5 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "malaga",
    nombre: "Málaga",
    territorioId: "andalucia",
    ivtm: porCoeficiente(138.9),
    bonificacionIvtm: { electrico: { porcentaje: 0.75, anios: 5 }, hibrido: { porcentaje: 0.75, anios: 5 }, hibrido_enchufable: { porcentaje: 0.75, anios: 5 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "zaragoza",
    nombre: "Zaragoza",
    territorioId: "aragon",
    ivtm: porCoeficiente(123.6),
    bonificacionIvtm: { electrico: { porcentaje: 0.75 }, hibrido_enchufable: { porcentaje: 0.75, anios: 10 }, hibrido: { porcentaje: 0.75, anios: 6 } },
    fuente: GUIAFISCAL,
  },
  {
    id: "otro",
    nombre: "Otro (cuota mínima legal)",
    territorioId: "*",
    ivtm: porCoeficiente(MINIMOS[2]!),
    bonificacionIvtm: {},
    fuente: "Cuotas mínimas del art. 95 TRLRHL; muchos ayuntamientos cobran hasta el doble",
  },
];
