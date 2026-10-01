import { costesUsoMes, valorResidual } from "./costes";
import { cuotaMensual, saldoPendiente, tae, tinImplicito } from "./finanzas";
import { deduccionIrpf, matriculacionIncluida, tipoItp } from "./fiscalidad";
import type {
  Apunte,
  Categoria,
  CocheCandidato,
  CondicionesCuotaFinal,
  CondicionesPrestamo,
  CondicionesRenting,
  Escenario,
  Inclusiones,
  Municipio,
  PerfilUso,
  Territorio,
} from "./tipos";

/** Tasa DGT de transferencia de un vehículo */
export const TASA_TRANSFERENCIA = 55.7;

export interface Contexto {
  perfil: PerfilUso;
  territorio: Territorio;
  municipio: Municipio;
}

export interface Financiacion {
  principal: number;
  cuota: number;
  tin: number;
  tae: number;
  plazoMeses: number;
  cuotaFinal: number;
}

function acumula(xs: number[]): number[] {
  let suma = 0;
  return xs.map((x) => (suma += x));
}

export interface Resultado {
  escenarioId: string;
  aplica: boolean;
  motivoNoAplica?: string;
  /** Coste neto si se sale del Escenario en el mes m (0..H), con penalización por cancelar el contrato */
  costeNeto: number[];
  /** Igual que `costeNeto` pero suponiendo que el contrato no se cancela: sin penalización */
  costeNetoSinPenalizacion: number[];
  /** Dinero que sale del bolsillo cada mes (0..H) */
  caja: number[];
  /** Lo puesto de bolsillo hasta cada mes (0..H): suma de `caja`, sin restar el valor del coche */
  desembolsoAcumulado: number[];
  /** Lo que se paga el primer día, sin descontar ayudas (llegan meses después) */
  pagoInicial: number;
  /** Desglose del Coste neto al final del Horizonte */
  desglose: Partial<Record<Categoria | "oportunidad", number>>;
  financiacion?: Financiacion;
  avisos: string[];
}

/** Un ciclo es un periodo con el mismo coche: la compra, o cada contrato renovado */
interface Ciclo {
  inicio: number;
  fin: number;
  /** Apuntes del ciclo indexados por mes absoluto */
  apuntes: Apunte[];
  /** Coste de salida si se abandona en el mes m (inicio <= m < fin, o cualquier m si no termina).
   * Con `penalizar` falso no incluye la penalización por cancelar un contrato de uso. */
  salida: (m: number, penalizar?: boolean) => Apunte[];
  incluye?: Inclusiones;
}

const SIN_FIN = Number.POSITIVE_INFINITY;

