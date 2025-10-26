import { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

// Local imports
import store from "@/store";
import i18n from "@/i18n";

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600">جاري التحميل...</p>
    </div>
  </div>
);

const AppProviders = ({ children }) => (
  <BrowserRouter>
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </I18nextProvider>
    </ReduxProvider>
  </BrowserRouter>
);

export default AppProviders;
