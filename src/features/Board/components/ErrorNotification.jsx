import React from 'react';

const ErrorNotification = ({ errors, onRemoveError, onClearAll }) => {
  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm sm:max-w-md">
      {errors.map((error) => (
        <div
          key={error.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 ${
            error.recoverable 
              ? 'bg-yellow-50 border-yellow-400 text-yellow-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-sm">
                {error.recoverable ? 'Warning' : 'Error'}
              </h4>
              <p className="text-sm mt-1">{error.message}</p>
              {error.context && (
                <p className="text-xs mt-1 opacity-75">{error.context}</p>
              )}
            </div>
            <button
              onClick={() => onRemoveError(error.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      {errors.length > 1 && (
        <button
          onClick={onClearAll}
          className="w-full px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
        >
          Clear all errors
        </button>
      )}
    </div>
  );
};

export default ErrorNotification;
