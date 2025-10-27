import React, { useState } from "react";

const ImportPDFFromURL = ({ onLoadPDFFromURL, onClose }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Validate URL format
      new URL(url);
      
      // Check if it's a PDF URL
      if (!url.toLowerCase().includes('.pdf')) {
        setError("Please enter a valid PDF URL");
        setIsLoading(false);
        return;
      }

      await onLoadPDFFromURL(url);
      onClose();
    } catch (error) {
      // PDF import error
      if (error.message.includes('CORS') || error.message.includes('fetch')) {
        setError("Unable to access this PDF due to CORS restrictions. Please try a different URL or download and upload the PDF file instead.");
      } else if (error.message.includes('HTTP error')) {
        setError("Failed to load PDF. Please check if the URL is accessible.");
      } else {
        setError("Please enter a valid PDF URL");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUrl("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Import PDF from URL</h3>
        
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Some PDF URLs may be blocked by CORS policy. If you encounter issues, 
            try downloading the PDF and using the "Upload PDF" option instead.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pdf-url" className="block text-sm font-medium text-gray-700 mb-2">
              PDF URL
            </label>
            <input
              id="pdf-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? "Loading..." : "Import PDF"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportPDFFromURL;
