/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React optimizations
      fastRefresh: true,
    }),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
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
            type: "image/webp"
          },
          {
            src: "/homeChild.png",
            sizes: "512x512",
            type: "image/webp"
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
  publicDir: "public",
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-core";
            }
            // Heavy libraries in separate chunks
            if (id.includes("pdfjs-dist") || id.includes("pdf-lib")) {
              return "pdf-libs";
            }
            if (id.includes("chart.js") || id.includes("react-chartjs-2")) {
              return "chart-libs";
            }
            if (id.includes("konva") || id.includes("react-konva")) {
              return "canvas-libs";
            }
            if (id.includes("html2canvas") || id.includes("jspdf")) {
              return "export-libs";
            }
            if (id.includes("swiper")) {
              return "swiper";
            }
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "i18n";
            }
            if (id.includes("@tanstack/react-query")) {
              return "query";
            }
            if (id.includes("@reduxjs") || id.includes("react-redux")) {
              return "redux";
            }
            if (id.includes("axios")) {
              return "http";
            }
            // All other vendor libraries
            return "vendor";
          }

          // Feature chunks with better splitting
          if (id.includes("/src/features/")) {
            const feature = id.split("/src/features/")[1]?.split("/")[0];
            if (feature) {
              // Heavy features get their own chunks
              if (feature === "Board" || feature === "lessons") {
                return `feature-${feature}`;
              }
              // Group smaller features
              if (["auth", "profile", "subscription"].includes(feature)) {
                return "feature-user";
              }
              if (["balance", "packages"].includes(feature)) {
                return "feature-commerce";
              }
              return `feature-${feature}`;
            }
          }

          // Component chunks - split heavy ones
          if (id.includes("/src/components/")) {
            if (id.includes("feedback") || id.includes("modal")) {
              return "components-ui";
            }
            return "components";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: "esbuild",
    target: "esnext",
    // Enable tree shaking
    treeshake: true,
    // Optimize for production
    cssCodeSplit: true,
    sourcemap: false,
    // CSS optimization
    css: {
      devSourcemap: false,
    },
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
