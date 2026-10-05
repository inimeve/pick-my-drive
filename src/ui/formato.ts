import type { Escenario } from "../engine/tipos";

const euros0 = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const euros2 = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numero = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });

export const eur = (v: number) => euros0.format(Math.round(v));
export const eurCent = (v: number) => euros2.format(v);
export const num = (v: number) => numero.format(v);
export const pct = (v: number, decimales = 2) =>
  `${(v * 100).toLocaleString("es-ES", { maximumFractionDigits: decimales })} %`;
export const meses = (m: number) =>
  m % 12 === 0 ? `${m / 12} ${m === 12 ? "año" : "años"}` : `${m} meses`;

/** Crea un elemento con atributos y contenido */
export function el<K extends keyof HTMLElementTagNameMap>(
  etiqueta: K,
  atributos: Record<string, string> = {},
  ...hijos: (Node | string | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const e = document.createElement(etiqueta);
  for (const [k, v] of Object.entries(atributos)) e.setAttribute(k, v);
  for (const h of hijos) if (h !== undefined && h !== false) e.append(h);
  return e;
}

/** Marca de las opciones que salen de un presupuesto real; avisa si ya ha caducado */
export function etiquetaOferta(e: Escenario): HTMLElement | undefined {
  const o = e.ofertaReal;
  if (!o) return undefined;
  const caducada = o.hasta !== undefined && o.hasta < new Date().toISOString().slice(0, 10);
  const validez = o.hasta ? (caducada ? ` Caducó el ${o.hasta}.` : ` Válida hasta el ${o.hasta}.`) : " Sin fecha de validez.";
  return el("span", { class: caducada ? "etiqueta-oferta caducada" : "etiqueta-oferta", title: `${o.origen}.${validez}` }, caducada ? "Oferta real · caducada" : "Oferta real");
}
