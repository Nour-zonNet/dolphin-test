// Centralized PDF.js configuration to avoid conflicts and SSR issues
import { pdfjs } from "react-pdf";

const configurePDFWorker = () => {
  if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
};

configurePDFWorker();

export { configurePDFWorker };
