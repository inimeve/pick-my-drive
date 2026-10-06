// Vocabulario del dominio: ver CONTEXT.md

export type Motorizacion =
  | "gasolina"
  | "diesel"
  | "hibrido"
  | "hibrido_enchufable"
  | "electrico";

export type Estado = "nuevo" | "usado";

export type ModalidadId =
  | "contado"
  | "prestamo"
  | "cuota_final"
  | "renting"
  | "leasing"
  | "suscripcion";

export interface Consumo {
  /** l/100 km en uso real (para PHEV: con batería descargada) */
  litros100?: number;
  /** kWh/100 km en uso real */
  kwh100?: number;
  /** PHEV: fracción de km recorridos en modo eléctrico (0..1) */
  fraccionElectrica?: number;
}

export interface CocheCandidato {
  id: string;
  nombre: string;
  version: string;
  estado: Estado;
  motorizacion: Motorizacion;
  /** Precio final de venta: con IVA, transporte e impuesto de matriculación */
  pvp: number;
  /** Emisiones WLTP en g/km, para el impuesto de matriculación */
  co2: number;
  cvFiscales: number;
  /** Edad y km del coche en el momento de adquirirlo (0 si es nuevo) */
  edadInicialMeses: number;
  kmIniciales: number;
  /** Usado comprado a un particular: paga ITP en lugar de IVA */
  vendedorParticular: boolean;
  consumo: Consumo;
  garantiaMeses: number;
  garantiaKm: number;
  /** Depreciación: fracción perdida el primer año de vida y en cada año siguiente */
  depreciacionPrimerAnio: number;
  depreciacionAnual: number;
  mantenimientoAnual: number;
  /** Mantenimiento ya pagado: no cuesta nada hasta que el coche cumple estos meses de edad */
  mantenimientoIncluidoMeses?: number;
  /** Coste anual esperado de averías el primer año sin garantía */
  averiasAnual: number;
  seguroTodoRiesgoAnual: number;
  seguroTercerosAnual: number;
  neumaticosJuego: number;
  neumaticosVidaKm: number;
  /** Ayuda directa a la compra (Programa Auto+), en euros; la deducción de IRPF la pone el Territorio */
  ayudas: number;
  /** Procedencia y fecha de los datos por defecto */
  fuente?: string;
}

export interface PreciosEnergia {
  gasolina: number;
  diesel: number;
  kwhCasa: number;
  kwhPublica: number;
  /** Fracción de la carga que se hace en casa (0..1) */
  fraccionCargaCasa: number;
}

export interface PerfilUso {
  kmAnuales: number;
  horizonteMeses: number;
  territorioId: string;
  municipioId: string;
  oportunidadActiva: boolean;
  /** Rentabilidad anual alternativa del dinero (0.025 = 2,5%) */
  tipoOportunidad: number;
  /** Subida anual de costes de uso y energía */
  inflacion: number;
  energia: PreciosEnergia;
  /** Edad del coche (años) hasta la que se asegura a todo riesgo */
  aniosTodoRiesgo: number;
  tarifaItv: number;
  /** Multiplicador sobre el Valor residual para la vista de sensibilidad */
  ajusteValorResidual: number;
}

export interface DeduccionIrpf {
  /** Fracción deducible del precio */
  porcentaje: number;
  /** Base máxima sobre la que se aplica */
  baseMaxima: number;
  motorizaciones: Motorizacion[];
  /** La base se reduce en las ayudas públicas recibidas */
  restaAyudas: boolean;
}

export interface Territorio {
  id: string;
  nombre: string;
  /** Tipo de ITP para usados comprados a particulares */
  itp: number;
  /** ITP para turismos de más de 15 CV fiscales, si es distinto */
  itpMas15Cv?: number;
  /** ITP para coches eléctricos (etiqueta CERO), si es distinto */
  itpElectrico?: number;
  /** Ajuste sobre los tipos estatales del impuesto de matriculación (Canarias: -0.01) */
  ajusteMatriculacion?: number;
  /** Tipo del impuesto de matriculación para más de 200 g/km, si la comunidad lo sube */
  matriculacionMas200?: number;
  deduccionIrpf?: DeduccionIrpf;
  notas?: string;
  fuente?: string;
}

