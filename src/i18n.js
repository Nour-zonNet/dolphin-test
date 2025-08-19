import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your JSON translations
import ar from "./locales/ar.json";
import en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: "en", 
    fallbackLng: "en", 
    debug: true,
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
