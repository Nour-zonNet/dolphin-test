import React, { useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import ImportPDFFromURL from "./ImportPDFFromURL";
import "../../../utils/pdfConfig"; // Import centralized PDF configuration

const ImportPDFButton = ({ onLoadPDF }) => {
  const fileInputRef = useRef();
  const [showURLModal, setShowURLModal] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onLoadPDF(file);
  };

  const handleURLImport = async (url) => {
    // Try direct fetch first
    let response;
    try {
      response = await fetch(url);
    } catch {
      // Direct fetch failed due to CORS, trying with proxy...
      // Use CORS proxy as fallback
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      response = await fetch(proxyUrl);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const file = new File([blob], 'imported.pdf', { type: 'application/pdf' });
    onLoadPDF(file);
  };

  return (
    <>
      <div className="flex gap-2 lg:flex-col">
        <button
          onClick={() => fileInputRef.current.click()}
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Upload PDF
        </button>
        <button
          onClick={() => setShowURLModal(true)}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          From URL
        </button>
      </div>
      
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {showURLModal && (
        <ImportPDFFromURL
          onLoadPDFFromURL={handleURLImport}
          onClose={() => setShowURLModal(false)}
        />
      )}
    </>
  );
};

export default ImportPDFButton;
