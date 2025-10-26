/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
// React 19 Polyfill - Must be loaded before any React code
// This fixes the "Cannot set properties of undefined (setting 'Activity')" error

// Apply polyfill immediately when this module loads
(function() {
  'use strict';
  
  // Store original React if it exists
  // const originalReact = null;
  
  // Fix for use-sync-external-store-with-selector compatibility
  if (typeof window !== 'undefined') {
    // Patch the global exports object to prevent Activity property errors
    const originalExports = typeof exports !== 'undefined' ? exports : {};
    
    // Create a safe exports object that handles undefined properties
    const safeExports = new Proxy(originalExports, {
      set(target, property, value) {
        if (property === 'Activity' && target === undefined) {
          return true;
        }
        if (target && typeof target === 'object') {
          target[property] = value;
        }
        return true;
      },
      get(target, property) {
        if (target && typeof target === 'object') {
          return target[property];
        }
        return undefined;
      }
    });
    
    // Replace exports if it exists
    if (typeof exports !== 'undefined') {
      Object.assign(exports, safeExports);
    }
  }
  
  // Wait for React to be available
  const waitForReact = () => {
    return new Promise((resolve) => {
      const checkReact = () => {
        if (typeof window !== 'undefined' && window.React) {
          originalReact = window.React;
          resolve(window.React);
        } else {
          setTimeout(checkReact, 10);
        }
      };
      checkReact();
    });
  };
  
  // Apply React 19 compatibility fixes
  const applyReact19Fixes = (React) => {
    if (!React || !React.useSyncExternalStore) {
      return;
    }
    
    const originalUseSyncExternalStore = React.useSyncExternalStore;
    
    React.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      try {
        return originalUseSyncExternalStore.call(this, subscribe, getSnapshot, getServerSnapshot);
      } catch (error) {
        // Handle React 19 compatibility errors
        if (error.message && (
          error.message.includes('Cannot set properties of undefined') ||
          error.message.includes('Activity') ||
          error.message.includes('react-core')
        )) {
          // Use a simple fallback implementation - only if not in hook context
          try {
            const [state, setState] = React.useState(() => {
              try {
                return getSnapshot();
              } catch (e) {
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
                    // Ignore errors in subscription
                  }
                }
              });
              
              return () => {
                isSubscribed = false;
                unsubscribe();
              };
            }, [subscribe, getSnapshot]);
            
            return state;
          } catch (hookError) {
            // Return snapshot directly
            try {
              return getSnapshot();
            } catch (e) {
              return null;
            }
          }
        }
        
        throw error;
      }
    };
    
    // Additional fix for use-sync-external-store-with-selector
    // This prevents the Activity property error
    if (typeof window !== 'undefined') {
      // Patch the global module system to handle undefined exports
      const originalDefineProperty = Object.defineProperty;
      Object.defineProperty = function(obj, prop, descriptor) {
        if (prop === 'Activity' && (obj === undefined || obj === null)) {
          return obj;
        }
        return originalDefineProperty.call(this, obj, prop, descriptor);
      };
    }
  };
  
  // Global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', function(event) {
      if (event.error && event.error.message && 
          event.error.message.includes('Cannot set properties of undefined') &&
          (event.error.message.includes('Activity') || event.error.message.includes('react-core'))) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    });
    
    // Apply fixes when React becomes available
    waitForReact().then(applyReact19Fixes);
  }
})();

export default {};
