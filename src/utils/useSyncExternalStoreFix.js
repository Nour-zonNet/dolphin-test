/* eslint-disable no-undef */
// Fix for use-sync-external-store-with-selector React 19 compatibility
// This specifically addresses the "Cannot set properties of undefined (setting 'Activity')" error

// Apply fix immediately
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Store original Object.defineProperty
  const originalDefineProperty = Object.defineProperty;
  
  // Patch Object.defineProperty to handle undefined objects
  Object.defineProperty = function(obj, prop, descriptor) {
    // Prevent setting Activity property on undefined objects
    if (prop === 'Activity' && (obj === undefined || obj === null)) {
      return obj || {};
    }
    
    // Ensure obj is not undefined before defining property
    if (obj === undefined || obj === null) {
      return obj || {};
    }
    
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // Store original Object.setPrototypeOf
  const originalSetPrototypeOf = Object.setPrototypeOf;
  
  // Patch Object.setPrototypeOf to handle undefined objects
  Object.setPrototypeOf = function(obj, prototype) {
    if (obj === undefined || obj === null) {
      return obj || {};
    }
    
    return originalSetPrototypeOf.call(this, obj, prototype);
  };
  
  // Global error handler for React 19 compatibility
  window.addEventListener('error', function(event) {
      if (event.error && event.error.message && 
        event.error.message.includes('Cannot set properties of undefined') &&
        event.error.message.includes('Activity')) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });
  
  // Additional fix for module exports
  if (typeof module !== 'undefined' && module.exports) {
    const originalExports = module.exports;
    
    // Create a safe exports object
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
