import React, { useState } from 'react';
import generalErrorImage from '@/assets/images/error.png';
import sendIcon from '@/assets/images/send-rate-icon.svg';
import { Retry } from '@/utils/icons';

const GeneralError = ({ onRetry, onCopyError, error, errorInfo, copied = false }) => {
  // Auto-show details in development mode
  const [showDetails, setShowDetails] = useState(import.meta.env.DEV);
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleContactSupport = () => {
    // Open support chat if available
    if (window.$chatwoot) {
      window.$chatwoot.toggle();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 md:px-8">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center w-full">
        {/* Illustration Image */}
        <div className="mb-8 w-full max-w-md">
          <img 
            src={generalErrorImage} 
            alt="General Error" 
            className="w-[60%] md:w-[75%] lg:w-full h-auto mx-auto"
          />
        </div>

        {/* Error Messages */}
        <div className="mb-8">
          <h2 className="text-base md:text-2xl lg:text-3xl font-bold text-navyteal mb-3">
            عذرا, حدث خطأ ما
          </h2>
          <p className="text-sm md:text-xl text-navyteal">
            يرجي المجاولة مرة اخري في وقت لاحق
          </p>
        </div>

        {/* Error Details Section */}
        {error && (
          <div className="mb-6 w-full max-w-4xl">
            <details className="w-full">
              <summary 
                className="cursor-pointer text-sm md:text-base font-semibold text-navyteal mb-3 hover:opacity-80 transition-opacity"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'إخفاء تفاصيل الخطأ' : 'عرض تفاصيل الخطأ'}
              </summary>
              {showDetails && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-right" dir="ltr">
                  {/* Error Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-red-600">Error Details:</h3>
                      {import.meta.env.DEV && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-bold">
                          DEVELOPMENT MODE
                        </span>
                      )}
                      {import.meta.env.PROD && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                          PRODUCTION MODE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded border font-mono overflow-auto max-h-32">
                      {error.toString()}
                    </p>
                    {/* Environment Info */}
                    <div className="mt-3 text-xs text-gray-600">
                      <p><strong>Browser:</strong> {navigator.userAgent}</p>
                      <p><strong>Timestamp:</strong> {new Date().toLocaleString('ar-SA')}</p>
                      <p><strong>React Version:</strong> {React.version}</p>
                      <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
                    </div>
                  </div>

                  {/* Stack Trace */}
                  {error.stack && (
                    <div className="mb-4">
                      <h4 className="font-bold text-orange-600 mb-2">Stack Trace:</h4>
                      <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-auto max-h-64 font-mono">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {/* Component Stack */}
                  {errorInfo?.componentStack && (
                    <div className="mb-4">
                      <h4 className="font-bold text-blue-600 mb-2">Component Stack:</h4>
                      <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-auto max-h-64 font-mono whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}

                  {/* Copy Button */}
                  {onCopyError && (
                    <button
                      onClick={onCopyError}
                      className="w-full bg-navyteal text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      {copied ? '✓ تم نسخ الخطأ' : '📋 نسخ تفاصيل الخطأ'}
                    </button>
                  )}
                </div>
              )}
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-[80%]">
          {/* Secondary Action Button (Left) - Send to Support */}
          <button 
            onClick={handleContactSupport}
            className="bg-white border-2 border-[#D18C2D] w-full text-navyteal hover:bg-[#D18C2D] hover:text-navyteal rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
          >
            <img src={sendIcon} alt="send icon" className="w-5 h-5 md:w-6 md:h-6" />
            <span>ارسال للدعم الفني</span>
          </button>

          {/* Primary Action Button (Right) - Try Again */}
          <button 
            onClick={handleRetry}
            className="bg-[#D18C2D] hover:bg-btnClicked w-full text-navyteal rounded-full px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <Retry className="w-5 h-5 md:w-6 md:h-6" />
            <span>حاول مرة أخرى</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralError;

