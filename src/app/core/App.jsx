import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { useOfflineDetection } from "@/hooks/useOfflineDetection";
import { usePerformanceOptimizations } from "@/hooks/usePerformanceOptimizations";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import ChatwootInit from "../components/ChatwootInit"
import { GlobalLoader, GlobalError } from "@/components/feedback";
import { ModalManager } from "@/components/feedback/modal";
import SessionRatingInitializer from "@/components/SessionRatingInitializer";
import EmailCheckInitializer from "@/components/EmailCheckInitializer";
import OfflineScreen from "@/components/OfflineScreen";

const App = () => {
  useLanguageDirection();
  usePerformanceOptimizations(); // Apply performance optimizations
  const isOnline = useOfflineDetection();

  // Show offline screen when not connected to internet
  if (!isOnline) {
    return (
      <AppProviders>
        <OfflineScreen 
          onRetry={() => {
            if (navigator.onLine) {
              window.location.reload();
            } else {
              // Optional: Show a toast or message that we're still offline
            }
          }} 
        />
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <div className="app-container">
        <GlobalLoader />
        <GlobalError />
        <ModalManager />
        <SessionRatingInitializer />
        <EmailCheckInitializer />
        <AppRoutes />
      </div>
      <ChatwootInit />
    </AppProviders>
  );
};

export default App;