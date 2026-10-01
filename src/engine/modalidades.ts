import type { Categoria, ModalidadId } from "./tipos";

export interface InfoModalidad {
  id: ModalidadId;
  nombre: string;
  resumen: string;
  /** Quién es el dueño del coche */
  propiedad: string;
  aplica: boolean;
  porQueNoAplica?: string;
}

export const MODALIDADES: InfoModalidad[] = [
  {
    id: "contado",
    nombre: "Contado",
    resumen: "Pagas el coche entero el día de la compra.",
    propiedad: "Tuyo desde el primer día",
    aplica: true,
  },
  {
    id: "prestamo",
    nombre: "Préstamo clásico",
    resumen:
      "Un préstamo (del banco o del concesionario) que devuelves en cuotas fijas hasta saldar la deuda.",
    propiedad: "Tuyo desde el primer día",
    aplica: true,
  },
  {
    id: "cuota_final",
    nombre: "Financiación con cuota final",
    resumen:
      "Cuotas bajas y una última cuota grande garantizada. Al final eliges: devolver el coche, quedártelo pagando esa cuota o cambiarlo.",
    propiedad: "Tuyo, con la deuda de la cuota final pendiente",
    aplica: true,
  },
  {
    id: "renting",
    nombre: "Renting",
    resumen:
      "Alquiler a largo plazo (3-5 años). La cuota incluye seguro, mantenimiento e impuestos; tú pagas la energía.",
    propiedad: "Nunca es tuyo",
    aplica: true,
  },
  {
    id: "suscripcion",
    nombre: "Suscripción",
    resumen:
      "Alquiler flexible mes a mes, con todo incluido y poca o ninguna permanencia. Pagas la flexibilidad.",
    propiedad: "Nunca es tuyo",
    aplica: true,
  },
  {
    id: "leasing",
    nombre: "Leasing",
    resumen:
      "Arrendamiento financiero con opción de compra al final, pensado para autónomos y empresas.",
    propiedad: "De la entidad hasta ejercer la opción de compra",
    aplica: false,
    porQueNoAplica:
      "Su ventaja es fiscal: el autónomo o la empresa deduce el IVA y mete las cuotas como gasto. Un particular no puede hacer ninguna de las dos cosas, así que sería un préstamo con cuota final más caro y menos flexible, y muchas entidades ni lo ofrecen a particulares.",
  },
];

export const nombreModalidad = (id: ModalidadId) =>
  MODALIDADES.find((m) => m.id === id)!.nombre;

/** Grupos del desglose: ocho como máximo, para que cada uno tenga su color */
export interface GrupoDesglose {
  id: string;
  nombre: string;
  categorias: (Categoria | "oportunidad")[];
}

export const GRUPOS_DESGLOSE: GrupoDesglose[] = [
  { id: "depreciacion", nombre: "Depreciación (menos ayudas)", categorias: ["vehiculo", "ayudas", "principal"] },
  { id: "contrato", nombre: "Cuotas y fin de contrato", categorias: ["cuotas", "fin_contrato"] },
  { id: "financiacion", nombre: "Intereses y comisiones", categorias: ["intereses", "comisiones"] },
  { id: "impuestos", nombre: "Impuestos, ITV e IVTM", categorias: ["impuestos", "itv_ivtm"] },
  { id: "energia", nombre: "Energía", categorias: ["energia"] },
  { id: "seguro", nombre: "Seguro", categorias: ["seguro"] },
  { id: "mantenimiento", nombre: "Mantenimiento, averías y neumáticos", categorias: ["mantenimiento", "averias", "neumaticos"] },
  { id: "oportunidad", nombre: "Coste de oportunidad", categorias: ["oportunidad"] },
];
