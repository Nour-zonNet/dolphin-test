import React, { useState } from "react";

const PDFIframeViewer = ({
  pdfUrl,
  isVisible = true,
  isMobile = false,
  className = "",
  style = {},
}) => {
  const [error, setError] = useState(null);

  if (!isVisible) return null;

  if (!pdfUrl) {
    return (
      <div
        className={`flex items-center justify-center p-8 ${className}`}
        style={style}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">No PDF Loaded</p>
          <p className="text-sm">Enter a PDF URL to preview</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center p-8 ${className}`}
        style={style}
      >
        <div className="text-center text-red-600">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-lg font-medium mb-2">Error Loading PDF</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-iframe-container ${className}`} style={style}>
      {/* Navigation Header */}
      

      {/* PDF Content */}
      <div
        className={`pdf-content ${isMobile ? "p-2" : "p-4"}`}
        style={{
          overflow: "auto",
          // maxHeight: isMobile ? "80vh" : "90vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div className="flex justify-center">
          <div
            className="pdf-page-container"
            style={{
              width: "100%",
              height: "800px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{
                border: "none",
                borderRadius: "8px",
              }}
              onError={() => {
                setError("Failed to load PDF in iframe");
              }}
              title="PDF Viewer"
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      {/* <div
        className={`bg-gray-50 border-t border-gray-200 ${
          isMobile ? "p-2" : "p-3"
        }`}
      >
        <div
          className={`text-center text-gray-600 ${
            isMobile ? "text-xs" : "text-sm"
          }`}
        >
          PDF Viewer - Simple and reliable iframe display
        </div>
      </div> */}
    </div>
  );
};

export default PDFIframeViewer;
