
// app/App.jsx
import GlobalLoader from "../components/feedback/GlobalLoader";
import ModalManager from "../components/feedback/modal/ModalManager";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import { useLanguageDirection } from "../hooks/useLanguageDirection";

const App = () => {
  // Initialize language direction
  useLanguageDirection();

  return (
    <AppProviders>
       <GlobalLoader />
           <ModalManager />
      <AppRoutes />
    </AppProviders>
  );
};

export default App;