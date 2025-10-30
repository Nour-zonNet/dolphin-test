// React Activity polyfill for react-konva compatibility with React 18
// This is a compatibility shim

// Import React to ensure it's available
import React from 'react';

// For React 18 compatibility with react-konva
if (!React.Activity) {
  try {
    React.Activity = {
      __polyfill: true
    };
  } catch (e) {
    // Silently fail if we can't set Activity
  }
}

export default React;

