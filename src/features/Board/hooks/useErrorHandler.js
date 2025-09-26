import { useState, useCallback, useEffect } from 'react';

const useErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const addError = useCallback((error, context = '') => {
    const errorId = Date.now().toString();
    const errorInfo = {
      id: errorId,
      message: getErrorMessage(error),
      context,
      timestamp: new Date(),
      recoverable: isRecoverableError(error)
    };
    
    setErrors(prev => [...prev, errorInfo]);
    
    // Auto-remove after 5 seconds for non-critical errors
    if (!errorInfo.recoverable) {
      setTimeout(() => removeError(errorId), 5000);
    }
  }, []);

  const removeError = useCallback((errorId) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearAllErrors,
    isOnline
  };
};

const getErrorMessage = (error) => {
  if (error.name === 'QuotaExceededError') {
    return 'Storage quota exceeded. Please clear some data or use a different browser.';
  }
  if (error.message.includes('CORS')) {
    return 'Unable to load PDF due to security restrictions. Please try a different file.';
  }
  if (error.message.includes('Invalid PDF')) {
    return 'Invalid PDF file. Please check the file and try again.';
  }
  if (error.message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  return error.message || 'An unexpected error occurred.';
};

const isRecoverableError = (error) => {
  return error.name === 'QuotaExceededError' || 
         error.message.includes('network') ||
         error.message.includes('timeout');
};

export default useErrorHandler;
