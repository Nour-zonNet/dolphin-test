// Polyfill for react-reconciler constants to support react-konva with React 19
// This fixes the "DiscreteEventPriority" and "DefaultEventPriority" export errors

// Root types copied from react-reconciler
export const ConcurrentRoot = 1;
export const LegacyRoot = 0;

// Event priorities copied from react-reconciler
export const DefaultEventPriority = 16;
export const DiscreteEventPriority = 2;
export const ContinuousEventPriority = 4;
export const IdleEventPriority = 1;
export const NoEventPriority = 0;

if (typeof window !== 'undefined') {
  // Ensure the module is available globally if react-konva needs it
  window.__REACT_RECONCILER_POLYFILL__ = true;
}
