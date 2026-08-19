import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Nessun plugin per le API: il portale non ha un backend. Le demo sono
// file dentro demo/, letti in fase di build. È la differenza principale
// rispetto al progetto principale, ed è voluta: niente database vuol
// dire niente da proteggere e niente da tenere acceso.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#demo': fileURLToPath(new URL('./demo', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] },
      },
    },
  },
  server: { port: 5174, host: true },
})
