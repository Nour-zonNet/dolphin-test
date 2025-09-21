import React, { useState } from 'react';

const PDFURLInput = ({ 
  onLoadPDF, 
  isLoading = false,
  isVisible = true,
  isMobile = false,
  className = "",
  style = {}
}) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValidUrl(validateUrl(newUrl) || newUrl === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url && validateUrl(url)) {
      onLoadPDF(url);
    }
  };

  const handleLoadExample = () => {
    const exampleUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    setUrl(exampleUrl);
    setIsValidUrl(true);
    onLoadPDF(exampleUrl);
  };

  const handleLoadLocalExample = () => {
    const localUrl = '/sample-pdfs/test.html';
    setUrl(localUrl);
    setIsValidUrl(true);
    onLoadPDF(localUrl);
  };

  if (!isVisible) return null;

  return (
    <div className={`pdf-url-input ${className}`} style={style}>
      <form onSubmit={handleSubmit} className={`space-y-4 ${
        isMobile ? 'p-3' : 'p-4'
      }`}>
        <div>
          <label 
            htmlFor="pdf-url" 
            className={`block font-medium text-gray-700 mb-2 ${
              isMobile ? 'text-sm' : 'text-base'
            }`}
          >
            PDF URL
          </label>
          <div className="flex gap-2">
            <input
              id="pdf-url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter PDF URL (e.g., https://example.com/document.pdf)"
              className={`flex-1 border rounded-md px-3 py-2 ${
                isMobile ? 'text-sm' : 'text-base'
              } ${
                isValidUrl 
                  ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                  : 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!url || !isValidUrl || isLoading}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isMobile ? 'text-sm' : 'text-base'
              } ${
                !url || !isValidUrl || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load PDF'
              )}
            </button>
          </div>
          {!isValidUrl && url && (
            <p className="mt-1 text-sm text-red-600">
              Please enter a valid URL starting with http:// or https://
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleLoadExample}
            disabled={isLoading}
            className={`px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Load Example PDF
          </button>
          
          <button
            type="button"
            onClick={handleLoadLocalExample}
            disabled={isLoading}
            className={`px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Load Test Page
          </button>
          
          <button
            type="button"
            onClick={() => {
              setUrl('');
              setIsValidUrl(true);
            }}
            disabled={isLoading}
            className={`px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Clear
          </button>
        </div>

        <div className={`text-xs text-gray-500 ${
          isMobile ? 'text-center' : ''
        }`}>
          <p>Supported formats: PDF files from any public URL or local files</p>
          <p>Note: Some external PDFs may not display due to server restrictions</p>
          <p>For testing: Use "Load Test Page" for files in /public/sample-pdfs/</p>
        </div>
      </form>
    </div>
  );
};

export default PDFURLInput;
