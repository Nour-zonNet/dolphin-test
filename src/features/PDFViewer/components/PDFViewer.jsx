import React from "react";
import PDFIframeViewer from "./PDFIframeViewer";

const PDFViewer = ({
  isVisible = true,
  isMobile = false,
  className = "",
  pdfUrl = "",
  style = {},
}) => {
  if (!isVisible) return null;

  return (
    <div className={`pdf-viewer ${className}`} style={style}>
      {/* URL Input Section */}

      {/* PDF Preview Section */}
      <div className="flex-1 min-h-0">
        <PDFIframeViewer pdfUrl={pdfUrl} isVisible={true} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default PDFViewer;