export interface TramoIvtm {
  /** CV fiscales a partir de los que se aplica la cuota */
  desdeCv: number;
  cuota: number;
}

export interface BonificacionIvtm {
  porcentaje: number;
  /** Años desde la primera matriculación durante los que se aplica (sin límite si no se indica) */
  anios?: number;
}

export interface Municipio {
  id: string;
  nombre: string;
  /** Territorio al que pertenece; "*" si vale para cualquiera */
  territorioId: string;
  /** Cuotas anuales de turismos, de menor a mayor potencia fiscal */
  ivtm: TramoIvtm[];
  bonificacionIvtm: Partial<Record<Motorizacion, BonificacionIvtm>>;
  fuente?: string;
}

/** Qué cubre la cuota de un contrato de uso */
export interface Inclusiones {
  seguro: boolean;
  mantenimiento: boolean;
  averias: boolean;
  neumaticos: boolean;
  impuestos: boolean;
  itv: boolean;
}

export interface CondicionesContado {
  modalidad: "contado";
  descuento: number;
}

export interface CondicionesPrestamo {
  modalidad: "prestamo";
  descuento: number;
  entrada: number;
  tin: number;
  plazoMeses: number;
  comisionApertura: number;
  comisionCancelacion: number;
  /** Si la oferta fija la cuota, se usa en lugar de calcularla y el TIN se deduce */
  cuotaOfertada?: number;
}

export interface CondicionesCuotaFinal {
  modalidad: "cuota_final";
  descuento: number;
  entrada: number;
  tin: number;
  plazoMeses: number;
  /** Cuota final garantizada que se paga (o se compensa con el coche) al final del plazo */
  cuotaFinal: number;
  comisionApertura: number;
  comisionCancelacion: number;
  kmAnualesContrato: number;
  excesoKm: number;
  daniosDevolucion: number;
  salida: "devolver" | "quedarse";
  cuotaOfertada?: number;
}

export interface CondicionesRenting {
  modalidad: "renting" | "suscripcion";
  cuota: number;
  entrada: number;
  plazoMeses: number;
  kmAnualesContrato: number;
  excesoKm: number;
  daniosDevolucion: number;
  /** Fracción de las cuotas restantes que se paga si se cancela antes de tiempo */
  penalizacionCancelacion: number;
  incluye: Inclusiones;
}

export interface CondicionesLeasing {
  modalidad: "leasing";
}

export type Condiciones =
  | CondicionesContado
  | CondicionesPrestamo
  | CondicionesCuotaFinal
  | CondicionesRenting
  | CondicionesLeasing;

/** Oferta real en lugar de una estimación: un presupuesto o una oferta publicada por la marca */
export interface OfertaReal {
  /** Presupuesto hecho para ti (concesionario, plataforma de renting) u oferta que la marca publica en
   * su web o su configurador; sin indicar, presupuesto */
  tipo?: "presupuesto" | "web";
  /** Quién la hizo y cuándo */
  origen: string;
  /** Último día de validez (AAAA-MM-DD), si se conoce */
  hasta?: string;
}

export interface Escenario {
  id: string;
  cocheId: string;
  condiciones: Condiciones;
  visible: boolean;
  fuente?: string;
  ofertaReal?: OfertaReal;
  /** Quién la ofrece (BYD Renting, Idoneo…): distingue dos ofertas del mismo coche, modalidad y plazo */
  proveedor?: string;
}

export type Categoria =
  | "vehiculo"
  | "impuestos"
  | "intereses"
  | "comisiones"
  | "principal"
  | "cuotas"
  | "energia"
  | "seguro"
  | "mantenimiento"
  | "averias"
  | "neumaticos"
  | "itv_ivtm"
  | "fin_contrato"
  | "ayudas";

export interface Apunte {
  mes: number;
  categoria: Categoria;
  importe: number;
}
