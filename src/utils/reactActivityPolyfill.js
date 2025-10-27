// React Activity polyfill for react-konva compatibility with React 19
// This MUST be loaded before any react-konva imports to prevent "Cannot set properties of undefined (setting 'Activity')" error

import * as React from 'react';

// CRITICAL: Set Activity property on React before react-konva loads
if (!React.Activity) {
  Object.defineProperty(React, 'Activity', {
    value: {
      // Stub object to prevent "Cannot set properties of undefined" errors
      // This satisfies react-konva's expectation of React 19's Activity API
      __polyfill: true
    },
    configurable: true,
    enumerable: false,
    writable: false
  });
}

// Also set it on window.React if available
if (typeof window !== 'undefined') {
  if (!window.React) {
    window.React = React;
  }
  
  if (!window.React.Activity) {
    Object.defineProperty(window.React, 'Activity', {
      value: React.Activity,
      configurable: true,
      enumerable: false,
      writable: false
    });
  }
}

export default React;

