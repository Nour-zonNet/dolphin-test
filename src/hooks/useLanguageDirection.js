import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageDirection = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const currentLang = i18n.language;
    const isRTL = currentLang === 'ar';
    
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    
    // Add/remove RTL class for additional styling if needed
    if (isRTL) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }
  }, [i18n.language]);

  return {
    isRTL: i18n.language === 'ar',
    language: i18n.language
  };
};
