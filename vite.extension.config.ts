import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import manifest from './extension/manifest.json' with { type: 'json' };

export default defineConfig({
  root: path.resolve(__dirname, 'extension'),
  publicDir: false,
  build: {
    outDir: path.resolve(__dirname, 'dist-extension'),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'extension/popup.html'),
        offscreen: path.resolve(__dirname, 'extension/offscreen.html'),
      },
    },
  },
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
