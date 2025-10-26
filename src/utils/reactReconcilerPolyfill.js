// Polyfill for react-reconciler constants to support react-konva with React 19
// This fixes the "DefaultEventPriority" export error

if (typeof window !== 'undefined') {
  // Ensure the module is available globally if react-konva needs it
  window.__REACT_RECONCILER_POLYFILL__ = true;
}

// This polyfill will be applied when react-konva tries to import from react-reconciler/constants
// The actual fix happens through the vite config aliasing

export default {};
