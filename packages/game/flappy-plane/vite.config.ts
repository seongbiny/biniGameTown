import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  assetsInclude: ["**/*.otf", "**/*.ttf"],
  build: {
    assetsInlineLimit: 0,
    outDir: resolve(__dirname, "../../../dist/game/flappy-plane"),
    emptyOutDir: true,
  },
  base: "/game/flappy-plane/",
});
