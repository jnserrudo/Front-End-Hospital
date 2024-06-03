import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../Front-End-Hospital/Front-End-Hospital/dist',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
});