export function simular(
  escenario: Escenario,
  coche: CocheCandidato,
  ctx: Contexto,
): Resultado {
  const H = ctx.perfil.horizonteMeses;
  const c = escenario.condiciones;
  const avisos: string[] = [];

  if (c.modalidad === "leasing") {
    return {
      escenarioId: escenario.id,
      aplica: false,
      motivoNoAplica:
        "El leasing es para autónomos y empresas: su ventaja es deducir el IVA y meter las cuotas como gasto. Un particular no puede hacerlo y muchas entidades ni se lo ofrecen.",
      costeNeto: [],
      costeNetoSinPenalizacion: [],
      caja: [],
      desembolsoAcumulado: [],
      pagoInicial: 0,
      desglose: {},
      avisos,
    };
  }

  let ciclos: Ciclo[];
  let financiacion: Financiacion | undefined;

  switch (c.modalidad) {
    case "contado":
      ciclos = [cicloCompra(coche, ctx, 0, c.descuento)];
      break;
    case "prestamo": {
      const r = cicloPrestamo(coche, ctx, c);
      ciclos = [r.ciclo];
      financiacion = r.financiacion;
      if (c.plazoMeses > H)
        avisos.push(
          `El préstamo dura ${c.plazoMeses} meses, más que el Horizonte: al final se cancela la deuda pendiente.`,
        );
      break;
    }
    case "cuota_final": {
      ciclos = [];
      for (let inicio = 0; inicio < H || inicio === 0; inicio += c.plazoMeses) {
        const r = cicloCuotaFinal(coche, ctx, c, inicio);
        ciclos.push(r.ciclo);
        financiacion ??= r.financiacion;
        if (c.salida === "quedarse") break;
      }
      if (ciclos.length > 1)
        avisos.push(
          `El contrato dura ${c.plazoMeses} meses: se supone que al acabar se renueva con un coche igual y las mismas condiciones.`,
        );
      break;
    }
    case "renting":
    case "suscripcion": {
      const renovable = c.modalidad === "renting";
      ciclos = [];
      for (let inicio = 0; inicio < H || inicio === 0; inicio += c.plazoMeses) {
        // las renovaciones se contratan solo por los meses que faltan hasta el Horizonte
        const plazoMeses = inicio === 0 ? c.plazoMeses : Math.min(c.plazoMeses, H - inicio);
        ciclos.push(cicloUso(ctx, { ...c, plazoMeses }, inicio, renovable));
        if (!renovable) break;
      }
      if (ciclos.length > 1)
        avisos.push(
          `El renting dura ${c.plazoMeses} meses: se supone que al acabar se renueva con la misma cuota hasta completar el horizonte.`,
        );
      break;
    }
  }

  // costes de uso de cada mes, imputados al ciclo con el coche de ese mes
  for (let m = 1; m <= H; m++) {
    const ciclo = cicloActivo(ciclos, m);
    ciclo.apuntes.push(
      ...costesUsoMes(coche, ctx.perfil, ctx.municipio, m, m - ciclo.inicio, ciclo.incluye),
    );
  }

  const r = ctx.perfil.oportunidadActiva ? ctx.perfil.tipoOportunidad : 0;
  const capitaliza = (meses: number) => Math.pow(1 + r, meses / 12);

  const caja = new Array<number>(H + 1).fill(0);
  for (const ciclo of ciclos)
    for (const a of ciclo.apuntes) if (a.mes <= H) caja[a.mes]! += a.importe;

  // por ciclo, lo pagado hasta cada mes capitalizado a ese mes: S(m) = S(m-1)·g + pagos(m)
  const g = capitaliza(1);
  const acumulado = ciclos.map((ciclo) => {
    const porMes = new Array<number>(H + 1).fill(0);
    for (const a of ciclo.apuntes) if (a.mes <= H) porMes[a.mes]! += a.importe;
    const s: number[] = [];
    porMes.forEach((importe, m) => s.push((m > 0 ? s[m - 1]! * g : 0) + importe));
    return s;
  });

  const costeNetoCon = (penalizar: boolean) => {
    const serie: number[] = [];
    for (let m = 0; m <= H; m++) {
      const activo = cicloActivo(ciclos, m);
      let total = 0;
      ciclos.forEach((ciclo, k) => {
        if (ciclo.inicio <= activo.inicio) total += acumulado[k]![m]!;
      });
      if (m < activo.fin) for (const a of activo.salida(m, penalizar)) total += a.importe;
      serie.push(total);
    }
    return serie;
  };
  const costeNeto = costeNetoCon(true);
  const costeNetoSinPenalizacion = costeNetoCon(false);

  // desglose por categoría al final del Horizonte
  const desglose: Resultado["desglose"] = {};
  const suma = (categoria: Categoria | "oportunidad", importe: number) => {
    desglose[categoria] = (desglose[categoria] ?? 0) + importe;
  };
  for (const ciclo of ciclos)
    for (const a of ciclo.apuntes) {
      if (a.mes > H) continue;
      suma(a.categoria, a.importe);
      suma("oportunidad", a.importe * (capitaliza(H - a.mes) - 1));
    }
  const ultimo = cicloActivo(ciclos, H);
  if (H < ultimo.fin) for (const a of ultimo.salida(H)) suma(a.categoria, a.importe);

  let pagoInicial = caja[0]!;
  for (const ciclo of ciclos)
    for (const a of ciclo.apuntes) if (a.mes === 0 && a.categoria === "ayudas") pagoInicial -= a.importe;

  return {
    escenarioId: escenario.id,
    aplica: true,
    costeNeto,
    costeNetoSinPenalizacion,
    caja,
    desembolsoAcumulado: acumula(caja),
    pagoInicial,
    desglose,
    financiacion,
    avisos,
  };
}

/** Ciclo en el que está el coche durante el mes m: el que empezó antes de m (o el primero) */
function cicloActivo(ciclos: Ciclo[], m: number): Ciclo {
  let activo = ciclos[0]!;
  for (const ciclo of ciclos) if (ciclo.inicio < m) activo = ciclo;
  return activo;
}

