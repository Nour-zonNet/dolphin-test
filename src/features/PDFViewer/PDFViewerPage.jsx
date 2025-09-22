// features/pdf/PDFViewerPage.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PDFViewer from "./components/PDFViewer";
import { Header } from "../../components/layout";

const PDFViewerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { pdfUrl, title } = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const src = sp.get("src") || location.state?.src;
    const ttl = sp.get("title") || location.state?.title || "ملف PDF";
    return { pdfUrl: src, title: ttl };
  }, [location]);

  // If someone hits /pdfviewer without params, go back to schedule
  if (!pdfUrl) {
    navigate("/schedule", { replace: true });
    return null;
  }

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="h-full flex flex-col">
        <Header onBack={"/schedule"} title={title} />
        <div className="flex-1 min-h-0 py-6 px-2">
          <PDFViewer
            pdfUrl={pdfUrl}
            isVisible={true}
            isMobile={isMobile}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewerPage;
