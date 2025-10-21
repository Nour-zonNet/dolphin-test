import React from 'react';
import { useTranslation } from 'react-i18next';
import offlineDolphin from '@/assets/images/offline-dolphin.svg?inline';
import { Retry } from '@/utils/icons';
import OptimizedImage from './OptimizedImage';

const RefreshIcon = () => (
  <Retry className="w-4 h-4 md:w-6 md:h-6" />
);

const OfflineScreen = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Offline Dolphin Character */}
        <div className="mb-8">
          <OptimizedImage 
            src={offlineDolphin} 
            alt="Offline Dolphin" 
            className="w-32 h-auto max-w-full md:w-56"
            width={224}
            height={224}
            loading="eager"
          />
        </div>

        {/* Offline Messages */}
        <div className="mb-8 max-w-md">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#155274] mb-4 leading-tight">
            {t('offline.title', 'أنت غير متصل بالإنترنت')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#155274] leading-relaxed">
            {t('offline.description', 'الرجاء التحقق من اتصالك بالشبكة وإعادة المحاولة')}
          </p>
        </div>

        {/* Retry Button */}
        <button 
          className="bg-orangedeep hover:bg-btnClicked border-none rounded-full px-8 py-3 md:py-4 text-base md:text-lg font-semibold cursor-pointer flex items-center gap-2 transition-colors duration-200 w-full lg:w-[50%] justify-center"
          onClick={onRetry}
        >
          <RefreshIcon />
          <span className="text-navyteal">{t('offline.retry', 'حاول مرة أخري')}</span>
        </button>
      </div>
    </div>
  );
};

export default OfflineScreen;