/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { 
        enabled: false,
        type: 'module'
      },
      includeAssets: [
        "favicon.svg", "robots.txt", "apple-touch-icon.png", 
        "homeChild.png", "offline-dolphin.svg"
      ],
      manifest: {
        name: "منصة الدلفين التعليمية",
        short_name: "الدلفين",
        description: "منصة الدلفين التعليمية",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/homeChild.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/homeChild.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,ico}"],
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 500 * 1024 * 1024,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /\.(?:html)$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      selfDestroying: false,
      injectRegister: null,
      pwaAssets: {
        disabled: true,
      },
      // ensure SW takes control ASAP
      strategies: 'generateSW',
      injectManifest: undefined,
      workboxPublicPaths: [],
      // enable immediate activation
      minify: true,
      srcDir: "src",
      filename: "sw.js",
      // workbox will set skipWaiting/clientsClaim; also set in dev SW if used
      injectManifestConfig: {
        globDirectory: "dist",
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,ico}"]
      }
    })
  ],
  server: {
    proxy: {
      '/api/pdf-proxy': {
        target: 'https://torage-learnatdolphin.b-cdn.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pdf-proxy/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Add CORS headers
            proxyReq.setHeader('Access-Control-Allow-Origin', '*');
            proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          });
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks (excluding react/react-dom to avoid multiple React instances)
          if (id.includes("node_modules")) {
            if (
              id.includes("react-router") ||
              id.includes("@reduxjs") ||
              id.includes("react-redux") ||
              id.includes("lucide-react") ||
              id.includes("html2canvas") ||
              id.includes("jspdf") ||
              id.includes("google-libphonenumber")
            ) {
              return "vendor";
            }
            return "vendor"; // all other node_modules
          }

          // Feature chunks
          if (id.includes("/src/features/")) {
            const feature = id.split("/src/features/")[1]?.split("/")[0];
            if (feature) return `feature-${feature}`;
          }

          // Component chunks
          if (id.includes("/src/components/")) return "components";
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: "esnext",
    minify: "esbuild",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      // removed explicit react/react-dom alias to avoid duplicate React instances
    },
  },
});
