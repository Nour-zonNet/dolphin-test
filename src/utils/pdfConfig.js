// Centralized PDF.js configuration to avoid conflicts and SSR issues
import { pdfjs } from 'react-pdf';

// Configure PDF.js worker with proper error handling for SSR
const configurePDFWorker = () => {
  // Only configure worker in browser environment
  if (typeof window !== 'undefined') {
    try {
      // Use a more reliable worker source that works with Vite
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
    } catch (error) {
      console.warn('Failed to configure PDF.js worker with Vite path, falling back to CDN:', error);
      // Fallback to CDN if Vite path fails
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }
  }
};

// Initialize worker configuration
configurePDFWorker();

export { configurePDFWorker };
