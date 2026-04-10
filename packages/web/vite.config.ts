import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 모노레포 루트의 .env.local을 읽도록 설정
  envDir: resolve(__dirname, '../../'),
  server: {
    port: 3000,
  },

  build: {
    outDir: resolve(__dirname, '../../dist'),
    // dist/가 packages/web/ 밖에 있으므로 Vite 기본값은 emptyOutDir: false.
    // 게임 빌드 결과물(dist/game/*)을 보존하기 위해 명시적으로 false 지정.
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
