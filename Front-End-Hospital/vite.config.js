import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        display: "standalone",
        display_override: ["window-controls-overlay"],
        lang: "es-AR",
        name: "Hospital Dr. Arturo Oñativia",
        short_name: "H. Oñativia",
        description: "Plataforma de salud del Hospital Dr. Arturo Oñativia",
        theme_color: "#0369a1",
        background_color: "#f0f9ff",
        //start_url: "/",
        icons: [
          { src: "logo-onativia-app-64.png", sizes: "64x64", type: "image/png" },
          { src: "logo-onativia-app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "logo-onativia-app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "logo-onativia-app-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
     /*  registerType: "autoUpdate", // Actualización automática del service worker
      devOptions: {
        enabled: true, // Habilita PWA en modo desarrollo
      }, */
    }),
  ],
  base: "./",
  build: {
    outDir: "../Front-End-Hospital/dist",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  optimizeDeps: {
    include: [
      "antd",
      "antd/locale/es_ES",
      "dayjs",
      "dayjs/locale/es",
      "@ant-design/icons",
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
  },
});
