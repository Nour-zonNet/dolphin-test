import { useLanguageDirection } from "@/hooks/useLanguageDirection";
// import { useOfflineDetection } from "@/hooks/useOfflineDetection";
// import { useMaintenanceDetection } from "@/hooks/useMaintenanceDetection";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import ChatwootInit from "../components/ChatwootInit"
import MaintenanceScreen from "@/components/MaintenanceScreen";

import GlobalLoader from "@/components/feedback/GlobalLoader";
import GlobalError from "@/components/feedback/GlobalError";
import ModalManager from "@/components/feedback/modal/ModalManager";

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
        <AppRoutes />
      </div>
      <ChatwootInit />
    </AppProviders>
  );
};

export default App;
