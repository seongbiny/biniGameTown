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
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
