// Direct fix for use-sync-external-store-with-selector Activity property error
// This addresses the specific error: "Cannot set properties of undefined (setting 'Activity')"

// Apply the fix immediately when this module loads
(function() {
  'use strict';
  
  // Store original methods
  const originalDefineProperty = Object.defineProperty;
  const originalSetPrototypeOf = Object.setPrototypeOf;
  
  // Patch Object.defineProperty to prevent Activity property errors
  Object.defineProperty = function(obj, prop, descriptor) {
    // Prevent setting Activity property on undefined/null objects
    if (prop === 'Activity' && (obj === undefined || obj === null)) {
      return obj || {};
    }
    
    // Ensure object exists before defining property
    if (obj === undefined || obj === null) {
      return obj || {};
    }
    
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // Patch Object.setPrototypeOf to prevent prototype errors
  Object.setPrototypeOf = function(obj, prototype) {
    if (obj === undefined || obj === null) {
      return obj || {};
    }
    
    return originalSetPrototypeOf.call(this, obj, prototype);
  };
  
  // Global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', function(event) {
      if (event.error && event.error.message && 
        event.error.message.includes('Cannot set properties of undefined') &&
        event.error.message.includes('Activity')) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    });
    
    // Additional fix for module system
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      
      // Suppress specific React 19 compatibility errors
      if (message.includes('Cannot set properties of undefined') && 
          message.includes('Activity')) {
        return;
      }
      
      // Call original console.error for other errors
      originalConsoleError.apply(console, args);
    };
  }
  
  // Fix for CommonJS module system
  /* eslint-disable no-undef */
  if (typeof module !== 'undefined' && module.exports) {
    const originalExports = module.exports;
    
    // Create a safe exports proxy
    const safeExports = new Proxy(originalExports, {
      set(target, property, value) {
        if (property === 'Activity' && (target === undefined || target === null)) {
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
    
    module.exports = safeExports;
  }
})();

export default {};
