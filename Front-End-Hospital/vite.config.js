import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',  // Asegura que los archivos se sirvan correctamente desde la raíz relativa.
  build: {
    outDir: '../Front-End-Hospital/Front-End-Hospital/dist',  // Directorio de salida correcto.
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',  // Estructura de nombres de archivos.
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
