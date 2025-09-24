// Centralized PDF.js configuration to avoid conflicts and SSR issues

const configurePDFWorker = async () => {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined" && pdfjs?.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
};

configurePDFWorker();

export { configurePDFWorker };
