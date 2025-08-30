import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/en.json";
import ar from "./locales/ar/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "ar",            // default language Arabic
  fallbackLng: "en",    // fallback if a key is missing
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

// 👇 make sure document direction is correct when starting
document.dir = i18n.language === "ar" ? "rtl" : "ltr";

export default i18n;
