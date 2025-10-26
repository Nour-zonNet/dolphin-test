import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

const GlobalErrorOverlay = () => {
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleError = (event) => {
      if (event.message?.includes('Activity')) {
        event.preventDefault();
        setError({
          type: 'error',
          message: event.message,
          source: event.filename,
          line: event.lineno,
          col: event.colno,
          stack: event.error?.stack
        });
      }
    };

    const handleRejection = (event) => {
      const errorMessage = event.reason?.message || String(event.reason);
      if (errorMessage.includes('Activity')) {
        event.preventDefault();
        setError({
          type: 'rejection',
          message: errorMessage,
          stack: event.reason?.stack
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-bold">⚠️ خطأ Activity يتم اكتشافه</h2>
          </div>
          <button
            onClick={() => setError(null)}
            className="hover:bg-red-700 rounded p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Content */}
        <div className="p-6" dir="ltr">
          <details open className="mb-4">
            <summary className="cursor-pointer font-bold text-gray-700 mb-3">
              📋 تفاصيل الخطأ (تفاصيل الخطأ)
            </summary>
            <div className="bg-gray-50 p-4 rounded border space-y-4">
              <div>
                <h4 className="font-bold text-red-600 mb-2">Error Message:</h4>
                <pre className="bg-white p-3 rounded border text-sm overflow-auto max-h-32">
                  {error.message}
                </pre>
              </div>

              {error.source && (
                <div>
                  <h4 className="font-bold text-blue-600 mb-2">Source:</h4>
                  <p className="bg-white p-3 rounded border text-sm break-all">
                    {error.source}:{error.line}:{error.col}
                  </p>
                </div>
              )}

              {error.stack && (
                <div>
                  <h4 className="font-bold text-orange-600 mb-2">Stack Trace:</h4>
                  <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-64">
                    {error.stack}
                  </pre>
                </div>
              )}

              {/* Environment Info */}
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-bold text-blue-800 mb-2">Environment Info:</h4>
                <div className="text-xs space-y-1">
                  <p><strong>Browser:</strong> {navigator.userAgent}</p>
                  <p><strong>Timestamp:</strong> {new Date().toLocaleString('ar-SA')}</p>
                  <p><strong>React Version:</strong> {React.version}</p>
                  <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 p-3 rounded">
                <h4 className="font-bold text-yellow-800 mb-2">💡 Note:</h4>
                <p className="text-sm text-yellow-700">
                  This Activity error is likely coming from react-konva trying to access React 19 Activity features that may not be properly initialized. 
                  The app may still function, but some features might not work correctly.
                </p>
              </div>
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-semibold"
            >
              Ignore & Continue
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalErrorOverlay;

