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
        // Fix for iOS Safari/Chrome "FetchEvent.respondWith" error
        // Add error handling for Cache API operations
        runtimeCaching: [
          {
            urlPattern: /\.(?:html)$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache",
              networkTimeoutSeconds: 5, // Increased timeout for iOS
              fetchOptions: {
                mode: 'cors',
                credentials: 'same-origin',
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "NetworkFirst", // Changed from StaleWhileRevalidate for iOS compatibility
            options: {
              cacheName: "static-resources",
              networkTimeoutSeconds: 5,
              fetchOptions: {
                mode: 'cors',
                credentials: 'same-origin',
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              fetchOptions: {
                mode: 'cors',
                credentials: 'same-origin',
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
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
              fetchOptions: {
                mode: 'cors',
                credentials: 'omit',
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
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
          // CRITICAL: Keep ALL React and Redux in ONE chunk to prevent multiple instances
          if (id.includes("node_modules")) {
            // ALL React/Redux code MUST be in the same chunk
            if (
              id.includes("react") || 
              id.includes("react-dom") || 
              id.includes("react/jsx-runtime") ||
              id.includes("react-redux") ||
              id.includes("@reduxjs") ||
              id.includes("redux")
            ) {
              return "vendor"; // Put all in vendor
            }

            // Heavy PDF libraries
            if (
              id.includes("pdfjs-dist") || 
              id.includes("pdf-lib") ||
              id.includes("react-pdf")
            ) {
              return "pdf";
            }

            // Chart libraries
            if (id.includes("chart.js") || id.includes("react-chartjs")) {
              return "charts";
            }

            // All other vendor libraries
            return "vendor";
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
    target: ["es2019", "safari13"],
    minify: "esbuild",
    cssTarget: "safari13",
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react-redux",
      "@reduxjs/toolkit"
    ],
    exclude: ["react-konva"], // Exclude react-konva to prevent pre-bundling issues
    esbuildOptions: {
      target: "es2019",
    },
    force: true, // Force re-optimization
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      // Force single React instance in production builds
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
    dedupe: ["react", "react-dom"],
  },
});