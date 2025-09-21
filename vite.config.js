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
