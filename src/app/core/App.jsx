import { useLanguageDirection } from "@/hooks/useLanguageDirection";
// import { useOfflineDetection } from "@/hooks/useOfflineDetection";
// import { useMaintenanceDetection } from "@/hooks/useMaintenanceDetection";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import ChatwootInit from "../components/ChatwootInit"
import MaintenanceScreen from "@/components/MaintenanceScreen";

import SessionRatingInitializer from "@/components/SessionRatingInitializer";

const App = () => {
  useLanguageDirection();

  // Show maintenance screen when maintenance mode is active
  // if (isMaintenanceMode) {
  //   return (
  //     <AppProviders>
  //       <MaintenanceScreen onGoHome={() => window.location.href = '/'} />
  //     </AppProviders>
  //   );
  // }

  // Show offline screen when not connected to internet
  // if (!isOnline) {
  //   return (
  //     <AppProviders>
  //       <OfflineScreen onRetry={() => window.location.reload()} />
  //     </AppProviders>
  //   );
  // }

  return (
    <AppProviders>
      <div className="app-container">
        {/* Global Components */}
        <GlobalLoader />
        <GlobalError />
        <ModalManager />
        <SessionRatingInitializer />
        <AppRoutes />
      </div>
      <ChatwootInit />
    </AppProviders>
  );
};

export default App;
