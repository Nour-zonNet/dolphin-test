/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/pdf-proxy': {
        target: 'https://torage-learnatdolphin.b-cdn.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pdf-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
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
          // React core (keep together to avoid multiple React instances)
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react";
            }
            
            // PDF-related libraries (large dependencies)
            if (
              id.includes("pdfjs-dist") ||
              id.includes("react-pdf") ||
              id.includes("pdf-lib") ||
              id.includes("jspdf")
            ) {
              return "pdf-libs";
            }
            
            // Canvas/Graphics libraries
            if (id.includes("react-konva") || id.includes("konva")) {
              return "canvas-libs";
            }
            
            // UI/Slider libraries
            if (id.includes("swiper")) {
              return "ui-libs";
            }
            
            // Form libraries
            if (
              id.includes("react-hook-form") ||
              id.includes("react-otp-input") ||
              id.includes("react-international-phone") ||
              id.includes("intl-tel-input")
            ) {
              return "form-libs";
            }
            
            // State management
            if (
              id.includes("@reduxjs") ||
              id.includes("react-redux") ||
              id.includes("@tanstack/react-query")
            ) {
              return "state-libs";
            }
            
            // Internationalization
            if (
              id.includes("i18next") ||
              id.includes("react-i18next") ||
              id.includes("i18next-browser-languagedetector")
            ) {
              return "i18n-libs";
            }
            
            // Router
            if (id.includes("react-router")) {
              return "router-libs";
            }
            
            // UI utilities
            if (
              id.includes("lucide-react") ||
              id.includes("tailwind-merge") ||
              id.includes("tailwind-scrollbar") ||
              id.includes("react-toastify")
            ) {
              return "ui-utils";
            }
            
            // HTTP client
            if (id.includes("axios")) {
              return "http-libs";
            }
            
            // Other vendor libraries
            return "vendor";
          }

          // Feature chunks - split by feature
          if (id.includes("/src/features/")) {
            const feature = id.split("/src/features/")[1]?.split("/")[0];
            if (feature) return `feature-${feature}`;
          }

          // Split components by usage patterns
          if (id.includes("/src/components/")) {
            // PDF-related components
            if (id.includes("PDFEditor") || id.includes("PDFViewer")) {
              return "pdf-components";
            }
            
            // Layout components (used everywhere)
            if (id.includes("/layout/")) {
              return "layout-components";
            }
            
            // UI components (used frequently)
            if (id.includes("/ui/")) {
              return "ui-components";
            }
            
            // Feedback components (modals, loaders)
            if (id.includes("/feedback/")) {
              return "feedback-components";
            }
            
            // Profile components
            if (id.includes("/profile/")) {
              return "profile-components";
            }
            
            return "components";
          }
          
          // Split utils and services by functionality
          if (id.includes("/src/utils/") || id.includes("/src/services/")) {
            // PDF-related utilities
            if (id.includes("pdfConfig") || id.includes("pdf")) {
              return "pdf-utils";
            }
            
            // Auth-related utilities
            if (id.includes("authToken") || id.includes("auth")) {
              return "auth-utils";
            }
            
            // Date and formatting utilities
            if (id.includes("date") || id.includes("format") || id.includes("FormatWithCurrency")) {
              return "format-utils";
            }
            
            // Validation utilities
            if (id.includes("phoneValidation") || id.includes("validation")) {
              return "validation-utils";
            }
            
            // Icon and UI utilities
            if (id.includes("icons") || id.includes("Illustrations")) {
              return "ui-utils";
            }
            
            // Mappers and data transformation
            if (id.includes("mappers")) {
              return "data-utils";
            }
            
            // API services
            if (id.includes("/services/")) {
              return "api-services";
            }
            
            return "utils";
          }
          
          // Store/State
          if (id.includes("/src/store/")) {
            return "store";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Reduced from 1000 to be more strict
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
