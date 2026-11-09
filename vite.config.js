import { defineConfig } from 'vite';
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  server: { watch: { usePolling: true, interval: 300 }, port: 5174, strictPort: true, origin: 'http://localhost:5174', cors: { origin: 'http://localhost:8081' } },
  build: {
    outDir: 'plugin/klanarchia-edytor/dist', emptyOutDir: true, manifest: true,
    rollupOptions: { input: 'src/main.tsx' }
  }
});
