import { useState, useEffect } from 'react';

/**
 * Custom hook to detect online/offline status
 * Uses navigator.onLine API and listens to online/offline events
 * @returns {boolean} isOnline - true if online, false if offline
 */
export const useOfflineDetection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listen to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOfflineDetection;


