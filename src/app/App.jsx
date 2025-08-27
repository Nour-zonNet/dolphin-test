
// app/App.jsx
import GlobalLoader from "../components/feedback/GlobalLoader";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";

const App = () => (
  <AppProviders>
     <GlobalLoader />
    <AppRoutes />
  </AppProviders>
);

export default App;