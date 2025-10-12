import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import ChatwootInit from "../components/ChatwootInit"

import GlobalLoader from "@/components/feedback/GlobalLoader";
import GlobalError from "@/components/feedback/GlobalError";
import ModalManager from "@/components/feedback/modal/ModalManager";
import SessionRatingInitializer from "@/components/SessionRatingInitializer";

const App = () => {
  useLanguageDirection();

  

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
