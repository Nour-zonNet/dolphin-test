import { useEffect, useState } from 'react';

/**
 * Hook to handle 403 errors globally
 * Monitors localStorage for 403 error flag and navigates to 403 page
 */
export const use403Error = () => {
  const [has403Error, setHas403Error] = useState(false);

  useEffect(() => {
    const check403Error = () => {
      const error403 = localStorage.getItem('403_error');
      if (error403 === 'true') {
        setHas403Error(true);
        localStorage.removeItem('403_error');
        window.location.href = '/403';
      }
    };

    // Check immediately
    check403Error();

    // Listen for storage changes (in case error is set from another tab)
    const handleStorageChange = (e) => {
      if (e.key === '403_error' && e.newValue === 'true') {
        check403Error();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (localStorage events don't fire in the same tab)
    const interval = setInterval(check403Error, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return has403Error;
};

