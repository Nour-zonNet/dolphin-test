import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enTranslations from "./locales/en.json";
import arTranslations from "./locales/ar.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  ar: {
    translation: arTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar", // Default to Arabic since the app is primarily in Arabic
    // debug: import.meta.env && import.meta.env.DEV,
    supportedLngs: ["ar", "en"],
    nonExplicitSupportedLngs: true,

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Prefer saved choice, then document <html lang="...">. Ignore browser navigator
      order: ["localStorage", "htmlTag"],
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false, // Recommended for React 18+
    },
  });

export default i18n;
