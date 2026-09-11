import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // GitHub project Pages: https://eflav.github.io/namey/
  base: '/namey/',
  server: {
    host: true,
    allowedHosts: true,
  },
  plugins: [
    react(),
    {
      name: "namey-waitlist-stub",
      configureServer(server) {
        server.middlewares.use("/api/waitlist", (req, res, next) => {
          if (req.method === "POST") {
            res.statusCode = 204;
            res.end();
            return;
          }
          next();
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon.svg'],
      manifest: {
        name: 'Namey',
        short_name: 'Namey',
        description: 'Namey — find your baby’s name with a fun guided quiz.',
        theme_color: '#3B82F6',
        background_color: '#F5F9FF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/namey/',
        scope: '/namey/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