/** Valor de mercado de referencia: lo que se pagó por el coche */
function cocheAlPrecio(coche: CocheCandidato, descuento: number): CocheCandidato {
  return { ...coche, pvp: coche.pvp - descuento };
}

/** Apuntes de adquirir el coche en propiedad en el mes `inicio` */
function apuntesAdquisicion(
  coche: CocheCandidato,
  ctx: Contexto,
  inicio: number,
  descuento: number,
): Apunte[] {
  const matriculacion = matriculacionIncluida(coche, ctx.territorio);
  const precio = coche.pvp - descuento;
  const apuntes: Apunte[] = [
    { mes: inicio, categoria: "vehiculo", importe: precio - matriculacion },
  ];
  if (matriculacion > 0)
    apuntes.push({ mes: inicio, categoria: "impuestos", importe: matriculacion });
  if (coche.estado === "usado" && coche.vendedorParticular)
    apuntes.push({
      mes: inicio,
      categoria: "impuestos",
      importe: precio * tipoItp(coche, ctx.territorio) + TASA_TRANSFERENCIA,
    });
  // las ayudas y la deducción llegan meses después; se cuentan al comprar por simplicidad
  const ayudas = coche.ayudas + deduccionIrpf(coche, ctx.territorio, precio);
  if (ayudas > 0) apuntes.push({ mes: inicio, categoria: "ayudas", importe: -ayudas });
  return apuntes;
}

function cicloCompra(
  coche: CocheCandidato,
  ctx: Contexto,
  inicio: number,
  descuento: number,
): Ciclo {
  const referencia = cocheAlPrecio(coche, descuento);
  return {
    inicio,
    fin: SIN_FIN,
    apuntes: apuntesAdquisicion(coche, ctx, inicio, descuento),
    salida: (m) => [
      {
        mes: m,
        categoria: "vehiculo",
        importe: -valorResidual(referencia, m - inicio, ctx.perfil),
      },
    ],
  };
}

function resolverFinanciacion(
  principal: number,
  c: CondicionesPrestamo | CondicionesCuotaFinal,
  cuotaFinal: number,
): Financiacion {
  const cuota =
    c.cuotaOfertada ?? cuotaMensual(principal, c.tin, c.plazoMeses, cuotaFinal);
  const tin =
    c.cuotaOfertada !== undefined
      ? tinImplicito(principal, cuota, c.plazoMeses, cuotaFinal)
      : c.tin;
  return {
    principal,
    cuota,
    tin,
    tae: tae(principal, principal * c.comisionApertura, cuota, c.plazoMeses, cuotaFinal),
    plazoMeses: c.plazoMeses,
    cuotaFinal,
  };
}

/** Apuntes de las cuotas de un préstamo, separando intereses y principal */
function apuntesCuotas(f: Financiacion, inicio: number): Apunte[] {
  const apuntes: Apunte[] = [
    { mes: inicio, categoria: "principal", importe: -f.principal },
  ];
  let saldo = f.principal;
  const i = f.tin / 12;
  for (let k = 1; k <= f.plazoMeses; k++) {
    const interes = saldo * i;
    const amortizado = f.cuota - interes;
    saldo -= amortizado;
    apuntes.push({ mes: inicio + k, categoria: "intereses", importe: interes });
    apuntes.push({ mes: inicio + k, categoria: "principal", importe: amortizado });
  }
  return apuntes;
}

function cicloPrestamo(
  coche: CocheCandidato,
  ctx: Contexto,
  c: CondicionesPrestamo,
): { ciclo: Ciclo; financiacion: Financiacion } {
  const compra = cicloCompra(coche, ctx, 0, c.descuento);
  const principal = coche.pvp - c.descuento - c.entrada;
  const f = resolverFinanciacion(principal, c, 0);
  compra.apuntes.push(
    { mes: 0, categoria: "comisiones", importe: principal * c.comisionApertura },
    ...apuntesCuotas(f, 0),
  );
  return {
    financiacion: f,
    ciclo: {
      ...compra,
      salida: (m) => {
        const pagadas = Math.min(m, f.plazoMeses);
        const saldo = saldoPendiente(f.principal, f.tin, f.cuota, pagadas);
        return [
          ...compra.salida(m),
          ...apuntesCancelacion(m, saldo, c.comisionCancelacion),
        ];
      },
    },
  };
}

