/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('html2canvas') || id.includes('jspdf')) {
              return 'vendor-utils';
            }
            if (id.includes('google-libphonenumber')) {
              return 'vendor-phone';
            }
            return 'vendor';
          }
          
          // Feature chunks
          if (id.includes('/src/features/')) {
            const feature = id.split('/src/features/')[1]?.split('/')[0];
            if (feature) {
              return `feature-${feature}`;
            }
          }
          
          // Component chunks
          if (id.includes('/src/components/')) {
            return 'components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
