import { useState, useEffect } from 'react';

export const useOfflineDetection = () => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser came online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Browser went offline');
      setIsOnline(false);
    };

    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};