// Patch for react-konva to ensure React.Activity exists before it loads
// This module MUST be imported before any react-konva imports

import * as React from 'react';

// CRITICAL: Ensure React.Activity exists before react-konva tries to use it
if (!React.Activity) {
  try {
    Object.defineProperty(React, 'Activity', {
      value: {
        __polyfill: true,
        // Add any required methods as stubs
        __activate: function() {},
        __deactivate: function() {}
      },
      configurable: true,
      enumerable: false,
      writable: false
    });
    
    console.log('✓ React.Activity polyfill applied');
  } catch (error) {
    console.error('Failed to set React.Activity:', error);
  }
}

// Export React with Activity already set
export default React;

