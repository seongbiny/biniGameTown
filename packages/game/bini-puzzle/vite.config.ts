import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  base: "/game/bini-puzzle/",
  build: {
    outDir: "../../../dist/game/bini-puzzle",
    emptyOutDir: true,
  },
});
