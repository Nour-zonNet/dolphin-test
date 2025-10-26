// Polyfill for react-reconciler constants to support react-konva with React 19
// This fixes various export errors including Activity-related issues

// Root types copied from react-reconciler
export const ConcurrentRoot = 1;
export const LegacyRoot = 0;

// Event priorities copied from react-reconciler  
// Note: Values differ between dev and prod - using production values for consistency
export const DefaultEventPriority = 32; // Changed from 16 to 32 to match React 19
export const DiscreteEventPriority = 2;
export const ContinuousEventPriority = 8; // Changed from 4 to 8 to match React 19
export const IdleEventPriority = 268435456; // Changed to match React 19
export const NoEventPriority = 0;

if (typeof window !== 'undefined') {
  // Ensure the module is available globally if react-konva needs it
  window.__REACT_RECONCILER_POLYFILL__ = true;
}
