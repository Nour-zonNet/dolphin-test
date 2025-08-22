// app/providers.jsx
import { Provider as ReduxProvider } from "react-redux";
import store from "../store";
import { BrowserRouter } from "react-router-dom";

const AppProviders = ({ children }) => (
  <BrowserRouter>
    <ReduxProvider store={store}>{children}</ReduxProvider>
  </BrowserRouter>
);

export default AppProviders;
