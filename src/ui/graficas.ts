import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";
import { GRUPOS_DESGLOSE } from "../engine/modalidades";
import type { Resultado } from "../engine/simulacion";
import { eur } from "./formato";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
);

export interface Serie {
  id: string;
  nombre: string;
  /** Hueco de la paleta categórica (0..7), fijo para la entidad que representa */
  hueco: number;
  resultado: Resultado;
}

const token = (nombre: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();

export const colorSerie = (hueco: number) => token(`--serie-${(hueco % 8) + 1}`);

function tema() {
  return {
    tinta: token("--tinta"),
    tinta2: token("--tinta-2"),
    suave: token("--tinta-suave"),
    rejilla: token("--rejilla"),
    eje: token("--eje"),
    superficie: token("--superficie"),
  };
}

const graficas = new Map<string, Chart>();

function pinta(canvas: HTMLCanvasElement, config: ChartConfiguration) {
  graficas.get(canvas.id)?.destroy();
  graficas.set(canvas.id, new Chart(canvas, config));
}

function ejeMeses(H: number, t: ReturnType<typeof tema>) {
  return {
    type: "linear" as const,
    min: 0,
    max: H,
    grid: { color: t.rejilla },
    border: { color: t.eje },
    ticks: {
      color: t.suave,
      stepSize: 12,
      callback: (v: string | number) => (Number(v) === 0 ? "Hoy" : `Año ${Number(v) / 12}`),
    },
  };
}

function ejeEuros(t: ReturnType<typeof tema>) {
  return {
    grid: { color: t.rejilla },
    border: { display: false },
    ticks: { color: t.suave, callback: (v: string | number) => eur(Number(v)) },
  };
}

function leyenda(t: ReturnType<typeof tema>) {
  return {
    position: "top" as const,
    align: "start" as const,
    labels: { color: t.tinta2, usePointStyle: true, pointStyle: "circle" as const, boxWidth: 8, boxHeight: 8, padding: 14 },
  };
}

function tooltipBase(t: ReturnType<typeof tema>) {
  return {
    backgroundColor: t.superficie,
    titleColor: t.tinta,
    bodyColor: t.tinta2,
    borderColor: t.eje,
    borderWidth: 1,
    padding: 10,
    usePointStyle: true,
    boxWidth: 8,
    boxHeight: 8,
  };
}

const tituloMes = (m: number) =>
  m === 0 ? "Hoy" : `Mes ${m} · ${(m / 12).toLocaleString("es-ES", { maximumFractionDigits: 1 })} años`;

function lineas(series: Serie[], datos: (s: Serie) => { x: number; y: number }[], t: ReturnType<typeof tema>) {
  return series.map((s) => ({
    label: s.nombre,
    data: datos(s),
    borderColor: colorSerie(s.hueco),
    backgroundColor: colorSerie(s.hueco),
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointHoverBorderColor: t.superficie,
    borderJoinStyle: "round" as const,
    borderCapStyle: "round" as const,
  }));
}

export type VistaCoste = "continuar" | "salir" | "desembolso";

function serieCoste(r: Serie["resultado"], vista: VistaCoste): number[] {
  if (vista === "salir") return r.costeNeto;
  if (vista === "continuar") return r.costeNetoSinPenalizacion;
  return r.desembolsoAcumulado;
}

export function graficaCosteNeto(
  canvas: HTMLCanvasElement,
  series: Serie[],
  H: number,
  vista: VistaCoste,
) {
  const t = tema();
  pinta(canvas, {
    type: "line",
    data: {
      datasets: lineas(
        series,
        (s) => serieCoste(s.resultado, vista).map((y, x) => ({ x, y })),
        t,
      ),
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      scales: { x: ejeMeses(H, t), y: ejeEuros(t) },
      plugins: {
        legend: leyenda(t),
        tooltip: {
          ...tooltipBase(t),
          itemSort: (a, b) => a.parsed.y! - b.parsed.y!,
          callbacks: {
            title: (items) => tituloMes(items[0]?.parsed.x ?? 0),
            label: (i) => ` ${i.dataset.label}: ${eur(i.parsed.y!)}`,
          },
        },
      },
    },
  });
}

export function graficaCaja(canvas: HTMLCanvasElement, series: Serie[], H: number) {
  const t = tema();
  pinta(canvas, {
    type: "line",
    data: {
      datasets: lineas(
        series,
        (s) => s.resultado.caja.map((y, x) => ({ x, y })).filter((p) => p.x > 0),
        t,
      ).map((d) => ({ ...d, stepped: "middle" as const })),
    },
    options: {
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      scales: { x: ejeMeses(H, t), y: { ...ejeEuros(t), beginAtZero: true } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipBase(t),
          itemSort: (a, b) => b.parsed.y! - a.parsed.y!,
          callbacks: {
            title: (items) => tituloMes(items[0]?.parsed.x ?? 0),
            label: (i) => ` ${i.dataset.label}: ${eur(i.parsed.y!)}`,
          },
        },
      },
    },
  });
}

export function graficaDesglose(canvas: HTMLCanvasElement, series: Serie[]) {
  const t = tema();
  const datasets = GRUPOS_DESGLOSE.map((g, k) => ({
    label: g.nombre,
    data: series.map((s) =>
      g.categorias.reduce((suma, c) => suma + (s.resultado.desglose[c] ?? 0), 0),
    ),
    backgroundColor: colorSerie(k),
    borderColor: t.superficie,
    borderWidth: 1,
    maxBarThickness: 24,
  })).filter((d) => d.data.some((v) => Math.abs(v) >= 1));

  pinta(canvas, {
    type: "bar",
    data: { labels: series.map((s) => s.nombre), datasets },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      animation: false,
      scales: {
        x: { ...ejeEuros(t), stacked: true },
        y: { stacked: true, grid: { display: false }, border: { color: t.eje }, ticks: { color: t.tinta2 } },
      },
      plugins: {
        legend: leyenda(t),
        tooltip: {
          ...tooltipBase(t),
          callbacks: { label: (i) => ` ${i.dataset.label}: ${eur(i.parsed.x!)}` },
        },
      },
    },
  });
}
