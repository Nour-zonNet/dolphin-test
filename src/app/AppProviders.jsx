// app/providers.jsx
import { Provider as ReduxProvider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import store from "../store";
import { BrowserRouter } from "react-router-dom";
import i18n from "../i18n";

const AppProviders = ({ children }) => (
  <BrowserRouter>
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ReduxProvider>
  </BrowserRouter>
);

export default AppProviders;
