import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/game/bini-puzzle-web/", // 배포 경로 설정
  build: {
    outDir: resolve(__dirname, "../../../dist/game/bini-puzzle-web"), // 빌드 결과물 경로
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // 경로 별칭 설정
    },
  },
});
