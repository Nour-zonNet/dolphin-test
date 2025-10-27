// React 19 compatibility shim
// Ensures React is properly initialized before other modules like react-konva

// Import React immediately to ensure it's available
import * as React from 'react';

if (typeof window !== 'undefined') {
  // Make React available globally for libraries that need it
  if (!window.React) {
    window.React = React;
  }
  
  // CRITICAL: Add Activity property to React for react-konva compatibility
  // This fixes "Cannot set properties of undefined (setting 'Activity')" error
  if (!React.Activity) {
    Object.defineProperty(React, 'Activity', {
      value: {
        // Add stub implementation to prevent errors when react-konva tries to access it
        // This is a React 19 feature that react-konva expects
        __polyfill: true
      },
      configurable: true,
      enumerable: false,
      writable: false
    });
  }
  
  // Ensure window.React exists if needed by third-party libraries
  // This is a shim to prevent "Cannot set properties of undefined" errors
  if (!window.__REACT_19_COMPAT_INITIALIZED__) {
    window.__REACT_19_COMPAT_INITIALIZED__ = true;
  }
}

export default React;