function apuntesCancelacion(m: number, saldo: number, comision: number): Apunte[] {
  if (saldo <= 0.005) return [];
  return [
    { mes: m, categoria: "principal", importe: saldo },
    { mes: m, categoria: "comisiones", importe: saldo * comision },
  ];
}

function excesoKm(
  perfil: PerfilUso,
  kmAnualesContrato: number,
  meses: number,
  precioKm: number,
): number {
  const exceso = Math.max(0, perfil.kmAnuales - kmAnualesContrato);
  return (exceso / 12) * meses * precioKm;
}

function cicloCuotaFinal(
  coche: CocheCandidato,
  ctx: Contexto,
  c: CondicionesCuotaFinal,
  inicio: number,
): { ciclo: Ciclo; financiacion: Financiacion } {
  const compra = cicloCompra(coche, ctx, inicio, c.descuento);
  const principal = coche.pvp - c.descuento - c.entrada;
  const f = resolverFinanciacion(principal, c, c.cuotaFinal);
  const fin = inicio + c.plazoMeses;
  compra.apuntes.push(
    { mes: inicio, categoria: "comisiones", importe: principal * c.comisionApertura },
    ...apuntesCuotas(f, inicio),
  );
  const referencia = cocheAlPrecio(coche, c.descuento);

  if (c.salida === "devolver") {
    // al final: o se vende el coche y se paga la cuota final, o se devuelve (pagando exceso de km y daños)
    const valor = valorResidual(referencia, c.plazoMeses, ctx.perfil);
    const devolver =
      excesoKm(ctx.perfil, c.kmAnualesContrato, c.plazoMeses, c.excesoKm) +
      c.daniosDevolucion;
    const vender = c.cuotaFinal - valor;
    compra.apuntes.push({ mes: fin, categoria: "principal", importe: c.cuotaFinal });
    if (vender <= devolver) {
      compra.apuntes.push({ mes: fin, categoria: "vehiculo", importe: -valor });
    } else {
      compra.apuntes.push(
        { mes: fin, categoria: "vehiculo", importe: -c.cuotaFinal },
        { mes: fin, categoria: "fin_contrato", importe: devolver },
      );
    }
  } else {
    compra.apuntes.push({ mes: fin, categoria: "principal", importe: c.cuotaFinal });
  }

  return {
    financiacion: f,
    ciclo: {
      ...compra,
      fin: c.salida === "devolver" ? fin : SIN_FIN,
      salida: (m) => {
        const pagadas = Math.min(m - inicio, c.plazoMeses);
        const saldo =
          m >= fin ? 0 : saldoPendiente(f.principal, f.tin, f.cuota, pagadas);
        return [...compra.salida(m), ...apuntesCancelacion(m, saldo, c.comisionCancelacion)];
      },
    },
  };
}

function cicloUso(
  ctx: Contexto,
  c: CondicionesRenting,
  inicio: number,
  renovable: boolean,
): Ciclo {
  const fin = renovable ? inicio + c.plazoMeses : SIN_FIN;
  const H = ctx.perfil.horizonteMeses;
  const ultimaCuota = renovable ? fin : H;
  const apuntes: Apunte[] = [];
  if (c.entrada > 0) apuntes.push({ mes: inicio, categoria: "cuotas", importe: c.entrada });
  for (let m = inicio + 1; m <= ultimaCuota; m++)
    apuntes.push({ mes: m, categoria: "cuotas", importe: c.cuota });
  if (renovable)
    apuntes.push({
      mes: fin,
      categoria: "fin_contrato",
      importe:
        excesoKm(ctx.perfil, c.kmAnualesContrato, c.plazoMeses, c.excesoKm) +
        c.daniosDevolucion,
    });

  return {
    inicio,
    fin,
    apuntes,
    incluye: c.incluye,
    salida: (m, penalizar = true) => {
      const transcurridos = m - inicio;
      const restantes = Math.max(0, inicio + c.plazoMeses - m);
      const importe =
        (penalizar ? restantes * c.cuota * c.penalizacionCancelacion : 0) +
        excesoKm(ctx.perfil, c.kmAnualesContrato, transcurridos, c.excesoKm) +
        (transcurridos > 0 ? c.daniosDevolucion : 0);
      return importe > 0 ? [{ mes: m, categoria: "fin_contrato", importe }] : [];
    },
  };
}
