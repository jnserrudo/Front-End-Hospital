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
        lang: "es-ES",
        name: "Hospital Oñativia",
        short_name: "H. Oñativia",
        description: "Sistema para el Hospital Oñativia",
        theme_color: "#19223c",
        background_color: "#d4d4d4",
        //start_url: "/",
        icons: [
          {
						src: 'logo oñativia.png',
						sizes: '64x64',
						type: 'image/png',
					},
					{
						src: 'logo oñativia.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'logo oñativia.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
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
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
