import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  // 모노레포 루트의 .env.local을 읽도록 설정
  envDir: resolve(__dirname, '../../../'),
  server: {
    port: 5003,
    cors: true,
    strictPort: true, // 포트 충돌 시 에러
  },
  assetsInclude: ['**/*.otf', '**/*.ttf', '**/*.json'],
  base: process.env.NODE_ENV === 'production' ? '/game/typo-trap/' : '/',
  build: {
    assetsInlineLimit: 0,
    outDir: resolve(__dirname, '../../../dist/game/typo-trap'),
    emptyOutDir: true,
  },
});
