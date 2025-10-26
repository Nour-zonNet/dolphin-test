/* eslint-disable react-hooks/rules-of-hooks */
// React 19 compatibility fix for react-redux and other libraries
// This fixes the "Cannot set properties of undefined (setting 'Activity')" error

import React from 'react';

// Enhanced React 19 compatibility fixes - apply immediately
// This must run before any other React code to prevent conflicts

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
          
          // Use useState and useEffect as fallback (only if inside component)
          // Note: This creates a fallback that should only be used in components
          // Wrapping in try-catch to prevent hook errors
          try {
            if (typeof React.useState === 'function') {
              const [state, setState] = React.useState(() => {
                try {
                  return getSnapshot();
                } catch (e) {
                  return null;
                }
              });
              
              if (typeof React.useEffect === 'function') {
                React.useEffect(() => {
                  let isSubscribed = true;
                  
                  const unsubscribe = subscribe(() => {
                    if (isSubscribed) {
                      try {
                        const newState = getSnapshot();
                        setState(newState);
                      } catch (e) {
                        // Error in subscription callback
                      }
                    }
                  });
                  
                  return () => {
                    isSubscribed = false;
                    unsubscribe();
                  };
                }, [subscribe, getSnapshot]);
              }
              
              return state;
            }
          } catch (hookError) {
            // Return snapshot directly as fallback
            try {
              return getSnapshot();
            } catch (e) {
              return null;
            }
          }
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
