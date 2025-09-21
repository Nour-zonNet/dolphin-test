import React from "react";
import PDFViewer from "./components/PDFViewer";
import { Header } from "../../components/layout";

const PDFViewerPage = () => {
  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="h-full flex flex-col">
        {/* Header */}
        <Header onBack={"/schedule"} title="تدريبات الدرس" />

        {/* PDF Viewer Content */}
        <div className="flex-1 min-h-0 py-6 px-2">
          <PDFViewer
            pdfUrl="https://torage-learnatdolphin.b-cdn.net/data/2025/pdfs/68cc0d378c355___Full_Teacher_Slot_System_Technical_Document.pdf"
            isVisible={true}
            isMobile={window.innerWidth < 768}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPage;
