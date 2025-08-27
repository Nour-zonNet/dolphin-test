
// app/App.jsx
import GlobalLoader from "../components/feedback/GlobalLoader";
import ModalManager from "../components/feedback/modal/ModalManager";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

const App = () => (
  <AppProviders>
     <GlobalLoader />
         <ModalManager />
    <AppRoutes />
  </AppProviders>
);

export default App;