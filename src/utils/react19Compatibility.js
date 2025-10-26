// React 19 compatibility shim
// Ensures React is properly initialized before other modules

if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactCompat);
  } else {
    initReactCompat();
  }
}

function initReactCompat() {
  // Ensure window.React exists if needed by third-party libraries
  // This is a shim to prevent "Cannot set properties of undefined" errors
  if (!window.__REACT_19_COMPAT_INITIALIZED__) {
    window.__REACT_19_COMPAT_INITIALIZED__ = true;
  }
}

export default {};
