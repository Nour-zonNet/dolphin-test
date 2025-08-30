import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === 'ar' ? 'العربية' : 'English';
  const nextLang = i18n.language === 'ar' ? 'English' : 'العربية';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
      title={`Switch to ${nextLang}`}
    >
      <Globe size={16} className="text-gray-600" />
      <span className="text-gray-700">{currentLang}</span>
    </button>
  );
};

export default LanguageSwitcher;
