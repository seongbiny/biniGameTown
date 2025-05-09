import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  assetsInclude: ["**/*.otf", "**/*.ttf"],
  build: {
    assetsInlineLimit: 0, // 폰트 같은 큰 파일은 인라인화하지 않음
    outDir: "../../../dist/game/flappy-plane",
    emptyOutDir: true,
  },
  base: "/game/flappy-plane/",
});
