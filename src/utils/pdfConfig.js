// Centralized PDF.js configuration to avoid conflicts and SSR issues
import { pdfjs } from "react-pdf";

const configurePDFWorker = async() => {
  if (typeof window !== "undefined" && pdfjs?.GlobalWorkerOptions) {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
};

configurePDFWorker();

export { configurePDFWorker };
