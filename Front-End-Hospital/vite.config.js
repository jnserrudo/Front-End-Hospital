import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../Front-End-Hospital/Front-End-Hospital/dist', // Cambia esto a la ruta correcta para tu proyecto
  },
  server: {
    host: '0.0.0.0',
    port: 3000, // Puedes cambiar el puerto si es necesario
  }
});
