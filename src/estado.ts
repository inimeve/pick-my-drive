import {
  COCHES_POR_DEFECTO,
  ESCENARIOS_POR_DEFECTO,
  MUNICIPIOS,
  PERFIL_POR_DEFECTO,
  TERRITORIOS,
} from "./data";
import type { Contexto } from "./engine/simulacion";
import type { CocheCandidato, Escenario, ModalidadId, PerfilUso } from "./engine/tipos";

export type Vista =
  | { tipo: "mejores" }
  | { tipo: "coche"; cocheId: string }
  | { tipo: "modalidad"; modalidad: ModalidadId };

export interface Comparativa {
  version: 1;
  perfil: PerfilUso;
  coches: CocheCandidato[];
  escenarios: Escenario[];
  vista: Vista;
}

export function comparativaPorDefecto(): Comparativa {
  return structuredClone({
    version: 1,
    perfil: PERFIL_POR_DEFECTO,
    coches: COCHES_POR_DEFECTO,
    escenarios: ESCENARIOS_POR_DEFECTO,
    vista: { tipo: "mejores" },
  });
}

export function contexto(c: Comparativa): Contexto {
  const territorio =
    TERRITORIOS.find((t) => t.id === c.perfil.territorioId) ?? TERRITORIOS[0]!;
  const municipio =
    MUNICIPIOS.find((m) => m.id === c.perfil.municipioId) ??
    MUNICIPIOS.find((m) => m.territorioId === territorio.id) ??
    MUNICIPIOS[0]!;
  return { perfil: c.perfil, territorio, municipio };
}

// --- Guardado en la URL (para compartir) ---

async function comprimir(texto: string): Promise<string> {
  const flujo = new Blob([texto]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  const bytes = new Uint8Array(await new Response(flujo).arrayBuffer());
  let binario = "";
  bytes.forEach((b) => (binario += String.fromCharCode(b)));
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function descomprimir(codigo: string): Promise<string> {
  const base64 = codigo.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), (ch) => ch.charCodeAt(0));
  const flujo = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(flujo).text();
}

export async function enlaceCompartir(c: Comparativa): Promise<string> {
  const url = new URL(location.href);
  url.hash = "c=" + (await comprimir(JSON.stringify(c)));
  return url.toString();
}

async function desdeUrl(): Promise<Comparativa | undefined> {
  const m = location.hash.match(/^#c=(.+)$/);
  if (!m) return undefined;
  try {
    return valida(JSON.parse(await descomprimir(m[1]!)));
  } catch {
    return undefined;
  }
}

// --- Guardado en el navegador (para uno mismo) ---

const CLAVE_ACTUAL = "pick-my-drive:actual";
const CLAVE_GUARDADAS = "pick-my-drive:guardadas";

function leer<T>(clave: string): T | undefined {
  try {
    const texto = localStorage.getItem(clave);
    return texto ? (JSON.parse(texto) as T) : undefined;
  } catch {
    return undefined;
  }
}

function escribir(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento disponible: la página funciona igual
  }
}

function valida(c: unknown): Comparativa | undefined {
  const x = c as Comparativa | undefined;
  if (x && x.version === 1 && Array.isArray(x.coches) && Array.isArray(x.escenarios) && x.perfil)
    return { ...x, perfil: { ...PERFIL_POR_DEFECTO, ...x.perfil } };
  return undefined;
}

export async function cargar(): Promise<Comparativa> {
  return (
    (await desdeUrl()) ??
    valida(leer(CLAVE_ACTUAL)) ??
    comparativaPorDefecto()
  );
}

export function guardarActual(c: Comparativa) {
  escribir(CLAVE_ACTUAL, c);
}

export function guardadas(): Record<string, Comparativa> {
  return leer<Record<string, Comparativa>>(CLAVE_GUARDADAS) ?? {};
}

export function guardarComo(nombre: string, c: Comparativa) {
  escribir(CLAVE_GUARDADAS, { ...guardadas(), [nombre]: c });
}

export function borrarGuardada(nombre: string) {
  const todas = guardadas();
  delete todas[nombre];
  escribir(CLAVE_GUARDADAS, todas);
}
