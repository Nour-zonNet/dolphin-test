import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./app/core/App";
import ErrorBoundary from "./components/ErrorBoundary";
import { registerSW } from "virtual:pwa-register";
import { performanceMonitor } from "./utils/performanceMonitor";

// Initialize performance monitoring
performanceMonitor.init();

// Silence Workbox logs if any service worker is still active
// This flag is respected by Workbox in page and SW contexts
// (the SW needs its own flag, but setting window helps for some logs)
window.__WB_DISABLE_DEV_LOGS = true;

// Enhanced error logging for iOS Safari debugging
let errorQueue = [];

window.addEventListener('error', (event) => {

  // Store error for display
  errorQueue.push({
    type: 'error',
    message: event.message,
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  });
});

window.addEventListener('unhandledrejection', (event) => {

  // Store rejection for display
  errorQueue.push({
    type: 'rejection',
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  });

  // Prevent default to avoid console errors on iOS
  event.preventDefault();
});

// Make error queue accessible globally for debugging
window.__ERROR_QUEUE__ = errorQueue;

let updateSW = () => {};

if (import.meta.env.PROD) {
  // Register SW only in production builds with iOS-specific error handling
  try {
    updateSW = registerSW({
      immediate: true,
      onOfflineReady() {
        // App ready for offline use
      },
      onRegisteredSW(swUrl, registration) {
        if (!registration) {
          return;
        }
        // Service Worker registered successfully
        // Check for updates every hour
        setInterval(() => {
          try {
            registration.update();
          } catch (error) {
            // SW update check failed
          }
        }, 60 * 60 * 1000);
      },
      onNeedRefresh() {
        if (confirm('New version available! Reload to update?')) {
          updateSW(true); // Force reload
        }
      },
      onRegisterError(error) {
        // SW registration error - Don't block app if SW fails - critical for iOS
      }
    });
  } catch (error) {
    // Failed to register service worker - App will continue without SW - important for iOS compatibility
  }
} else {
  // In development: ensure any previously installed SW is unregistered to avoid Workbox logs
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    }).catch((error) => {
      // Failed to unregister service workers
    });
  }
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);