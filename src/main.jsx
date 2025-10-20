import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./app/core/App";
import { registerSW } from "virtual:pwa-register";

// Silence Workbox logs if any service worker is still active
// This flag is respected by Workbox in page and SW contexts
// (the SW needs its own flag, but setting window helps for some logs)
window.__WB_DISABLE_DEV_LOGS = true;

// Enhanced error logging for iOS Safari debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  console.error('Error message:', event.message);
  console.error('Error stack:', event.error?.stack);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

let updateSW = () => {};

if (import.meta.env.PROD) {
  // Register SW only in production builds
  updateSW = registerSW({
    immediate: true,
    onOfflineReady() {
      console.log('App ready for offline use');
    },
    onRegisteredSW(swUrl, registration) {
      if (!registration) {
        console.log('Service Worker registration failed');
        return;
      }
      console.log('Service Worker registered successfully');
      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    },
    onNeedRefresh() {
      console.log('New content available, please refresh.');
      if (confirm('New version available! Reload to update?')) {
        updateSW(true); // Force reload
      }
    }
  });
} else {
  // In development: ensure any previously installed SW is unregistered to avoid Workbox logs
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  }
}

createRoot(document.getElementById("root")).render(<App />);