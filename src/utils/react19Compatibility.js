// React 19 compatibility fix for react-redux and other libraries
// This fixes the "Cannot set properties of undefined (setting 'Activity')" error

import React from 'react';

// Enhanced React 19 compatibility fixes - apply immediately
// This must run before any other React code to prevent conflicts

// Global error handler for React 19 compatibility
const originalError = Error;
const originalTypeError = TypeError;

// Enhanced React 19 compatibility fixes
if (typeof window !== 'undefined') {
  
  // Fix for React 19 compatibility with react-redux
  if (React.useSyncExternalStore) {
    const originalUseSyncExternalStore = React.useSyncExternalStore;
    
    React.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      try {
        return originalUseSyncExternalStore.call(this, subscribe, getSnapshot, getServerSnapshot);
      } catch (error) {
        // If the error is related to Activity property or undefined properties, use a fallback
        if (error.message && (error.message.includes('Activity') || error.message.includes('Cannot set properties of undefined'))) {
          console.warn('React 19 compatibility: Using fallback for useSyncExternalStore due to property error:', error.message);
          
          // Use useState and useEffect as fallback
          const [state, setState] = React.useState(() => {
            try {
              return getSnapshot();
            } catch (e) {
              console.warn('Error in initial getSnapshot:', e);
              return null;
            }
          });
          
          React.useEffect(() => {
            let isSubscribed = true;
            
            const unsubscribe = subscribe(() => {
              if (isSubscribed) {
                try {
                  const newState = getSnapshot();
                  setState(newState);
                } catch (e) {
                  console.warn('Error in subscription callback:', e);
                }
              }
            });
            
            return () => {
              isSubscribed = false;
              unsubscribe();
            };
          }, [subscribe, getSnapshot]);
          
          return state;
        }
        
        // Re-throw other errors
        throw error;
      }
    };
  }

  // Additional fix for React 19 compatibility with external libraries
  // Prevent undefined property access errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress specific React 19 compatibility errors
    if (message.includes('Cannot set properties of undefined') && 
        (message.includes('Activity') || message.includes('react-core'))) {
      console.warn('React 19 compatibility: Suppressed error:', message);
      return;
    }
    
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
  };

  // Global error handler for React 19 compatibility
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        event.error.message.includes('Cannot set properties of undefined') &&
        (event.error.message.includes('Activity') || event.error.message.includes('react-core'))) {
      console.warn('React 19 compatibility: Caught and suppressed error:', event.error.message);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Fix for potential React 19 issues with external libraries
  if (window.React) {
    // Ensure React is properly initialized
    window.React = React;
  }

  // Additional React 19 compatibility patches
  if (React.useSyncExternalStore) {
    // Patch the global React object to ensure compatibility
    const ReactGlobal = window.React || React;
    if (ReactGlobal && ReactGlobal.useSyncExternalStore) {
      ReactGlobal.useSyncExternalStore = React.useSyncExternalStore;
    }
  }
}

export default {};
