import { useLanguageDirection } from "@/hooks/useLanguageDirection";

// App Components
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

// Global Components
import GlobalLoader from "@/components/feedback/GlobalLoader";
import ModalManager from "@/components/feedback/modal/ModalManager";

const App = () => {
  // Initialize language direction
  useLanguageDirection();

  return (
    <AppProviders>
      <div className="app-container">
        {/* Global Components */}
        <GlobalLoader />
        <ModalManager />
        
        {/* Main Application Routes */}
        <AppRoutes />
      </div>
    </AppProviders>
  );
};

export default App;
