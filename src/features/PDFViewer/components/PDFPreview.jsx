import React, { useState, useEffect, useCallback } from 'react';
import usePDFViewer from '../hooks/usePDFViewer';

const PDFPreview = ({ 
  pdfUrl, 
  isVisible = true, 
  isMobile = false,
  className = "",
  style = {},
  onLoad = () => {},
  onError = () => {}
}) => {
  const [pdfPages, setPdfPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { getPageDimensions } = usePDFViewer();

  // Load PDF from URL
  const loadPDF = useCallback(async (url) => {
    if (!url) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const pdfjs = await import("pdfjs-dist");
      
      // Configure worker
      if (typeof window !== "undefined" && pdfjs?.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }

      // Convert URL to use proxy if it's from the CDN
      let pdfUrl = url;
      if (url.includes('torage-learnatdolphin.b-cdn.net')) {
        const urlPath = url.replace('https://torage-learnatdolphin.b-cdn.net', '');
        pdfUrl = `/api/pdf-proxy${urlPath}`;
      }

      // Load PDF from URL with custom fetch options
      const loadingTask = pdfjs.getDocument({
        url: pdfUrl,
        httpHeaders: {
          'Accept': 'application/pdf',
        },
        withCredentials: false,
        // Try to bypass CORS by using a different approach
        ...(url.includes('torage-learnatdolphin.b-cdn.net') ? {
          // Use a CORS proxy service as fallback
          url: `https://cors-anywhere.herokuapp.com/${url}`
        } : {})
      });
      const pdf = await loadingTask.promise;
      
      setTotalPages(pdf.numPages);
      
      const pages = [];
      const deviceScale = Math.max(1, window.devicePixelRatio || 1);
      
      // Render all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: deviceScale });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ 
          canvasContext: context, 
          viewport 
        }).promise;
        
        pages.push({
          dataUrl: canvas.toDataURL("image/png"),
          width: viewport.width,
          height: viewport.height,
          pageNumber: pageNum
        });
      }
      
      setPdfPages(pages);
      setCurrentPage(1);
      onLoad();
      
    } catch (err) {
      // Error loading PDF
      setError(err.message || "Failed to load PDF");
      onError(err);
    } finally {
      setIsLoading(false);
    }
  }, [onLoad, onError]);

  // Load PDF when URL changes
  useEffect(() => {
    if (pdfUrl) {
      loadPDF(pdfUrl);
    }
  }, [pdfUrl, loadPDF]);

  // Navigation handlers
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isVisible) return null;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`} style={style}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`} style={style}>
        <div className="text-center text-red-600">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-medium mb-2">Error Loading PDF</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (pdfPages.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`} style={style}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-2">No PDF Loaded</p>
          <p className="text-sm">Enter a PDF URL to preview</p>
        </div>
      </div>
    );
  }

  const currentPageData = pdfPages[currentPage - 1];
  const pageDimensions = currentPageData ? getPageDimensions(currentPageData.width, currentPageData.height) : null;

  return (
    <div className={`pdf-preview-container ${className}`} style={style}>
      {/* Navigation Header */}
      <div className={`bg-white border-b border-gray-200 ${
        isMobile ? 'p-3' : 'p-4'
      }`}>
        <div className={`flex items-center justify-between ${
          isMobile ? 'flex-col gap-2' : 'gap-4'
        }`}>
          {/* Page Info */}
          <div className="flex items-center gap-2">
            <span className={`font-medium ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage <= 1}
              className={`rounded-md transition-colors ${
                isMobile ? 'p-2' : 'p-3'
              } ${
                currentPage <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className={`flex items-center gap-1 ${
              isMobile ? 'px-2' : 'px-3'
            }`}>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                min="1"
                max={totalPages}
                className={`border rounded text-center ${
                  isMobile 
                    ? 'w-12 px-1 py-1 text-xs' 
                    : 'w-16 px-2 py-1 text-sm'
                }`}
                aria-label="Page number"
              />
              <span className={`text-gray-500 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                / {totalPages}
              </span>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className={`rounded-md transition-colors ${
                isMobile ? 'p-2' : 'p-3'
              } ${
                currentPage >= totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              aria-label="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className={`pdf-content ${
        isMobile ? 'p-2' : 'p-4'
      }`} style={{
        overflow: 'auto',
        maxHeight: isMobile ? '60vh' : '70vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div className="flex justify-center">
          <div 
            className="pdf-page-container"
            style={{
              maxWidth: '100%',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <img
              src={currentPageData.dataUrl}
              alt={`PDF Page ${currentPage}`}
              style={{
                width: pageDimensions ? `${pageDimensions.width}px` : '100%',
                height: pageDimensions ? `${pageDimensions.height}px` : 'auto',
                display: 'block',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onLoad={() => {
                // Image loaded successfully
              }}
              onError={() => {
                setError('Failed to load page image');
                onError(new Error('Failed to load page image'));
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className={`bg-gray-50 border-t border-gray-200 ${
        isMobile ? 'p-2' : 'p-3'
      }`}>
        <div className={`text-center text-gray-600 ${
          isMobile ? 'text-xs' : 'text-sm'
        }`}>
          PDF Preview - {pdfUrl ? new URL(pdfUrl).pathname.split('/').pop() : 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
