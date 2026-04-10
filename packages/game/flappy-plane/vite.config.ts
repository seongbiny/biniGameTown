import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  // 모노레포 루트의 .env.local을 읽도록 설정
  envDir: resolve(__dirname, '../../../'),
  server: {
    port: 5002,
    cors: true,
    strictPort: true, // 포트 충돌 시 에러
  },
  base: process.env.NODE_ENV === 'production' ? '/game/flappy-plane/' : '/',
  assetsInclude: ['**/*.otf', '**/*.ttf'],
  build: {
    assetsInlineLimit: 0,
    outDir: resolve(__dirname, '../../../dist/game/flappy-plane'),
    emptyOutDir: true,
  },
});
