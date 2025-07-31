import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  assetsInclude: ['**/*.otf', '**/*.ttf', '**/*.json'],
  base: '/game/typo-trap/',
  build: {
    assetsInlineLimit: 0,
    outDir: resolve(__dirname, '../../../dist/game/typo-trap'),
    emptyOutDir: true,
  },
});
