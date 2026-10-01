import { resolve } from "node:path";
import { defineConfig } from "vite";

// base relativo para poder publicarlo en GitHub Pages bajo /pick-my-drive/
// dos páginas: la comparativa (index.html) y la ficha de cada coche (coche.html)
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        comparativa: resolve(import.meta.dirname, "index.html"),
        coche: resolve(import.meta.dirname, "coche.html"),
      },
    },
  },
});
