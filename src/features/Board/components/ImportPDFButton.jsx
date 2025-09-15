import React, { useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ImportPDFButton = ({ onLoadPDF }) => {
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onLoadPDF(file);
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current.click()}
        className="p-2 bg-green-500 text-white rounded-md"
      >
        Import PDF
      </button>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImportPDFButton;
