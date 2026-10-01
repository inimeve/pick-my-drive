import { el } from "./formato";

interface OpcionesNumero {
  sufijo?: string;
  paso?: number;
  min?: number;
  max?: number;
  /** El valor es una fracción (0.07) que se edita como porcentaje (7) */
  porcentaje?: boolean;
  ayuda?: string;
}

const redondea = (v: number) => Math.round(v * 1e6) / 1e6;

export function campoNumero(
  etiqueta: string,
  valor: number,
  cambia: (v: number) => void,
  o: OpcionesNumero = {},
): HTMLElement {
  const factor = o.porcentaje ? 100 : 1;
  const input = el("input", {
    type: "number",
    step: String(o.paso ?? (o.porcentaje ? 0.1 : 1)),
    inputmode: "decimal",
  });
  if (o.min !== undefined) input.min = String(o.min * factor);
  if (o.max !== undefined) input.max = String(o.max * factor);
  input.value = String(redondea(valor * factor));
  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    if (!Number.isNaN(v)) cambia(v / factor);
  });
  const label = el(
    "label",
    { class: "campo" },
    etiqueta,
    el("span", { class: "fila" }, input, o.sufijo ? el("span", { class: "sufijo" }, o.sufijo) : undefined),
  );
  if (o.ayuda) label.title = o.ayuda;
  return label;
}

export function campoDeslizador(
  etiqueta: string,
  valor: number,
  cambia: (v: number) => void,
  o: { min: number; max: number; paso: number; muestra: (v: number) => string },
): HTMLElement {
  const input = el("input", {
    type: "range",
    min: String(o.min),
    max: String(o.max),
    step: String(o.paso),
    "aria-label": etiqueta,
  });
  input.value = String(valor);
  const salida = el("span", { class: "valor" }, o.muestra(valor));
  input.addEventListener("input", () => {
    const v = parseFloat(input.value);
    salida.textContent = o.muestra(v);
    cambia(v);
  });
  return el("label", { class: "campo" }, etiqueta, el("span", { class: "fila" }, input, salida));
}

export function campoTexto(etiqueta: string, valor: string, cambia: (v: string) => void): HTMLElement {
  const input = el("input", { type: "text" });
  input.value = valor;
  input.addEventListener("input", () => cambia(input.value));
  return el("label", { class: "campo" }, etiqueta, input);
}

export function campoSelect<T extends string>(
  etiqueta: string,
  valor: T,
  opciones: { valor: T; texto: string; desactivada?: boolean }[],
  cambia: (v: T) => void,
): HTMLElement {
  const select = el("select");
  for (const op of opciones) {
    const o = el("option", { value: op.valor }, op.texto);
    if (op.desactivada) o.disabled = true;
    select.append(o);
  }
  select.value = valor;
  select.addEventListener("change", () => cambia(select.value as T));
  return el("label", { class: "campo" }, etiqueta, select);
}

export function campoCheck(etiqueta: string, valor: boolean, cambia: (v: boolean) => void): HTMLElement {
  const input = el("input", { type: "checkbox" });
  input.checked = valor;
  input.addEventListener("change", () => cambia(input.checked));
  return el("label", { class: "campo-check" }, input, etiqueta);
}
